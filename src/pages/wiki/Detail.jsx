import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useParams, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import PageNavbar from '../../components/common/PageNavbar.jsx'
import useSheetDrag from '../../hooks/common/useSheetDrag.js'
import SearchBar from '../../components/common/SearchBar.jsx'
import { useSavedPlaceContext } from '../../contexts/SavedPlaceContext.jsx'
import warningIcon from '../../assets/icons/warning.svg'
import { getWikiDetail, likeWikiReview } from '../../apis/wikiApi.js'
import { showToast } from '../../hooks/common/toast.js'
import BottomSheetSelect from '../../components/common/BottomSheetSelect.jsx'
import { useTranslation } from "react-i18next";


export default function WikiDetail() {
  const { t } = useTranslation();
  const { id: routeId } = useParams()
  const navigate = useNavigate()
  const { savedPlaces, addPlace, removePlace } = useSavedPlaceContext()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [place, setPlace] = useState({ id: '', name: '', address: '', images: [], stars: null, hours: '', running_time: [], phone: '', summary: '' })
  const [reviews, setReviews] = useState([])
  const [averageScore, setAverageScore] = useState(null)
  const heroPhoto = useMemo(() => (Array.isArray(place.images) && place.images.length > 0 ? place.images[0] : ''), [place.images])

  // 보기 좋은 영업시간 렌더링을 위한 파싱 ("일요일 08:00-22:00, 월요일 08:00-22:00, ...")
  const hoursList = useMemo(() => {
    const text = place?.hours || ''
    if (!text) return []
    return text
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)
      .map(line => {
        const m = line.match(/^(일|월|화|수|목|금|토)요일\s*(.*)$/)
        if (m) return { day: `${m[1]}요일`, time: m[2] || '' }
        return { day: '', time: line }
      })
  }, [place?.hours])

  // 뷰포트 기준으로 접힌 상태 높이를 작게(≈220px) 유지
  const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 812
  const expandedTop = 80
  const collapsedTop = Math.max(expandedTop, Math.round(viewportHeight * 0.60))

  const { y, dragging, onPointerDown, onPointerMove, onPointerUp } = useSheetDrag({
    expandedTop,
    collapsedTop,
    start: 'collapsed',
  })

  // 고정형 "게시판 작성" 바 위치 (시트 드래그와 무관하게 고정)
  const writeBarTop = Math.max(120, Math.round(viewportHeight * 0.52))
  const showWriteBar = y > writeBarTop + 12

  const isLiked = useMemo(() => savedPlaces.some(p => (
    p.id ? p.id === place.id : (p.name||p.place_name) === place.name && (p.address||p.address_name||p.location) === place.address
  )), [savedPlaces, place])

  const [sortKey, setSortKey] = useState('추천순') // 추천순 | 최신순
  const [sortOpen, setSortOpen] = useState(false)
  const [searchKeyword, setSearchKeyword] = useState('')
  const likeBusyRef = useRef(new Set())

  const toggleReviewLike = async (rid) => {
    // 중복 클릭 방지
    if (likeBusyRef.current.has(rid)) return
    likeBusyRef.current.add(rid)
    const target = reviews.find(r => r.id === rid)
    if (!target) return
    if (target.hasVoted) { likeBusyRef.current.delete(rid); return }
    // 최초 1회만 허용
    setReviews(prev => prev.map(r => r.id === rid ? { ...r, liked: true, likes: (r.baseLikes ?? r.likes ?? 0) + 1, hasVoted: true } : r))
    try {
      const res = await likeWikiReview({ id: rid, place_id: place.id })
      if (res && typeof res.like_count === 'number') {
        setReviews(prev => prev.map(r => r.id === rid ? { ...r, likes: res.like_count, baseLikes: res.like_count } : r))
      }
    } catch (e) {
      // 실패 시 롤백 (다시 누를 수 있도록 hasVoted 해제)
      setReviews(prev => prev.map(r => r.id === rid ? { ...r, liked: false, hasVoted: false, likes: (r.baseLikes ?? 0) } : r))
      showToast('좋아요 처리에 실패했어요')
    } finally {
      likeBusyRef.current.delete(rid)
    }
  }

  const sortedReviews = useMemo(() => {
    const score = (r) => (r.likes ?? r.like_num ?? 0)
    const arr = [...reviews]
    if (sortKey === '추천순') return arr.sort((a, b) => score(b) - score(a))
    return arr.sort((a, b) => new Date(b.created_at || b.createdAt) - new Date(a.created_at || a.createdAt))
  }, [reviews, sortKey])

  useEffect(() => {
    let aborted = false
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const rawId = (() => { try { return decodeURIComponent(routeId) } catch { return routeId } })()
        const data = await getWikiDetail({ place_id: rawId })
        if (aborted) return
        const sd = data?.search_detail || {}
        setPlace({
          id: rawId,
          name: sd.place_name || '',
          address: sd.address || '',
          images: sd.place_photos || [],
          stars: data?.average_review_score || null,
          hours: Array.isArray(sd.running_time) ? sd.running_time.join(', ') : '',
          phone: sd.phone_number || '',
          summary: data?.ai_summary || '',
        })
        setAverageScore(data?.average_review_score ?? null)
        setReviews((data?.reviews_content || []).map(r => ({
          id: r.id,
          text: r.review_content,
          likes: r.like_num,
          baseLikes: r.like_num,
          like_num: r.like_num,
          createdAt: r.created_at,
          created_at: r.created_at,
          hasVoted: false,
        })))
      } catch (e) {
        if (!aborted) setError(e)
      } finally {
        if (!aborted) setLoading(false)
      }
    }
    load()
    return () => { aborted = true }
  }, [routeId])

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
      <PageNavbar title={t("wiki.titletop")} />
      </Bleed>
      <HeroSection style={{ marginLeft: -16, marginRight: -16, padding: '0 16px', minHeight: writeBarTop + 56 }}>
        <HeroBG $src={heroPhoto} />
        <SearchBar
          placeholder={t("wiki.subtitletop")}
          value={searchKeyword}
          onChange={setSearchKeyword}
          bordered
          borderColor="#E2E2E2"
          onSubmit={() => {
            const q = searchKeyword.trim()
            if (q) navigate({ pathname: '/wiki/search', search: `?q=${encodeURIComponent(q)}` })
          }}
        />

      <Header style={{ gap: ((place?.name ?? '').length > 14 && (place?.address ?? '').length > 24) ? 0 : 20 }}>
        <Title>{place.name || '...'}</Title>
        <Addr>{place.address || ''}</Addr>
        <Gallery>
          {place.images.map((src, i) => (
            <Img key={i} src={src} alt={`${place.name}-${i + 1}`} />
          ))}
        </Gallery>
        {showWriteBar && (
          <Actions style={{ position: 'fixed', top: writeBarTop, left: '50%', transform: 'translateX(-50%)', width: 'min(375px, 100vw)', paddingLeft: 16, paddingRight: 16, zIndex: 45 }}>
            <WriteBtn onClick={() => navigate(`/wiki/place/${encodeURIComponent(place.id)}/review/new`)}>{t("wiki.enter")}</WriteBtn>
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
                  running_time: place.running_time,
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
        )}
      </Header>
      </HeroSection>

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
  <SecTitle><Dot /><TitleText>{t("wiki.star")}</TitleText></SecTitle>
  <Stars>{averageScore ? `★ ${averageScore.toFixed(1)}` : t("toast.noavg")}</Stars>
</Section>

<Section>
  <SecTitle><Dot /><TitleText>{t("wiki.summary")}</TitleText></SecTitle>
  <Summary>{place.summary || t("toast.nosummary")}</Summary>
</Section>

<Section>
  <SecTitle><Dot /><TitleText>{t("wiki.info")}</TitleText></SecTitle>
  <Info>
    <div>{t("wiki.info_loc")}: {place.address || '-'}</div>
    <HoursBlock>
      <HoursTitle>{t("wiki.info_time")}</HoursTitle>
      <HoursList>
        {hoursList.length > 0 ? (
          hoursList.map((h, i) => (
            <HoursRow key={i}>
              {h.day && <HoursDay>{h.day}</HoursDay>}
              <HoursTime>{h.time || '정보없음'}</HoursTime>
            </HoursRow>
          ))
        ) : (
          <HoursTime>-</HoursTime>
        )}
      </HoursList>
    </HoursBlock>
    <div>{t("wiki.info_num")}: {place.phone || '-'}</div>
  </Info>
</Section>


          <Section>
  <SecTitle><Dot /><TitleText>{t("wiki.review")}</TitleText></SecTitle>
  <SortBar>
    <PillButton type="button" onClick={() => setSortOpen(true)}>{sortKey}</PillButton>
  </SortBar>

          
          <BottomSheetSelect
            visible={sortOpen}
            title={t("wiki.wikisort")}
            options={[{label:t("wiki.reviewsort1"), value:'추천순'},{label:t("wiki.reviewsort1"), value:'최신순'}]}
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
                    <HeartIcon $active={r.liked} />
                  </HeartBtn>
                  <LikeCount>{r.likes ?? 0}</LikeCount>
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
                <ReportTitle>{t("wiki.reporttitle")}</ReportTitle>
                <ReportList>
                  {reportOptions.map(opt => (
                    <ReportItem key={opt} onClick={() => setReportReason(opt)}>
                      <Radio $checked={reportReason === opt} />
                      <span>{opt}</span>
                      {opt === '기타' && (
                        <EtcInput
                          placeholder={t("wiki.why")}
                          value={reportEtc}
                          onChange={e => setReportEtc(e.target.value)}
                          onClick={e => { e.stopPropagation(); setReportReason('기타') }}
                        />
                      )}
                    </ReportItem>
                  ))}
                </ReportList>
                <ReportActions>
                  <CancelBtn type="button" onClick={() => setReportOpen(false)}>{t("wiki.return")}</CancelBtn>
                  <SubmitBtn type="button" onClick={submitReport}>{t("wiki.report")}</SubmitBtn>
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
                  {t("wiki.thank")}
                  <br />
                  {t("wiki.thank2")}
                </ThanksMessage>
                <ThanksActions>
                  <OkBtn type="button" onClick={() => setReportThanksOpen(false)}>{t("wiki.okay")}</OkBtn>
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

const HeroSection = styled.div`
  position: relative;
`

const HeroBG = styled.div`
  position: absolute; inset: 0; z-index: -1;
  background: ${p => p.$src ? `linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 60%, rgba(0,0,0,0) 100%), url(${p.$src}) center/cover no-repeat` : 'transparent'};
  filter: ${p => p.$src ? 'brightness(0.5)' : 'none'};
`

const Header = styled.div`display:flex; flex-direction:column; gap:20px; margin-top:8px; padding: 0 8px;`
const Title = styled.h1`
  margin: 10px 0 0;
  color: var(--color-neutral-white, #FFF);
  text-align: center;
  font-family: Paperlogy;
  font-size: 32px;
  font-style: normal;
  font-weight: 800;
  line-height: 1.28;
  letter-spacing: -0.5px;
  word-break: keep-all;
  overflow-wrap: anywhere;
`



const Addr = styled.div`
  color: var(--color-neutral-whitegray, #F0F0F0);
  text-align: center;
  font-family: Paperlogy;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 1.5;
  margin-bottom: 12px;
  word-break: keep-all;
  overflow-wrap: anywhere;
  padding: 0 12px;
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
const Section = styled.section`
  margin-top:16px;
  /* Section 내부 기본 타이포 (TitleText는 자체 스타일 유지) */
  & * {
    color: var(--color-neutral-black, #2A2A2A);
    font-family: Paperlogy;
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 17px; /* 141.667% */
    letter-spacing: -0.5px;
  }
`
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
const HoursBlock = styled.div`
  margin: 6px 0 4px;
`
const HoursTitle = styled.div`
  color: var(--color-neutral-black, #2A2A2A);
  font-family: Paperlogy;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 17px; /* 141.667% */
  letter-spacing: -0.5px;
  margin-bottom: 6px;
`
const HoursList = styled.div`
  display: grid; grid-template-columns: auto 1fr; row-gap: 4px; column-gap: 10px;
`
const HoursRow = styled.div`
  display: contents;
`
const HoursDay = styled.div`
  color: var(--color-neutral-black, #2A2A2A);
  font-family: Paperlogy;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 17px; /* 141.667% */
  letter-spacing: -0.5px;
`
const HoursTime = styled.div`
  color: var(--color-neutral-black, #2A2A2A);
  font-family: Paperlogy;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 17px; /* 141.667% */
  letter-spacing: -0.5px;
`
const Review = styled.div`padding:12px 0; border-top:1px solid rgba(0,0,0,0.06);`

// 게시판 정렬/리스트 스타일
const SortBar = styled.div`
  display: flex; justify-content: flex-start; margin: 8px 0 6px;
  color: var(--color-neutral-black, #2A2A2A);
font-family: Paperlogy;
font-size: 10px;
font-style: normal;
font-weight: 600;
line-height: 17px; /* 170% */
letter-spacing: -0.5px;

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
  display: grid;
  grid-template-columns: 16px 22px 16px; /* heart | count | report */
  align-items: center;
  column-gap: 6px;
  height: 16px;
`
const HeartBtn = styled.button`
  width: 16px; height: 16px; border-radius: 10px; border: none; background: transparent; display: grid; place-items: center; cursor: pointer; justify-self: center;
`
const HeartIcon = styled.div`
  width: 16px; height: 16px;
  background: url('/src/assets/icons/Heart.svg') center/contain no-repeat;
  filter: ${p => p.$active ? 'none' : 'grayscale(1) opacity(0.6)'};
`
const LikeCount = styled.span`
  color: var(--color-neutral-gray, #8A8A8A);
  text-align: center;
  font-family: MaruBuriOTF;
  font-size: 10px;
  font-style: normal;
  font-weight: 400;
  line-height: 16px;
  letter-spacing: -0.5px;
  min-width: 22px; /* 고정 폭으로 아이콘 정렬 유지 */
  display: block;
`

// 신고 버튼
const WarnBtn = styled.button`
  width: 16px; height: 16px; border-radius: 10px; border: none; background: transparent; display: grid; place-items: center; cursor: pointer; justify-self: center;
  img { width: 16px; height: 16px; display: block; }
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
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: 17px;
  letter-spacing: -0.5px;
`