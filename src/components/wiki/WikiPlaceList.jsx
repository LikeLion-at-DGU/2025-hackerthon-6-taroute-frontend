import styled from 'styled-components'

export function WikiPlaceList({ query }) {
  // TODO: 실제 API 연동 시 query 사용
  const demo = Array.from({ length: 8 }).map((_, i) => ({
    id: i + 1,
    name: `${query.category} 위키 샘플 ${i + 1}`,
    thumb: `https://picsum.photos/seed/wiki-${i}/200/200`,
  }))

  return (
    <Grid>
      {demo.map((p) => (
        <Card key={p.id}>
          <Thumb src={p.thumb} alt={p.name} />
          <Name>{p.name}</Name>
        </Card>
      ))}
    </Grid>
  )
}

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 2 → 3열로 축소 */
  gap: 8px; /* 간격도 축소 */
`

const Card = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  background: #fff;
  border-radius: 10px;
  padding: 6px;
  
`

const Thumb = styled.img`
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 8px;
  object-fit: cover;
`

const Name = styled.div`
  font-size: 11px;
  font-weight: 600;
  color: #2A2A2A;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`


