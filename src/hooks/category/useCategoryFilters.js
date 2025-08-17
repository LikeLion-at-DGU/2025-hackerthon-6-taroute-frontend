import { useState } from 'react'

export function useCategoryFilters() {
  const [keyword, setKeyword] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('식당')
  const [distance, setDistance] = useState('1km 이내')
  const [visitTime, setVisitTime] = useState('아침')
  const [visitDay, setVisitDay] = useState('요일무관')

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


