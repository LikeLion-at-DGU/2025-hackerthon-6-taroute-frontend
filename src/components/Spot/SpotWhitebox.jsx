import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useState, useCallback } from "react";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import useSheetDrag from "../../hooks/common/useSheetDrag";
import RouteListItem from "./RouteListItem";
import { useSavedPlaceContext } from "../../contexts/SavedPlaceContext";
import ShareModal from "./ShareModal";
import { useTranslation } from "react-i18next";




const SpotWhiteBoxContainer = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 50;
    display: flex;
    flex-direction: column;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    background-color: white;
    /* 높이는 런타임에서 y에 따라 동적으로 설정됩니다 */
    width: 100%;
    align-items: center;
    box-sizing: border-box;
    box-shadow: 0 -8px 24px rgba(0,0,0,0.12);
    will-change: transform;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    overscroll-behavior: contain;
    margin-top: 60px;
`;

const DragHandle = styled.div`
    position: sticky;
    top: 0;
    z-index: 2;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 8px 0 6px 0;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    touch-action: none; /* 가로/세로 스와이프 충돌 방지 */
    cursor: grab;
    &::before {
        content: "";
        width: 40px;
        height: 4px;
        border-radius: 2px;
        background: #E5E7EB;
    }
    &:active { cursor: grabbing; }
`;
const Title = styled.p`
    font-size: 12px;
    font-weight: 300;
    margin: 10px 0 6px 0;
    padding-left: 18px;
    width: 100%;
    text-align: start;
`;

const SavedPlaceList = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    /* 드래그 앤 드롭을 위한 터치 액션 허용 */
    touch-action: manipulation;
`;

const ButtonContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 20px 16px 100px 16px;
    gap: 12px;
`;

const ActionButton = styled.button`
    width: 100%;
    height: 48px;
    border-radius: 8px;
    border: none;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &.primary {
        background-color: #271932;
        color: white;
        
        &:hover {
            background-color: #1f1428;
        }
        
        &:active {
            background-color: #150e1a;
        }
    }
    
    &.secondary {
        background-color: #f8f9fa;
        color: #2A2A2A;
        border: 1px solid #e9ecef;
        
        &:hover {
            background-color: #e9ecef;
        }
        
        &:active {
            background-color: #dee2e6;
        }
    }
`;

const SpotWhiteBox = ({ expandedTop = 96, collapsedTop = 520 }) => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    // 저장된 장소들을 관리하는 커스텀 훅
    const { savedPlaces, setSavedPlaces } = useSavedPlaceContext();

    // 공유 모달 상태
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [shareData, setShareData] = useState(null);

    // 터치 기능을 위한 백엔드 선택
    const isTouchDevice = 'ontouchstart' in window;
    const dndBackend = isTouchDevice ? TouchBackend : HTML5Backend;
    const backendOptions = isTouchDevice ? {
        enableMouseEvents: true,
        delayTouchStart: 200,
        delayMouseStart: 0,
        touchSlop: 5,
    } : {};

    const {
        y,
        dragging,
        onPointerDown,
        onPointerMove,
        onPointerUp,
        snapTo,
    } = useSheetDrag({ expandedTop, collapsedTop, start: 'collapsed' });

    // 드래그 앤 드롭으로 순서 변경하는 함수
    const movePlace = useCallback((dragIndex, hoverIndex) => {
        const draggedPlace = savedPlaces[dragIndex];
        const newPlaces = [...savedPlaces];
        
        // 드래그된 아이템을 제거
        newPlaces.splice(dragIndex, 1);
        // 새 위치에 삽입
        newPlaces.splice(hoverIndex, 0, draggedPlace);
        
        setSavedPlaces(newPlaces);
        
        // localStorage에도 변경된 순서 저장
        try {
            localStorage.setItem('favoritePlaces', JSON.stringify(newPlaces));
            console.log('📝 드래그 앤 드롭으로 순서 변경 후 localStorage 업데이트:', newPlaces);
        } catch (error) {
            console.error('❌ localStorage 업데이트 실패:', error);
        }
    }, [savedPlaces, setSavedPlaces]);

    // 일정 추가하기 버튼 클릭 핸들러
    const handleAddToPlan = () => {
        navigate('/');
    };

    // 공유하기 버튼 클릭 핸들러 
    const handleShare = () => {
        // 활성화된 장소들만 필터링
        const activePlaces = savedPlaces.filter(place => place.isEnabled !== false);
        
        if (activePlaces.length < 2) {
            alert('공유하려면 최소 2개 이상의 장소가 필요합니다.');
            return;
        }

        // 첫 번째와 마지막 장소를 출발지/도착지로 설정
        const startPlace = activePlaces[0];
        const endPlace = activePlaces[activePlaces.length - 1];

        // 공유 데이터 생성 (places 필드 제거)
        const shareData = {
            start: {
                name: startPlace.place_name || startPlace.name || '출발지',
                x: startPlace.x || startPlace.lng || startPlace.longitude,
                y: startPlace.y || startPlace.lat || startPlace.latitude
            },
            end: {
                name: endPlace.place_name || endPlace.name || '도착지', 
                x: endPlace.x || endPlace.lng || endPlace.longitude,
                y: endPlace.y || endPlace.lat || endPlace.latitude
            },
            ui: {
                selected_mode: 'car', // 기본값
                map_theme: 'light',
                show_order_badges: true
            }
        };

        console.log('🔗 공유 데이터 생성:', shareData);
        setShareData(shareData);
        setIsShareModalOpen(true);
    };

    return (
        <DndProvider backend={dndBackend} options={backendOptions}>
            <SpotWhiteBoxContainer
                style={{
                    transform: `translate3d(0, ${y}px, 0)`,
                    height: `${812 - y}px`,
                    transition: dragging ? 'none' : 'transform 240ms cubic-bezier(0.22, 1, 0.36, 1), height 240ms cubic-bezier(0.22, 1, 0.36, 1)'
                }}
            >
                <DragHandle
                    onPointerDown={onPointerDown}
                    onPointerMove={onPointerMove}
                    onPointerUp={onPointerUp}
                    onPointerCancel={onPointerUp}
                />

                <Title>
                    {t("spot.change")}
                </Title>
                <SavedPlaceList>
                    {savedPlaces && savedPlaces.length > 0 ? (
                        (() => {
                            // 활성화된 장소와 비활성화된 장소를 분리
                            const activePlaces = savedPlaces.filter(place => place.isEnabled !== false);
                            const inactivePlaces = savedPlaces.filter(place => place.isEnabled === false);
                            const sortedPlaces = [...activePlaces, ...inactivePlaces];
                            
                            let activeIndex = 1; // 활성화된 장소의 번호 카운터
                            
                            return sortedPlaces.map((place, index) => {
                                const displayIndex = place.isEnabled !== false ? activeIndex++ : null;
                                
                                return (
                                    <RouteListItem
                                        key={place.id || place.place_name || place.name}
                                        place={place}
                                        index={displayIndex}
                                        arrayIndex={savedPlaces.findIndex(p => 
                                            (p.id || p.place_name || p.name) === (place.id || place.place_name || place.name)
                                        )}
                                        movePlace={movePlace}
                                    />
                                );
                            });
                        })()
                    ) : (
                        <div style={{ textAlign: 'center', color: '#8A8A8A', fontSize: 14, padding: '40px 20px' }}>
                            {t("spot.noplace")}<br />
                            {t("spot.pick")}
                        </div>
                    )}
                </SavedPlaceList>

                {/* 활성화된 장소가 있을 때만 버튼 표시 */}
                {savedPlaces && savedPlaces.some(place => place.isEnabled !== false) && (
                    <ButtonContainer>
                        <ActionButton className="primary" onClick={handleAddToPlan}>
                            일정 추가하기
                        </ActionButton>
                        <ActionButton className="secondary" onClick={handleShare}>
                            공유하기
                        </ActionButton>
                    </ButtonContainer>
                )}
            </SpotWhiteBoxContainer>
            
            {/* 공유 모달 */}
            <ShareModal
                isOpen={isShareModalOpen}
                onClose={() => setIsShareModalOpen(false)}
                shareData={shareData}
            />
        </DndProvider>
    );
};

export default SpotWhiteBox;