import { useMemo, useEffect, useState } from 'react'
import styled from 'styled-components'
import SearchBar from '../components/common/SearchBar.jsx'
import PageNavbar from '../components/common/PageNavbar.jsx'
import { FilterBar } from '../components/category/FilterBar.jsx'
import { PlaceList } from '../components/category/PlaceList.jsx'
import { useCategoryFilters } from '../hooks/category/useCategoryFilters.js'
import { useLocation, useSearchParams } from 'react-router-dom'
import { useSelectedLocation } from '../hooks/useSelectedLocation'
// 검색은 카테고리 API(text_query)만 사용

function Category() {
  const { location: selectedLoc } = useSelectedLocation()
  const [submittedKeyword, setSubmittedKeyword] = useState('')
  const {
    keyword,
    setKeyword,
    selectedCategory,
    setSelectedCategory,
    distance,
    setDistance,
    visitTime,
    setVisitTime,
    visitDay,
    setVisitDay,
  } = useCategoryFilters()

  const query = useMemo(() => ({
    // 필수/기본 파라미터 포함
    category: selectedCategory,
    distance: distance || 'all',
    visitTime: visitTime || 'all',
    visitDay,
    sortBy: 'relevance',
    limit: 10,
    x: selectedLoc?.x ?? 126.98364611778,
    y: selectedLoc?.y ?? 37.565315667212,
    // 선택: 검색어
    keyword: (submittedKeyword || '').trim() || undefined,
  }), [selectedCategory, distance, visitTime, visitDay, selectedLoc?.x, selectedLoc?.y, submittedKeyword])
  // 위키 검색 fallback 제거: 카테고리 API(text_query)만 사용

  const location = useLocation()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const fromState = location.state?.initialCategory
    const fromQuery = searchParams.get('cat')
    const initCat = fromState || fromQuery
    const allowed = ['식당', '카페', '문화시설', '관광명소']
    if (initCat && allowed.includes(initCat)) {
      setSelectedCategory(initCat)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 입력 시 자동 검색(디바운스)
  useEffect(() => {
    const t = setTimeout(() => {
      setSubmittedKeyword((keyword || '').trim())
    }, 300)
    return () => clearTimeout(t)
  }, [keyword])

  return (
    <Wrapper>
      <Bleed>
        <PageNavbar title="카테고리" />
      </Bleed>
      <SearchBar
        placeholder="검색어를 입력하세요"
        value={keyword}
        onChange={setKeyword}
        onSubmit={() => setSubmittedKeyword((keyword || '').trim())}
        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); setSubmittedKeyword((keyword || '').trim()) } }}
        bordered
        borderColor="#E2E2E2"
      />


      <FilterBar
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        distance={distance}
        onChangeDistance={setDistance}
        visitTime={visitTime}
        onChangeVisitTime={setVisitTime}
        visitDay={visitDay}
        onChangeVisitDay={setVisitDay}
      />

      <Content>
        <PlaceList query={query} />
      </Content>
    </Wrapper>
  )
}

export default Category

const Wrapper = styled.section`
  width: 100%;
  max-width: 420px;
  margin: 0 auto;
  padding: 0 16px 24px; /* 상단 여백 제거: 네비를 위쪽에 딱 붙이기 */
  min-height: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--color-neutral-white, #FFF);
`

const Content = styled.div`
  margin-top: 12px;
  flex: 1;
  overflow-y: auto;
  padding-bottom: 16px;
  /* 스크롤바 숨기기 (동작은 유지) */
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
  &::-webkit-scrollbar { display: none; } /* Chrome, Safari, Opera */
`

/* 부모 패딩을 무시하고 좌우/상단을 꽉 채우는 래퍼 */
const Bleed = styled.div`
  margin-left: -16px;
  margin-right: -16px;
`


