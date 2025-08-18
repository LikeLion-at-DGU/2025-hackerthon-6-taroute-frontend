import { useState } from 'react'
import styled from 'styled-components'
import SearchBar from '../components/common/SearchBar.jsx'
import taru from '../assets/icons/WikiTaru.svg'

import PageNavbar from '../components/common/PageNavbar.jsx'

export default function WikiSearch() {
    const [keyword, setKeyword] = useState('')
    return (
        <Wrapper>
            <PageNavbar title="지역위키" />
            <SearchBar
                placeholder="검색어를 입력해주세요"
                value={keyword}
                onChange={setKeyword}
                bordered
                borderColor="#E2E2E2"
                autoFocus
            />

            <Hero>
                <Mascot src={taru} alt="위키 마스코트" />
                <Copy>궁금한 장소를 입력해주세요</Copy>
            </Hero>
            {/* TODO: 검색 결과 리스트 */}
        </Wrapper>
    )
}

const Wrapper = styled.section`
  width: 100%;
  max-width: 420px;
  margin: 0 auto;
  min-height: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--bg-3, linear-gradient(90deg, #EBF3FF 0%, #F5F8FF 100%));
`

const Hero = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start; /* 가운데에서 위쪽으로 */
  padding-top: 24px;          /* 상단으로 올리기 */
`

const Mascot = styled.img`
  width: 180x;
  height: 180px;
  object-fit: contain;
  filter: drop-shadow(0 10px 24px rgba(0,0,0,0.15));
  margin-bottom: 34px;
`

const Copy = styled.div`
  color: #2A2A2A;
  font-size: 18px;
  font-weight: 700;
  letter-spacing: -0.5px;
  color: var(--color-neutral-black, #2A2A2A);
font-family: Paperlogy;
font-size: 24px;
font-style: normal;
font-weight: 600;
line-height: 17px; /* 70.833% */
letter-spacing: -0.5px;
`


