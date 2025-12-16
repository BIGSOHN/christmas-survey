import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function LoginPage() {
  const [nickname, setNickname] = useState('')
  const navigate = useNavigate()

  const handleLogin = () => {
    if (nickname.trim()) {
      // 닉네임을 localStorage에 저장 (임시 로그인)
      localStorage.setItem('nickname', nickname)
      navigate('/participant')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-500 via-green-500 to-blue-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">🎄 42 경산</h1>
          <h2 className="text-2xl font-semibold text-gray-700">밸런스 게임 배틀</h2>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              닉네임 입력
            </label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              placeholder="닉네임을 입력하세요"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition"
              maxLength={20}
            />
          </div>

          <button
            onClick={handleLogin}
            disabled={!nickname.trim()}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3 px-6 rounded-lg hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition transform hover:scale-105"
          >
            참여하기 🚀
          </button>

          <p className="text-sm text-gray-500 text-center">
            * 닉네임은 익명으로 표시됩니다
          </p>
        </div>

        {/* 관리자/디스플레이 링크 */}
        <div className="mt-8 pt-6 border-t border-gray-200 flex justify-center gap-4">
          <button
            onClick={() => navigate('/admin')}
            className="text-sm text-gray-600 hover:text-gray-800"
          >
            관리자
          </button>
          <span className="text-gray-300">|</span>
          <button
            onClick={() => navigate('/display')}
            className="text-sm text-gray-600 hover:text-gray-800"
          >
            디스플레이
          </button>
        </div>
      </div>
    </div>
  )
}
