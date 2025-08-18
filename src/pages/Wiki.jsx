import { useMemo, useState } from 'react'
import styled from 'styled-components'
import SearchBar from '../components/common/SearchBar.jsx'
import { useNavigate } from 'react-router-dom'

export default function WikiPage() {
  const [keyword, setKeyword] = useState('')
  const [category, setCategory] = useState('식당')
  const navigate = useNavigate()

  const query = useMemo(() => ({ keyword, category }), [keyword, category])

  return (
    <Wrapper>

      <SearchBar
        placeholder="검색어를 입력해주세요"
        asButton
        readOnly
        onClick={() => navigate('/wiki/search')}
        bordered
        borderColor="#E2E2E2"
      />

    
    </Wrapper>
  )
}

const Wrapper = styled.section`
  width: 100%;
  max-width: 420px;
  margin: 0 auto;
  padding: 0 16px 24px;
  min-height: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`

const Content = styled.div`
  margin-top: 12px;
  flex: 1;
  overflow-y: auto;
  padding-bottom: 16px;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
  &::-webkit-scrollbar { display: none; }
`

const Bleed = styled.div`
  margin-left: -16px;
  margin-right: -16px;
`

const Spacer = styled.div`
  height: 16px;
`

// default export는 위에서 수행됨