import CommonStep from './CommonStep'

function ConsentStep({ next, prev }) {
  const contentText = `
    안녕! 난 타로마스터 <strong>'타루'</strong>라고 해
    <br />본격적인 상담에 앞서 네가 어떤 고민을 가지고 있는지 
    <br />들어보고 너의 상황에 맞는 추천을 해줄게
    <br />너에게 더 적합한 답변을 선택해줘
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

export default ConsentStep
