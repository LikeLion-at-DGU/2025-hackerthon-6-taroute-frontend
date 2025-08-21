/**
 * 세션 키 관리 유틸리티
 */

const SESSION_KEY_STORAGE = 'taroute_session_key';

/**
 * 세션 키를 localStorage에 저장
 * @param {string} sessionKey 
 */
export const saveSessionKey = (sessionKey) => {
    console.log('💾 saveSessionKey 호출:', sessionKey);
    if (sessionKey) {
        localStorage.setItem(SESSION_KEY_STORAGE, sessionKey);
        console.log('✅ 세션 키 localStorage 저장 완료:', sessionKey);
    } else {
        console.log('⚠️ 세션 키가 비어있어서 저장하지 않음');
    }
};

/**
 * localStorage에서 세션 키 가져오기
 * @returns {string|null}
 */
export const getSessionKey = () => {
    const sessionKey = localStorage.getItem(SESSION_KEY_STORAGE);
    console.log('🔑 getSessionKey 호출 결과:', sessionKey);
    return sessionKey;
};

/**
 * 세션 키 삭제
 */
export const clearSessionKey = () => {
    localStorage.removeItem(SESSION_KEY_STORAGE);
};

/**
 * 세션 키가 유효한지 확인
 * @returns {boolean}
 */
export const hasValidSessionKey = () => {
    const sessionKey = getSessionKey();
    return sessionKey && sessionKey.length > 0;
};
