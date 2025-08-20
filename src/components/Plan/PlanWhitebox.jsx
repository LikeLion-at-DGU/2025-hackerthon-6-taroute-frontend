import styled from "styled-components";
import { useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from 'react-router-dom';
import useSheetDrag from "../../hooks/common/useSheetDrag";
import { useSavedPlaceContext } from "../../contexts/SavedPlaceContext";
import Calendar from "./Calendar";
import SavedPlaceListItem from "./SavedPlaceListItem";
import calendarIcon from '../../assets/icons/calendar.svg';
import arrow from '../../assets/icons/arrowDownGray.svg';
import noImageIcon from '../../assets/icons/placeNoImage.png';

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
    /* 높이는 런타임에서 y에 따라 동적으로 설정 (height: calc(100dvh - y)) */
    width: 100%;
    align-items: center;
    box-sizing: border-box;
    box-shadow: 0 -8px 24px rgba(0,0,0,0.12);
    will-change: transform;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    overscroll-behavior: contain;
    margin-top: 60px;
    padding-bottom: 150px;
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
    border-bottom: 0.5px solid #2d2d2d;
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
    margin-bottom: 100px;
`;

const SavedPlaceList = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
`;

const EmptyMessage = styled.div`
    text-align: center;
    color: #8A8A8A;
    font-size: 14px;
    padding: 40px 20px;
`;

const PlanButton = styled.button`
    position: fixed;
    bottom: -230px; /* 812px 화면 기준으로 하단에서 30px 위 */
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
    z-index: 1000; /* 화이트박스보다 높은 z-index로 항상 위에 표시 */
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

const PlanWhiteBox = ({ expandedTop = 42, collapsedTop = 332 }) => {
    const navigate = useNavigate();
    const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showToast, setShowToast] = useState(false);
    const [removedPlace, setRemovedPlace] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // 저장된 장소들을 관리하는 커스텀 훅
    const { savedPlaces, handleClearAll, addPlace } = useSavedPlaceContext();

    const {
        y,
        dragging,
        onPointerDown,
        onPointerMove,
        onPointerUp,
        snapTo,
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
    const handleConfirmDelete = () => {
        handleClearAll();
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
                    transition: dragging ? 'none' : 'transform 240ms cubic-bezier(0.22, 1, 0.36, 1), height 240ms cubic-bezier(0.22, 1, 0.36, 1)'
                }}
            >
                <DragHandle
                    onPointerDown={onPointerDown}
                    onPointerMove={onPointerMove}
                    onPointerUp={onPointerUp}
                    onPointerCancel={onPointerUp}
                />
                <WhatWonder>
                    <Title>
                        <p>내가 찜한 장소들</p>
                    </Title>

                    <ButtonBar>
                        <CalendarBar onClick={() => setIsCalendarModalOpen(true)}>
                            <img src={calendarIcon} />
                            <p>{formatDate(selectedDate)}</p>
                            <img src={arrow} />
                        </CalendarBar>
                        <p onClick={handleDeleteAllClick} style={{ cursor: 'pointer' }}>전체삭제</p>
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
                                저장된 장소가 없습니다.<br />
                                마음에 드는 장소를 찜해보세요!
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
                    동선 계획하기 ({savedPlaces.length}개 장소)
                </PlanButton>
            )}

            {/* 찜 취소 토스트 메시지 */}
            <ToastMessage $show={showToast}>
                <span>찜이 취소되었습니다</span>
                <UndoButton onClick={handleUndoRemove}>복구</UndoButton>
            </ToastMessage>

            {/* 전체삭제 확인 모달 - body에 Portal로 렌더링 */}
            {showDeleteConfirm && createPortal(
                <ConfirmOverlay onClick={handleCancelDelete}>
                    <ConfirmModal onClick={(e) => e.stopPropagation()}>
                        <ConfirmMessage>
                            찜한 장소를 전체 삭제하시겠습니까?<br />
                            삭제 후에는 취소할 수 없습니다.
                        </ConfirmMessage>
                        <ConfirmButtons>
                            <CancelButton onClick={handleCancelDelete}>
                                취소
                            </CancelButton>
                            <DeleteButton onClick={handleConfirmDelete}>
                                삭제
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