'use client'
import { useState } from 'react'

export interface QuizQuestion {
  question: string
  options: string[]
  answer: number
  explanation: string
}

const LABELS = ['A', 'B', 'C', 'D']

export function Quiz({ questions, title = '퀴즈로 확인하기' }: { questions: QuizQuestion[]; title?: string }) {
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)

  const q = questions[current]
  const isLast = current === questions.length - 1

  function handleSelect(idx: number) {
    if (selected !== null) return
    setSelected(idx)
    if (idx === q.answer) setScore((s) => s + 1)
  }

  function handleNext() {
    if (isLast) {
      setFinished(true)
    } else {
      setCurrent((c) => c + 1)
      setSelected(null)
    }
  }

  function handleRestart() {
    setCurrent(0)
    setSelected(null)
    setScore(0)
    setFinished(false)
  }

  if (finished) {
    const pct = Math.round((score / questions.length) * 100)
    const emoji = pct >= 80 ? '🎉' : pct >= 60 ? '👍' : '💪'
    const msg = pct >= 80 ? '훌륭해요! 완벽하게 이해했네요.' : pct >= 60 ? '잘했어요! 한 번 더 읽어보면 완벽할 거예요.' : '조금 더 읽어보고 다시 도전해봐요!'
    return (
      <div className="not-prose my-8 rounded-2xl border-2 border-purple-100 bg-gradient-to-br from-purple-50 to-white p-8 text-center shadow-sm">
        <div className="text-5xl mb-3">{emoji}</div>
        <h3 className="text-xl font-bold text-purple-900 mb-1">{msg}</h3>
        <p className="text-purple-600 mb-1 text-lg font-semibold">{score} / {questions.length} 정답</p>
        <p className="text-purple-400 text-sm mb-6">정확도 {pct}%</p>
        <button
          onClick={handleRestart}
          className="px-6 py-2.5 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors text-sm font-semibold shadow"
        >
          다시 풀기
        </button>
      </div>
    )
  }

  const progress = (current / questions.length) * 100

  return (
    <div className="not-prose my-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-purple-700">{title}</span>
        <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">{current + 1} / {questions.length}</span>
      </div>

      <div className="w-full h-1.5 bg-gray-100 rounded-full mb-5 overflow-hidden">
        <div
          className="h-1.5 bg-purple-400 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="text-gray-900 font-medium text-base mb-4 leading-relaxed">{q.question}</p>

      <div className="space-y-2 mb-4">
        {q.options.map((opt, idx) => {
          let cls = 'w-full text-left px-4 py-3 rounded-xl border text-sm transition-all duration-150 flex items-start gap-2.5 '
          if (selected === null) {
            cls += 'border-gray-200 hover:border-purple-300 hover:bg-purple-50 cursor-pointer'
          } else if (idx === q.answer) {
            cls += 'border-green-400 bg-green-50 text-green-800 font-medium'
          } else if (idx === selected) {
            cls += 'border-red-300 bg-red-50 text-red-700'
          } else {
            cls += 'border-gray-100 text-gray-400 cursor-default'
          }
          return (
            <button key={idx} onClick={() => handleSelect(idx)} disabled={selected !== null} className={cls}>
              <span className="flex-shrink-0 w-5 h-5 rounded-full border border-current flex items-center justify-center text-xs font-bold">
                {selected !== null && idx === q.answer ? '✓' : selected !== null && idx === selected && idx !== q.answer ? '✗' : LABELS[idx]}
              </span>
              <span>{opt}</span>
            </button>
          )
        })}
      </div>

      {selected !== null && (
        <>
          <div className={`rounded-xl px-4 py-3 text-sm mb-4 ${selected === q.answer ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-orange-50 text-orange-800 border border-orange-200'}`}>
            <span className="font-semibold">{selected === q.answer ? '✓ 정답!' : '✗ 오답'}</span>
            {' '}{q.explanation}
          </div>
          <button
            onClick={handleNext}
            className="w-full py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors text-sm font-semibold"
          >
            {isLast ? '결과 보기 →' : '다음 문제 →'}
          </button>
        </>
      )}
    </div>
  )
}
