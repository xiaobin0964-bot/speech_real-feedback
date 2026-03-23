import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createSession } from '../lib/api'

export default function CreateSession() {
  const [title, setTitle] = useState('')
  const [duration, setDuration] = useState(30)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title.trim()) {
      setError('请输入演讲题目')
      return
    }
    
    if (duration < 0) {
      setError('时长不能为负数')
      return
    }
    
    setLoading(true)
    setError('')
    
    try {
      const session = await createSession(title.trim(), duration)
      navigate(`/session/${session.id}`)
    } catch (err) {
      setError('创建演讲失败，请重试')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4 pb-16">
      <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 w-full max-w-md">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">创建演讲</h1>
          <p className="text-gray-600 text-sm sm:text-base">填写演讲信息，开始收集实时反馈</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              演讲题目
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="例如：产品发布会演讲"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
              演讲时长（分钟）
            </label>
            <input
              type="text"
              id="duration"
              value={duration}
              onChange={(e) => {
                const value = e.target.value
                if (value === '') {
                  setDuration(0)
                } else {
                  const num = parseInt(value)
                  if (!isNaN(num) && num >= 0) {
                    setDuration(num)
                  }
                }
              }}
              inputMode="numeric"
              pattern="[0-9]*"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              disabled={loading}
            />
            <p className="mt-1 text-sm text-gray-500">支持输入任意时长（分钟）</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '创建中...' : '开始演讲'}
          </button>
        </form>
      </div>
      
      <div className="fixed bottom-0 left-0 right-0 text-center py-3 sm:py-4 text-gray-500 text-xs sm:text-sm bg-gradient-to-br from-blue-50 to-indigo-100">
        网页所有权 @肖彬 XiaoBin  wechat:_Bin_Xiao_
      </div>
    </div>
  )
}
