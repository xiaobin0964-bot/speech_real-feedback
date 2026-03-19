import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import QRCode from 'qrcode.react'
import { getSession, startSession, endSession, getFeedbackStats, subscribeToFeedback } from '../lib/api'

export default function SpeakerRoom() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [stats, setStats] = useState({ thumb_up_count: 0, thinking_count: 0, total_feedback: 0 })
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    loadSession()
  }, [id])

  useEffect(() => {
    if (session?.status === 'live') {
      const subscription = subscribeToFeedback(id!, () => {
        loadStats()
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
        setError('演讲不存在')
        return
      }
      setSession(sessionData)
      
      if (sessionData.status === 'live') {
        await loadStats()
      }
    } catch (err) {
      setError('加载演讲失败')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const statsData = await getFeedbackStats(id!)
      setStats(statsData)
    } catch (err) {
      console.error('Failed to load stats:', err)
    }
  }

  const handleStart = async () => {
    setActionLoading(true)
    try {
      await startSession(id!)
      await loadSession()
      await loadStats()
    } catch (err) {
      setError('开始演讲失败')
      console.error(err)
    } finally {
      setActionLoading(false)
    }
  }

  const handleEnd = async () => {
    if (!confirm('确定要结束演讲吗？')) return
    
    setActionLoading(true)
    try {
      await endSession(id!)
      await loadSession()
      navigate(`/session/${id}/report`)
    } catch (err) {
      setError('结束演讲失败')
      console.error(err)
    } finally {
      setActionLoading(false)
    }
  }

  const getRoomUrl = () => {
    const protocol = window.location.protocol
    const hostname = window.location.hostname
    const port = window.location.port || (protocol === 'https:' ? '443' : '80')
    return `${protocol}//${hostname}:${port}/join/${id}`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">出错了</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            返回首页
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{session.title}</h1>
            <p className="text-gray-600">时长：{session.duration_minutes} 分钟</p>
            <div className="mt-2 inline-flex items-center px-4 py-2 rounded-full text-sm font-medium">
              {session.status === 'created' && (
                <span className="bg-yellow-100 text-yellow-800">等待开始</span>
              )}
              {session.status === 'live' && (
                <span className="bg-green-100 text-green-800">进行中</span>
              )}
              {session.status === 'ended' && (
                <span className="bg-gray-100 text-gray-800">已结束</span>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">观众扫码进入</h3>
              <div className="flex justify-center mb-4">
                <div className="bg-white p-6 rounded-lg shadow-inner">
                  <QRCode value={getRoomUrl()} size={280} level="M" includeMargin={true} />
                </div>
              </div>
              <p className="text-sm text-gray-600 text-center mb-2">或复制链接分享：</p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={getRoomUrl()}
                  readOnly
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white"
                />
                <button
                  onClick={() => navigator.clipboard.writeText(getRoomUrl())}
                  className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition"
                >
                  复制
                </button>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">实时反馈统计</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                  <div className="text-4xl mb-2">👍</div>
                  <div className="text-3xl font-bold text-green-600">{stats.thumb_up_count}</div>
                  <div className="text-sm text-gray-600 mt-1">好评</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                  <div className="text-4xl mb-2">🤔</div>
                  <div className="text-3xl font-bold text-orange-600">{stats.thinking_count}</div>
                  <div className="text-sm text-gray-600 mt-1">需改进</div>
                </div>
              </div>
              {session.status === 'live' && (
                <div className="mt-4 text-center text-sm text-gray-600">
                  总反馈：{stats.total_feedback} 次
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {session.status === 'created' && (
              <button
                onClick={handleStart}
                disabled={actionLoading}
                className="bg-green-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed text-lg"
              >
                {actionLoading ? '开始中...' : '🎤 开始演讲'}
              </button>
            )}
            {session.status === 'live' && (
              <button
                onClick={handleEnd}
                disabled={actionLoading}
                className="bg-red-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed text-lg"
              >
                {actionLoading ? '结束中...' : '⏹️ 结束演讲'}
              </button>
            )}
            {session.status === 'ended' && (
              <button
                onClick={() => navigate(`/session/${id}/report`)}
                className="bg-indigo-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition text-lg"
              >
                📊 查看报告
              </button>
            )}
            <button
              onClick={() => navigate('/')}
              className="bg-gray-200 text-gray-800 px-8 py-4 rounded-lg font-semibold hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition text-lg"
            >
              返回首页
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
