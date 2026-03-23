import { supabase } from './supabase'
import { Session, Feedback, FeedbackStats, TimeDistribution, ReportData } from '../types'

export async function createSession(title: string, durationMinutes: number): Promise<Session> {
  const { data, error } = await supabase
    .from('sessions')
    .insert({
      title,
      duration_minutes: durationMinutes,
      status: 'created'
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getSession(sessionId: string): Promise<Session | null> {
  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('id', sessionId)
    .single()

  if (error) return null
  return data
}

export async function startSession(sessionId: string): Promise<void> {
  const { error } = await supabase
    .from('sessions')
    .update({
      status: 'live',
      started_at: new Date().toISOString()
    })
    .eq('id', sessionId)

  if (error) throw error
}

export async function endSession(sessionId: string): Promise<void> {
  const { error } = await supabase
    .from('sessions')
    .update({
      status: 'ended',
      ended_at: new Date().toISOString()
    })
    .eq('id', sessionId)

  if (error) throw error
}

export async function addFeedback(
  sessionId: string,
  type: 'thumb_up' | 'thinking',
  timestamp: number
): Promise<Feedback> {
  const visitorId = localStorage.getItem('visitor_id') || generateVisitorId()
  localStorage.setItem('visitor_id', visitorId)

  const { data, error } = await supabase
    .from('feedback')
    .insert({
      session_id: sessionId,
      type,
      timestamp,
      visitor_id: visitorId
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getSessionFeedback(sessionId: string): Promise<Feedback[]> {
  const { data, error } = await supabase
    .from('feedback')
    .select('*')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true })

  if (error) throw error
  return data || []
}

export async function getFeedbackStats(sessionId: string): Promise<FeedbackStats> {
  const feedback = await getSessionFeedback(sessionId)
  
  const thumb_up_count = feedback.filter(f => f.type === 'thumb_up').length
  const thinking_count = feedback.filter(f => f.type === 'thinking').length
  
  return {
    thumb_up_count,
    thinking_count,
    total_feedback: feedback.length
  }
}

export function getTimeDistribution(feedback: Feedback[], durationMinutes: number): TimeDistribution[] {
  const durationSeconds = durationMinutes * 60
  const segmentCount = 50
  const segmentDuration = Math.ceil(durationSeconds / segmentCount)
  
  const distribution: { [key: number]: { thumb_up: number; thinking: number } } = {}
  
  for (let i = 0; i < segmentCount; i++) {
    distribution[i] = { thumb_up: 0, thinking: 0 }
  }
  
  feedback.forEach(f => {
    const second = f.timestamp
    if (second >= 0 && second < durationSeconds) {
      const segmentIndex = Math.floor(second / segmentDuration)
      const safeIndex = Math.min(segmentIndex, segmentCount - 1)
      
      if (f.type === 'thumb_up') {
        distribution[safeIndex].thumb_up++
      } else {
        distribution[safeIndex].thinking++
      }
    }
  })
  
  return Object.entries(distribution).map(([segment, counts]) => ({
    time: parseInt(segment),
    segmentLabel: `${parseInt(segment) * segmentDuration}-${Math.min((parseInt(segment) + 1) * segmentDuration, durationSeconds)}s`,
    thumb_up: counts.thumb_up,
    thinking: -counts.thinking
  }))
}

export async function generateReport(sessionId: string): Promise<ReportData> {
  const session = await getSession(sessionId)
  if (!session) throw new Error('Session not found')
  
  const stats = await getFeedbackStats(sessionId)
  const feedback = await getSessionFeedback(sessionId)
  const timeDistribution = getTimeDistribution(feedback, session.duration_minutes)
  
  return {
    session,
    stats,
    timeDistribution
  }
}

export function subscribeToSession(
  sessionId: string,
  callback: (payload: any) => void
) {
  return supabase
    .channel(`session:${sessionId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'sessions',
        filter: `id=eq.${sessionId}`
      },
      callback
    )
    .subscribe()
}

export function subscribeToFeedback(
  sessionId: string,
  callback: (payload: any) => void
) {
  return supabase
    .channel(`feedback:${sessionId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'feedback',
        filter: `session_id=eq.${sessionId}`
      },
      callback
    )
    .subscribe()
}

function generateVisitorId(): string {
  return `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}
