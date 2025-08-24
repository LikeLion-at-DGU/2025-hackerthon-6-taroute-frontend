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
import { useTranslation } from "react-i18next";


function CommonStep(props){
  const { t } = useTranslation();
  const{ 
    next, 
    prev, 
    headerText,
    roleText,
    contentText,
    showPrevButton = false,
  } = props;

  const taroHeader = headerText ?? t("taro.name"); // "타루"
  const taroRole   = roleText  ?? t("taro.job");   // "타로마스터"

  return (
    <Wrapper>
      <Overlay />
      <TaruMascot src={taruSvg} alt="타루" aria-label="타루" role="img" />

      <BubbleHeader>
        <span className="name">{taroHeader}</span>
        <span className="role">{taroRole}</span>
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
