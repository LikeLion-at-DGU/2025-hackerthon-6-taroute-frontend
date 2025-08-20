import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import SearchBar from '../../components/common/SearchBar.jsx'

export default function WikiIndex() {
  const navigate = useNavigate()
  return (
    <Wrap>
      <SearchBar
        placeholder="검색어를 입력해주세요"
        asButton
        readOnly
        onClick={() => navigate('/wiki/search')}
        bordered
        borderColor="#E2E2E2"
      />
    </Wrap>
  )
}

const Wrap = styled.section`
  width: 100%;
  max-width: 375px;
  margin: 0 auto;
  padding: 0 16px 24px;
  min-height: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`


