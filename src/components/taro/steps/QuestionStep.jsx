function QuestionStep({ next, prev }) {
  return (
    <div>
      <h1>타로 3 — 질문 선택</h1>
      <button onClick={prev}>이전</button>
      <button onClick={next}>다음</button>
    </div>
  )
}

export default QuestionStep


