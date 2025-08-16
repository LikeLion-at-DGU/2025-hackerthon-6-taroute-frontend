import {
  Wrapper,
  Overlay,
  TaruMascot,
  BubbleHeader,
  BubbleContent,
  ButtonPrev,
  ButtonNext,
} from '../styles/ConsentStep.style.js'
import taruSvg from '../../../assets/icons/taru.svg'

function CommonStep({ 
  next, 
  prev, 
  headerText = "타루",
  roleText = "타로마스터",
  contentText,
  showPrevButton = false,
}) {
  return (
    <Wrapper>
      <Overlay />
      <TaruMascot src={taruSvg} alt="타루" aria-label="타루" role="img" />

      <BubbleHeader>
        <span className="name">{headerText}</span>
        <span className="role">{roleText}</span>
      </BubbleHeader>

      <BubbleContent>
        <div className="text" dangerouslySetInnerHTML={{ __html: contentText }} />
        <div className="next-indicator" onClick={next}>&gt;&gt;</div>
      </BubbleContent>

      {showPrevButton && (
        <ButtonPrev onClick={prev} />
      )}
    </Wrapper>
  )
}

export default CommonStep
