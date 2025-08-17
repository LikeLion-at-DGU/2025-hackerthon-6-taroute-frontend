import { useMemo } from 'react'
import styled from 'styled-components'
import SearchBar from '../components/common/SearchBar.jsx'
import PageNavbar from '../components/common/PageNavbar.jsx'
import { FilterBar } from '../components/category/FilterBar.jsx'
import { PlaceList } from '../components/category/PlaceList.jsx'
import { useCategoryFilters } from '../hooks/category/useCategoryFilters.js'

function Category() {
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
    keyword,
    category: selectedCategory,
    distance,
    visitTime,
    visitDay,
  }), [keyword, selectedCategory, distance, visitTime, visitDay])

  return (
    <Wrapper>
      <Bleed>
        <PageNavbar title="카테고리" />
      </Bleed>
      <SearchBar
        placeholder="검색어를 입력하세요"
        value={keyword}
        onChange={setKeyword}
        onSubmit={() => {}}
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
  background: var(--bg-3, linear-gradient(90deg, #EBF3FF 0%, #F5F8FF 100%));
`

const Content = styled.div`
  margin-top: 12px;
`

/* 부모 패딩을 무시하고 좌우/상단을 꽉 채우는 래퍼 */
const Bleed = styled.div`
  margin-left: -16px;
  margin-right: -16px;
`


