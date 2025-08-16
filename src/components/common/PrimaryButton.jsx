import styled from 'styled-components'

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 54px;
  padding: 0 16px;
  border: none;
  border-radius: 12px;
  background: #271932;
  color: #FFFFFF;
  font-family: MaruBuriOTF;
  font-size: 18px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.35);
  cursor: pointer;
  z-index: ${props => props.zIndex || 1000};
  position: ${props => (props.fixedBottom ? 'fixed' : 'relative')};
  bottom: ${props => (props.fixedBottom ? 'calc(24px + env(safe-area-inset-bottom))' : 'auto')};
  /* 고정 버튼은 뷰포트 가운데에, 최대 420px, 좌우 마진 16px 유지 */
  width: ${props => props.fixedBottom ? 'min(100% - 32px, 420px)' : (props.fullWidth ? '100%' : 'auto')};
  left: ${props => (props.fixedBottom ? '50%' : 'auto')};
  transform: ${props => (props.fixedBottom ? 'translateX(-50%)' : 'none')};
`

function PrimaryButton({ children, onClick, fullWidth = true, fixedBottom = false, zIndex }) {
    return (
        <Button onClick={onClick} fullWidth={fullWidth} fixedBottom={fixedBottom} zIndex={zIndex}>
            {children}
        </Button>
    )
}

export default PrimaryButton


