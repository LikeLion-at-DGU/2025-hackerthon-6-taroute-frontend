import styled from 'styled-components'
import { createPortal } from 'react-dom'
import checkIcon from '../../assets/icons/check.svg'

export default function BottomSheetSelect({
  visible = false,
  title = '',
  options = [], // [{ label, value }]
  value,
  onSelect,
  onClose,
}) {
  if (!visible) return null
  return createPortal(
    (
      <Overlay role="dialog" aria-modal="true" onClick={onClose}>
        <Sheet onClick={(e) => e.stopPropagation()}>
          <Header>
            <HeaderTitle>{title}</HeaderTitle>
          </Header>
          <Divider />
          <List role="listbox" aria-label={title}>
            {options.map((opt) => {
              const active = opt.value === value
              return (
                <Item
                  key={String(opt.value)}
                  role="option"
                  aria-selected={active}
                  onClick={() => onSelect && onSelect(opt.value)}
                  $active={active}
                >
                  <Label $active={active}>{opt.label}</Label>
                  {active && <Check src={checkIcon} alt="selected" />}
                </Item>
              )
            })}
          </List>
        </Sheet>
      </Overlay>
    ),
    document.body
  )
}

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.45);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 2000;
`;

const Sheet = styled.div`
  width: 100%;
  max-width: 420px;
  background: #fff;
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  padding: 0; /* 상/하 여백 제거 */
  box-shadow: 0 -10px 28px rgba(0,0,0,0.25);
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 0; /* 상하 최소 여백만 유지 */
`;

const HeaderTitle = styled.h3`
  margin: 0;
  font-family: 'Paperlogy', system-ui, -apple-system, sans-serif;
  font-size: 20px;
  font-weight: 800;
`;

const Divider = styled.div`
  height: 1px;
  background: #eee;
  margin: 0; /* 구분선 위/아래 여백 제거 */
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-height: 60vh;
  overflow-y: auto;
  padding: 0 18px 0; /* 좌우 패딩만, 상/하 제거 */
  padding-top: 19px;
  padding-bottom: 34px;
`;

const Item = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  border: none;
  background: #fff;
  border-radius: 12px;
  padding: 8px 12px;
  cursor: pointer;
  text-align: left;

  &:active { background: #f7f7f7; }
`;

const Label = styled.span`
  color: var(--color-neutral-black, #2A2A2A);
  font-family: 'Paperlogy', system-ui, -apple-system, sans-serif;
  font-size: 16px;
  font-style: normal;
  line-height: 17px; /* 106.25% */
  letter-spacing: -0.5px;
  font-weight: ${p => (p.$active ? 700 : 400)};
`;

const Check = styled.img`
  width: 22px;
  height: 22px;
`;


