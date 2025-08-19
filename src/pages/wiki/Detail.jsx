import { useParams, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import PageNavbar from '../../components/common/PageNavbar.jsx'

export default function WikiDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  // TODO: fetch detail by id
  const place = {
    id,
    name: '고냉지',
    address: '서울시 중구 퇴계로',
    images: [
      'https://picsum.photos/seed/d1/600/400',
      'https://picsum.photos/seed/d2/600/400',
      'https://picsum.photos/seed/d3/600/400',
    ],
    stars: 3.5,
    hours: '매일 11:00 - 22:30',
    phone: '0507-1335-9573',
    summary: '여기는 지역위키에 전한 글을 요약한 부문이 들어가게 됩니다.',
    reviews: [
      { id: 1, user: '익명', text: '가치 있어요.. 굿', likes: 18 },
    ],
  }

  return (
    <Wrap>
      <PageNavbar title="지역위키" />
      <Header>
        <Title>{place.name}</Title>
        <Addr>{place.address}</Addr>
        <Gallery>
          {place.images.map((src, i) => (
            <Img key={i} src={src} alt={`${place.name}-${i + 1}`} />
          ))}
        </Gallery>
        <Actions>
          <WriteBtn onClick={() => navigate(`/wiki/place/${id}/review/new`)}>게시판 작성</WriteBtn>
          <LikeBtn>♡</LikeBtn>
        </Actions>
      </Header>

      <Section>
        <SecTitle>위키 별점</SecTitle>
        <Stars>★★★☆☆</Stars>
      </Section>

      <Section>
        <SecTitle>AI 요약</SecTitle>
        <Summary>{place.summary}</Summary>
      </Section>

      <Section>
        <SecTitle>기본 정보</SecTitle>
        <Info>
          <div>위치: {place.address}</div>
          <div>영업 시간: {place.hours}</div>
          <div>전화번호: {place.phone}</div>
        </Info>
      </Section>

      <Section>
        <SecTitle>게시판</SecTitle>
        <Review>
          <p>{place.reviews[0].text}</p>
          <div className="reactions">
            <button>♡</button>
            <span>{place.reviews[0].likes}</span>
          </div>
        </Review>
      </Section>
    </Wrap>
  )
}

const Wrap = styled.section`
  width: 100%; max-width: 420px; margin: 0 auto; padding: 0 16px 24px;
  display: flex; flex-direction: column;
`
const Header = styled.div`display:flex; flex-direction:column; gap:8px; margin-top:8px;`
const Title = styled.h1`margin:0; font-size:24px;`
const Addr = styled.div`color:#7a7a7a; font-size:13px;`
const Gallery = styled.div`display:flex; gap:8px; overflow-x:auto;`
const Img = styled.img`width: 140px; height: 100px; object-fit: cover; border-radius: 8px;`
const Actions = styled.div`display:flex; gap:8px; align-items:center; margin: 8px 0;`
const WriteBtn = styled.button`flex:1; height:36px; border-radius:18px; border:none; background:#eee;`
const LikeBtn = styled.button`width:36px; height:36px; border-radius:12px; border:none; background:#fff; box-shadow:0 4px 12px rgba(0,0,0,0.1);`
const Section = styled.section`margin-top:16px;`
const SecTitle = styled.h3`margin:0 0 8px; font-size:16px;`
const Stars = styled.div``
const Summary = styled.p``
const Info = styled.div`display:flex; flex-direction:column; gap:4px;`
const Review = styled.div`padding:12px 0; border-top:1px solid rgba(0,0,0,0.06);`


