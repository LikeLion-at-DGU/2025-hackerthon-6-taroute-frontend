import { useEffect, useState } from 'react'
import styled from 'styled-components'
import SearchBar from '../../components/common/SearchBar.jsx'
import taru from '../../assets/icons/WikiTaru.svg'
import PageNavbar from '../../components/common/PageNavbar.jsx'
import { WikiSearchResults } from '../../components/wiki/WikiSearchResults.jsx'
import { useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from "react-i18next";

export default function WikiSearch() {
    const { t } = useTranslation();
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
            <PageNavbar title={t("wiki.titletop")} />
            <SearchBar
                placeholder={t("wiki.subtitletop")}
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

            {submitted ? (
                <Results>
                    <WikiSearchResults query={{ keyword }} />
                </Results>
            ) : (
                <Hero>
                    <Mascot src={taru} alt="위키 마스코트" />
                    <Copy>{t("wiki.nowiki")}</Copy>
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
  background: var(--color-neutral-white, #FFF);
`


const Hero = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start; /* 가운데에서 위쪽으로 */
  padding-top: 100px;          /* 상단으로 올리기 */
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
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding-bottom: 16px;
  /* 스크롤은 되지만 스크롤바는 숨김 */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE 10+ */
  &::-webkit-scrollbar { /* Chrome, Safari, Opera */
    display: none;
  }
`


