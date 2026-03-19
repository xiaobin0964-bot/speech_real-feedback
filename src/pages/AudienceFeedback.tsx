import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getSession, addFeedback, subscribeToSession } from '../lib/api'

export default function AudienceFeedback() {
  const { id } = useParams<{ id: string }>()
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [feedbackSent, setFeedbackSent] = useState<{ thumb_up: boolean; thinking: boolean }>({
    thumb_up: false,
    thinking: false
  })

  useEffect(() => {
    loadSession()
  }, [id])

  useEffect(() => {
    if (session) {
      const subscription = subscribeToSession(id!, (payload) => {
        if (payload.new) {
          setSession((prev: any) => ({ ...prev, ...payload.new }))
        }
      })
      
      return () => {
        subscription.unsubscribe()
      }
    }
  }, [session, id])

  const loadSession = async () => {
    try {
      const sessionData = await getSession(id!)
      if (!sessionData) {
        setError('演讲不存在或已结束')
        return
      }
      setSession(sessionData)
    } catch (err) {
      setError('加载演讲失败')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleFeedback = async (type: 'thumb_up' | 'thinking') => {
    if (!session || session.status !== 'live') return
    
    try {
      const now = Date.now()
      const timestamp = Math.floor((now - new Date(session.started_at).getTime()) / 1000)
      await addFeedback(id!, type, timestamp)
      
      setFeedbackSent(prev => ({ ...prev, [type]: true }))
      
      setTimeout(() => {
        setFeedbackSent(prev => ({ ...prev, [type]: false }))
      }, 1000)
    } catch (err) {
      console.error('Failed to send feedback:', err)
      alert('发送反馈失败，请重试')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">出错了</h2>
          <p className="text-gray-600 mb-6">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{session.title}</h1>
            <div className="mt-2 inline-flex items-center px-4 py-2 rounded-full text-sm font-medium">
              {session.status === 'created' && (
                <span className="bg-yellow-100 text-yellow-800">⏳ 等待演讲开始</span>
              )}
              {session.status === 'live' && (
                <span className="bg-green-100 text-green-800">🎤 演讲进行中</span>
              )}
              {session.status === 'ended' && (
                <span className="bg-gray-100 text-gray-800">✅ 演讲已结束</span>
              )}
            </div>
          </div>

          {session.status === 'created' && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">⏳</div>
              <p className="text-xl text-gray-600 mb-2">演讲尚未开始</p>
              <p className="text-gray-500">请等待演讲者开始演讲</p>
            </div>
          )}

          {session.status === 'live' && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <p className="text-gray-600 mb-4">点击按钮表达你的感受</p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <button
                  onClick={() => handleFeedback('thumb_up')}
                  disabled={feedbackSent.thumb_up}
                  className={`bg-white border-4 rounded-2xl p-8 transition-all duration-200 transform hover:scale-105 active:scale-95 ${
                    feedbackSent.thumb_up
                      ? 'border-green-500 bg-green-50'
                      : 'border-green-200 hover:border-green-400'
                  }`}
                >
                  <div className="text-6xl mb-4">👍</div>
                  <div className="text-xl font-bold text-gray-800">讲得好</div>
                  <div className="text-sm text-gray-500 mt-2">这段讲得很好</div>
                </button>

                <button
                  onClick={() => handleFeedback('thinking')}
                  disabled={feedbackSent.thinking}
                  className={`bg-white border-4 rounded-2xl p-8 transition-all duration-200 transform hover:scale-105 active:scale-95 ${
                    feedbackSent.thinking
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-orange-200 hover:border-orange-400'
                  }`}
                >
                  <div className="text-6xl mb-4">🤔</div>
                  <div className="text-xl font-bold text-gray-800">需改进</div>
                  <div className="text-sm text-gray-500 mt-2">这段需要改进</div>
                </button>
              </div>

              <div className="text-center mt-8">
                <p className="text-sm text-gray-500">按照你的感觉来点击</p>
              </div>
            </div>
          )}

          {session.status === 'ended' && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">✅</div>
              <p className="text-xl text-gray-600 mb-2">演讲已结束</p>
              <p className="text-gray-500">感谢您的反馈！</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
