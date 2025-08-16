import useTaroFlow from '../hooks/useTaroFlow.js'

import IntroStep from '../components/taro/steps/IntroStep.jsx'
import ConsentStep from '../components/taro/steps/ConsentStep.jsx'
import QuestionStep from '../components/taro/steps/QuestionStep.jsx'
import LocationStep from '../components/taro/steps/LocationStep.jsx'
import ConfirmStep from '../components/taro/steps/ConfirmStep.jsx'
import ShuffleStep from '../components/taro/steps/ShuffleStep.jsx'
import SpreadStep from '../components/taro/steps/SpreadStep.jsx'
import ReadyStep from '../components/taro/steps/ReadyStep.jsx'
import ResultStep from '../components/taro/steps/ResultStep.jsx'
import GoStep from '../components/taro/steps/GoStep.jsx'

const stepComponents = [
  IntroStep,
  ConsentStep,
  QuestionStep,
  LocationStep,
  ConfirmStep,
  ShuffleStep,
  SpreadStep,
  ReadyStep,
  GoStep,
  ResultStep,
]

function Taro() {
  const { currentStepIndex, goNext, goPrev, goTo, totalSteps } = useTaroFlow({
    totalSteps: stepComponents.length,
  })
  const Step = stepComponents[currentStepIndex]

  return (
    <section>
      <Step next={goNext} prev={goPrev} goTo={goTo} index={currentStepIndex} />
    </section>
  )
}

export default Taro


