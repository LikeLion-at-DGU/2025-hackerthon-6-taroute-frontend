import styled from "styled-components";
import { useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from 'react-router-dom';
import useSheetDrag from "../../hooks/common/useSheetDrag";
import { useSavedPlaceContext } from "../../contexts/SavedPlaceContext";
import { unsavePlaceFromServer } from "../../apis/savePlaceApi";
import Calendar from "./Calendar";
import SavedPlaceListItem from "./SavedPlaceListItem";
import calendarIcon from '../../assets/icons/calendar.svg';
import arrow from '../../assets/icons/arrowDownGray.svg';
import noImageIcon from '../../assets/icons/placeNoImage.png';
import { useTranslation } from "react-i18next";

const WhiteBoxContainer = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 50;
    display: flex;
    flex-direction: column;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    background: linear-gradient(90deg, #EBF3FF 0%, #F5F8FF 80%);
    width: 100%;
    align-items: center;
    box-sizing: border-box;
    box-shadow: 0 -8px 24px rgba(0,0,0,0.12);
    will-change: transform;
    overflow-y: auto;
    overflow-x: hidden;
    max-width: 375px;
    margin: 0 auto;
    /* 812px 프레임 기준으로 최대 높이 제한 */
    max-height: 712px;
    &::-webkit-scrollbar {
        display: none;
    }

    scrollbar-width: none; 
    -ms-overflow-style: none;
`;

const DragHandle = styled.div`
    position: sticky;
    top: 0;
    z-index: 2;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 12px 0 8px 0;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    touch-action: none; /* 브라우저 기본 터치 동작 방지 */
    user-select: none; /* 텍스트 선택 방지 */
    cursor: grab;
    transition: opacity 0.2s ease;
    
    &::before {
        content: "";
        width: 40px;
        height: 4px;
        border-radius: 2px;
        background: #E5E7EB;
        transition: all 0.2s ease;
    }
    
    &:hover::before {
        background: #9CA3AF;
        height: 5px;
    }
    
    &:active { 
        cursor: grabbing; 
        opacity: 0.7;
    }
    
    /* 모바일에서 더 큰 터치 영역 */
    @media (max-width: 768px) {
        padding: 16px 0 12px 0;
        
        &::before {
            width: 48px;
            height: 5px;
        }
    }
`;

const WhatWonder = styled.div`
    display: flex;
    flex-direction: column;
`;

const Title = styled.div`
    display: flex;
    color: #2A2A2A;
    align-items: center;
    font-weight: 500;
    font-size: 20px;
    gap: 15px;
    padding: 0px 10px 6px 2px;
    width: 343px;
    /* 기본 마진 리셋: p의 위아래 마진이 간격을 왜곡하지 않게 */
    & > p { margin: 0; }
     /* 이미지의 베이스라인 여백 제거 */
    & > img { display: block; }
    border-bottom: 0.5px solid #8A8A8A;
`;


const CalendarBar = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    color: #8A8A8A;
    cursor: pointer;
    padding: 15px 0;
    border-radius: 8px;
    transition: background-color 0.2s ease;
    
    p {
        margin: 0;
        font-size: 14px;
        font-weight: 600;
    }
`;

const ButtonBar = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 343px;
    color: #2A2A2A;
    font-weight: 500;
    margin: 0;
    padding: 0;
`;

const SavedPlaceContainer = styled.div`
    width: 343px;
    padding-bottom: 150px;
`;

const SavedPlaceList = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    padding-bottom: 70px;
`;

const EmptyMessage = styled.div`
    text-align: center;
    color: #8A8A8A;
    font-size: 14px;
    padding: 40px 20px;
`;

const PlanButton = styled.button`
    position: fixed;
    bottom: -230px; 
    left: 50%;
    transform: translateX(-50%);
    width: 349px;
    height: 51px;
    background: #25213B;
    border: none;
    border-radius: 12px;
    color: white;
    font-size: 18px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 50;
`;

const ToastMessage = styled.div`
    position: fixed;
    bottom: -150px; /* 동선계획하기 버튼 위쪽에 위치 */
    left: 50%;
    transform: translateX(-50%);
    width: 272px;
    padding: 12px 16px;
    background: #2D3748;
    border-radius: 8px;
    color: white;
    font-size: 16px;
    font-weight: 400;
    display: flex;
    align-items: center;
    justify-content: space-around;
    z-index: 1001; /* 버튼보다 위에 표시 */
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    
    transition: all 0.3s ease;
    opacity: ${props => props.$show ? 1 : 0};
    transform: translateX(-50%) translateY(${props => props.$show ? '0' : '10px'});
    pointer-events: ${props => props.$show ? 'auto' : 'none'};
`;

const UndoButton = styled.button`
    background: none;
    border: none;
    color: #FFC500;
    font-size: 14px;
    font-weight: 400;
    cursor: pointer;
    padding: 0;
    text-decoration: underline;
`;

// 전체삭제 확인 모달 스타일
const ConfirmOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.766);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    width: 100vw;
    height: 100vh;
`;

const ConfirmModal = styled.div`
    background: white;
    border-radius: 16px;
    padding: 24px;
    width: 300px;
    max-width: calc(100vw - 40px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
`;

const ConfirmMessage = styled.p`
    font-size: 17px;
    color: #2A2A2A;
    margin: 0 0 15px 0;
    line-height: 1.5;
`;

const ConfirmButtons = styled.div`
    display: flex;
    gap: 12px;
    justify-content: flex-end;
`;

const CancelButton = styled.button`
    color: #8A8A8A;
    border: none;
    border-radius: 8px;
    padding: 5px 10px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    background: none;
    :hover{
        background: #d0d0d0;
    }
`;

const DeleteButton = styled.button`
    color: #25213B;
    background: none;
    border: none;
    border-radius: 8px;
    padding: 5px 10px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    :hover{
        background: #d0d0d0;
    }
`;

const PlanWhiteBox = ({ expandedTop = 105, collapsedTop = 390 }) => {
    const navigate = useNavigate();
    const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showToast, setShowToast] = useState(false);
    const [removedPlace, setRemovedPlace] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const { t } = useTranslation();


    // 저장된 장소들을 관리하는 커스텀 훅
    const { savedPlaces, handleClearAll, addPlace } = useSavedPlaceContext();

    const {
        y,
        dragging,
        onPointerDown,
    } = useSheetDrag({ expandedTop, collapsedTop, start: 'collapsed' });

    // 날짜 포맷팅 (YYYY-MM-DD)
    const formatDate = (date) => {
        if (!date) return '현재날짜';
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // 화이트박스가 확장된 상태인지 확인 (y값이 expandedTop에 가까우면 확장된 상태)
    const isExpanded = y <= expandedTop + 50; // 50px 여유값

    // 동선 계획하기 버튼 클릭 핸들러
    const handlePlanRoute = () => {
        if (savedPlaces.length === 0) {
            alert('저장된 장소가 없습니다. 장소를 먼저 찜해주세요!');
            return;
        }
        // TODO: 동선 계획 페이지로 이동하거나 모달 열기
        navigate('/spot');
    };

    // 찜 취소 토스트 표시 함수
    const showUndoToast = (place) => {        
        setRemovedPlace(place);
        setShowToast(true);

        // 3초 후 자동으로 토스트 숨기기
        setTimeout(() => {
            setShowToast(false);
            setRemovedPlace(null);
        }, 3000);
    };

    // 복구하기 버튼 클릭 핸들러
    const handleUndoRemove = () => {
        
        if (removedPlace) {          
            addPlace(removedPlace);
            setShowToast(false);
            setRemovedPlace(null);
        } else {
            console.log('❌ removedPlace가 null이어서 복구할 수 없음');
        }
    };

    // 전체삭제 확인 모달 열기
    const handleDeleteAllClick = () => {
        if (savedPlaces.length > 0) {
            setShowDeleteConfirm(true);
        }
    };

    // 전체삭제 확인
    const handleConfirmDelete = async () => {
        try {
            // 저장된 모든 장소의 ID들을 수집
            const placeIds = savedPlaces
                .map(place => place.id || place.place_id)
                .filter(Boolean); // null/undefined 제거
            
            if (placeIds.length > 0) {
                // 각 장소를 개별적으로 서버에서 삭제
                const deletePromises = placeIds.map(placeId => 
                    unsavePlaceFromServer(placeId).catch(error => {
                        console.error(`❌ 장소 ${placeId} 삭제 실패:`, error);
                        return null; // 개별 실패는 무시하고 계속 진행
                    })
                );
                
                await Promise.all(deletePromises);
                console.log('🗑️ 전체 삭제 완료:', placeIds);
            }
            
            // 로컬 상태도 초기화
            handleClearAll();
        } catch (error) {
            console.error('❌ 전체 삭제 중 오류:', error);
            // 서버 요청이 실패해도 로컬은 초기화
            handleClearAll();
        }
        
        setShowDeleteConfirm(false);
    };

    // 전체삭제 취소
    const handleCancelDelete = () => {
        setShowDeleteConfirm(false);
    };

    return (
        <>
            <WhiteBoxContainer
                data-whitebox-container
                style={{
                    transform: `translate3d(0, ${y}px, 0)`,
                    height: `calc(100dvh - ${y}px)`,
                    transition: dragging ? 'none' : 'transform 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94), height 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                }}
            >
                <DragHandle
                    onPointerDown={onPointerDown}
                    onTouchStart={onPointerDown}
                />
                <WhatWonder>
                    <Title>
                        <p>{t("plan.pick")}</p>
                    </Title>

                    <ButtonBar>
                        <CalendarBar onClick={() => setIsCalendarModalOpen(true)}>
                            <img src={calendarIcon} />
                            <p>{formatDate(selectedDate)}</p>
                            <img src={arrow} />
                        </CalendarBar>
                        <p onClick={handleDeleteAllClick} style={{ cursor: 'pointer' }}>{t("plan.deleteall")}</p>
                    </ButtonBar>

                    {/* 저장된 장소들 표시 */}
                    <SavedPlaceContainer>
                        {savedPlaces.length > 0 ? (
                            <SavedPlaceList>
                                {savedPlaces.map((place) => (
                                    <SavedPlaceListItem
                                        key={place.id}
                                        place={place}
                                        selectedDate={selectedDate}
                                        onRemove={showUndoToast}
                                    />
                                ))}
                            </SavedPlaceList>
                        ) : (
                            <EmptyMessage>
                                {t("spot.noplace")}<br />
                                {t("spot.noplace")}
                            </EmptyMessage>
                        )}
                    </SavedPlaceContainer>

                </WhatWonder>

                {/* Calendar Modal - body에 Portal로 렌더링 */}
                <Calendar
                    isModalOpen={isCalendarModalOpen}
                    onModalClose={() => setIsCalendarModalOpen(false)}
                    selectedDate={selectedDate}
                    onDateSelect={setSelectedDate}
                />
            </WhiteBoxContainer>

            {/* 동선 계획하기 버튼 - 화이트박스와 독립적으로 화면에 고정 */}
            {isExpanded && savedPlaces.length > 0 && (
                <PlanButton onClick={handlePlanRoute}>
                    {t("plan.goplan")}({savedPlaces.length}{t("plan.count")})
                </PlanButton>
            )}

            {/* 찜 취소 토스트 메시지 */}
            <ToastMessage $show={showToast}>
                <span>{t("plan.cancle")}</span>
                <UndoButton onClick={handleUndoRemove}>{t("plan.recancle")}</UndoButton>
            </ToastMessage>

            {/* 전체삭제 확인 모달 - body에 Portal로 렌더링 */}
            {showDeleteConfirm && createPortal(
                <ConfirmOverlay onClick={handleCancelDelete}>
                    <ConfirmModal onClick={(e) => e.stopPropagation()}>
                        <ConfirmMessage>
                            {t("plan.deletetext")}<br />
                            {t("plan.deletetext2")}
                        </ConfirmMessage>
                        <ConfirmButtons>
                            <CancelButton onClick={handleCancelDelete}>
                                {t("plan.return")}
                            </CancelButton>
                            <DeleteButton onClick={handleConfirmDelete}>
                                {t("plan.delete")}
                            </DeleteButton>
                        </ConfirmButtons>
                    </ConfirmModal>
                </ConfirmOverlay>,
                document.body
            )}
        </>
    );
};

export default PlanWhiteBox;