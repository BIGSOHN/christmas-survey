import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { motion, AnimatePresence } from 'framer-motion'

export default function ParticipantPage() {
  const [activeRound, setActiveRound] = useState(null)
  const [selectedSide, setSelectedSide] = useState(null)
  const [comment, setComment] = useState('')
  const [comments, setComments] = useState([])
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    fetchActiveRound()

    // Realtime 구독
    const roundSubscription = supabase
      .channel('participant_round')
      .on('postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'balance_game_rounds' },
        (payload) => {
          if (payload.new.is_active) {
            setActiveRound(payload.new)
            setSelectedSide(null)
            setComment('')
            setSubmitted(false)
            fetchComments(payload.new.id)
          } else {
            setActiveRound(null)
          }
        }
      )
      .subscribe()

    const commentsSubscription = supabase
      .channel('participant_comments')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'balance_game_comments' },
        () => activeRound && fetchComments(activeRound.id)
      )
      .subscribe()

    return () => {
      roundSubscription.unsubscribe()
      commentsSubscription.unsubscribe()
    }
  }, [activeRound])

  const fetchActiveRound = async () => {
    const { data } = await supabase
      .from('balance_game_rounds')
      .select('*')
      .eq('is_active', true)
      .single()

    if (data) {
      setActiveRound(data)
      fetchComments(data.id)
    }
  }

  const fetchComments = async (roundId) => {
    const { data } = await supabase
      .from('balance_game_comments')
      .select('*')
      .eq('round_id', roundId)
      .eq('is_hidden', false)
      .order('created_at', { ascending: true })
      .limit(20)

    if (data) setComments(data)
  }

  const submitComment = async () => {
    if (!comment.trim() || comment.length > 50) {
      alert('의견은 1-50자 이내로 입력해주세요')
      return
    }

    await supabase.from('balance_game_comments').insert({
      round_id: activeRound.id,
      nickname: '익명',
      side: selectedSide,
      comment: comment.trim(),
    })

    setComment('')
    // submitted 상태를 더 이상 true로 설정하지 않음
  }

  if (!activeRound) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center p-4">
        <div className="text-white text-center">
          <div className="text-6xl mb-4">⏱️</div>
          <h1 className="text-3xl font-bold mb-2">곧 시작됩니다...</h1>
          <p className="text-xl">관리자가 라운드를 시작하면 게임이 시작됩니다</p>
        </div>
      </div>
    )
  }

  if (!selectedSide) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-500 p-4">
        <div className="max-w-md mx-auto pt-8">
          <div className="bg-white rounded-2xl shadow-2xl p-6 mb-6">
            <h1 className="text-2xl font-bold text-center mb-2">
              🎮 Round {activeRound.round_number}
            </h1>
            <h2 className="text-xl text-center text-gray-700 mb-6">
              {activeRound.question_text}
            </h2>

            <div className="space-y-4">
              <button
                onClick={() => setSelectedSide('A')}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-6 px-6 rounded-xl hover:from-blue-600 hover:to-blue-700 transform hover:scale-105 transition"
              >
                <div className="text-2xl mb-2">😤</div>
                <div className="text-lg">{activeRound.option_a}</div>
              </button>

              <button
                onClick={() => setSelectedSide('B')}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-6 px-6 rounded-xl hover:from-pink-600 hover:to-purple-700 transform hover:scale-105 transition"
              >
                <div className="text-2xl mb-2">💪</div>
                <div className="text-lg">{activeRound.option_b}</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 text-center">
        <h1 className="text-xl font-bold">
          🎮 R{activeRound.round_number}/6
        </h1>
        <p className="text-sm">
          {selectedSide === 'A' ? activeRound.option_a : activeRound.option_b} 😤 vs 💪
        </p>
      </div>

      {/* 채팅 영역 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <AnimatePresence>
          {comments.map((c) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${c.side === selectedSide ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs p-3 rounded-2xl ${
                  c.side === selectedSide
                    ? 'bg-yellow-400 text-gray-900'
                    : 'bg-white text-gray-800 shadow'
                }`}
              >
                <p>{c.comment}</p>
                <p className="text-xs mt-1 opacity-70">
                  {c.side === selectedSide ? '나' : '👤'}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* 입력 영역 */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="max-w-md mx-auto">
          <p className="text-sm text-gray-600 mb-2">메시지 보내기 (50자 이내):</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && comment.trim()) {
                  submitComment()
                }
              }}
              placeholder="메시지를 입력하세요..."
              maxLength={50}
              className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
            />
            <button
              onClick={submitComment}
              disabled={!comment.trim()}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold px-6 py-3 rounded-lg disabled:opacity-50 hover:from-purple-600 hover:to-pink-600"
            >
              전송 📤
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
