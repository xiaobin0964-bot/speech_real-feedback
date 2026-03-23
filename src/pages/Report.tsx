import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceArea } from 'recharts'
import { generateReport } from '../lib/api'

export default function Report() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [report, setReport] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadReport()
  }, [id])

  const loadReport = async () => {
    try {
      const reportData = await generateReport(id!)
      setReport(reportData)
    } catch (err) {
      setError('加载报告失败')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const calculateDuration = () => {
    if (!report?.session?.started_at || !report?.session?.ended_at) return '-'
    const start = new Date(report.session.started_at)
    const end = new Date(report.session.ended_at)
    const diff = Math.floor((end.getTime() - start.getTime()) / 1000 / 60)
    return `${diff} 分钟`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">生成报告中...</p>
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
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">📊 反馈报告</h1>
            <button
              onClick={() => navigate('/')}
              className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg font-semibold hover:bg-gray-300 transition"
            >
              返回首页
            </button>
          </div>

          <div className="border-b border-gray-200 pb-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{report.session.title}</h2>
            <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
              <div>
                <span className="font-medium">设定时长：</span>
                {report.session.duration_minutes} 分钟
              </div>
              <div>
                <span className="font-medium">实际时长：</span>
                {calculateDuration()}
              </div>
              <div>
                <span className="font-medium">开始时间：</span>
                {formatTime(report.session.started_at)}
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 text-center">
              <div className="text-5xl mb-3">👍</div>
              <div className="text-4xl font-bold text-green-600 mb-2">{report.stats.thumb_up_count}</div>
              <div className="text-gray-700 font-medium">好评总数</div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 text-center">
              <div className="text-5xl mb-3">🤔</div>
              <div className="text-4xl font-bold text-orange-600 mb-2">{report.stats.thinking_count}</div>
              <div className="text-gray-700 font-medium">需改进总数</div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 text-center">
              <div className="text-5xl mb-3">📈</div>
              <div className="text-4xl font-bold text-blue-600 mb-2">{report.stats.total_feedback}</div>
              <div className="text-gray-700 font-medium">总反馈次数</div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">时间轴分布</h3>
            <p className="text-sm text-gray-600 mb-2">
              展示 👍 和 🤔️ 在演讲过程中的时间分布，帮助你发现哪段讲得好、哪段需要改进
            </p>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-4 h-4 bg-yellow-400 opacity-30 rounded"></div>
              <p className="text-sm text-yellow-700 font-medium">
                黄色区域：开头10秒和结尾10秒，最需要注意的区域
              </p>
            </div>
            <div className="h-[450px] md:h-[500px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={report.timeDistribution} margin={{ top: 30, right: 30, left: 45, bottom: 70 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="time" 
                    label={{ value: '时间（秒）', position: 'insideBottom', offset: 10, fontSize: 14, fontWeight: '600', dy: 20 }}
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                    tickFormatter={(value: any) => `${value}s`}
                    interval="preserveStartEnd"
                  />
                  <YAxis 
                    label={{ value: '反馈次数', angle: -90, position: 'insideLeft', offset: -10
                      , fontSize: 14, fontWeight: '600' }}
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                    tickFormatter={(value: any) => Math.abs(value).toString()}
                  />
                  <Tooltip 
                    formatter={(value: number, name: string) => [Math.abs(value), name === 'thumb_up' ? '👍 好评' : '🤔 需改进']}
                    labelFormatter={(label) => `时间：${label} 秒`}
                    contentStyle={{ fontSize: 14, borderRadius: 8, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  />
                  <Legend 
                    verticalAlign="top" 
                    height={50}
                    wrapperStyle={{ fontSize: 14, fontWeight: '500' }}
                  />
                  <ReferenceArea x1={0} x2={10} fill="#fbbf24" fillOpacity={0.25} />
                  <ReferenceArea x1={report.session.duration_minutes * 60 - 10} x2={report.session.duration_minutes * 60} fill="#fbbf24" fillOpacity={0.25} />
                  <Line type="monotone" dataKey="thumb_up" name="👍 好评" stroke="#22c55e" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="thinking" name="🤔 需改进" stroke="#f97316" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4">💡 分析建议</h3>
          <div className="space-y-4">
            {report.stats.thumb_up_count > report.stats.thinking_count && (
              <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                <p className="text-green-800">
                  <strong>整体表现优秀！</strong> 好评数量多于需改进数量，说明演讲内容得到了观众的认可。
                </p>
              </div>
            )}
            
            {report.stats.thinking_count > report.stats.thumb_up_count && (
              <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded">
                <p className="text-orange-800">
                  <strong>需要改进！</strong> 需改进数量多于好评数量，建议回顾演讲内容，找出观众不理解的环节。
                </p>
              </div>
            )}

            {report.stats.total_feedback === 0 && (
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <p className="text-blue-800">
                  <strong>暂无反馈</strong> 本次演讲没有收到观众反馈，可能是观众参与度不高或反馈机制需要优化。
                </p>
              </div>
            )}

            {report.timeDistribution.some((d: any) => Math.abs(d.thinking) > d.thumb_up * 2) && (
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                <p className="text-yellow-800">
                  <strong>注意高峰时段</strong> 时间轴显示某些时段的需改进反馈明显多于好评，建议重点回顾这些时间段的内容。
                </p>
              </div>
            )}

            {(() => {
              const first10Seconds = report.timeDistribution.filter((d: any) => d.time >= 0 && d.time <= 10)
              const last10Seconds = report.timeDistribution.filter((d: any) => d.time >= report.session.duration_minutes * 60 - 10)
              const first10Thinking = first10Seconds.reduce((sum: number, d: any) => sum + Math.abs(d.thinking), 0)
              const last10Thinking = last10Seconds.reduce((sum: number, d: any) => sum + Math.abs(d.thinking), 0)
              
              if (first10Thinking > 0 || last10Thinking > 0) {
                return (
                  <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                    <p className="text-yellow-800">
                      <strong>⚠️ 开头或结尾需要改进</strong> 
                      {first10Thinking > 0 && ` 开头10秒有 ${first10Thinking} 条需改进反馈`}
                      {first10Thinking > 0 && last10Thinking > 0 && '，'}
                      {last10Thinking > 0 && `结尾10秒有 ${last10Thinking} 条需改进反馈`}
                      。这两个时间段是观众注意力最集中的时刻，建议重点优化。
                    </p>
                  </div>
                )
              }
              return null
            })()}
          </div>
        </div>
      </div>
      
      <div className="fixed bottom-0 left-0 right-0 text-center py-4 text-gray-500 text-sm bg-gradient-to-br from-blue-50 to-indigo-100">
        网页所有权 @肖彬 XiaoBin  wechat:_Bin_Xiao_
      </div>
    </div>
  )
}
