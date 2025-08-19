import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import PageNavbar from '../../components/common/PageNavbar.jsx'

export default function WikiReviewWrite() {
  const { id } = useParams()
  return (
    <Wrap>
      <PageNavbar title="게시판 작성" />
      <Form>
        <label>별점</label>
        <Stars>☆☆☆☆☆</Stars>
        <label>내용</label>
        <TextArea rows={8} placeholder="후기를 입력하세요" />
        <Submit>등록</Submit>
      </Form>
    </Wrap>
  )
}

const Wrap = styled.section`
  width: 100%; max-width: 420px; margin: 0 auto; padding: 0 16px 24px;
  display: flex; flex-direction: column;
`
const Form = styled.div`display:flex; flex-direction:column; gap:12px; margin-top:12px;`
const Stars = styled.div``
const TextArea = styled.textarea`width:100%; border-radius:8px; border:1px solid #e2e2e2; padding:8px;`
const Submit = styled.button`height:40px; border:none; border-radius:8px; background:#271932; color:#fff;`


