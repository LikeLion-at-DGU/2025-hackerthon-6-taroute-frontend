function ReadyStep({ next, prev }) {
  return (
    <div>
      <h1>타로 9 — 결과 확인 준비</h1>
      <button onClick={prev}>이전</button>
      <button onClick={next}>결과 보기</button>
    </div>
  )
}

export default ReadyStep


