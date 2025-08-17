// 임시 API 스텁. 실제 API 연결 시 여기만 교체하면 됩니다.

export async function fetchCategoryPlaces(query) {
  // 네트워크 지연 시뮬레이션
  await new Promise((r) => setTimeout(r, 300))

  // 데모 데이터
  const demo = Array.from({ length: 6 }).map((_, i) => ({
    id: `${i + 1}`,
    name: `${query.category || '식당'} 샘플 ${i + 1}`,
    thumbnail: 'https://picsum.photos/seed/' + (i + 10) + '/200/200',
    meta: `${query.category || '식당'} · ${query.distance || ''}`.trim(),
  }))

  return demo
}


