import { useParams } from 'react-router-dom'
import { useState } from 'react'
import styled from 'styled-components'
import PageNavbar from '../../components/common/PageNavbar.jsx'
import SearchBar from '../../components/common/SearchBar.jsx'
import PrimaryButton from '../../components/common/PrimaryButton.jsx'

export default function WikiReviewWrite() {
  const { id } = useParams()
  const [agreeTruth, setAgreeTruth] = useState(true)
  const [confirmPlace, setConfirmPlace] = useState(false)
  const [rating, setRating] = useState(0)
  const [text, setText] = useState('')
  const [files, setFiles] = useState([])
  const placeName = '고냉지'
  const address = '서울시 중구 퇴계로'

  const onPickFiles = (e) => {
    const list = Array.from(e.target.files || [])
    setFiles(list)
  }
  return (
    <Wrap>
      <Bleed>
        <PageNavbar title="지역위키" />
      </Bleed>
      <Content>
        <SearchTop>
          <SearchBar/>
        </SearchTop>
        <Header>
          <PlaceTitle>{placeName}</PlaceTitle>
          <Addr>{address}</Addr>
        </Header>

        <NoticeCard>
          <NoticeBar>
            <Dot />
            <span>작성 전 아래 내용을 확인해주세요</span>
          </NoticeBar>
          <P>푸드 위키는 실제 후기를 바탕으로 정보를 공유하는 서비스입니다.</P>
          <P>거짓 없이 진실만을 바탕으로 내용을 작성할 것을 약속해주세요</P>
        </NoticeCard>

        <CheckList>
          <CheckRow>
            <CheckLabel>진실된 내용만을 작성할 것을 약속합니다</CheckLabel>
            <CheckBox role="checkbox" aria-checked={agreeTruth} $checked={agreeTruth} onClick={() => setAgreeTruth(v => !v)} />
          </CheckRow>
          <CheckRow>
            <CheckLabel>작성할 식당이 ‘{placeName}’가 맞습니까?</CheckLabel>
            <CheckBox role="checkbox" aria-checked={confirmPlace} $checked={confirmPlace} onClick={() => setConfirmPlace(v => !v)} />
          </CheckRow>
        </CheckList>

        <DividerTitle>
          <Dot />
          <span>해당 식당의 별점을 작성해주세요</span>
        </DividerTitle>

        <Stars>
          {[0,1,2,3,4].map(i => (
            <Star key={i} $active={i < rating} onClick={() => setRating(i+1)} aria-label={`${i+1}점`}>
              ★
            </Star>
          ))}
        </Stars>

        <DividerTitle>
          <Dot />
          <span>내용을 작성해주세요</span>
        </DividerTitle>

        <TextArea
          rows={8}
          placeholder="내용을 입력해주세요."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <DividerTitle>
          <Dot />
          <span>사진을 등록해주세요</span>
        </DividerTitle>

        <UploadWrap>
          <UploadBox>
            <UploadIcon>⇪</UploadIcon>
            <UploadText>사진을 업로드해주세요</UploadText>
            <HiddenInput type="file" accept="image/*" multiple onChange={onPickFiles} />
          </UploadBox>
        </UploadWrap>
      </Content>

      <PrimaryButton fixedBottom onClick={() => { /* TODO: submit */ }}>
        게시판 작성
      </PrimaryButton>
    </Wrap>
  )
}

const Wrap = styled.section`
  width: 100%; max-width: 375px; margin: 0 auto; padding: 0 16px 0;
  display: flex; flex-direction: column; height: 100%; min-height: 0;
  background: var(--color-neutral-white, #FFF);
`


const Bleed = styled.div`
  margin-left: -16px; margin-right: -16px;
`
const Content = styled.div`
  flex: 1; min-height: 0; overflow-y: auto; padding-bottom: 120px;
  -webkit-overflow-scrolling: touch; overscroll-behavior: contain;
`
const SearchTop = styled.div`margin: 24px 0;`
const Header = styled.header`
  margin: 16px 0 8px; display: flex; flex-direction: column; gap: 6px;
`
const PlaceTitle = styled.h1`
  margin: 0; font-size: 32px; font-weight: 800; color: #2A2A2A; letter-spacing: -0.5px;
`
const Addr = styled.p`
  margin: 0; color: #6B7280; font-size: 16px;
`
const NoticeCard = styled.section`
  margin-top: 12px; background: transparent ; border-radius: 12px; padding: 12px; 
`
const NoticeBar = styled.div`
  display: flex; align-items: center; gap: 8px; padding: 8px 10px; background: #F4F4F5; border-radius: 8px; color: #2A2A2A; font-weight: 700;
`
const P = styled.p`
  margin: 12px 4px 0; color: #4B5563; font-size: 14px; line-height: 1.6;
`
const CheckList = styled.div`margin-top: 12px; display: flex; flex-direction: column; gap: 12px;`
const CheckRow = styled.div`display: grid; grid-template-columns: 1fr auto; align-items: center; gap: 10px;`
const CheckLabel = styled.span`color: #2A2A2A;`
const CheckBox = styled.button`
  width: 28px; height: 28px; border-radius: 6px; border: 2px solid ${p => p.$checked ? '#FFC500' : '#C9C9C9'}; background: ${p => p.$checked ? '#FFC500' : 'transparent'};
  display: grid; place-items: center; cursor: pointer;
  &::after { content: '✓'; color: ${p => p.$checked ? '#2A2A2A' : 'transparent'}; font-weight: 900; }
`

const DividerTitle = styled.div`
  display: flex; align-items: center; gap: 8px; margin: 20px 0 10px; color: #2A2A2A; font-weight: 700;
  position: relative;
  &::before { content: ''; position: absolute; left: 0; right: 0; bottom: -8px; border-bottom: 2px dashed #E5E7EB; }
`
const Dot = styled.span`display:inline-block; width:8px; height:8px; border-radius:50%; background:#FFC500;`

const Stars = styled.div`display:flex; gap: 16px; margin: 8px 2px 2px;`
const Star = styled.button`
  font-size: 36px; line-height: 1; border: none; background: transparent; cursor: pointer; color: ${p => p.$active ? '#FFC500' : '#D1D5DB'};
`

const TextArea = styled.textarea`
  width:100%; border-radius:8px; border:1px solid #E2E2E2; padding:12px; background:#fff; resize: vertical;
`

const UploadWrap = styled.div`display:flex; gap: 10px; align-items: center;`
const UploadBox = styled.label`
  flex: 1; height: 160px; display: grid; place-items: center; border: 1px dashed #D1D5DB; border-radius: 12px; background: #fff;
  cursor: pointer;
`
const UploadIcon = styled.div`font-size: 36px; color: #FFC500;`
const UploadText = styled.div`color: #6B7280; margin-top: 6px;`
const HiddenInput = styled.input`display:none;`
const AlbumButton = styled.button`
  height: 40px; padding: 0 14px; border-radius: 10px; border: none; background: #fff; box-shadow: 0 2px 10px rgba(0,0,0,0.06);
`


