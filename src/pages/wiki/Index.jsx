import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import SearchBar from '../../components/common/SearchBar.jsx'
import heart from '../../assets/icons/Heart.svg'
import warning from '../../assets/icons/warning.svg'
import taru from '../../assets/icons/WikiTaru.svg'
import useSheetDrag from '../../hooks/common/useSheetDrag.js'

export default function WikiIndex() {
  const navigate = useNavigate()

  const recent = [
    { id: 1, title: '서브웨이', ago: '2분 전' },
    { id: 2, title: '서브웨이', ago: '6분 전' },
    { id: 3, title: '서브웨이', ago: '10분 전' },
    { id: 4, title: '서브웨이', ago: '48분 전' },
    { id: 5, title: '서브웨이', ago: '55분 전' },
  ]

  const hot = [
    { id: 11, title: '여기 진짜 맛있어서 저만 알고 싶어요', likes: 13 },
    { id: 12, title: '여기 진짜 분위기도 좋고… 서비스도 좋고,,, 맛도 있고,,,', likes: 9 },
    { id: 13, title: '집 가고 싶고, 집인데 집 가고 싶고,,, 진짜 너무 어렵고,,', likes: 14 },
    { id: 14, title: '한 번 힘을 내볼까요', likes: 2 },
  ]

  const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 812
  const expandedTop = 80
  const collapsedTop = 330
  const { y, dragging, onPointerDown, onPointerMove, onPointerUp } = useSheetDrag({
    expandedTop,
    collapsedTop,
    start: 'collapsed',
  })

  return (
    <Wrap>
      <SearchBar
        placeholder="검색어를 입력해주세요"
        asButton
        readOnly
        onClick={() => navigate('/wiki/search')}
        bordered
        borderColor="#E2E2E2"
      />

<WikiHero>
    <HeroLeft>
      <HeroLead>우리가 만들어가는<br />동네 장소들의 위키백과</HeroLead>
      <CTAButton onClick={() => navigate('/wiki/search')}>
        <p>내가 방문한 장소<br /><span>위키 작성하기 &gt;</span></p>
        <img src={taru} alt="타루" />
      </CTAButton>
    </HeroLeft>
  </WikiHero>

  <Sheet
    style={{
      transform: `translate3d(0, ${y}px, 0)`,
      height: `calc(100dvh - ${y}px)`,
      transition: dragging ? 'none' : 'transform 240ms cubic-bezier(0.22, 1, 0.36, 1), height 240ms cubic-bezier(0.22, 1, 0.36, 1)',
    }}
  >
    <Handle
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    />

      <Section>
        <TitleBox>
          <Dot />
          <TitleText>최근 업데이트된 위키</TitleText>
          <Stamp>2025-08-16 14:02 기준</Stamp>
        </TitleBox>
        <RecentList>
          {recent.map((r, i) => (
            <RecentRow key={r.id}>
              <IndexBadge>{i + 1}</IndexBadge>
              <RowTitle>{r.title}</RowTitle>
              <RightText>{r.ago}</RightText>
            </RecentRow>
          ))}
        </RecentList>
      </Section>

      <Section>
        <TitleBox>
          <Dot />
          <TitleText>현재 핫한 게시판</TitleText>
        </TitleBox>
        <HotList>
          {hot.map(item => (
            <HotRow key={item.id}>
              <HotTitle>· {item.title}</HotTitle>
              <HotRight>
                <LikeIcon src={heart} alt="좋아요" />
                <LikeCount>{item.likes}</LikeCount>
                <WarnIcon src={warning} alt="신고" />
              </HotRight>
            </HotRow>
          ))}
        </HotList>
      </Section>
    </Sheet>
    </Wrap>
  )
}

const Wrap = styled.section`
  width: 100%;
  max-width: 375px;
  margin: 0 auto;
  padding: 0 16px 24px;
  min-height: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`

/* Hero */
const Hero = styled.div`
  display: grid;
  grid-template-columns: 1fr 120px;
  align-items: center;
  gap: 10px;
  padding: 16px;
  margin-top: 8px;
  border-radius: 12px;
  background: linear-gradient(180deg, #1E2141 0%, #2B2F5A 100%);
  color: #fff;
  cursor: pointer;
`
const WikiHero = styled.div`
  margin-top: 12px;
  padding: 16px;
  border-radius: 12px;
  background: linear-gradient(180deg, #1E2141 0%, #2B2F5A 100%);
  color: #fff;
`

const HeroLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const HeroLead = styled.p`
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  letter-spacing: -0.3px;
  line-height: 1.4;
`

const CTAButton = styled.button`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 110px;
  align-items: center;
  gap: 10px;
  border: none;
  border-radius: 12px;
  padding: 12px 14px;
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(4px);
  color: #fff;
  cursor: pointer;

  p { margin: 0; line-height: 1.3; }
  p > span { font-size: 20px; color: #FFC500; font-weight: 500; }
  img { width: 96px; height: 86px; object-fit: contain; justify-self: end; }
`

/* Section + Title */
const Section = styled.section`margin-top: 16px;`
const TitleBox = styled.div`
  display:flex; align-items:center; gap:8px;
  padding: 10px 12px;
  border-radius: 8px;
  background: #F4F4F5;
`
const Dot = styled.span`
  width:8px; height:8px; border-radius:50%;
  background: var(--color-neutral-black, #2A2A2A);
`
const TitleText = styled.span`
  color: var(--color-neutral-black, #2A2A2A);
  font-family: Paperlogy;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 17px;
  letter-spacing: -0.5px;
`
const Stamp = styled.span`margin-left:auto; color:#9AA0A6; font-size:12px;`

/* Recent */
const RecentList = styled.div`display:flex; flex-direction:column;`
const RecentRow = styled.div`
  display:grid; grid-template-columns: 24px 1fr auto;
  align-items:center; gap:10px;
  padding: 10px 4px; border-bottom: 1px solid rgba(255,255,255,0.06);
`
const IndexBadge = styled.span`color:#8A8A8A; font-weight:700;`
const RowTitle = styled.span`color:#2A2A2A;`
const RightText = styled.span`color:#8A8A8A; font-size:12px;`

/* Hot */
const HotList = styled.div`display:flex; flex-direction:column;`
const HotRow = styled.div`
  display:grid; grid-template-columns: 1fr auto; align-items:center;
  padding: 12px 4px; border-bottom: 1px solid rgba(0,0,0,0.06);
`
const HotTitle = styled.span`
  color: var(--color-neutral-black, #2A2A2A);
  font-size: 14px; letter-spacing:-0.3px;
`
const HotRight = styled.div`display:flex; align-items:center; gap:8px;`
const LikeIcon = styled.img`width:18px; height:18px;`
const LikeCount = styled.span`color:#8A8A8A; font-size:12px; min-width:18px; text-align:center;`
const WarnIcon = styled.img`width:16px; height:16px; opacity:.6;`

const Sheet = styled.div`
  position: fixed;
  left: 0; right: 0; top: 0; margin: 0 auto;
  z-index: 40;
  width: min(375px, 100vw);
  background: var(--bg-3, linear-gradient(90deg, #EBF3FF 0%, #F5F8FF 100%));
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  box-shadow: 0 -8px 24px rgba(0,0,0,0.12);
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
  padding: 0 16px 24px;
`

const Handle = styled.div`
  position: sticky; top: 0; z-index: 2;
  display: flex; justify-content: center; align-items: center;
  padding: 10px 0 8px 0; cursor: grab;
  &::before { content: ""; width: 40px; height: 4px; border-radius: 2px; background: #E5E7EB; }
  &:active { cursor: grabbing; }
`