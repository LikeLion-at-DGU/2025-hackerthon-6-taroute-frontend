import styled from 'styled-components'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BottomSheetSelect from '../common/BottomSheetSelect.jsx'
import timeIcon from '../../assets/icons/time.svg'
import { searchWikiPlaces } from '../../apis/wikiApi.js'
import { useSelectedLocation } from '../../hooks/useSelectedLocation.js'

const SORT_OPTIONS = ['정확도순', '거리순', '후기순', '인기순']

export function WikiSearchResults({ query }) {
  const navigate = useNavigate()
  const { location } = useSelectedLocation()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [sortOpen, setSortOpen] = useState(false)
  const [sortKey, setSortKey] = useState(SORT_OPTIONS[0])

  const rankPreference = useMemo(() => {
    if (sortKey === '정확도순') return 'RELEVANCE'
    if (sortKey === '거리순') return 'DISTANCE'
    return undefined
  }, [sortKey])

  useEffect(() => {
    let aborted = false
    const fetch = async () => {
      if (!query?.keyword) {
        setItems([])
        return
      }
      setLoading(true)
      setError(null)
      try {
        const results = await searchWikiPlaces({
          latitude: location?.y,
          longitude: location?.x,
          place_name: query.keyword,
          radius: 20000,
          rankPreference,
        })
        if (aborted) return
        let arr = Array.isArray(results) ? results : []
        // Client-side sort for 후기순/인기순 when no rankPreference
        if (!rankPreference) {
          if (sortKey === '후기순') arr = [...arr].sort((a, b) => (b.review_count || 0) - (a.review_count || 0))
          if (sortKey === '인기순') arr = [...arr].sort((a, b) => (b.click_num || 0) - (a.click_num || 0))
        }
        setItems(arr)
      } catch (e) {
        if (!aborted) setError(e)
      } finally {
        if (!aborted) setLoading(false)
      }
    }
    fetch()
    return () => { aborted = true }
  }, [query?.keyword, location?.x, location?.y, rankPreference, sortKey])

  return (
    <Wrap>
      <Header>
        <h3>검색결과</h3>
        <SortWrap>
          <SortButton onClick={() => setSortOpen(true)}>{sortKey} ▾</SortButton>
        </SortWrap>
      </Header>
      <BottomSheetSelect
        visible={sortOpen}
        title="정렬 기준"
        options={SORT_OPTIONS.map(o => ({ label: o, value: o }))}
        value={sortKey}
        onSelect={(v) => { setSortKey(v); setSortOpen(false) }}
        onClose={() => setSortOpen(false)}
      />
      {loading && <Empty>불러오는 중…</Empty>}
      {error && <Empty>문제가 발생했어요. 잠시 후 다시 시도해주세요.</Empty>}
      {!loading && !error && (
        <List>
          {items.map((p) => (
            <Row key={p.place_id} onClick={() => {
              const rawId = p.place_id
              navigate(`/wiki/place/${encodeURIComponent(rawId)}`)
            }} role="button" tabIndex={0}>
              <Left>
                <Title>{p.place_name}</Title>
                <Address>{p.address}</Address>
                <Meta>
                  <img src={timeIcon} alt="time" />
                  <span>{Array.isArray(p.running_time) && p.running_time.length > 0 ? p.running_time[0] : '영업시간 정보 미제공'}</span>
                  <Caret>▾</Caret>
                </Meta>
              </Left>
              <Thumb src={`https://picsum.photos/seed/${encodeURIComponent(p.place_id)}/240/160`} alt={p.place_name} />
            </Row>
          ))}
          {items.length === 0 && (
            <Empty>검색 결과가 없습니다.</Empty>
          )}
        </List>
      )}
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

const Empty = styled.div`
  padding: 24px 0;
  color: #7a7a7a;
  text-align: center;
  font-size: 14px;
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


