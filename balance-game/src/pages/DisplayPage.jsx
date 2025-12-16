import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { motion, AnimatePresence } from 'framer-motion'

export default function DisplayPage() {
  const [activeRound, setActiveRound] = useState(null)
  const [comments, setComments] = useState([])

  useEffect(() => {
    fetchActiveRound()
    fetchComments()

    // Realtime 구독
    const roundSubscription = supabase
      .channel('active_round')
      .on('postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'balance_game_rounds' },
        (payload) => {
          if (payload.new.is_active) {
            setActiveRound(payload.new)
            fetchComments(payload.new.id)
          }
        }
      )
      .subscribe()

    const commentsSubscription = supabase
      .channel('display_comments')
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

  const fetchComments = async (roundId = activeRound?.id) => {
    if (!roundId) return

    const { data } = await supabase
      .from('balance_game_comments')
      .select('id, side, comment, created_at, nickname')
      .eq('round_id', roundId)
      .eq('is_hidden', false)
      .order('created_at', { ascending: true })
      .limit(20)

    if (data) setComments(data)
  }

  if (!activeRound) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
        <div className="text-white text-4xl font-bold text-center">
          <div className="mb-4">🎮</div>
          <div>대기 중...</div>
          <div className="text-2xl mt-4">곧 시작됩니다!</div>
        </div>
      </div>
    )
  }

  const sideAComments = comments.filter(c => c.side === 'A')
  const sideBComments = comments.filter(c => c.side === 'B')

  // 각 진영별 고유 참가자 수 계산
  const sideAParticipants = new Set(sideAComments.map(c => c.nickname)).size
  const sideBParticipants = new Set(sideBComments.map(c => c.nickname)).size
  const totalParticipants = sideAParticipants + sideBParticipants

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      {/* 헤더 */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">
          🎮 ROUND {activeRound.round_number}
        </h1>
        <h2 className="text-3xl mb-4">{activeRound.question_text}</h2>

        {/* 진영 vs 인원 표시 */}
        <div className="flex justify-center items-center gap-8 text-2xl">
          <div className="text-blue-400 text-center">
            <div className="font-bold">{activeRound.option_a} 😤</div>
            <div className="text-4xl font-bold mt-2">{sideAParticipants}명</div>
          </div>

          <div className="text-gray-400 text-3xl">vs</div>

          <div className="text-pink-400 text-center">
            <div className="font-bold">{activeRound.option_b} 💪</div>
            <div className="text-4xl font-bold mt-2">{sideBParticipants}명</div>
          </div>
        </div>

        <div className="mt-4 text-lg text-gray-400">
          총 참여자: {totalParticipants}명
        </div>
      </div>

      {/* 채팅방 UI */}
      <div className="max-w-6xl mx-auto space-y-4">
        <AnimatePresence>
          {comments.map((comment) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, x: comment.side === 'A' ? -50 : 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className={`flex ${comment.side === 'B' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-md p-4 rounded-2xl ${
                  comment.side === 'A'
                    ? 'bg-white text-gray-800'
                    : 'bg-yellow-400 text-gray-900'
                }`}
              >
                <p className="text-lg">{comment.comment}</p>
                <p className="text-sm mt-1 opacity-70">
                  {comment.side === 'A' ? activeRound.option_a : activeRound.option_b} 👤
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
