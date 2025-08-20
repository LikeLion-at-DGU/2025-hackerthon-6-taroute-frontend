import { useEffect, useState } from 'react'
import styled from 'styled-components'
import SearchBar from '../../components/common/SearchBar.jsx'
import taru from '../../assets/icons/WikiTaru.svg'
import PageNavbar from '../../components/common/PageNavbar.jsx'
import { WikiSearchResults } from '../../components/wiki/WikiSearchResults.jsx'
import { useLocation, useNavigate } from 'react-router-dom'

export default function WikiSearch() {
    const location = useLocation()
    const navigate = useNavigate()
    const [keyword, setKeyword] = useState('')
    const [submitted, setSubmitted] = useState(false)

    // URL 쿼리에서 검색어 복원 (뒤로가기 시 유지)
    useEffect(() => {
        const params = new URLSearchParams(location.search)
        const q = params.get('q') || ''
        setKeyword(q)
        setSubmitted(q.trim().length > 0)
    }, [location.search])

    return (
        <Wrapper>
            <PageNavbar title="지역위키" />
            <SearchTop>
            <SearchBar
                placeholder="검색어를 입력해주세요"
                value={keyword}
                onChange={(v) => {
                    setKeyword(v)
                    if (v.trim() === '') {
                        setSubmitted(false)
                        const p = new URLSearchParams(location.search)
                        p.delete('q')
                        navigate({ pathname: '/wiki/search', search: p.toString() }, { replace: true })
                    }
                }}
                bordered
                borderColor="#E2E2E2"
                autoFocus
                onSubmit={() => {
                    if (keyword.trim().length > 0) {
                        const p = new URLSearchParams(location.search)
                        p.set('q', keyword.trim())
                        navigate({ pathname: '/wiki/search', search: p.toString() })
                        setSubmitted(true)
                    }
                }}
            />
            </SearchTop>

            {submitted ? (
                <Results>
                    <WikiSearchResults query={{ keyword }} />
                </Results>
            ) : (
                <Hero>
                    <Mascot src={taru} alt="위키 마스코트" />
                    <Copy>궁금한 장소를 입력해주세요</Copy>
                </Hero>
            )}
        </Wrapper>
    )
}

const Wrapper = styled.section`
  width: 100%;
  max-width: 375px;
  margin: 0 auto;
  min-height: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--bg-3, linear-gradient(90deg, #EBF3FF 0%, #F5F8FF 100%));
`

const SearchTop = styled.div`
  margin-top: 24px;
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
  width: 180px;
  height: 180px;
  object-fit: contain;
  filter: drop-shadow(0 10px 24px rgba(0,0,0,0.15));
  margin-bottom: 34px;
`

const Copy = styled.div`
  color: var(--color-neutral-black, #2A2A2A);
  font-family: Paperlogy;
  font-size: 24px;
  font-style: normal;
  font-weight: 600;
  line-height: 17px; /* 70.833% */
  letter-spacing: -0.5px;
`

const Results = styled.div`
  margin-top: 4px; /* 검색바 바로 아래 붙도록 간격 축소 */
`


