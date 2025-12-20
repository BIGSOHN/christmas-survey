import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { motion, AnimatePresence } from 'framer-motion'

export default function DisplayPage() {
  const [activeRound, setActiveRound] = useState(null)
  const [comments, setComments] = useState([])
  const [voteCounts, setVoteCounts] = useState({ A: 0, B: 0 })
  const messagesEndRef = useRef(null)
  const containerRef = useRef(null)

  useEffect(() => {
    fetchActiveRound()
    fetchComments()
    fetchVoteCounts()

    // Realtime 구독
    const roundSubscription = supabase
      .channel('active_round')
      .on('postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'balance_game_rounds' },
        (payload) => {
          if (payload.new.is_active) {
            setActiveRound(payload.new)
            fetchComments(payload.new.id)
            fetchVoteCounts(payload.new.id)
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

    // 투표 실시간 구독 추가
    const votesSubscription = supabase
      .channel('display_votes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'balance_game_votes' },
        () => activeRound && fetchVoteCounts(activeRound.id)
      )
      .subscribe()

    return () => {
      roundSubscription.unsubscribe()
      commentsSubscription.unsubscribe()
      votesSubscription.unsubscribe()
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
      fetchVoteCounts(data.id)
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

    if (data) setComments(data)
  }

  /**
   * 투표 집계 함수
   * - balance_game_votes 테이블에서 실제 투표 수 집계
   * - 각 진영별 투표 수를 카운트
   */
  const fetchVoteCounts = async (roundId = activeRound?.id) => {
    if (!roundId) return

    const { data, error } = await supabase
      .from('balance_game_votes')
      .select('side')
      .eq('round_id', roundId)

    if (error) {
      console.error('투표 집계 실패:', error)
      return
    }

    if (data) {
      const countA = data.filter(v => v.side === 'A').length
      const countB = data.filter(v => v.side === 'B').length
      setVoteCounts({ A: countA, B: countB })
    }
  }

  // 이전 메시지 개수 추적
  const prevCommentsLengthRef = useRef(0)

  // 사용자가 하단에 있는지 확인하는 함수
  const isNearBottom = () => {
    if (!containerRef.current) return true
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight
    return distanceFromBottom < 100
  }

  // 스크롤을 맨 아래로 이동
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // 새 메시지가 추가될 때만 스크롤
  useEffect(() => {
    // 첫 로딩 시 (이전 메시지 개수가 0이고 새로 메시지가 로드된 경우)
    if (prevCommentsLengthRef.current === 0 && comments.length > 0) {
      // 첫 입장 시 무조건 맨 아래로 스크롤
      setTimeout(() => scrollToBottom(), 100)
    }
    // 새 메시지가 추가된 경우에만 (기존보다 길이가 증가한 경우)
    // 그리고 사용자가 하단 근처에 있을 때만
    else if (comments.length > prevCommentsLengthRef.current && isNearBottom()) {
      scrollToBottom()
    }
    prevCommentsLengthRef.current = comments.length
  }, [comments])

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

  // 투표 집계
  const totalVotes = voteCounts.A + voteCounts.B
  const percentageA = totalVotes > 0 ? Math.round((voteCounts.A / totalVotes) * 100) : 0
  const percentageB = totalVotes > 0 ? Math.round((voteCounts.B / totalVotes) * 100) : 0

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      {/* 헤더 */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">🎮 밸런스 게임</h1>
        <h2 className="text-3xl mb-4">{activeRound.question_text}</h2>

        {/* 진영 vs 투표 수 표시 */}
        <div className="flex justify-center items-center gap-8 text-2xl">
          <div className="text-blue-400 text-center">
            <div className="font-bold">{activeRound.option_a} 😤</div>
            <div className="text-5xl font-bold mt-2">{voteCounts.A}표</div>
            <div className="text-xl text-gray-400 mt-1">{percentageA}%</div>
          </div>

          <div className="text-gray-400 text-3xl">vs</div>

          <div className="text-pink-400 text-center">
            <div className="font-bold">{activeRound.option_b} 💪</div>
            <div className="text-5xl font-bold mt-2">{voteCounts.B}표</div>
            <div className="text-xl text-gray-400 mt-1">{percentageB}%</div>
          </div>
        </div>

        <div className="mt-4 text-lg text-gray-400">
          총 투표: {totalVotes}표
        </div>

        {/* 진행률 바 */}
        <div className="max-w-2xl mx-auto mt-6">
          <div className="h-8 bg-gray-700 rounded-full overflow-hidden flex">
            <div
              className="bg-blue-500 flex items-center justify-center text-white font-bold transition-all duration-500"
              style={{ width: `${percentageA}%` }}
            >
              {percentageA > 10 && `${percentageA}%`}
            </div>
            <div
              className="bg-pink-500 flex items-center justify-center text-white font-bold transition-all duration-500"
              style={{ width: `${percentageB}%` }}
            >
              {percentageB > 10 && `${percentageB}%`}
            </div>
          </div>
        </div>
      </div>

      {/* 채팅방 UI */}
      <div
        ref={containerRef}
        className="max-w-6xl mx-auto space-y-4 overflow-y-auto overflow-x-hidden max-h-[calc(100vh-300px)] scrollbar-hide"
        style={{
          scrollbarWidth: 'none', /* Firefox */
          msOverflowStyle: 'none', /* IE and Edge */
        }}
      >
        <AnimatePresence>
          {comments.map((comment) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`flex ${comment.side === 'B' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] p-4 rounded-2xl break-words ${
                  comment.side === 'A'
                    ? 'bg-white text-gray-800'
                    : 'bg-yellow-400 text-gray-900'
                }`}
              >
                <p className="text-lg">{comment.comment}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>
    </div>
  )
}
