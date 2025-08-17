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
      <PageNavbar title="카테고리" />
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
  padding: 12px 16px 24px;
`

const Content = styled.div`
  margin-top: 12px;
`


