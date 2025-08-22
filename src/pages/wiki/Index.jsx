import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import SearchBar from '../../components/common/SearchBar.jsx'
import heart from '../../assets/icons/Heart.svg'
import warning from '../../assets/icons/warning.svg'
import taru from '../../assets/icons/taru/WikiPlanTaru.svg'
import useSheetDrag from '../../hooks/common/useSheetDrag.js'
import rotateLeft from '../../assets/icons/rotateLeft.svg'
import timeIcon from '../../assets/icons/time.svg'
import { useState, useEffect } from 'react'
import { getRecentWiki, getTopLikedWiki } from '../../apis/wikiApi.js'

export default function WikiIndex() {
  const navigate = useNavigate()
  const [recent, setRecent] = useState([])
  const [hot, setHot] = useState([])

  const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 812
  const expandedTop = 102
  const collapsedTop = 387; // 기존 330
  const { y, dragging, onPointerDown, onPointerMove, onPointerUp } = useSheetDrag({
    expandedTop,
    collapsedTop,
    start: 'collapsed',
  })

  const [stamp, setStamp] = useState('')

  const updateStamp = () => {
    const d = new Date()
    const z2 = (n) => String(n).padStart(2, '0')
    setStamp(`${d.getFullYear()}-${z2(d.getMonth() + 1)}-${z2(d.getDate())} ${z2(d.getHours())}:${z2(d.getMinutes())} 기준`)
  }

  useEffect(() => {
    updateStamp()
    const t = setInterval(updateStamp, 60000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    let aborted = false
    ;(async () => {
      try {
        const [r, h] = await Promise.all([
          getRecentWiki(),
          getTopLikedWiki(),
        ])
        if (!aborted) {
          setRecent(r)
          setHot(h)
        }
      } catch (e) {
        console.error('Failed to load wiki index data', e)
      }
    })()
    return () => { aborted = true }
  }, [])

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

      {/* 검색바 아래 */}
      <WikiInfo>
        <p>우리가 만들어가는 <br />동네 장소들의 위키백과</p>
        <WikiInfoBox onClick={() => navigate('/wiki/search')}>
          <p>내가 방문한 장소 <br />
            <span style={{ fontSize: '24px', color: '#FFC500', fontWeight: 500 }}>
              위키 작성하기
            </span>
          </p>
          <img src={taru} alt="타루" />
        </WikiInfoBox>
      </WikiInfo>

      <Sheet 
        style={{
          transform: `translate3d(0, ${y}px, 0)`,
          height: `${712 - y}px`, // 고정된 812px 프레임 기준으로 계산
          maxHeight: `${712 - y}px`,
          minHeight: `${712 - y}px`, // 최소 높이도 설정해서 강제로 스크롤 생성
          transition: dragging ? 'none' : 'transform 240ms cubic-bezier(0.22, 1, 0.36, 1), height 240ms cubic-bezier(0.22, 1, 0.36, 1)'
        }}
      >
        <Handle
          onPointerDown={(e) => {
            // 드래그 핸들 영역에서만 드래그 시작
            if (e.target === e.currentTarget || e.target.closest('::before')) {
              onPointerDown(e);
            }
          }}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        />

        <Section>
          <TitleBox>
            <TitleRow>
              <TitleText>최근 업데이트된 위키</TitleText>
            </TitleRow>
            <StampRow>
              <Stamp>
                {stamp}
                <RefreshBtn onClick={updateStamp}>
                  <img src={rotateLeft} alt="새로고침" />
                </RefreshBtn>
              </Stamp>
            </StampRow>
          </TitleBox>



          <RecentList>
            {recent.map((r, i) => (
              <RecentRow key={`${r.place_name}-${i}`}>
                <IndexBadge>{i + 1}</IndexBadge>
                <RowTitle>{r.place_name}</RowTitle>
                <RightText>{r.time_text}</RightText>
              </RecentRow>
            ))}
          </RecentList>
        </Section>

        <HotSection>
          <TitleRow>
            <TitleText>현재 핫한 게시판</TitleText>
          </TitleRow>
          <HotList>
            {hot.map((item, idx) => (
              <HotRow key={item.id ?? idx}>
                <HotLeft>
                  <HotPlaceLine>
                    <PlaceDot />
                    <HotPlace>{item.place_name}</HotPlace>
                  </HotPlaceLine>
                  <HotTitle>{item.review_content}</HotTitle>
                </HotLeft>
                <HotRight>
                  <LikeIcon src={heart} alt="좋아요" />
                  <LikeCount>{item.like_num}</LikeCount>
                  <WarnIcon src={warning} alt="신고" />
                </HotRight>
              </HotRow>
            ))}
          </HotList>
        </HotSection>
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
const HeroContainer = styled.div`
  margin-top: 12px;
  padding: 18px;
  border-radius: 16px;
  background: linear-gradient(180deg, #26294B 0%, #2F325C 100%);
  box-shadow: 0 12px 28px rgba(0,0,0,0.25);
  color: #fff;
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const HeroTitle = styled.p`
  margin: 0;
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.5px;
  line-height: 1.3;
`

const HeroButton = styled.button`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 110px;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  border: 1px solid rgba(255,255,255,0.10);
  border-radius: 16px;
  background: rgba(0,0,0,0.50);
  color: #fff;
  cursor: pointer;

  p { margin: 0; line-height: 1.3; font-size: 16px; font-weight: 400; }
  p > span { font-size: 24px; color: #FFC500; font-weight: 600; }
  img { width: 96px; height: 86px; object-fit: contain; justify-self: end; }
`

// 위키 히어로 영역
const WikiInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  color: #F0F0F0;

  > p {
    margin: 0;
    font-weight: 600;
    font-size: 24px;
    line-height: 1.3;
    letter-spacing: -0.5px;
  }
`

const WikiInfoBox = styled.div`
  width: 100%;
  min-height: 180px;
  display: grid;
  grid-template-columns: 1fr 124px;  /* 왼쪽 텍스트, 오른쪽 이미지 */
  align-items: center;
  gap: 12px;
  padding: 16px 18px;
  background: rgba(0,0,0,0.5);
  border-radius: 20px;
  

  > p { margin: 0; font-size: 20px; font-weight: 300; line-height: 1.2; }
  > p > span { display: inline-block; margin-top: 5px; font-size: 24px; color: #FFC500; font-weight: 600; }

  img { width: 120px; height: auto; object-fit: contain; justify-self: end; }
`


/* Section + Title */
const Section = styled.section`

`
// TitleBox: 세로 플렉스
const TitleBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

// 1행: 제목
const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.10);
  padding: 0 0 6px; /* 위 0, 아래 6 */
`;

// 2행: 시간(왼쪽 정렬)
const StampRow = styled.div`
  align-self: flex-start;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 12px 0;
`;

const TitleText = styled.span`
  color: var(--color-neutral-black, #2A2A2A);
  font-family: Paperlogy;
  font-size: 20px;
  font-weight: 500;
  letter-spacing: -0.5px;
  padding: 6px 0;

`
const Stamp = styled.span`
  color: #9AA0A6;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const RefreshBtn = styled.button`
  border: none;
  background: transparent;
  padding: 0 2px;
  cursor: pointer;
`;

/* 최근 업데이트 리스트 */
const RecentList = styled.div`display:flex; flex-direction:column;`
const RecentRow = styled.div`
  display:grid; grid-template-columns: 24px 1fr auto;
  align-items:center; gap:10px;
  padding: 6px 0;
`
const IndexBadge = styled.span`
  color:#2A2A2A; font-weight:700; font-size:18px;
`
const RowTitle = styled.span`
  color:#2A2A2A; font-size:16px; letter-spacing:-0.3px;
`
const RightText = styled.span`
  color:#9AA0A6; font-size:13px;
`

/* 핫한 게시판 리스트 */
const HotList = styled.div`display:flex; flex-direction:column;
`
// 오른쪽 열을 고정 폭, 첫 줄(top) 기준 정렬
const HotRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 72px; /* 텍스트 | 하트열(고정) */
  align-items: center;              /* 첫 줄 기준 */
  padding: 8px 0;
`

const HotLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const HotPlaceLine = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  
`

const PlaceDot = styled.span`
  width: 3px;
  height: 3px;
  border-radius: 100%;
  background-color: var(--color-neutral-gray, #8A8A8A);

  flex: 0 0 3px;
`

const HotPlace = styled.span`
  color: #7A7A7A;
  font-size: 12px;
`
const HotTitle = styled.span`
  color: var(--color-neutral-black, #2A2A2A);
  font-size: 14px;
  letter-spacing: -0.3px;
`
const HotRight = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 7px;           /* 하트 ↔ 숫자 간격 (작게) */
  height: 20px;
  margin-top: 2px;
`
const LikeIcon = styled.img`
  width: 16px; height: 16px; flex: 0 0 16px;
`

const LikeCount = styled.span`
  width: 20px;
  text-align: left;
  font-size: 12px;
  line-height: 1;
  color: black;
`

const WarnIcon = styled.img`
  width: 16px;
  height: 16px;
  opacity: .6;
  margin-left: 1px;   /* 숫자 ↔ 경고 아이콘 간격 (넉넉하게) */
`

const HotSection = styled(Section)`
  border-bottom: 1px solid rgba(0,0,0,0.10);
  margin-bottom: 18px;
  margin-top: 30px;
`

const Sheet = styled.div`
  position: fixed;
  left: 0; right: 0; top: 0; margin: 0 auto;
  z-index: 40;
  width: 100%;
  background: var(--bg-3, linear-gradient(90deg, #EBF3FF 0%, #F5F8FF 100%));
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  box-shadow: 0 -8px 24px rgba(0,0,0,0.12);
  will-change: transform;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
  padding: 0 16px 24px;
  max-width: 375px;
  margin: 0 auto;
  /* 812px 프레임 기준으로 최대 높이 제한 */
    max-height: 712px;
    /* 스크롤바를 강제로 표시 */
    scrollbar-width: thin;
    scrollbar-color: rgba(0,0,0,0.5) transparent;
    /* WebKit 스크롤바 스타일 */
    &::-webkit-scrollbar {
        width: 6px;
        display: block !important;
    }
    
    &::-webkit-scrollbar-track {
        background: rgba(0,0,0,0.1);
        border-radius: 3px;
    }
    
    &::-webkit-scrollbar-thumb {
        background-color: rgba(0,0,0,0.5);
        border-radius: 3px;
    }
    
    &::-webkit-scrollbar-thumb:hover {
        background-color: rgba(0,0,0,0.7);
    }
`

const Handle = styled.div`
  position: sticky; top: 0; z-index: 2;
  display: flex; justify-content: center; align-items: center;
  padding: 10px 0 8px 0; cursor: grab;
  &::before { content: ""; width: 40px; height: 4px; border-radius: 2px; background: #E5E7EB; }
  &:active { cursor: grabbing; }
`