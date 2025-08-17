import styled from 'styled-components'
import { useMemo } from 'react'
import { useSwipeable } from 'react-swipeable'

const CATEGORIES = ['식당', '카페', '문화시설', '관광명소']

export function FilterBar({
  selectedCategory,
  onSelectCategory,
  distance,
  onChangeDistance,
  visitTime,
  onChangeVisitTime,
  visitDay,
  onChangeVisitDay,
}) {
  const currentIndex = useMemo(() => {
    const i = CATEGORIES.indexOf(selectedCategory)
    return i === -1 ? 0 : i
  }, [selectedCategory])

  const swipe = useSwipeable({
    onSwipedLeft: (e) => {
      e.event.stopPropagation()
      onSelectCategory(CATEGORIES[(currentIndex + 1) % CATEGORIES.length])
    },
    onSwipedRight: (e) => {
      e.event.stopPropagation()
      onSelectCategory(CATEGORIES[(currentIndex - 1 + CATEGORIES.length) % CATEGORIES.length])
    },
    onSwiping: (e) => {
      // 수평 제스처만 처리
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) e.event.preventDefault()
    },
    delta: 20,
    preventScrollOnSwipe: true,
    trackTouch: true,
    trackMouse: true,
  })

  return (
    <Bar>
      <Chips {...swipe}>
        {CATEGORIES.map((c) => (
          <Chip
            key={c}
            $active={selectedCategory === c}
            onClick={() => onSelectCategory(c)}
          >
            {c}
          </Chip>
        ))}
      </Chips>

      <Selectors>
        <Select value={distance} onChange={(e) => onChangeDistance(e.target.value)}>
          <option value="" disabled>거리</option>
          {['1km 이내', '2km 이내', '3km 이내', '5km 이내', '5km 이상'].map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </Select>

        <Select value={visitTime} onChange={(e) => onChangeVisitTime(e.target.value)}>
          <option value="" disabled>방문시간</option>
          {['아침', '낮', '저녁', '밤', '새벽'].map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </Select>

        <Select value={visitDay} onChange={(e) => onChangeVisitDay(e.target.value)}>
          <option value="" disabled>방문요일</option>
          {['월요일', '화요일', '수요일', '목요일', '금요일', '토요일', '일요일'].map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </Select>
      </Selectors>
    </Bar>
  )
}

const Bar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const Chips = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 40px;
  border-bottom: 1px solid #c8c8c8;
  padding: 0 16px;
  gap: 18px;
  touch-action: pan-y;       /* 수직 스크롤만 허용 → 가로 스와이프 인식 */
  overscroll-behavior-x: contain;
  user-select: none;
`

const Chip = styled.button`
  background: transparent;
  border: none;
  border-bottom: 2px solid ${p => (p.$active ? '#ffc400' : 'transparent')};
  color: ${p => (p.$active ? '#ffc400' : '#2A2A2A')};
  font-weight: 600;
  font-size: 14px;
  padding: 8px 0;
  cursor: pointer;
`

const Selectors = styled.div`
  display: flex;
  gap: 6px;
  justify-content: flex-start;
  align-items: center;
`

const Select = styled.select`
  height: 32px;
  padding: 0 10px;
  padding-right: 26px; /* 화살표 공간 */
  border: 1.5px solid #bcbcbc;
  border-radius: 999px; /* pill 형태 */
  background: rgba(255,255,255,0.7);
  color: #555;
  font-size: 13px;
  appearance: none; /* 기본 화살표 제거 */
  position: relative;

  /* 커스텀 화살표 */
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="10" height="6" viewBox="0 0 10 6"><path fill="%23888" d="M1 1l4 4 4-4"/></svg>');
  background-repeat: no-repeat;
  background-position: right 10px center;
`


