function AnalyzeStep({ next, prev }) {
  return (
    <div>
      <h1>타로 8 — 해석 중</h1>
      <button onClick={prev}>이전</button>
      <button onClick={next}>다음</button>
    </div>
  )
}

export default AnalyzeStep


