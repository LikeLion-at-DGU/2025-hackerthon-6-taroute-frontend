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
export const postCardSelect = async (selectedCards = []) => {
  // 1차: 선택 카드 배열을 바디로 보냄
  try {
    const res = await instance.post("/chats/card_select", { selected_cards: selectedCards });
    const select = res?.data?.select;
    if (Array.isArray(select)) return select;
  } catch (err1) {
    // 2차: 빈 바디로 재시도 (백엔드가 바디 미사용일 수 있음)
    try {
      const res2 = await instance.post("/chats/card_select", {});
      const select2 = res2?.data?.select;
      return Array.isArray(select2) ? select2 : [];
    } catch (err2) {
      console.error("❌ postCardSelect 실패", {
        firstTry: { message: err1.message, status: err1.response?.status, data: err1.response?.data },
        secondTry: { message: err2.message, status: err2.response?.status, data: err2.response?.data },
      });
      throw err2;
    }
  }
  return [];
};


