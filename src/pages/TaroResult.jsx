import ResultStep from '../components/taro/steps/ResultStep.jsx'
import { useNavigate } from 'react-router-dom'

function TaroResult() {
  const navigate = useNavigate()
  
  // ResultStep 컴포넌트에 필요한 props 전달
  const handleGoTo = (stepIndex) => {
    if (stepIndex === 0) {
      navigate('/taro')
    }
  }
  
  return <ResultStep goTo={handleGoTo} />
}

export default TaroResult
