import styled from 'styled-components'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import timeIcon from '../../assets/icons/time.svg'

const SORT_OPTIONS = ['정확도순', '거리순', '후기순', '인기순']

export function WikiSearchResults({ query }) {
  const navigate = useNavigate()
  // TODO: Replace with real API. Demo list for now
  const items = Array.from({ length: 8 }).map((_, i) => ({
    id: i + 1,
    name: '진식당',
    address: '서울 중구 필동로 7-11층',
    time: '목요일 11:00 - 22:00',
    thumb: `https://picsum.photos/seed/wikir-${i}/240/160`,
  }))
  const [sortOpen, setSortOpen] = useState(false)
  const [sortKey, setSortKey] = useState(SORT_OPTIONS[0])

  return (
    <Wrap>
      <Header>
        <h3>검색결과</h3>
        <SortWrap>
          <SortButton onClick={() => setSortOpen(v => !v)}>{sortKey} ▾</SortButton>
          {sortOpen && (
            <SortMenu>
              {SORT_OPTIONS.map(opt => (
                <li key={opt}>
                  <button onClick={() => { setSortKey(opt); setSortOpen(false) }}>
                    {opt}
                  </button>
                </li>
              ))}
            </SortMenu>
          )}
        </SortWrap>
      </Header>
      <List>
        {items.map((p) => (
          <Row key={p.id} onClick={() => navigate(`/wiki/place/${p.id}`)} role="button" tabIndex={0}>
            <Left>
              <Title>{p.name}</Title>
              <Address>{p.address}</Address>
              <Meta>
                <img src={timeIcon} alt="time" />
                <span>{p.time}</span>
                <Caret>▾</Caret>
              </Meta>
            </Left>
            <Thumb src={p.thumb} alt={p.name} />
          </Row>
        ))}
      </List>
    </Wrap>
  )
}

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 16px; /* 좌우 여백 추가 */
`

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 800;
    letter-spacing: -0.5px;
    color: #2A2A2A;
  }
`

const SortWrap = styled.div`
  position: relative;
`

const SortButton = styled.button`
  background: transparent;
  border: none;
  font-size: 14px;
  color: #2A2A2A;
  cursor: pointer;
`

const SortMenu = styled.ul`
  position: absolute;
  right: 0;
  top: 24px;
  margin: 6px 0 0;
  padding: 6px 0;
  list-style: none;
  background: #fff;
  border: 1px solid rgba(0,0,0,0.1);
  border-radius: 8px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.12);
  min-width: 110px;
  z-index: 10;
  li { padding: 0; }
  button {
    width: 100%;
    padding: 8px 12px;
    background: transparent;
    border: none;
    text-align: left;
    cursor: pointer;
  }
  button:hover { background: #f5f5f5; }
`

const List = styled.div`
  display: flex;
  flex-direction: column;
`

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 96px; /* 썸네일 작게 */
  align-items: center;
  gap: 12px;
  padding: 10px 0; /* 위아래 여백 */
  border-bottom: 1px solid rgba(0,0,0,0.06);
  cursor: pointer;
  &:active { opacity: .7; }
`

const Left = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`

const Title = styled.div`
  color: var(--color-neutral-black, #2A2A2A);
  font-family: Paperlogy;
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  letter-spacing: -0.5px;
`

const Address = styled.div`
  color: #7a7a7a;
  font-size: 13px;
`

const Meta = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;

  color: #000;
font-family: Paperlogy;
font-size: 13px;
font-style: normal;
font-weight: 400;
line-height: normal;
letter-spacing: -0.5px;
  img { width: 14px; height: 14px; }
`

const Caret = styled.span`
  margin-left: 6px;
`

const Thumb = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 12px;
  justify-self: end; 
`


