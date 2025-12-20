import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [passwordInput, setPasswordInput] = useState('')
  const [rounds, setRounds] = useState([])
  const [comments, setComments] = useState([])
  const [activeRound, setActiveRound] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingRound, setEditingRound] = useState(null)
  const [voteCounts, setVoteCounts] = useState({})
  const [formData, setFormData] = useState({
    question_text: '',
    option_a: '',
    option_b: ''
  })

  const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD // 나중에 42 OAuth로 교체 예정

  const fetchRounds = useCallback(async () => {
    const { data, error } = await supabase
      .from('balance_game_rounds')
      .select('*')
      .order('round_number')

    if (!error) {
      setRounds(data)
      const active = data.find(r => r.is_active)
      setActiveRound(active)
    }
    setLoading(false)
  }, [])

  const fetchComments = useCallback(async () => {
    const { data } = await supabase
      .from('balance_game_comments')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)

    if (data) setComments(data)
  }, [])

  const fetchVoteCounts = useCallback(async () => {
    const { data: votes } = await supabase
      .from('balance_game_votes')
      .select('round_id, side')

    if (votes) {
      const counts = {}
      votes.forEach(vote => {
        if (!counts[vote.round_id]) {
          counts[vote.round_id] = { A: 0, B: 0 }
        }
        counts[vote.round_id][vote.side]++
      })
      setVoteCounts(counts)
    }
  }, [])

  useEffect(() => {
    if (!isAuthenticated) return

    // 초기 데이터 로드 및 실시간 구독 설정
    const initializeData = async () => {
      await fetchRounds()
      await fetchComments()
      await fetchVoteCounts()
    }

    initializeData()

    // Realtime 구독 - 댓글 변경사항 실시간 감지
    const commentsSubscription = supabase
      .channel('admin_comments_realtime')
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'balance_game_comments' },
        (payload) => {
          console.log('새 댓글 추가됨:', payload.new)
          fetchComments()
        }
      )
      .on('postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'balance_game_comments' },
        (payload) => {
          console.log('댓글 업데이트됨:', payload.new)
          fetchComments()
        }
      )
      .on('postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'balance_game_comments' },
        (payload) => {
          console.log('댓글 삭제됨:', payload.old)
          fetchComments()
        }
      )
      .subscribe((status) => {
        console.log('AdminPage 댓글 실시간 구독 상태:', status)
      })

    // 라운드 변경사항 실시간 감지
    const roundsSubscription = supabase
      .channel('admin_rounds_realtime')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'balance_game_rounds' },
        (payload) => {
          console.log('라운드 변경됨:', payload)
          fetchRounds()
        }
      )
      .subscribe((status) => {
        console.log('AdminPage 라운드 실시간 구독 상태:', status)
      })

    // 투표 변경사항 실시간 감지
    const votesSubscription = supabase
      .channel('admin_votes_realtime')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'balance_game_votes' },
        (payload) => {
          console.log('투표 변경됨:', payload)
          fetchVoteCounts()
        }
      )
      .subscribe((status) => {
        console.log('AdminPage 투표 실시간 구독 상태:', status)
      })

    return () => {
      console.log('AdminPage 구독 해제')
      commentsSubscription.unsubscribe()
      roundsSubscription.unsubscribe()
      votesSubscription.unsubscribe()
    }
  }, [isAuthenticated, fetchRounds, fetchComments, fetchVoteCounts])

  const toggleRound = async (round) => {
    if (round.is_active) {
      // 진행 중인 라운드 종료
      await supabase
        .from('balance_game_rounds')
        .update({ is_active: false })
        .eq('id', round.id)
    } else {
      // 다른 라운드 시작
      // 먼저 모든 라운드 비활성화
      await supabase
        .from('balance_game_rounds')
        .update({ is_active: false })
        .neq('id', '00000000-0000-0000-0000-000000000000')

      // 해당 라운드만 활성화
      await supabase
        .from('balance_game_rounds')
        .update({ is_active: true })
        .eq('id', round.id)
    }

    fetchRounds()
  }

  const hideComment = async (commentId) => {
    await supabase
      .from('balance_game_comments')
      .update({ is_hidden: true })
      .eq('id', commentId)

    fetchComments()
  }

  const unhideComment = async (commentId) => {
    await supabase
      .from('balance_game_comments')
      .update({ is_hidden: false })
      .eq('id', commentId)

    fetchComments()
  }

  const deleteComment = async (commentId) => {
    if (!confirm('정말 이 메시지를 삭제하시겠습니까?')) return

    await supabase.from('balance_game_comments').delete().eq('id', commentId)

    fetchComments()
  }

  const deleteAllComments = async () => {
    if (
      !confirm(
        `정말 모든 메시지(${comments.length}개)를 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`
      )
    )
      return

    await supabase.from('balance_game_comments').delete().neq('id', '00000000-0000-0000-0000-000000000000')

    fetchComments()
  }

  const openAddModal = () => {
    setEditingRound(null)
    setFormData({ question_text: '', option_a: '', option_b: '' })
    setShowAddModal(true)
  }

  const openEditModal = (round) => {
    setEditingRound(round)
    setFormData({
      question_text: round.question_text,
      option_a: round.option_a,
      option_b: round.option_b
    })
    setShowAddModal(true)
  }

  const closeModal = () => {
    setShowAddModal(false)
    setEditingRound(null)
    setFormData({ question_text: '', option_a: '', option_b: '' })
  }

  const saveRound = async () => {
    if (!formData.question_text || !formData.option_a || !formData.option_b) {
      alert('모든 필드를 입력해주세요')
      return
    }

    if (editingRound) {
      // 수정
      await supabase
        .from('balance_game_rounds')
        .update({
          question_text: formData.question_text,
          option_a: formData.option_a,
          option_b: formData.option_b
        })
        .eq('id', editingRound.id)
    } else {
      // 새로 추가
      const nextRoundNumber = rounds.length > 0
        ? Math.max(...rounds.map(r => r.round_number)) + 1
        : 1

      await supabase
        .from('balance_game_rounds')
        .insert({
          round_number: nextRoundNumber,
          question_text: formData.question_text,
          option_a: formData.option_a,
          option_b: formData.option_b,
          is_active: false
        })
    }

    fetchRounds()
    closeModal()
  }

  const deleteRound = async (roundId) => {
    if (!confirm('정말 이 라운드를 삭제하시겠습니까?')) return

    await supabase
      .from('balance_game_rounds')
      .delete()
      .eq('id', roundId)

    fetchRounds()
  }

  const resetVotesForRound = async (roundId) => {
    if (!confirm('이 라운드의 모든 투표를 초기화하시겠습니까?')) return

    await supabase
      .from('balance_game_votes')
      .delete()
      .eq('round_id', roundId)

    alert('투표가 초기화되었습니다')
  }

  const resetAllVotes = async () => {
    if (!confirm('정말 모든 라운드의 투표를 초기화하시겠습니까?\n이 작업은 되돌릴 수 없습니다.')) return

    await supabase
      .from('balance_game_votes')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000')

    alert('모든 투표가 초기화되었습니다')
  }

  const handleLogin = () => {
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      setPasswordInput('')
    } else {
      alert('비밀번호가 틀렸습니다')
      setPasswordInput('')
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
          <h1 className="text-3xl font-bold text-center mb-6">🔒 관리자 로그인</h1>
          <div className="space-y-4">
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleLogin()
                }
              }}
              placeholder="비밀번호를 입력하세요"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
              autoFocus
            />
            <button
              onClick={handleLogin}
              className="w-full bg-purple-500 text-white font-bold py-3 rounded-lg hover:bg-purple-600 transition"
            >
              로그인
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-2xl">로딩 중...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <header className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800">🎮 관리자 페이지</h1>
          <div className="mt-4 p-4 bg-blue-50 rounded-lg min-h-[60px] flex items-center">
            {activeRound ? (
              <p className="text-lg font-semibold text-blue-800">
                현재 진행 중: {activeRound.question_text}
              </p>
            ) : (
              <p className="text-lg text-gray-400">진행 중인 라운드가 없습니다</p>
            )}
          </div>
        </header>

        {/* 라운드 관리 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">라운드 관리</h2>
            <div className="flex gap-3">
              <button
                onClick={resetAllVotes}
                className="bg-orange-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-orange-600"
              >
                전체 투표 초기화
              </button>
              <button
                onClick={openAddModal}
                className="bg-blue-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-600"
              >
                + 새 라운드 추가
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rounds.map((round) => (
              <div
                key={round.id}
                className={`p-4 rounded-lg border-2 ${
                  round.is_active
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-300 bg-white'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{round.question_text}</h3>
                    <div className="mt-2 space-y-1">
                      <p className="text-sm text-blue-600">
                        A: {round.option_a}
                        <span className="font-bold ml-2">
                          ({voteCounts[round.id]?.A || 0}표)
                        </span>
                      </p>
                      <p className="text-sm text-pink-600">
                        B: {round.option_b}
                        <span className="font-bold ml-2">
                          ({voteCounts[round.id]?.B || 0}표)
                        </span>
                      </p>
                    </div>
                    <div className="mt-2 text-sm font-semibold text-gray-600">
                      총 {(voteCounts[round.id]?.A || 0) + (voteCounts[round.id]?.B || 0)}표
                    </div>
                  </div>
                  <div className="flex gap-2 ml-2">
                    <button
                      onClick={() => openEditModal(round)}
                      className="text-blue-500 hover:text-blue-700"
                      title="수정"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => deleteRound(round.id)}
                      className="text-red-500 hover:text-red-700"
                      title="삭제"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => toggleRound(round)}
                    className={`flex-1 font-semibold py-2 px-4 rounded-lg transition ${
                      round.is_active
                        ? 'bg-red-500 text-white hover:bg-red-600'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {round.is_active ? '종료하기' : '시작하기'}
                  </button>
                  <button
                    onClick={() => resetVotesForRound(round.id)}
                    className="bg-orange-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-orange-600 transition"
                    title="투표 초기화"
                  >
                    🔄
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 메시지 관리 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">메시지 관리</h2>
            {comments.length > 0 && (
              <button
                onClick={deleteAllComments}
                className="bg-red-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-red-700"
              >
                전체 삭제
              </button>
            )}
          </div>
          <div className="space-y-1 max-h-96 overflow-y-auto">
            {comments.length === 0 ? (
              <p className="text-gray-500 text-center py-8">아직 메시지가 없습니다</p>
            ) : (
              comments.map((comment) => (
                <div
                  key={comment.id}
                  className={`p-4 rounded-lg flex justify-between items-center ${
                    comment.is_hidden ? 'bg-gray-100 opacity-50' : 'bg-blue-50'
                  }`}
                >
                  <div>
                    <span className="font-semibold">{comment.nickname || 'Anonymous'}</span>
                    <span className="text-gray-500 ml-2">({comment.side})</span>
                    <p className="mt-1">{comment.comment}</p>
                  </div>
                  <div className="flex gap-2">
                    {!comment.is_hidden ? (
                      <button
                        onClick={() => hideComment(comment.id)}
                        className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                      >
                        숨김
                      </button>
                    ) : (
                      <button
                        onClick={() => unhideComment(comment.id)}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                      >
                        표시
                      </button>
                    )}
                    <button
                      onClick={() => deleteComment(comment.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* 라운드 추가/수정 모달 */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-2xl font-bold mb-4">
              {editingRound ? '라운드 수정' : '새 라운드 추가'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">주제</label>
                <input
                  type="text"
                  value={formData.question_text}
                  onChange={(e) => setFormData({ ...formData, question_text: e.target.value })}
                  placeholder="예: 크리스마스 선물"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">선택지 A</label>
                <input
                  type="text"
                  value={formData.option_a}
                  onChange={(e) => setFormData({ ...formData, option_a: e.target.value })}
                  placeholder="예: 직접 만든 선물"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">선택지 B</label>
                <input
                  type="text"
                  value={formData.option_b}
                  onChange={(e) => setFormData({ ...formData, option_b: e.target.value })}
                  placeholder="예: 비싼 선물"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={closeModal}
                className="flex-1 bg-gray-300 text-gray-700 font-bold py-3 rounded-lg hover:bg-gray-400"
              >
                취소
              </button>
              <button
                onClick={saveRound}
                className="flex-1 bg-blue-500 text-white font-bold py-3 rounded-lg hover:bg-blue-600"
              >
                {editingRound ? '수정' : '추가'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
