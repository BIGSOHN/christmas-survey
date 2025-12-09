import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const QUESTIONS = [
  {
    id: 'intra_id',
    question: '42 Intra ID',
    type: 'text',
    required: true
  },
  {
    id: 'circle',
    question: '현재 서클',
    type: 'select',
    options: ['0서클', '1서클', '2서클', '3서클', '4서클', '5서클', '6서클', '트랜센던스'],
    required: true
  },
  {
    id: 'dev_field',
    question: '졸업 후 희망하는 개발 분야는?',
    type: 'select',
    options: [
      '프론트엔드 개발자',
      '백엔드 개발자',
      '풀스택 개발자',
      'DevOps/인프라 엔지니어',
      'AI/ML 엔지니어',
      '게임 개발자',
      '모바일 앱 개발자',
      '임베디드/시스템 프로그래머',
      '보안 전문가',
      '데이터 엔지니어/분석가',
      '아직 모르겠다'
    ],
    required: true
  },
  {
    id: 'programming_language',
    question: '가장 자신있는 프로그래밍 언어는?',
    type: 'select',
    options: ['C/C++', 'Python', 'JavaScript/TypeScript', 'Java', 'Go', 'Rust', 'Swift/Kotlin', 'Ruby', '기타'],
    required: true
  },
  {
    id: 'editor',
    question: '주로 사용하는 에디터/IDE는?',
    type: 'select',
    options: ['Vim/Neovim', 'VS Code', 'IntelliJ IDEA 계열', 'Emacs', 'Sublime Text', '기타'],
    required: true
  },
  {
    id: 'active_time',
    question: '주로 클러스터에 오는 시간대는?',
    type: 'select',
    options: [
      '새벽형 (04:00-08:00)',
      '아침형 (08:00-12:00)',
      '오후형 (12:00-18:00)',
      '저녁형 (18:00-22:00)',
      '밤형 (22:00-02:00)',
      '올빼미형 (02:00-04:00)'
    ],
    required: true
  },
  {
    id: 'cluster_hours',
    question: '평균적으로 하루에 클러스터에서 몇 시간 정도 있나요?',
    type: 'select',
    options: ['2시간 미만', '2-4시간', '4-6시간', '6-8시간', '8-10시간', '10시간 이상', '거의 안 간다 (재택)'],
    required: true
  },
  {
    id: 'study_location',
    question: '주로 학습하는 위치는?',
    type: 'select',
    options: ['클러스터 개방존', '사일런트존', '오아시스', '오픈라운지', '정해진 자리 없이 매번 바뀜'],
    required: true
  },
  {
    id: 'study_location_reason',
    question: '왜 이곳에서 주로 학습을 하나요?',
    type: 'select',
    options: [
      '개인 노트북으로 공부하는게 편해서',
      '클러스터 pc 내에서 내가 필요로 하는 소프트웨어를 지원하지 않아서',
      '편하게 세팅할 수 있어서',
      '기타'
    ],
    required: false,
    showIf: (answers) => {
      const location = answers.study_location
      return location && location !== '클러스터 개방존' && location !== '사일런트존'
    }
  },
  {
    id: 'study_location_reason_other',
    question: '기타 이유를 입력해주세요',
    type: 'text',
    required: false,
    showIf: (answers) => {
      return answers.study_location_reason === '기타'
    }
  },
  {
    id: 'work_style',
    question: '과제를 할 때 선호하는 방식은?',
    type: 'select',
    options: ['완전 혼자 집중해서', '옆에서 같이 하면서 질문/답변', '페어 프로그래밍', '상황에 따라 다름'],
    required: true
  },
  {
    id: 'planning_style',
    question: '과제 진행 스타일은?',
    type: 'select',
    options: ['철저한 계획형 (먼저 설계하고 코딩)', '일단 코딩 시작하는 즉흥형', '반반 섞임'],
    required: true
  },
  {
    id: 'learning_method',
    question: '새로운 기술을 배울 때 선호하는 방법은?',
    type: 'select',
    options: ['공식 문서 정독', '유튜브/강의', '블로그/미디엄 글', '직접 코드 짜보면서', '다른 사람에게 물어보면서'],
    required: true
  },
  {
    id: 'mbti',
    question: 'MBTI는?',
    type: 'select',
    options: [
      'ISTJ', 'ISFJ', 'INFJ', 'INTJ',
      'ISTP', 'ISFP', 'INFP', 'INTP',
      'ESTP', 'ESFP', 'ENFP', 'ENTP',
      'ESTJ', 'ESFJ', 'ENFJ', 'ENTJ',
      '모르겠다/안 믿는다'
    ],
    required: true
  },
  {
    id: 'mbti_reliability',
    question: 'MBTI를 얼마나 신뢰하시나요?',
    type: 'scale',
    min: 1,
    max: 5,
    labels: ['전혀 안 믿는다', '별로 안 믿는다', '그냥 재미로만', '어느 정도 맞는 것 같다', '매우 신뢰한다'],
    required: true
  },
  {
    id: 'coding_environment',
    question: '코딩할 때 선호하는 환경은?',
    type: 'select',
    options: [
      '완전 조용한 환경',
      '잔잔한 음악 (lo-fi, 클래식 등)',
      '신나는 음악 (팝, 록 등)',
      '백색소음/빗소리',
      '사람들 소리 들리는 환경',
      '아무거나 상관없음'
    ],
    required: true
  },
  {
    id: 'favorite_snack',
    question: '42 경산에서 선호하는 간식은? (복수 선택)',
    type: 'multi-select',
    options: ['커피/에너지 드링크', '소시지류', '에너지바류', '과자류', '젤리류', '기타'],
    required: true
  },
  {
    id: 'debugging_method',
    question: '디버깅할 때 주로 쓰는 방법은?',
    type: 'select',
    options: [
      'printf/console.log 도배',
      '디버거 툴 사용',
      '구글링',
      '동료에게 물어봄',
      '러버덕 디버깅 (혼잣말)',
      '일단 코드 다시 짬'
    ],
    required: true
  },
  {
    id: 'hardest_project',
    question: '42 교육과정에서 가장 힘들었던 과제는?',
    type: 'text',
    required: false
  },
  {
    id: 'goal_2026',
    question: '2026년 개발 목표는?',
    type: 'select',
    options: [
      '포트폴리오 프로젝트 완성',
      '취업 성공',
      '새로운 언어/프레임워크 마스터',
      '오픈소스 기여',
      '블랙홀 탈출',
      '기타'
    ],
    required: false
  }
]

export default function Survey() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Filter questions based on showIf condition
  const filteredQuestions = QUESTIONS.filter(q => {
    if (!q.showIf) return true
    return q.showIf(answers)
  })

  const currentQuestion = filteredQuestions[currentStep]
  const progress = ((currentStep + 1) / filteredQuestions.length) * 100

  const handleAnswer = (value) => {
    setAnswers({ ...answers, [currentQuestion.id]: value })
  }

  const handleNext = () => {
    if (currentStep < filteredQuestions.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleSubmit()
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const { data, error } = await supabase
        .from('surveys')
        .insert([{
          ...answers,
          created_at: new Date().toISOString()
        }])

      if (error) throw error

      alert('설문에 참여해주셔서 감사합니다!')
      navigate('/stats')
    } catch (error) {
      console.error('Error submitting survey:', error)
      alert('설문 제출 중 오류가 발생했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const isAnswered = answers[currentQuestion.id] !== undefined && answers[currentQuestion.id] !== ''

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-900 to-green-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-white mb-2">
            <span>질문 {currentStep + 1} / {filteredQuestions.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-3 bg-white/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-white transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            {currentQuestion.question}
            {currentQuestion.required && <span className="text-red-500 ml-1">*</span>}
          </h2>

          {/* Answer Input */}
          <div className="space-y-3">
            {currentQuestion.type === 'text' && (
              <input
                type="text"
                value={answers[currentQuestion.id] || ''}
                onChange={(e) => handleAnswer(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none"
                placeholder="답변을 입력해주세요"
              />
            )}

            {currentQuestion.type === 'select' && (
              <div className="space-y-2">
                {currentQuestion.options.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleAnswer(option)}
                    className={`w-full px-4 py-3 rounded-lg text-left transition-colors ${
                      answers[currentQuestion.id] === option
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}

            {currentQuestion.type === 'multi-select' && (
              <div className="space-y-2">
                {currentQuestion.options.map((option) => {
                  const selectedOptions = answers[currentQuestion.id] || []
                  const isSelected = selectedOptions.includes(option)

                  return (
                    <button
                      key={option}
                      onClick={() => {
                        if (isSelected) {
                          handleAnswer(selectedOptions.filter(item => item !== option))
                        } else {
                          handleAnswer([...selectedOptions, option])
                        }
                      }}
                      className={`w-full px-4 py-3 rounded-lg text-left transition-colors ${
                        isSelected
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                      }`}
                    >
                      {option}
                    </button>
                  )
                })}
              </div>
            )}

            {currentQuestion.type === 'scale' && (
              <div className="space-y-4">
                <div className="flex justify-between">
                  {Array.from({ length: currentQuestion.max }, (_, i) => i + 1).map((num) => (
                    <button
                      key={num}
                      onClick={() => handleAnswer(num)}
                      className={`w-14 h-14 rounded-full text-xl font-bold transition-all ${
                        answers[currentQuestion.id] === num
                          ? 'bg-red-600 text-white scale-110'
                          : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
                <div className="text-sm text-gray-600 text-center">
                  {currentQuestion.labels[answers[currentQuestion.id] - 1]}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="flex-1 bg-white/20 text-white font-bold py-4 px-6 rounded-lg hover:bg-white/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← 이전
          </button>
          <button
            onClick={handleNext}
            disabled={currentQuestion.required && !isAnswered}
            className="flex-1 bg-white text-red-700 font-bold py-4 px-6 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {currentStep === filteredQuestions.length - 1 ? (isSubmitting ? '제출 중...' : '제출하기 →') : '다음 →'}
          </button>
        </div>
      </div>
    </div>
  )
}
