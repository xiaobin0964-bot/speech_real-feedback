export type SessionStatus = 'created' | 'live' | 'ended'

export interface Session {
  id: string
  title: string
  duration_minutes: number
  status: SessionStatus
  started_at: string | null
  ended_at: string | null
  created_at: string
}

export type FeedbackType = 'thumb_up' | 'thinking'

export interface Feedback {
  id: string
  session_id: string
  type: FeedbackType
  timestamp: number
  visitor_id: string | null
  created_at: string
}

export interface FeedbackStats {
  thumb_up_count: number
  thinking_count: number
  total_feedback: number
}

export interface TimeDistribution {
  time: number
  thumb_up: number
  thinking: number
}

export interface ReportData {
  session: Session
  stats: FeedbackStats
  timeDistribution: TimeDistribution[]
}
