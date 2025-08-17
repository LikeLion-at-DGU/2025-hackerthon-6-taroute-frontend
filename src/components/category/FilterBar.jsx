import styled from 'styled-components'

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
  return (
    <Bar>
      <Chips>
        {['식당', '카페', '문화시설', '관광명소'].map((c) => (
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
          {['1km 이내', '2km 이내', '3km 이내', '5km 이내', '5km 이상'].map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </Select>

        <Select value={visitTime} onChange={(e) => onChangeVisitTime(e.target.value)}>
          {['아침', '낮', '저녁', '밤', '새벽'].map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </Select>

        <Select value={visitDay} onChange={(e) => onChangeVisitDay(e.target.value)}>
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
  gap: 6px;
  overflow-x: auto;
`

const Chip = styled.button`
  padding: 8px 12px;
  border-radius: 999px;
  border: 1px solid ${p => p.$active ? '#271932' : '#e2e2e2'};
  color: ${p => p.$active ? '#271932' : '#555'};
  background: ${p => p.$active ? '#EBD8B6' : '#fff'};
  cursor: pointer;
`

const Selectors = styled.div`
  display: flex;
  gap: 8px;
`

const Select = styled.select`
  height: 36px;
  padding: 0 8px;
  border: 1px solid #e2e2e2;
  border-radius: 8px;
  background: #fff;
`


