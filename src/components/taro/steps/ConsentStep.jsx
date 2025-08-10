function ConsentStep({ next, prev }) {
  return (
    <div>
      <h1>타로 2 — 안내/동의</h1>
      <button onClick={prev}>이전</button>
      <button onClick={next}>다음</button>
    </div>
  )
}

export default ConsentStep


