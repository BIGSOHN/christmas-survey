import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function AdminPage() {
  const [rounds, setRounds] = useState([])
  const [comments, setComments] = useState([])
  const [activeRound, setActiveRound] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingRound, setEditingRound] = useState(null)
  const [formData, setFormData] = useState({
    question_text: '',
    option_a: '',
    option_b: ''
  })

  useEffect(() => {
    fetchRounds()
    fetchComments()

    // Realtime 구독
    const commentsSubscription = supabase
      .channel('admin_comments')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'balance_game_comments' },
        () => fetchComments()
      )
      .subscribe()

    return () => {
      commentsSubscription.unsubscribe()
    }
  }, [])

  const fetchRounds = async () => {
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
  }

  const fetchComments = async () => {
    const { data } = await supabase
      .from('balance_game_comments')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)

    if (data) setComments(data)
  }

  const startRound = async (roundNumber) => {
    // 모든 라운드 비활성화
    await supabase
      .from('balance_game_rounds')
      .update({ is_active: false })
      .neq('id', '00000000-0000-0000-0000-000000000000')

    // 해당 라운드만 활성화
    await supabase
      .from('balance_game_rounds')
      .update({ is_active: true })
      .eq('round_number', roundNumber)

    fetchRounds()
  }

  const endRound = async () => {
    await supabase
      .from('balance_game_rounds')
      .update({ is_active: false })
      .eq('is_active', true)

    setActiveRound(null)
    fetchRounds()
  }

  const hideComment = async (commentId) => {
    await supabase
      .from('balance_game_comments')
      .update({ is_hidden: true })
      .eq('id', commentId)

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
          {activeRound && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-lg font-semibold text-blue-800">
                현재 진행 중: Round {activeRound.round_number} - {activeRound.question_text}
              </p>
            </div>
          )}
        </header>

        {/* 라운드 관리 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">라운드 관리</h2>
            <button
              onClick={openAddModal}
              className="bg-blue-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-600"
            >
              + 새 라운드 추가
            </button>
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
                    <h3 className="font-bold text-lg">Round {round.round_number}</h3>
                    <p className="text-gray-700 mt-1">{round.question_text}</p>
                    <div className="mt-2 space-y-1">
                      <p className="text-sm text-blue-600">A: {round.option_a}</p>
                      <p className="text-sm text-pink-600">B: {round.option_b}</p>
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
                <button
                  onClick={() => startRound(round.round_number)}
                  disabled={round.is_active}
                  className={`w-full mt-3 font-semibold py-2 px-4 rounded-lg transition ${
                    round.is_active
                      ? 'bg-green-500 text-white cursor-not-allowed'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {round.is_active ? '진행 중' : '시작하기'}
                </button>
              </div>
            ))}
          </div>
          {activeRound && (
            <button
              onClick={endRound}
              className="mt-4 w-full bg-red-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-red-600"
            >
              현재 라운드 종료
            </button>
          )}
        </div>

        {/* 메시지 관리 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">메시지 관리</h2>
          <div className="space-y-2 max-h-96 overflow-y-auto">
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
                  {!comment.is_hidden && (
                    <button
                      onClick={() => hideComment(comment.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                      숨김
                    </button>
                  )}
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
