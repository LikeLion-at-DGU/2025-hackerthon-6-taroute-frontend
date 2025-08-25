import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import PageNavbar from '../../components/common/PageNavbar.jsx'
import SearchBar from '../../components/common/SearchBar.jsx'
import PrimaryButton from '../../components/common/PrimaryButton.jsx'
import { getWikiDetail, postWikiReview } from '../../apis/wikiApi.js'
import { showToast } from '../../hooks/common/toast.js'
import { useTranslation } from "react-i18next";



export default function WikiReviewWrite() {
  const { t } = useTranslation();
  const { id } = useParams()
  const navigate = useNavigate()
  const [agreeTruth, setAgreeTruth] = useState(false)
  const [confirmPlace, setConfirmPlace] = useState(false)
  const [rating, setRating] = useState(0)
  const [text, setText] = useState('')
  const [files, setFiles] = useState([])
  const [previews, setPreviews] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [placeName, setPlaceName] = useState('')
  const [address, setAddress] = useState('')
  const [placeLoading, setPlaceLoading] = useState(true)


  const onPickFiles = (e) => {
    const list = Array.from(e.target.files || [])
    setFiles(list)
  }

  // Generate previews when files change
  useEffect(() => {
    const urls = files.map(f => URL.createObjectURL(f))
    setPreviews(urls)
    return () => {
      urls.forEach(u => URL.revokeObjectURL(u))
    }
  }, [files])

  useEffect(() => {
    let aborted = false
    const load = async () => {
      try {
        const data = await getWikiDetail({ place_id: id })
        if (aborted) return
        setPlaceName(data?.search_detail?.place_name || '')
        setAddress(data?.search_detail?.address || '')
      } catch (e) {
        // ignore
      } finally {
        if (!aborted) setPlaceLoading(false)
      }
    }
    load()
    return () => { aborted = true }
  }, [id])

  const onSubmitReview = async () => {
    if (!agreeTruth || !confirmPlace) {
      showToast(t("toast.check"))
      return
    }
    if (rating <= 0) {
      showToast(t("toast.star"))
      return
    }
    if (!text.trim()) {
      showToast(t("toast.content"))
      return
    }
    if (!placeName || !id) {
      showToast(t("toast.again"))
      return
    }

    try {
      setSubmitting(true)
      const rawId = (() => { try { return decodeURIComponent(id) } catch { return id } })()
      const score = Math.max(0, Math.min(5, rating))
      const body = {
        place_id: rawId,
        gplace_id: rawId,
        place_name: placeName || undefined,
        review_content: text.trim(),
        review_score: score.toFixed(1), // 서버는 문자열 기대
      }
      // 이미지 미구현: 서버가 빈 문자열을 싫어할 수 있어 아예 필드 제외
      await postWikiReview(body)
      showToast('작성 완료!')
      navigate(`/wiki/place/${id}`)
    } catch (e) {
      // 서버 에러 메시지가 있으면 표시
      const msg = e?.response?.data?.message || e?.response?.data?.detail || '작성에 실패했어요'
      showToast(msg)
      console.error('POST /wiki/reviews failed:', e?.response || e)
    } finally {
      setSubmitting(false)
    }
  }
  return (
    <Wrap>
      <Bleed>
        <PageNavbar title={t("wiki.titletop")} />
        </Bleed>
      <Content>
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

        <Header>
          <PlaceTitle>{placeName}</PlaceTitle>
          <Addr>{address}</Addr>
        </Header>

        <NoticeCard>
  <HeadingBox>
    <Dot />
    <HeadingText>{t("wiki.check")}</HeadingText>
  </HeadingBox>
  <P>{t("wiki.wikidetail1")}</P>
  <P>{t("wiki.wikidetail2")}</P>
</NoticeCard>

        <CheckList>
          <CheckRow>
            <CheckLabel>{t("wiki.promise")}</CheckLabel>
            <CheckBox role="checkbox" aria-checked={agreeTruth} $checked={agreeTruth} onClick={() => setAgreeTruth(v => !v)} />
          </CheckRow>
          <CheckRow>
            <CheckLabel>{t("wiki.true")} ‘{placeName}’{t("wiki.true2")}</CheckLabel>
            <CheckBox role="checkbox" aria-checked={confirmPlace} $checked={confirmPlace} onClick={() => setConfirmPlace(v => !v)} />
          </CheckRow>
        </CheckList>

        <DividerTitle>
          <Dot />
          <span>{t("wiki.addstar")}</span>
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
          <span>{t("wiki.addcontent")}</span>
        </DividerTitle>

        <TextArea
          rows={8}
          placeholder={t("wiki.addcontent")}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <DividerTitle>
          <Dot />
          <span>{t("wiki.addphoto")}</span>
        </DividerTitle>

        <UploadWrap>
          <UploadBox>
            {previews.length === 0 ? (
              <>
                <UploadIcon>⇪</UploadIcon>
                <UploadText>{t("wiki.upload")}</UploadText>
              </>
            ) : (
              <PreviewGrid>
                {previews.slice(0, 3).map((src, i) => (
                  <PreviewImg key={i} src={src} alt={`preview-${i}`} />
                ))}
                {previews.length > 3 && (
                  <MoreBadge>+{previews.length - 3}</MoreBadge>
                )}
              </PreviewGrid>
            )}
            <HiddenInput type="file" accept="image/*" multiple onChange={onPickFiles} />
          </UploadBox>
        </UploadWrap>
      </Content>

      <PrimaryButton fixedBottom onClick={onSubmitReview} disabled={submitting || placeLoading}>
        {t("wiki.enter")}
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
  &::-webkit-scrollbar {
        display: none;
    }

    scrollbar-width: none; 
    -ms-overflow-style: none;
`
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
  margin-top: 16px;
  background: transparent;
  border: none;
  padding: 0;
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
  display: flex; align-items: center; gap: 8px;
  margin: 20px 0 10px; padding: 10px 12px;
  background: #F4F4F5; border-radius: 8px;
`

const Dot = styled.span`
  display: inline-block;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--color-neutral-black, #2A2A2A);

`

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

const PreviewGrid = styled.div`
  width: 100%; height: 100%; display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; padding: 10px;
`
const PreviewImg = styled.img`
  width: 100%; height: 100%; object-fit: cover; border-radius: 8px;
`
const MoreBadge = styled.div`
  position: absolute; right: 16px; bottom: 16px; background: rgba(0,0,0,0.6); color: #fff; padding: 6px 10px; border-radius: 999px; font-size: 12px;
`


const HeadingBox = styled.div`
  display: flex; align-items: center; gap: 10px;
  padding: 10px 12px; margin: 24px 0 12px;
  background: #F4F4F5; border-radius: 8px;
`
const HeadingText = styled.span`
  font: inherit;
  color: inherit;
`