import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceArea } from 'recharts'
import { generateReport } from '../lib/api'
import html2canvas from 'html2canvas'

export default function Report() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [report, setReport] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const reportRef = useRef<HTMLDivElement>(null)

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

  const saveReport = async () => {
    if (!reportRef.current) return
    
    setSaving(true)
    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false
      })
      
      const link = document.createElement('a')
      const fileName = `${report.session.title}_反馈报告_${new Date().toLocaleDateString('zh-CN').replace(/\//g, '-')}.png`
      link.download = fileName
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch (err) {
      console.error('保存报告失败:', err)
      alert('保存失败，请重试')
    } finally {
      setSaving(false)
    }
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-3 sm:p-4 pb-16">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-8 mb-4 sm:mb-6" ref={reportRef}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4 sm:mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">📊 反馈报告</h1>
            <div className="flex gap-2">
              <button
                onClick={saveReport}
                disabled={saving}
                className="bg-green-600 text-white px-4 sm:px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition disabled:bg-gray-400 text-sm sm:text-base"
              >
                {saving ? '保存中...' : '💾 保存报告'}
              </button>
              <button
                onClick={() => navigate('/')}
                className="bg-gray-200 text-gray-800 px-4 sm:px-6 py-2 rounded-lg font-semibold hover:bg-gray-300 transition text-sm sm:text-base"
              >
                返回首页
              </button>
            </div>
          </div>

          <div className="border-b border-gray-200 pb-4 sm:pb-6 mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-2xl font-bold text-gray-800 mb-2 sm:mb-3">{report.session.title}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
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

          <div className="grid grid-cols-3 gap-2 sm:gap-6 mb-4 sm:mb-8">
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-3 sm:p-6 text-center">
              <div className="text-3xl sm:text-5xl mb-1 sm:mb-3">👍</div>
              <div className="text-2xl sm:text-4xl font-bold text-green-600 mb-1 sm:mb-2">{report.stats.thumb_up_count}</div>
              <div className="text-gray-700 font-medium text-xs sm:text-base">好评总数</div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-3 sm:p-6 text-center">
              <div className="text-3xl sm:text-5xl mb-1 sm:mb-3">🤔</div>
              <div className="text-2xl sm:text-4xl font-bold text-orange-600 mb-1 sm:mb-2">{report.stats.thinking_count}</div>
              <div className="text-gray-700 font-medium text-xs sm:text-base">需改进总数</div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-3 sm:p-6 text-center">
              <div className="text-3xl sm:text-5xl mb-1 sm:mb-3">📈</div>
              <div className="text-2xl sm:text-4xl font-bold text-blue-600 mb-1 sm:mb-2">{report.stats.total_feedback}</div>
              <div className="text-gray-700 font-medium text-xs sm:text-base">总反馈次数</div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-3 sm:p-6">
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-4">时间轴分布</h3>
            <p className="text-xs sm:text-sm text-gray-600 mb-2">
              展示 👍 和 🤔️ 在演讲过程中的时间分布，将演讲分为 {report.session.duration_minutes * 60 / 50 | 0} 秒一个区间，共50个时间段，帮助你发现哪段讲得好、哪段需要改进
            </p>
            <div className="flex items-center gap-2 mb-2 sm:mb-4">
              <div className="w-3 sm:w-4 h-3 sm:h-4 bg-yellow-400 opacity-30 rounded"></div>
              <p className="text-xs sm:text-sm text-yellow-700 font-medium">
                黄色区域：前2个时间段和后2个时间段，最需要注意的区域
              </p>
            </div>
            <div className="h-[300px] sm:h-[400px] md:h-[500px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={report.timeDistribution} margin={{ top: 20, right: 10, left: 30, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="segmentLabel" 
                    label={{ value: '时间段', position: 'insideBottom', offset: 10, fontSize: 12, fontWeight: '600', dy: 15 }}
                    tick={{ fontSize: 9, fill: '#6b7280' }}
                    interval={4}
                  />
                  <YAxis 
                    label={{ value: '反馈次数', angle: -90, position: 'insideLeft', offset: -5, fontSize: 12, fontWeight: '600' }}
                    tick={{ fontSize: 10, fill: '#6b7280' }}
                    tickFormatter={(value: any) => Math.abs(value).toString()}
                  />
                  <Tooltip 
                    formatter={(value: number, name: string) => [Math.abs(value), name === 'thumb_up' ? '👍 好评' : '🤔 需改进']}
                    labelFormatter={(_, payload) => payload && payload[0] ? `时间段：${payload[0].payload.segmentLabel}` : ''}
                    contentStyle={{ fontSize: 12, borderRadius: 8, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  />
                  <Legend 
                    verticalAlign="top" 
                    height={40}
                    wrapperStyle={{ fontSize: 12, fontWeight: '500' }}
                  />
                  <ReferenceArea x1={0} x2={2} fill="#fbbf24" fillOpacity={0.25} />
                  <ReferenceArea x1={48} x2={50} fill="#fbbf24" fillOpacity={0.25} />
                  <Line type="monotone" dataKey="thumb_up" name="👍 好评" stroke="#22c55e" strokeWidth={2} dot={false} activeDot={{ r: 5 }} />
                  <Line type="monotone" dataKey="thinking" name="🤔 需改进" stroke="#f97316" strokeWidth={2} dot={false} activeDot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {report.stats.total_feedback > 0 && (
            <div className="mt-6">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">📋 时间段统计</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4">
                  <h4 className="text-lg font-bold text-green-700 mb-3">👍 好评 Top 5</h4>
                  <div className="space-y-2">
                    {(() => {
                      const sortedThumbUp = [...report.timeDistribution]
                        .filter((d: any) => d.thumb_up > 0)
                        .sort((a: any, b: any) => b.thumb_up - a.thumb_up)
                        .slice(0, 5)
                      
                      if (sortedThumbUp.length === 0) {
                        return <p className="text-gray-500 text-sm">暂无好评数据</p>
                      }
                      
                      return sortedThumbUp.map((d: any, index: number) => (
                        <div key={index} className="flex items-center justify-between bg-white rounded-lg p-2 shadow-sm">
                          <span className="text-gray-700 font-medium">{d.segmentLabel}</span>
                          <span className="text-green-600 font-bold">{d.thumb_up} 次</span>
                        </div>
                      ))
                    })()}
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4">
                  <h4 className="text-lg font-bold text-orange-700 mb-3">🤔 需改进 Top 5</h4>
                  <div className="space-y-2">
                    {(() => {
                      const sortedThinking = [...report.timeDistribution]
                        .filter((d: any) => Math.abs(d.thinking) > 0)
                        .sort((a: any, b: any) => Math.abs(b.thinking) - Math.abs(a.thinking))
                        .slice(0, 5)
                      
                      if (sortedThinking.length === 0) {
                        return <p className="text-gray-500 text-sm">暂无需改进数据</p>
                      }
                      
                      return sortedThinking.map((d: any, index: number) => (
                        <div key={index} className="flex items-center justify-between bg-white rounded-lg p-2 shadow-sm">
                          <span className="text-gray-700 font-medium">{d.segmentLabel}</span>
                          <span className="text-orange-600 font-bold">{Math.abs(d.thinking)} 次</span>
                        </div>
                      ))
                    })()}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4">💡 分析建议</h3>
          <div className="space-y-4">
            {(() => {
              const durationSeconds = report.session.duration_minutes * 60
              const segmentDuration = Math.ceil(durationSeconds / 50)
              const first30sSegments = Math.ceil(30 / segmentDuration)
              const last30sSegments = Math.ceil(30 / segmentDuration)
              
              const firstPart = report.timeDistribution.slice(0, first30sSegments)
              const middlePart = report.timeDistribution.slice(first30sSegments, 50 - last30sSegments)
              const lastPart = report.timeDistribution.slice(50 - last30sSegments)
              
              const firstThumbUp = firstPart.reduce((sum: number, d: any) => sum + d.thumb_up, 0)
              const firstThinking = firstPart.reduce((sum: number, d: any) => sum + Math.abs(d.thinking), 0)
              const middleThumbUp = middlePart.reduce((sum: number, d: any) => sum + d.thumb_up, 0)
              const middleThinking = middlePart.reduce((sum: number, d: any) => sum + Math.abs(d.thinking), 0)
              const lastThumbUp = lastPart.reduce((sum: number, d: any) => sum + d.thumb_up, 0)
              const lastThinking = lastPart.reduce((sum: number, d: any) => sum + Math.abs(d.thinking), 0)
              
              const suggestions: { type: 'success' | 'warning' | 'error' | 'info'; title: string; content: string }[] = []
              
              if (report.stats.total_feedback === 0) {
                suggestions.push({
                  type: 'info',
                  title: '暂无反馈',
                  content: '本次演讲没有收到观众反馈，可能是观众参与度不高或反馈机制需要优化。'
                })
              } else {
                if (firstThumbUp > firstThinking) {
                  suggestions.push({
                    type: 'success',
                    title: '开场精彩！',
                    content: `开头30秒获得 ${firstThumbUp} 次好评，${firstThinking} 次需改进反馈。好的开场是演讲成功的一半！`
                  })
                } else if (firstThinking > 0) {
                  suggestions.push({
                    type: 'warning',
                    title: '开场需要加强',
                    content: `开头30秒有 ${firstThinking} 次需改进反馈。头马演讲法则强调开场前30秒要抓住观众注意力，建议优化开场白，设置悬念或提出引人入胜的问题。`
                  })
                }
                
                if (lastThumbUp > lastThinking) {
                  suggestions.push({
                    type: 'success',
                    title: '结尾圆满！',
                    content: `结尾30秒获得 ${lastThumbUp} 次好评，${lastThinking} 次需改进反馈。好的结尾让演讲更难忘！`
                  })
                } else if (lastThinking > 0) {
                  suggestions.push({
                    type: 'warning',
                    title: '结尾需要加强',
                    content: `结尾30秒有 ${lastThinking} 次需改进反馈。头马演讲法则强调结尾要有强有力的呼吁或总结，建议加强结尾的号召力。`
                  })
                }
                
                if (middleThumbUp > middleThinking) {
                  suggestions.push({
                    type: 'success',
                    title: '主体内容优秀',
                    content: `演讲主体部分获得 ${middleThumbUp} 次好评，${middleThinking} 次需改进反馈。内容得到了观众的认可！`
                  })
                } else if (middleThinking > 0) {
                  suggestions.push({
                    type: 'warning',
                    title: '主体内容需改进',
                    content: `演讲主体部分有 ${middleThinking} 次需改进反馈。建议回顾观众反馈较多的时间段，找出需要改进的内容。`
                  })
                }
                
                if (report.stats.thumb_up_count > report.stats.thinking_count * 2) {
                  suggestions.push({
                    type: 'success',
                    title: '整体表现优异！',
                    content: `好评数量（${report.stats.thumb_up_count}）远多于需改进数量（${report.stats.thinking_count}），这是一场非常成功的演讲！`
                  })
                } else if (report.stats.thumb_up_count > report.stats.thinking_count) {
                  suggestions.push({
                    type: 'success',
                    title: '整体表现良好',
                    content: `好评数量（${report.stats.thumb_up_count}）多于需改进数量（${report.stats.thinking_count}），演讲整体得到了观众的认可。`
                  })
                } else if (report.stats.thinking_count > report.stats.thumb_up_count) {
                  suggestions.push({
                    type: 'error',
                    title: '需要继续改进',
                    content: `需改进数量（${report.stats.thinking_count}）多于好评数量（${report.stats.thumb_up_count}）。头马演讲强调每次演讲都是学习的机会，建议针对反馈较多的问题进行针对性练习。`
                  })
                }
              }
              
              return suggestions.length === 0 ? null : suggestions.map((s, index) => (
                <div key={index} className={`border-l-4 p-4 rounded ${
                  s.type === 'success' ? 'bg-green-50 border-green-500' :
                  s.type === 'warning' ? 'bg-yellow-50 border-yellow-500' :
                  s.type === 'error' ? 'bg-red-50 border-red-500' :
                  'bg-blue-50 border-blue-500'
                }`}>
                  <p className={`font-bold ${
                    s.type === 'success' ? 'text-green-800' :
                    s.type === 'warning' ? 'text-yellow-800' :
                    s.type === 'error' ? 'text-red-800' :
                    'text-blue-800'
                  }`}>{s.title}</p>
                  <p className={`text-sm ${
                    s.type === 'success' ? 'text-green-700' :
                    s.type === 'warning' ? 'text-yellow-700' :
                    s.type === 'error' ? 'text-red-700' :
                    'text-blue-700'
                  }`}>{s.content}</p>
                </div>
              ))
            })()}
          </div>
        </div>
      </div>
      
      <div className="fixed bottom-0 left-0 right-0 text-center py-3 sm:py-4 text-gray-500 text-xs sm:text-sm bg-gradient-to-br from-blue-50 to-indigo-100">
        网页所有权 @肖彬 XiaoBin  wechat:_Bin_Xiao_
      </div>
    </div>
  )
}
