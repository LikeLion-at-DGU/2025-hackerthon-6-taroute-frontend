import { useMemo, useEffect, useState } from 'react'
import styled from 'styled-components'
import SearchBar from '../components/common/SearchBar.jsx'
import PageNavbar from '../components/common/PageNavbar.jsx'
import { FilterBar } from '../components/category/FilterBar.jsx'
import { PlaceList } from '../components/category/PlaceList.jsx'
import { useCategoryFilters } from '../hooks/category/useCategoryFilters.js'
import { useLocation, useSearchParams } from 'react-router-dom'
import { useSelectedLocation } from '../hooks/useSelectedLocation'
import { searchWikiPlaces, getWikiDetail } from '../apis/wikiApi'
import { useTranslation } from "react-i18next";
import { useRecoilValue } from 'recoil';
import { languageState } from '../contexts/recoil/languageState.jsx';

// 검색은 카테고리 API(text_query)만 사용

function Category() {
  const { t, i18n } = useTranslation();
  const currentLanguage = useRecoilValue(languageState);
  const { location: selectedLoc } = useSelectedLocation()
  const [submittedKeyword, setSubmittedKeyword] = useState('')
  const [wikiItems, setWikiItems] = useState(null)
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

  // 언어가 변경될 때 i18n 언어도 업데이트
  useEffect(() => {
    if (i18n.language !== currentLanguage) {
      i18n.changeLanguage(currentLanguage);
    }
  }, [currentLanguage, i18n]);

  const location = useLocation()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const fromState = location.state?.initialCategory
    const fromQuery = searchParams.get('cat')
    const initCat = fromState || fromQuery
    const allowed = ['restaurant', 'cafe', 'culture', 'tourist']
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

  // 검색어가 있을 땐 wiki 검색 API 사용 (카테고리 리스트와 별도 기능)
  useEffect(() => {
    let cancelled = false
    const kw = (submittedKeyword || '').trim()
    if (!kw) { setWikiItems(null); return }
    ;(async () => {
      try {
        const distLabel = distance || 'all'
        const toRadius = (label) => {
          if (!label) return 20000
          if (label.includes('1km')) return 1000
          if (label.includes('3km')) return 3000
          if (label.includes('5km')) return 5000
          return 20000
        }
        const radius = toRadius(distLabel)
        const rankPreference = distLabel === 'all' ? 'RELEVANCE' : 'DISTANCE'
        const res = await searchWikiPlaces({
          latitude: selectedLoc?.y ?? 37.565315667212,
          longitude: selectedLoc?.x ?? 126.98364611778,
          place_name: kw,
          radius,
          rankPreference,
        })
        if (cancelled) return
        let mapped = res.map(p => ({
          id: p.place_id,
          name: p.place_name,
          images: [],
          distance: p.distance_text,
          address: p.address,
          time: Array.isArray(p.running_time) && p.running_time.length ? p.running_time[0] : '',
        }))
        // 사진 보강
        const details = await Promise.allSettled(
          mapped.slice(0, 10).map(item => getWikiDetail({ place_id: item.id }))
        )
        mapped = mapped.map((item, idx) => {
          const d = details[idx]
          if (d?.status === 'fulfilled') {
            const photos = d.value?.search_detail?.place_photos
            if (Array.isArray(photos) && photos.length) return { ...item, images: photos.slice(0, 5) }
          }
          return item
        })
        setWikiItems(mapped)
      } catch {
        setWikiItems(null)
      }
    })()
    return () => { cancelled = true }
  }, [submittedKeyword, distance, selectedLoc?.x, selectedLoc?.y])

  const query = useMemo(() => {
    const queryObj = {
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
    }
    
    // 디버깅용 로그
    console.log('Category query:', queryObj)
    
    return queryObj
  }, [selectedCategory, distance, visitTime, visitDay, selectedLoc?.x, selectedLoc?.y, submittedKeyword])

  return (
    <Wrapper>
      <Bleed>
        <PageNavbar title={t("category.title")} />
      </Bleed>
      <SearchBar
        placeholder={t("category.subtitle")}
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
        <PlaceList query={query} itemsOverride={wikiItems ?? undefined} />
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


