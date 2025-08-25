import { instance } from "./instance";

/**
 * 타루 챗봇 질문 리스트 저장 및 조회
 * 서버 세션에 질문 세트를 저장하고, 질문 리스트를 반환받는다.
 * @returns {Promise<Array>} questions 배열
 */
export const fetchSlotQuestions = async () => {
  try {
    const res = await instance.post("/chats/slot_question");
    // 기대 형태: { message: string, chats: { questions: [...] } }
    const questions = res?.data?.chats?.questions;
    return Array.isArray(questions) ? questions : [];
  } catch (err) {
    console.error("❌ fetchSlotQuestions 실패", {
      message: err.message,
      status: err.response?.status,
      data: err.response?.data,
    });
    throw err;
  }
};

/**
 * 선택된 카드(인덱스)로 추천 장소 20장을 요청
 * @param {number[]} selectedCards - 사용자가 선택한 카드 인덱스(0-based)
 * @returns {Promise<Array>} select 배열 (20개)
 */
export const postCardSelect = async () => {
  // 위치(x: lng, y: lat)와 질문 응답 텍스트를 조합해 전송
  let x, y
  try {
    // 1) 타로 플로우에서 방금 설정한 세션 값을 우선 사용 (아니야 → 위치 재설정 케이스 반영)
    const locRaw = sessionStorage.getItem('user_selected_location')
    if (locRaw) {
      const loc = JSON.parse(locRaw)
      if (typeof loc?.lng === 'number' && typeof loc?.lat === 'number') {
        x = loc.lng; y = loc.lat
      }
    }
    // 2) 세션이 없으면 메인에서 설정한 최신 위치(LocalStorage) 사용
    if (x === undefined || y === undefined) {
      const saved = JSON.parse(localStorage.getItem('selectedLocation') || '{}')
      if (typeof saved?.coordinates?.lng === 'number' && typeof saved?.coordinates?.lat === 'number') {
        x = saved.coordinates.lng; y = saved.coordinates.lat
      }
    }
  } catch {}

  let inputText = ''
  try {
    const answers = JSON.parse(sessionStorage.getItem('taro_answers') || '[]')
    if (Array.isArray(answers) && answers.length > 0) inputText = answers.join(',')
  } catch {}

  const payload = { x, y, radius: 2000, input_text: inputText, lang: 'ko' }
  try {
    const res = await instance.post('/chats/card_select', payload)
    const select = res?.data?.select || res?.data?.data?.select || (Array.isArray(res?.data) ? res.data : undefined)
    return Array.isArray(select) ? select : []
  } catch (err) {
    console.error('❌ postCardSelect 실패', { message: err.message, status: err.response?.status, data: err.response?.data, sent: payload })
    throw err
  }
};


/**
 * 장소 요약 정보를 조회
 * @param {{ place_id: string, lang?: string }} params
 * @returns {Promise<string>} 요약 텍스트
 */
export const fetchPlaceSummary = async (params) => {
  const { place_id, lang = 'ko' } = params || {}
  if (!place_id) return ''
  try {
    const res = await instance.get('/chats/place_summary', { params: { place_id, lang } })
    // 기대 형태: { place_summary: string, ... } 또는 { data: { place_summary } }
    // 하위 호환: summary 키도 허용
    const d = res?.data || {}
    const dd = d?.data || {}
    return (
      d.place_summary || d.summary || dd.place_summary || dd.summary || ''
    )
  } catch (err) {
    console.error('❌ fetchPlaceSummary 실패', {
      message: err.message,
      status: err.response?.status,
      data: err.response?.data,
    })
    return ''
  }
}


