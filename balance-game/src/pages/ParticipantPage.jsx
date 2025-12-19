import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { motion, AnimatePresence } from 'framer-motion'

export default function ParticipantPage() {
  const [activeRound, setActiveRound] = useState(null)
  const [selectedSide, setSelectedSide] = useState(null)
  const [comment, setComment] = useState('')
  const [comments, setComments] = useState([])
  const [submitted, setSubmitted] = useState(false)
  const messagesEndRef = useRef(null)
  const containerRef = useRef(null)
  const [profanityList, setProfanityList] = useState([])

  // 욕설 리스트 API에서 가져오기
  useEffect(() => {
    const fetchProfanityList = async () => {
      try {
        // TODO: 여기에 깃허브 API URL을 입력하세요
        const API_URL = 'YOUR_GITHUB_API_URL_HERE'
        const response = await fetch(API_URL)
        const data = await response.json()

        // API 응답 형식에 따라 수정이 필요할 수 있습니다
        // 예: data.words, data.list, 또는 data 자체가 배열일 수 있습니다
        setProfanityList(data)
      } catch (error) {
        console.error('욕설 리스트를 불러오는데 실패했습니다:', error)
        // 실패 시 기본 리스트 사용 (선택사항)
        setProfanityList([])
      }
    }

    fetchProfanityList()
  }, [])

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

    if (data) setComments(data)
  }

  // 욕설 필터링 체크 함수
  const containsProfanity = (text) => {
    if (profanityList.length === 0) return false

    const lowerText = text.toLowerCase()
    return profanityList.some(word => {
      const lowerWord = word.toLowerCase()
      return lowerText.includes(lowerWord)
    })
  }

  const submitComment = async () => {
    if (!comment.trim() || comment.length > 50) {
      alert('의견은 1-50자 이내로 입력해주세요')
      return
    }

    // 욕설 필터링 체크
    if (containsProfanity(comment)) {
      alert('부적절한 언어가 포함되어 있습니다. 다시 작성해주세요.')
      return
    }

    await supabase.from('balance_game_comments').insert({
      round_id: activeRound.id,
      nickname: '익명',
      side: selectedSide,
      comment: comment.trim(),
    })

    setComment('')
    // 메시지를 보냈다는 플래그 설정
    justSentMessageRef.current = true
  }

  // 이전 메시지 개수 추적
  const prevCommentsLengthRef = useRef(0)
  const hasScrolledOnceRef = useRef(false)
  const justSentMessageRef = useRef(false)

  // selectedSide가 변경되면 스크롤 플래그 리셋
  useEffect(() => {
    if (selectedSide) {
      hasScrolledOnceRef.current = false
      prevCommentsLengthRef.current = 0
    }
  }, [selectedSide])

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
    // 첫 로딩 시 (아직 스크롤하지 않았고 메시지가 있는 경우)
    if (!hasScrolledOnceRef.current && comments.length > 0 && selectedSide) {
      // 첫 입장 시 무조건 맨 아래로 스크롤
      setTimeout(() => scrollToBottom(), 100)
      hasScrolledOnceRef.current = true
    }
    // 본인이 메시지를 보낸 경우 무조건 스크롤
    else if (justSentMessageRef.current && comments.length > prevCommentsLengthRef.current) {
      setTimeout(() => scrollToBottom(), 100)
      justSentMessageRef.current = false
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
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 text-center flex-shrink-0">
        <h1 className="text-xl font-bold">
          🎮 R{activeRound.round_number}/6
        </h1>
        <p className="text-sm">
          {selectedSide === 'A' ? `😤 ${activeRound.option_a}` : `💪 ${activeRound.option_b}`}
        </p>
      </div>

      {/* 채팅 영역 */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-3 scrollbar-hide"
        style={{
          scrollbarWidth: 'none', /* Firefox */
          msOverflowStyle: 'none', /* IE and Edge */
        }}
      >
        <AnimatePresence>
          {comments.map((c) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${c.side === selectedSide ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] p-3 rounded-2xl break-words ${
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
        <div ref={messagesEndRef} />
        {/* 입력창 높이만큼 여백 추가 */}
        <div className="h-24"></div>
      </div>

      {/* 입력 영역 - 화면 하단 고정 */}
      <div className="bg-white border-t border-gray-200 p-4 flex-shrink-0 fixed bottom-0 left-0 right-0">
        <div className="max-w-md mx-auto">
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
              placeholder="메시지를 입력하세요... (50자 이내)"
              maxLength={50}
              className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
            />
            <button
              onClick={submitComment}
              disabled={!comment.trim()}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold px-6 py-3 rounded-lg disabled:opacity-50 hover:from-purple-600 hover:to-pink-600 transition-opacity"
            >
              전송 📤
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
