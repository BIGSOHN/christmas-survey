import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const COLORS = ['#dc2626', '#16a34a', '#2563eb', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16']

export default function Stats() {
  const [surveys, setSurveys] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSurveys()
  }, [])

  const fetchSurveys = async () => {
    try {
      const { data, error } = await supabase
        .from('surveys')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setSurveys(data || [])
    } catch (error) {
      console.error('Error fetching surveys:', error)
    } finally {
      setLoading(false)
    }
  }

  const getFieldStats = (field) => {
    const counts = {}
    surveys.forEach(survey => {
      const value = survey[field]
      if (value) {
        if (Array.isArray(value)) {
          value.forEach(v => {
            counts[v] = (counts[v] || 0) + 1
          })
        } else {
          counts[value] = (counts[value] || 0) + 1
        }
      }
    })

    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-900 to-green-900 flex items-center justify-center">
        <div className="text-white text-2xl">로딩 중...</div>
      </div>
    )
  }

  const devFieldStats = getFieldStats('dev_field')
  const mbtiStats = getFieldStats('mbti')
  const activeTimeStats = getFieldStats('active_time')
  const editorStats = getFieldStats('editor')
  const languageStats = getFieldStats('programming_language')

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-900 to-green-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            📊 42 경산 통계
          </h1>
          <p className="text-xl text-white/90">
            총 {surveys.length}명의 카뎃이 참여했습니다
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-8">
          {/* Development Field */}
          <div className="bg-white rounded-2xl shadow-2xl p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">희망 개발 분야</h2>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={devFieldStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={120} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#dc2626" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* MBTI Distribution */}
          <div className="bg-white rounded-2xl shadow-2xl p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">MBTI 분포</h2>
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={mbtiStats}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {mbtiStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Active Time */}
          <div className="bg-white rounded-2xl shadow-2xl p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">주요 활동 시간대</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={activeTimeStats} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={150} />
                <Tooltip />
                <Bar dataKey="value" fill="#16a34a" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Programming Language & Editor */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl shadow-2xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">선호 프로그래밍 언어</h2>
              <div className="space-y-2">
                {languageStats.slice(0, 8).map((stat, index) => (
                  <div key={stat.name} className="flex items-center gap-3">
                    <div className="w-32 text-sm font-medium">{stat.name}</div>
                    <div className="flex-1 bg-gray-200 rounded-full h-6">
                      <div
                        className="bg-blue-600 h-6 rounded-full flex items-center justify-end px-2"
                        style={{ width: `${(stat.value / surveys.length) * 100}%` }}
                      >
                        <span className="text-white text-xs font-bold">{stat.value}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-2xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">선호 에디터/IDE</h2>
              <div className="space-y-2">
                {editorStats.map((stat, index) => (
                  <div key={stat.name} className="flex items-center gap-3">
                    <div className="w-32 text-sm font-medium">{stat.name}</div>
                    <div className="flex-1 bg-gray-200 rounded-full h-6">
                      <div
                        className="bg-purple-600 h-6 rounded-full flex items-center justify-end px-2"
                        style={{ width: `${(stat.value / surveys.length) * 100}%` }}
                      >
                        <span className="text-white text-xs font-bold">{stat.value}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Fun Facts */}
          <div className="bg-white rounded-2xl shadow-2xl p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">🎄 재미있는 통계</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-red-50 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-red-700">
                  {devFieldStats[0]?.name || 'N/A'}
                </div>
                <div className="text-sm text-gray-600 mt-2">가장 인기있는 분야</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-green-700">
                  {mbtiStats[0]?.name || 'N/A'}
                </div>
                <div className="text-sm text-gray-600 mt-2">가장 많은 MBTI</div>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-blue-700">
                  {activeTimeStats[0]?.name || 'N/A'}
                </div>
                <div className="text-sm text-gray-600 mt-2">가장 활발한 시간대</div>
              </div>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-8 text-center">
          <a
            href="/"
            className="inline-block bg-white text-red-700 font-bold py-3 px-8 rounded-full hover:bg-red-50 transition-colors"
          >
            ← 홈으로 돌아가기
          </a>
        </div>
      </div>
    </div>
  )
}
