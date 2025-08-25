import { useState } from 'react'

export function useCategoryFilters() {
  const [keyword, setKeyword] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('restaurant')
  const [distance, setDistance] = useState('') // placeholder: 거리
  const [visitTime, setVisitTime] = useState('') // placeholder: 방문시간
  const [visitDay, setVisitDay] = useState('') // placeholder: 방문요일

  return {
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
  }
}

export default useCategoryFilters


