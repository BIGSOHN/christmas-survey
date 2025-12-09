import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-red-900 to-green-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-lg">
          🎄 42 경산 크리스마스 설문 🎅
        </h1>
        <p className="text-xl text-white/90 mb-8">
          42 경산 카뎃들의 2025년을 알아보는 연말 설문조사
        </p>
        <div className="space-y-4">
          <Link
            to="/survey"
            className="block bg-white text-red-700 font-bold py-4 px-8 rounded-full text-xl hover:bg-red-50 transition-colors shadow-lg"
          >
            🎁 설문 참여하기
          </Link>
          <Link
            to="/stats"
            className="block bg-green-600 text-white font-bold py-4 px-8 rounded-full text-xl hover:bg-green-700 transition-colors shadow-lg"
          >
            📊 통계 보기
          </Link>
        </div>
      </div>
    </div>
  )
}
