/**
 * 토스트 메시지를 표시하는 유틸리티 함수
 * @param {string} message - 표시할 메시지
 * @param {number} duration - 표시 시간 (밀리초, 기본값: 3000)
 */
export const showToast = (message, duration = 3000) => {
    // 기존 토스트가 있으면 제거
    const existingToast = document.getElementById('custom-toast');
    if (existingToast) {
        existingToast.remove();
    }

    // 토스트 요소 생성
    const toast = document.createElement('div');
    toast.id = 'custom-toast';
    toast.textContent = message;
    
    // 토스트 스타일 적용
    Object.assign(toast.style, {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        padding: '12px 24px',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '500',
        zIndex: '10000',
        maxWidth: '343px',
        minWidth: '300px',
        textAlign: 'center',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
        opacity: '0',
        transition: 'opacity 0.3s ease',
        whiteSpace: 'pre-wrap'
    });

    // DOM에 추가
    document.body.appendChild(toast);
    
    // 페이드 인 애니메이션
    setTimeout(() => {
        toast.style.opacity = '1';
    }, 10);
    
    // 지정된 시간 후 제거
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => {
            if (toast && toast.parentNode) {
                toast.remove();
            }
        }, 300);
    }, duration);
};
