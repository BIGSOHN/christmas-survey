import { useState, useEffect, useRef, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { motion, AnimatePresence } from 'framer-motion'
import profanityData from '../data/profanity.json'

export default function ParticipantPage() {
  const [activeRound, setActiveRound] = useState(null)
  const [selectedSide, setSelectedSide] = useState(null)
  const [comment, setComment] = useState('')
  const [comments, setComments] = useState([])
  const [submitted, setSubmitted] = useState(false)
  const [showRoundEndMessage, setShowRoundEndMessage] = useState(false)
  const [voteCounts, setVoteCounts] = useState({ A: 0, B: 0 })
  const [cooldownRemaining, setCooldownRemaining] = useState(0)
  const messagesEndRef = useRef(null)
  const containerRef = useRef(null)
  const lastMessageTimeRef = useRef(0)
  // 욕설 리스트를 초기값으로 직접 설정
  const profanityList = profanityData.profanityList || []

  const fetchComments = useCallback(async (roundId) => {
    const { data } = await supabase
      .from('balance_game_comments')
      .select('*')
      .eq('round_id', roundId)
      .eq('is_hidden', false)
      .order('created_at', { ascending: true })

    if (data) setComments(data)
  }, [])

  const fetchVoteCounts = useCallback(async (roundId) => {
    const { data: votes } = await supabase
      .from('balance_game_votes')
      .select('side')
      .eq('round_id', roundId)

    if (votes) {
      const counts = { A: 0, B: 0 }
      votes.forEach(vote => {
        counts[vote.side]++
      })
      setVoteCounts(counts)
    }
  }, [])

  useEffect(() => {
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

    fetchActiveRound()

    // Realtime 구독
    const roundSubscription = supabase
      .channel('participant_round')
      .on('postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'balance_game_rounds' },
        (payload) => {
          // 현재 보고 있는 라운드가 종료된 경우
          if (activeRound && payload.new.id === activeRound.id && !payload.new.is_active) {
            // 종료 메시지 표시
            setShowRoundEndMessage(true)
            setActiveRound(null)
            setSelectedSide(null)
            setComment('')
            setSubmitted(false)
            setComments([])

            // 2초 후 종료 메시지 숨김
            setTimeout(() => {
              setShowRoundEndMessage(false)
            }, 2000)
          }
          // 새로운 라운드가 시작된 경우
          else if (payload.new.is_active) {
            setShowRoundEndMessage(false)
            setActiveRound(payload.new)
            setSelectedSide(null)
            setComment('')
            setSubmitted(false)
            fetchComments(payload.new.id)
            fetchVoteCounts(payload.new.id)
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

    const votesSubscription = supabase
      .channel('participant_votes')
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
  }, [activeRound, fetchComments, fetchVoteCounts])

  /**
   * 욕설 필터링 체크 함수
   *
   * @param {string} text - 검사할 텍스트 (사용자가 입력한 메시지)
   * @returns {boolean} - 욕설이 포함되어 있으면 true, 없으면 false
   *
   * 작동 방식:
   * 1. profanityList에 있는 모든 욕설 단어를 하나씩 검사
   * 2. 대소문자를 무시하고 비교 (영문 욕설 대응)
   * 3. 부분 문자열 검색으로 욕설이 포함되어 있는지 확인
   * 4. 하나라도 발견되면 즉시 true 반환
   *
   * 예시:
   * - containsProfanity("안녕하세요") → false (욕설 없음)
   * - containsProfanity("시발 좋네") → true ("시발"이 리스트에 있음)
   * - containsProfanity("ㅅㅂ") → true ("ㅅㅂ"이 리스트에 있음)
   * - containsProfanity("FUCK") → true (소문자 변환 후 "fuck"과 매칭)
   */
  const containsProfanity = (text) => {
    // 욕설 리스트가 비어있으면 검사 생략 (통과)
    if (profanityList.length === 0) return false

    // 대소문자 구분 없이 검사하기 위해 소문자로 변환
    const lowerText = text.toLowerCase()

    // profanityList의 각 욕설 단어에 대해 검사
    // some(): 배열 요소 중 하나라도 조건을 만족하면 true 반환
    return profanityList.some(word => {
      const lowerWord = word.toLowerCase()
      // includes(): 문자열에 특정 단어가 포함되어 있는지 확인
      // 예: "이거 시발 좋네".includes("시발") → true
      return lowerText.includes(lowerWord)
    })
  }

  /**
   * 세션 ID 생성 또는 가져오기
   * - localStorage에 저장된 고유 ID 사용
   * - 없으면 새로 생성 (브라우저별 고유 ID)
   */
  const getOrCreateSessionId = () => {
    let sessionId = localStorage.getItem('balance_game_session_id')
    if (!sessionId) {
      sessionId = crypto.randomUUID()
      localStorage.setItem('balance_game_session_id', sessionId)
    }
    return sessionId
  }

  /**
   * 선택지 투표 저장
   * - upsert: 이미 투표했으면 업데이트, 없으면 새로 삽입
   * - 재투표 시 마지막 선택만 반영
   */
  const saveVote = async (side) => {
    const sessionId = getOrCreateSessionId()

    const { error } = await supabase
      .from('balance_game_votes')
      .upsert({
        round_id: activeRound.id,
        session_id: sessionId,
        side: side
      }, {
        onConflict: 'round_id,session_id'
      })

    if (error) {
      console.error('투표 저장 실패:', error)
    } else {
      console.log(`투표 저장 완료: ${side}`)
    }
  }

  /**
   * 선택지 선택 핸들러
   * - 선택지를 state에 저장하고
   * - DB에 투표 기록
   */
  const handleSideSelection = async (side) => {
    setSelectedSide(side)
    await saveVote(side)
  }

  const submitComment = async () => {
    if (!comment.trim() || comment.length > 50) {
      alert('의견은 1-50자 이내로 입력해주세요')
      return
    }

    // 쿨다운 체크 (3초)
    const now = Date.now()
    const timeSinceLastMessage = now - lastMessageTimeRef.current
    const cooldownTime = 3000 // 3초

    if (timeSinceLastMessage < cooldownTime) {
      const remainingSeconds = Math.ceil((cooldownTime - timeSinceLastMessage) / 1000)
      alert(`너무 빠르게 메시지를 보내고 있습니다. ${remainingSeconds}초 후에 다시 시도해주세요.`)
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

    // 마지막 메시지 전송 시간 기록
    lastMessageTimeRef.current = now

    setComment('')
    // 메시지를 보냈다는 플래그 설정
    justSentMessageRef.current = true

    // 쿨다운 타이머 시작
    setCooldownRemaining(3)
    const interval = setInterval(() => {
      setCooldownRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)
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

  // 라운드 종료 메시지 표시
  if (showRoundEndMessage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-white text-center"
        >
          <div className="text-6xl mb-4">🏁</div>
          <h1 className="text-4xl font-bold mb-2">라운드가 종료되었습니다!</h1>
          <p className="text-xl">잠시 후 다음 라운드가 시작됩니다...</p>
        </motion.div>
      </div>
    )
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
              🎮 밸런스 게임
            </h1>
            <h2 className="text-xl text-center text-gray-700 mb-6">
              {activeRound.question_text}
            </h2>

            <div className="space-y-4">
              <button
                onClick={() => handleSideSelection('A')}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-6 px-6 rounded-xl hover:from-blue-600 hover:to-blue-700 transform hover:scale-105 transition"
              >
                <div className="text-2xl mb-2">😤</div>
                <div className="text-lg">{activeRound.option_a}</div>
              </button>

              <button
                onClick={() => handleSideSelection('B')}
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

  const totalVotes = voteCounts.A + voteCounts.B
  const percentageA = totalVotes > 0 ? Math.round((voteCounts.A / totalVotes) * 100) : 50
  const percentageB = totalVotes > 0 ? Math.round((voteCounts.B / totalVotes) * 100) : 50

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white flex-shrink-0">
        <div className="p-4">
          <div className="relative max-w-md mx-auto">
            <button
              onClick={() => {
                setSelectedSide(null)
                setComment('')
              }}
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white font-bold text-2xl w-10 h-10 rounded-lg transition shadow-md flex items-center justify-center"
            >
              ←
            </button>
            <div className="text-center px-14">
              <h1 className="text-base sm:text-lg font-bold truncate">
                {activeRound.question_text}
              </h1>
              <p className="text-xs sm:text-sm truncate">
                {selectedSide === 'A' ? `😤 ${activeRound.option_a}` : `💪 ${activeRound.option_b}`}
              </p>
            </div>
          </div>
        </div>

        {/* 투표 현황 바 */}
        <div className="bg-white bg-opacity-10 px-4 py-3">
          <div className="max-w-md mx-auto">
            <div className="flex justify-between text-xs mb-1">
              <span>😤 {activeRound.option_a}: {voteCounts.A}표 ({percentageA}%)</span>
              <span>💪 {activeRound.option_b}: {voteCounts.B}표 ({percentageB}%)</span>
            </div>
            <div className="w-full bg-white bg-opacity-30 rounded-full h-2 overflow-hidden">
              <div className="flex h-full">
                <div
                  className="bg-blue-400 transition-all duration-500"
                  style={{ width: `${percentageA}%` }}
                ></div>
                <div
                  className="bg-pink-400 transition-all duration-500"
                  style={{ width: `${percentageB}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
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
                if (e.key === 'Enter' && comment.trim() && cooldownRemaining === 0) {
                  submitComment()
                }
              }}
              placeholder="메시지를 입력하세요... (50자 이내)"
              maxLength={50}
              className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
            />
            <button
              onClick={submitComment}
              disabled={!comment.trim() || cooldownRemaining > 0}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold px-6 py-3 rounded-lg disabled:opacity-50 hover:from-purple-600 hover:to-pink-600 transition-opacity"
            >
              {cooldownRemaining > 0 ? `${cooldownRemaining}초` : '전송 📤'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
