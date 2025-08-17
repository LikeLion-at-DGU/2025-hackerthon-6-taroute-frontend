import styled from 'styled-components'
import { useEffect, useState } from 'react'
import { fetchCategoryPlaces } from '../../apis/categoryApi.js'

export function PlaceList({ query }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetchCategoryPlaces(query)
      .then((res) => {
        if (!cancelled) setItems(res)
      })
      .finally(() => !cancelled && setLoading(false))
    return () => { cancelled = true }
  }, [JSON.stringify(query)])

  if (loading) return <Empty>불러오는 중...</Empty>
  if (!items.length) return <Empty>결과가 없어요</Empty>

  return (
    <List>
      {items.map((p) => (
        <Card key={p.id}>
          <Thumb src={p.thumbnail} alt={p.name} />
          <Info>
            <Name>{p.name}</Name>
            <Meta>{p.meta}</Meta>
          </Info>
        </Card>
      ))}
    </List>
  )
}

const List = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
`

const Card = styled.div`
  display: flex;
  gap: 12px;
  padding: 10px;
  border: 1px solid #eee;
  border-radius: 8px;
  background: #fff;
`

const Thumb = styled.img`
  width: 88px;
  height: 88px;
  object-fit: cover;
  border-radius: 8px;
`

const Info = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`

const Name = styled.div`
  font-weight: 700;
  margin-bottom: 4px;
`

const Meta = styled.div`
  color: #666;
  font-size: 12px;
`

const Empty = styled.div`
  padding: 40px 0;
  text-align: center;
  color: #888;
`


