function FlipStep({ next, prev }) {
  return (
    <div>
      <h1>타로 6.1 — 카드 뒤집기</h1>
      <button onClick={prev}>이전</button>
      <button onClick={next}>다음</button>
    </div>
  )
}

export default FlipStep


