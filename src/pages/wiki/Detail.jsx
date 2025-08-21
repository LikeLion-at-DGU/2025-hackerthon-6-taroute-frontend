import { useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { useParams, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import PageNavbar from '../../components/common/PageNavbar.jsx'
import useSheetDrag from '../../hooks/common/useSheetDrag.js'
import SearchBar from '../../components/common/SearchBar.jsx'
import { useSavedPlaceContext } from '../../contexts/SavedPlaceContext.jsx'
import warningIcon from '../../assets/icons/warning.svg'
import BottomSheetSelect from '../../components/common/BottomSheetSelect.jsx'

export default function WikiDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { savedPlaces, addPlace, removePlace } = useSavedPlaceContext()
  // TODO: fetch detail by id
  const place = {
    id,
    name: '고냉지',
    address: '서울시 중구 퇴계로',
    images: [
      'https://picsum.photos/seed/d1/600/400',
      'https://picsum.photos/seed/d2/600/400',
      'https://picsum.photos/seed/d3/600/400',
      'https://picsum.photos/seed/d4/600/400',

    ],
    stars: 3.5,
    hours: '매일 11:00 - 22:30',
    phone: '0507-1335-9573',
    summary: '여기는 지역위키에 전한 글을 요약한 부문이 들어가게 됩니다.',
    reviews: [
      { id: 1, user: '익명', text: '가치 있어요.. 굿', likes: 18 },
    ],
  }

  // 뷰포트 기준으로 접힌 상태 높이를 작게(≈220px) 유지
  const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 812
  const expandedTop = 80
  const collapsedTop = Math.max(expandedTop, Math.round(viewportHeight * 0.55))

  const { y, dragging, onPointerDown, onPointerMove, onPointerUp } = useSheetDrag({
    expandedTop,
    collapsedTop,
    start: 'collapsed',
  })

  const isLiked = useMemo(() => savedPlaces.some(p => (
    p.id ? p.id === place.id : (p.name||p.place_name) === place.name && (p.address||p.address_name||p.location) === place.address
  )), [savedPlaces, place])

  // 게시판 데모 데이터 및 정렬/좋아요 로직
  // 게시판 데모 데이터 및 정렬/좋아요 로직
  const [sortKey, setSortKey] = useState('추천순') // 추천순 | 최신순
  const [sortOpen, setSortOpen] = useState(false)
  const [reviews, setReviews] = useState([
    { id: 1, user: '익명', text: '여기 맛 없어요… 가지 마세요.. 진짜 왜 감', likes: 18, createdAt: '2025-08-01T10:00:00Z' },
    { id: 2, user: '익명', text: '분위기도 좋고, 서비스도 좋고, 맛도 있고,, 저녁 먹기 너무 좋아요', likes: 15, createdAt: '2025-08-12T12:00:00Z' },
    { id: 3, user: '익명', text: '집 가고 싶고,, 진인데 집 가고 싶고,, 진짜 너무 어렵고,, 하지만 할 수 있죠?', likes: 14, createdAt: '2025-08-15T09:00:00Z' },
    { id: 4, user: '익명', text: '한 번 힘을 내볼까요', likes: 2, createdAt: '2025-08-20T18:30:00Z' },
  ])
  const [searchKeyword, setSearchKeyword] = useState('')

  const toggleReviewLike = (rid) => {
    setReviews(prev => prev.map(r => r.id === rid
      ? { ...r, liked: !r.liked, likes: r.liked ? Math.max(0, r.likes - 1) : r.likes + 1 }
      : r
    ))
  }

  const sortedReviews = useMemo(() => {
    const arr = [...reviews]
    if (sortKey === '추천순') return arr.sort((a, b) => b.likes - a.likes)
    return arr.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }, [reviews, sortKey])

  // 신고 모달 상태
  const [reportOpen, setReportOpen] = useState(false)
  const [reportThanksOpen, setReportThanksOpen] = useState(false)
  const [reportTarget, setReportTarget] = useState(null)
  const [reportReason, setReportReason] = useState('욕설 / 비속어')
  const [reportEtc, setReportEtc] = useState('')
  const reportOptions = ['욕설 / 비속어', '불쾌감 조성', '무단광고 / 홍보', '음란 / 선정적', '기타']
  const submitReport = () => {
    // TODO: API 연동
    console.log('신고 전송', { reviewId: reportTarget, reason: reportReason, etc: reportEtc })
    setReportOpen(false)
    setReportThanksOpen(true)
    setReportTarget(null)
    setReportReason('욕설 / 비속어')
    setReportEtc('')
  }

  return (
    <Wrap>
      <Bleed>
      <PageNavbar title="지역위키" />
      </Bleed>
        <SearchBar
          placeholder="검색어를 입력해주세요"
          value={searchKeyword}
          onChange={setSearchKeyword}
          bordered
          borderColor="#E2E2E2"
          onSubmit={() => {
            const q = searchKeyword.trim()
            if (q) navigate({ pathname: '/wiki/search', search: `?q=${encodeURIComponent(q)}` })
          }}
        />

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
          <LikeIconButton
            $active={isLiked}
            onClick={() => {
              const normalized = {
                id: place.id,
                name: place.name,
                place_name: place.name,
                address: place.address,
                address_name: place.address,
                location: place.address,
                place_photos: place.images,
              }
              if (isLiked) removePlace(normalized)
              else addPlace(normalized)
            }}
            aria-label={isLiked ? '찜 해제' : '찜하기'}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 6 4 4 6.5 4c1.74 0 3.41 1.01 4.22 2.59C11.09 5.01 12.76 4 14.5 4 17 4 19 6 19 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill={isLiked ? '#E35A5A' : '#C8C8C8'} />
            </svg>
          </LikeIconButton>
        </Actions>
      </Header>

      <Sheet
        style={{
          transform: `translate3d(0, ${y}px, 0)`,
          height: `calc(100dvh - ${y}px)`,
          transition: dragging ? 'none' : 'transform 240ms cubic-bezier(0.22, 1, 0.36, 1), height 240ms cubic-bezier(0.22, 1, 0.36, 1)'
        }}
      >
        <Handle
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        />

<Section>
  <SecTitle><Dot /><TitleText>위키 별점</TitleText></SecTitle>
  <Stars>★★★☆☆</Stars>
</Section>

<Section>
  <SecTitle><Dot /><TitleText>AI 요약</TitleText></SecTitle>
  <Summary>{place.summary}</Summary>
</Section>

<Section>
  <SecTitle><Dot /><TitleText>기본 정보</TitleText></SecTitle>
  <Info>
    <div>위치: {place.address}</div>
    <div>영업 시간: {place.hours}</div>
    <div>전화번호: {place.phone}</div>
  </Info>
</Section>


          <Section>
  <SecTitle><Dot /><TitleText>게시판</TitleText></SecTitle>
  <SortBar>
    <PillButton type="button" onClick={() => setSortOpen(true)}>{sortKey} ▾</PillButton>
  </SortBar>

          
          <BottomSheetSelect
            visible={sortOpen}
            title="정렬 기준"
            options={[{label:'추천순', value:'추천순'},{label:'최신순', value:'최신순'}]}
            value={sortKey}
            onSelect={(v)=>{ setSortKey(v); setSortOpen(false) }}
            onClose={()=> setSortOpen(false)}
          />
          <ReviewList>
            {sortedReviews.map(r => (
              <ReviewRow key={r.id}>
                <ReviewText>{r.text}</ReviewText>
                <ReviewActions>
                  <HeartBtn onClick={() => toggleReviewLike(r.id)} aria-label={r.liked ? '좋아요 취소' : '좋아요'}>
                    <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 6 4 4 6.5 4c1.74 0 3.41 1.01 4.22 2.59C11.09 5.01 12.76 4 14.5 4 17 4 19 6 19 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill={r.liked ? '#E35A5A' : 'none'} stroke="#9AA0A6" strokeWidth="1.6"/>
                    </svg>
                  </HeartBtn>
                  <LikeCount>{r.likes}</LikeCount>
                  <WarnBtn type="button" aria-label="신고" onClick={() => { setReportTarget(r.id); setReportOpen(true) }}>
                    <img src={warningIcon} alt="신고" />
                  </WarnBtn>
                </ReviewActions>
              </ReviewRow>
            ))}
          </ReviewList>
        </Section>

        {reportOpen && createPortal(
          (
            <ReportOverlay role="dialog" aria-modal="true" onClick={() => setReportOpen(false)}>
              <ReportBox onClick={(e) => e.stopPropagation()}>
                <ReportTitle>해당 게시글을 신고하시겠습니까?</ReportTitle>
                <ReportList>
                  {reportOptions.map(opt => (
                    <ReportItem key={opt} onClick={() => setReportReason(opt)}>
                      <Radio $checked={reportReason === opt} />
                      <span>{opt}</span>
                      {opt === '기타' && (
                        <EtcInput
                          placeholder="사유를 입력하세요"
                          value={reportEtc}
                          onChange={e => setReportEtc(e.target.value)}
                          onClick={e => { e.stopPropagation(); setReportReason('기타') }}
                        />
                      )}
                    </ReportItem>
                  ))}
                </ReportList>
                <ReportActions>
                  <CancelBtn type="button" onClick={() => setReportOpen(false)}>취소</CancelBtn>
                  <SubmitBtn type="button" onClick={submitReport}>신고하기</SubmitBtn>
                </ReportActions>
              </ReportBox>
            </ReportOverlay>
          ),
          document.body
        )}

        {reportThanksOpen && createPortal(
          (
            <ReportOverlay role="dialog" aria-modal="true" onClick={() => setReportThanksOpen(false)}>
              <ThanksBox onClick={(e) => e.stopPropagation()}>
                <ThanksMessage>
                  신고해주셔서 감사합니다.
                  <br />
                  더 나은 서비스를 위해 노력하겠습니다.
                </ThanksMessage>
                <ThanksActions>
                  <OkBtn type="button" onClick={() => setReportThanksOpen(false)}>확인</OkBtn>
                </ThanksActions>
              </ThanksBox>
            </ReportOverlay>
          ),
          document.body
        )}
      </Sheet>
    </Wrap>
  )
}

const Wrap = styled.section`
  width: 100%; max-width: 420px; margin: 0 auto; padding: 0 16px 24px;
  display: flex; flex-direction: column;
`
const Bleed = styled.div`
  margin-left: -16px;
  margin-right: -16px;
`

const Header = styled.div`display:flex; flex-direction:column; gap:8px; margin-top:8px;`
const Title = styled.h1`
  margin-top: 10px;
  color: var(--color-neutral-white, #FFF);
  text-align: center;
  font-family: Paperlogy;
  font-size: 32px;
  font-style: normal;
  font-weight: 700;
  line-height: 17px; /* 53.125% */
  letter-spacing: -0.5px;
`



const Addr = styled.div`
  color: var(--color-neutral-whitegray, #F0F0F0);
  text-align: center;
  font-family: Paperlogy;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 17px; 
  margin-bottom: 20px;
`
const Gallery = styled.div`display:flex; gap:8px; overflow-x:auto;`
const Img = styled.img`width: 140px; height: 100px; object-fit: cover; border-radius: 8px;`
const Actions = styled.div`display:flex; gap:8px; align-items:center; margin: 8px 0;`
const WriteBtn = styled.button`
flex:1; 
height:36px; 
border:none; 
background:#eee;
display: flex;
width: 284px;
height: 34px;
padding: 5px;
justify-content: center;
align-items: center;
gap: 10px;
flex-shrink: 0;
border-radius: 10px;
background: var(--color-neutral-white, #FFF);
`
const LikeIconButton = styled.button`
  width: 34px;
  height: 34px;
  padding: 5px;
  padding-left: 6px;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  border: none;
  border-radius: 10px;
  background: var(--color-neutral-whitegray, #F0F0F0);
  box-shadow: 0 4px 12px rgba(0,0,0,0.12);
  
`
const Section = styled.section`margin-top:16px;`
const SecTitle = styled.h3`
  display: flex; align-items: center; gap: 8px;
  margin: 16px 0 8px;
  padding: 10px 12px;
  background: #F4F4F5; border-radius: 8px;
`
const Stars = styled.div`
  margin-left: 10px;
  margin-right: 10px;
`
    
const Summary = styled.p`
  margin-left: 10px;
  margin-right: 10px;
`
const Info = styled.div`display:flex; flex-direction:column; gap:4px;
margin-left: 10px;
margin-right: 10px;
`
const Review = styled.div`padding:12px 0; border-top:1px solid rgba(0,0,0,0.06);`

// 게시판 정렬/리스트 스타일
const SortBar = styled.div`
  display: flex; justify-content: flex-start; margin: 8px 0 6px;
`
const PillButton = styled.button`
  height: 22px;
  padding: 0 12px;
  border: 1.5px solid #bcbcbc;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.8);
  color: #555;
  font-size: 13px;
  cursor: pointer;
  margin-top: 9px;
  padding-bottom: 2px;
  margin-bottom: 9px;
  margin-left: 10px;
`
const ReviewList = styled.div`
  margin-left: 10px;
  margin-right: 10px;
`

const ReviewRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 3px;

`
const ReviewText = styled.p`
color: var(--color-neutral-black, #2A2A2A);
font-family: Paperlogy;
font-size: 12px;
font-style: normal;
font-weight: 400;
line-height: 17px; /* 141.667% */
letter-spacing: -0.5px;
`
const ReviewActions = styled.div`
  display: flex; align-items: center; gap: 8px;
`
const HeartBtn = styled.button`
  width: 24px; height: 24px; border-radius: 10px; border: none; background: transparent; display: grid; place-items: center; cursor: pointer;
`
const LikeCount = styled.span`
  min-width: 18px; text-align: center; color: #8A8A8A; font-size: 15px;
`

// 신고 버튼
const WarnBtn = styled.button`
  width: 24px; height: 24px; border-radius: 10px; border: none; background: transparent; display: grid; place-items: center; cursor: pointer;
  img { width: 22px; height: 22px; display: block; }
`

// 신고 모달 스타일
const ReportOverlay = styled.div`
  position: fixed; inset: 0; background: rgba(0,0,0,0.55); display: grid; place-items: center; z-index: 1000;
`
const ReportBox = styled.div`
  width: min(560px, calc(100vw - 40px));
  background: #fff; border-radius: 16px; padding: 22px 22px 18px; box-shadow: 0 10px 30px rgba(0,0,0,0.2);
`
const ReportTitle = styled.h3`
  margin: 0 0 14px; font-size: 20px; color: #2A2A2A; font-weight: 800;
`
const ReportList = styled.ul`
  margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 12px;
`
const ReportItem = styled.li`
  display: grid; grid-template-columns: 28px 1fr; align-items: center; gap: 8px; cursor: pointer;
`
const Radio = styled.span`
  width: 22px; height: 22px; border-radius: 50%; border: 2px solid #C9C9C9; display: inline-grid; place-items: center;
  &::after { content: ''; width: 12px; height: 12px; border-radius: 50%; background: #FFC500; display: ${p => p.$checked ? 'block' : 'none'}; }
`
const EtcInput = styled.input`
  grid-column: 2 / span 1; margin-top: 6px; height: 36px; border-radius: 8px; border: 1px solid #E2E2E2; padding: 0 10px;
`
const ReportActions = styled.div`
  display: flex; justify-content: space-between; gap: 12px; margin-top: 18px;
`
const CancelBtn = styled.button`
  flex: 1; height: 44px; border-radius: 12px; border: none; background: #F0F0F0; color: #2A2A2A; font-weight: 700;
`
const SubmitBtn = styled.button`
  flex: 1; height: 44px; border-radius: 12px; border: none; background: #271932; color: #fff; font-weight: 700;
`

// 신고 완료 토스트/모달
const ThanksBox = styled.div`
  width: min(720px, calc(100vw - 24px));
  background: #fff; border-radius: 16px; padding: 28px 24px 18px; box-shadow: 0 10px 30px rgba(0,0,0,0.2);
`
const ThanksMessage = styled.p`
  margin: 0 0 18px; color: #2A2A2A; font-size: 28px; font-weight: 700; line-height: 1.4;
  color: var(--color-neutral-black, #2A2A2A);
font-family: Paperlogy;
font-size: 17px;
font-style: normal;
font-weight: 400;
line-height: 30px; /* 176.471% */
letter-spacing: -0.5px;
`
const ThanksActions = styled.div`
  display: flex; justify-content: flex-end;
`
const OkBtn = styled.button`
  min-width: 96px; height: 44px; border-radius: 12px; border: none; background: #271932; color: #fff; font-weight: 700;
  
`

// Bottom Sheet Styles (Plan 화이트박스 패턴)
const Sheet = styled.div`
  position: fixed;
  left: 0; right: 0; top: 0; margin: 0 auto;
  z-index: 40;
  width: min(375px, 100vw);
  background: var(--color-neutral-white, #FFF);
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  box-shadow: 0 -8px 24px rgba(0,0,0,0.12);
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
  padding: 0 16px 24px;
    
`
const Handle = styled.div`
  position: sticky;
  top: 0;
  z-index: 2;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 0 8px 0;
  cursor: grab;
  &::before {
    content: "";
    width: 40px;
    height: 4px;
    border-radius: 2px;
    background: #E5E7EB;
  }
  &:active { cursor: grabbing; }
`


const Dot = styled.span`display:inline-block; width:4px; height:4px; border-radius:50%; background: var(--color-neutral-black, #2A2A2A);`

const TitleText = styled.span`
  color: var(--color-neutral-black, #2A2A2A);
  font-family: Paperlogy;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 17px;
  letter-spacing: -0.5px;
`