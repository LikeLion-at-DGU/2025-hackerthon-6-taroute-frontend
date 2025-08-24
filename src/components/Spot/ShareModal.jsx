import styled from "styled-components";
import { useState, useEffect } from "react";
import { createShareUrl } from "../../apis/shareApi";

const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: fadeIn 0.2s ease-out;

    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
`;

const ModalContainer = styled.div`
    background: white;
    border-radius: 16px;
    width: 320px;
    height: 143px;
    max-width: 90vw;
    padding: 24px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
    animation: slideUp 0.3s cubic-bezier(0.22, 1, 0.36, 1);

    @keyframes slideUp {
        from {
            transform: translateY(20px);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }
`;

const ModalTitle = styled.h3`
    font-size: 17px;
    font-weight: 600;
    color: #2A2A2A;
    margin: 0 0 8px 0;
    font-family: MaruBuri;
    width: 100%;
    border-bottom: 1px solid #8A8A8A;
    padding-bottom: 8px;
`;

const LinkContainer = styled.div`
    background: #F0F0F0;
    height: 30px;
    border-radius: 8px;
    padding: 4px;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
`;

const LinkText = styled.input`
    flex: 1;
    border: none;
    background: transparent;
    font-size: 13px;
    color: #2A2A2A;
    outline: none;
    font-family: 'MaruBuri';
    
    &::selection {
        background: #271932;
        color: white;
    }
`;

const CopyButton = styled.button`
    background: #271932;
    color: white;
    border: none;
    border-radius: 6px;
    padding: 2px 4px;
    font-size: 11px;
    font-weight: 600;
    font-family: MaruBuri;
    cursor: pointer;
    transition: all 0.2s ease;
    width: 33px;
    height: 20px;
    
    &:hover {
        background: #1f1428;
    }
    
    &:active {
        background: #150e1a;
        transform: scale(0.98);
    }
    
    &.copied {
        background: #28a745;
        
        &:hover {
            background: #218838;
        }
    }
`;

const ButtonContainer = styled.div`
    display: flex;
    gap: 8px;
    margin-top: 20px;
`;

const ActionButton = styled.button`
    flex: 1;
    height: 44px;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    border: none;
    
    &.cancel {
        background: #f8f9fa;
        color: #6c757d;
        border: 1px solid #e9ecef;
        
        &:hover {
            background: #e9ecef;
        }
    }
    
    &.close {
        background: #271932;
        color: white;
        
        &:hover {
            background: #1f1428;
        }
    }
`;

const LoadingSpinner = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 6px;
    color: #6c757d;
    font-size: 12px;
`;

const ErrorMessage = styled.div`
    text-align: center;
    padding: 6px;
    color: #dc3545;
    font-size: 12px;
    background: #f8d7da;
    border-radius: 8px;
    margin-bottom: 16px;
`;

const ShareModal = ({
    isOpen,
    onClose,
    shareData
}) => {
    const [shareUrl, setShareUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);

    // 모달이 열릴 때 공유 URL 생성
    useEffect(() => {
        if (isOpen && shareData) {
            generateShareUrl();
        }
        // 모달이 닫힐 때 상태 초기화
        if (!isOpen) {
            setShareUrl('');
            setError('');
            setCopied(false);
        }
    }, [isOpen, shareData]);

    const generateShareUrl = async () => {
        setLoading(true);
        setError('');

        try {
            const response = await createShareUrl(shareData);
            setShareUrl(response.share_url || '');
        } catch (err) {
            console.error('공유 URL 생성 실패:', err);
            setError('공유 링크 생성에 실패했습니다. 다시 시도해주세요.');
        } finally {
            setLoading(false);
        }
    };

    const handleCopyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);

            // 2초 후 복사 상태 초기화
            setTimeout(() => {
                setCopied(false);
            }, 2000);
        } catch (err) {
            console.error('클립보드 복사 실패:', err);
            // 대체 방법: input 선택 후 복사
            const linkInput = document.querySelector('#share-link-input');
            if (linkInput) {
                linkInput.select();
                linkInput.setSelectionRange(0, 99999);
                document.execCommand('copy');
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            }
        }
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <ModalOverlay onClick={handleOverlayClick}>
            <ModalContainer>
                <ModalTitle>공유하기</ModalTitle>
                <p style={{
                    fontSize: '13px',
                    color: '#2A2A2A',
                    margin: '0 0 8px 0',
                    fontFamily: 'MaruBuri',
                    padding: '0',
                }}>
                    링크
                </p>

                {loading && (
                    <LoadingSpinner>
                        공유 링크를 생성하는 중...
                    </LoadingSpinner>
                )}

                {error && (
                    <ErrorMessage>
                        {error}
                    </ErrorMessage>
                )}

                {shareUrl && !loading && !error && (
                    <>
                        <LinkContainer>
                            <LinkText
                                id="share-link-input"
                                type="text"
                                value={shareUrl}
                                readOnly
                            />
                            <CopyButton
                                className={copied ? 'copied' : ''}
                                onClick={handleCopyToClipboard}
                            >
                                {copied ? '완료' : '복사'}
                            </CopyButton>
                        </LinkContainer>
                    </>
                )}

                <ButtonContainer>
                    {error && !loading && (
                        <ActionButton
                            className="cancel"
                            onClick={generateShareUrl}
                        >
                            다시 시도
                        </ActionButton>
                    )}
                </ButtonContainer>
            </ModalContainer>
        </ModalOverlay>
    );
};

export default ShareModal;
