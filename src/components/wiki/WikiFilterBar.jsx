import styled from 'styled-components'
import { useState } from 'react'
import BottomSheetSelect from '../common/BottomSheetSelect.jsx'
import { useTranslation } from "react-i18next";

const CATS = ['item1', 'item2', 'item3', 'item4']
const { t } = useTranslation();

export function WikiFilterBar({ selectedCategory, onSelectCategory }) {
  const [open, setOpen] = useState(false)

  return (
    <Bar>
      <Tabs>
        {CATS.map((c) => {
          const label = t(`category.${c}`);
          <Tab key={c} $active={selectedCategory === c} onClick={() => onSelectCategory(c)}>
            {c}
          {label}
          </Tab>
        })}
        <PillButton onClick={() => setOpen(true)}>
          {selectedCategory || '카테고리'}
        </PillButton>
      </Tabs>

      <BottomSheetSelect
        visible={open}
        title="카테고리"
        options={CATS.map((c) => ({ label: c, value: c }))}
        value={selectedCategory}
        onSelect={(v) => { onSelectCategory(v); setOpen(false) }}
        onClose={() => setOpen(false)}
      />
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

const PillButton = styled.button`
  height: 28px;
  padding: 0 12px;
  border: 1.5px solid #bcbcbc;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.8);
  color: #555;
  font-size: 12px;
  cursor: pointer;
`


