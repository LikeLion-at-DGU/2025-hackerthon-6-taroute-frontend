import styled from 'styled-components'

const CATS = ['식당', '카페', '문화시설', '관광명소']

export function WikiFilterBar({ selectedCategory, onSelectCategory }) {
  return (
    <Bar>
      <Tabs>
        {CATS.map((c) => (
          <Tab key={c} $active={selectedCategory === c} onClick={() => onSelectCategory(c)}>
            {c}
          </Tab>
        ))}
      </Tabs>
    </Bar>
  )
}

const Bar = styled.div`
  display: flex;
  flex-direction: column;
`

const Tabs = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  height: 40px;
  border-bottom: 1px solid #c8c8c8;
`

const Tab = styled.button`
  background: transparent;
  border: none;
  font-weight: 600;
  color: ${p => (p.$active ? '#ffc400' : '#2A2A2A')};
  border-bottom: 2px solid ${p => (p.$active ? '#ffc400' : 'transparent')};
  padding: 8px 0;
  cursor: pointer;
`


