import CommonStep from './CommonStep'

function ConfirmStep({ next, prev }) {
  const contentText = `
    질문에 답해줘서 고마워!
    <br />너의 답변을 바탕으로 카드를 만들어볼게 
    <br />잠시만 기다려줘
  `

  return (
    <CommonStep
      next={next}
      prev={prev}
      headerText="타루"
      roleText="타로마스터"
      contentText={contentText}
      showPrevButton={false}
    />
  )
}

export default ConfirmStep


