function ConfirmStep({ next, prev }) {
  return (
    <div>
      <h1>타로 4 — 확인</h1>
      <button onClick={prev}>이전</button>
      <button onClick={next}>다음</button>
    </div>
  )
}

export default ConfirmStep


