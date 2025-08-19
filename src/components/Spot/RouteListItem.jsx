
import styled from "styled-components";
import { useState, useEffect, useRef, useCallback } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { useSavedPlaceContext } from '../../contexts/SavedPlaceContext';
import { showToast } from '../../hooks/common/toast';
import clockIcon from '../../assets/icons/time.svg';
import runningArrow from '../../assets/icons/arrow-down.svg';

const ITEM_TYPE = 'PLACE_ITEM';

const RouteListContainer = styled.div`
    display: flex;
    flex-direction: column;
    position: relative;
    /* 드래그 앤 드롭을 위한 터치 액션 허용 */
    touch-action: none;
    user-select: none;
`;

const SavedPlaceItem = styled.div`
    display: flex;
    padding: 12px;
    gap: 12px;
    align-items: center;
    height: 64px;
    border: 1px solid ${props => {
        if (props.$isDisabled) return '#D1D5DB';
        if (props.$isOver) return '#25213B';
        return '#2A2A2A';
    }};
    margin: 6px 14px;
    border-radius: 10px;
    cursor: ${props => props.$isDragging ? 'grabbing' : 'grab'};
    opacity: ${props => {
        if (props.$isDisabled) return 0.5;
        if (props.$isDragging) return 0.3;
        return 1;
    }};
    transform: ${props => props.$isDragging ? 'scale(1.1)' : 'none'};
    transition: ${props => props.$isDragging ? 'none' : 'all 0.2s ease'};
    background: ${props => {
        if (props.$isDisabled) return 'rgba(156, 163, 175, 0.1)';
        if (props.$isDragging) return 'rgba(37, 33, 59, 0.15)';
        if (props.$isOver) return 'rgba(37, 33, 59, 0.08)';
        return 'transparent';
    }};
    box-shadow: ${props => props.$isDragging ? '0 8px 24px rgba(0, 0, 0, 0.15)' : 'none'};
    z-index: ${props => props.$isDragging ? 1000 : 'auto'};
    position: ${props => props.$isDragging ? 'relative' : 'static'};
    
    &:hover {
        transform: ${props => props.$isDragging ? 'scale(1.1)' : 'scale(1.02)'};
        border-color: ${props => {
            if (props.$isDisabled) return '#D1D5DB';
            if (props.$isDragging) return '#25213B';
            return '#666';
        }};
    }
`;

const PlaceInfo = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0; // flexbox에서 텍스트 오버플로우 방지
`;

const LeftSection = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    flex-shrink: 0;
    width: 32px;
    height: 32px;
`;

const OrderNumber = styled.div`
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: ${props => {
        if (props.$isDisabled) return '#9CA3AF';
        
        // 인덱스별 색상 지정 (1~10번)
        const colors = [
            '#e06d6d', // 1번
            '#e09b6d', // 2번
            '#d9e06d', // 3번
            '#aee06d', // 4번
            '#6de09a', // 5번
            '#6ddfe0', // 6번
            '#6d95e0', // 7번
            '#9a6de0', // 8번
            '#e06ddf', // 9번
            '#e06d95'  // 10번
        ];
        
        return colors[(props.$index - 1) % 10] || '#25213B';
    }};
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 600;
    opacity: ${props => props.$isDisabled ? 0.7 : 1};
`;

const PlaceName = styled.div`
    font-size: 16px;
    font-weight: 600;
    color: ${props => props.$isDisabled ? '#9CA3AF' : '#2A2A2A'};
    word-break: keep-all;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const RunningTimeContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 4px;
    cursor: pointer;
    opacity: ${props => props.$isDisabled ? 0.5 : 1};
    
    &:hover {
        opacity: ${props => props.$isDisabled ? 0.5 : 0.7};
    }
`;

const RunningTime = styled.p`
    font-size: 11px;
    color: ${props => props.$isDisabled ? '#9CA3AF' : '#2A2A2A'};
    font-weight: 400;
    margin: 0;
    line-height: 1.2;
`;

const RightSection = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
`;

const Switch = styled.div`
    width: 40px;
    height: 20px;
    background: ${props => props.$isEnabled ? '#FFC500' : '#8A8A8A'};
    border-radius: 10px;
    position: relative;
    cursor: pointer;
    transition: background 0.3s ease;
    flex-shrink: 0;
    box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.15);
    
    &::after {
        content: '';
        position: absolute;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: white;
        top: 2px;
        left: ${props => props.$isEnabled ? '22px' : '2px'};
        transition: left 0.3s ease;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
    }
`;

// RouteListItem은 Spot 페이지용 저장된 장소 아이템입니다.
const RouteListItem = ({ place, index, arrayIndex, movePlace }) => {
    const ref = useRef(null);
    const { savedPlaces, setSavedPlaces } = useSavedPlaceContext();
    
    // 현재 장소의 활성화 상태 (기본값은 true)
    const isEnabled = place.isEnabled !== false;
    
    // 스위치 상태 토글 핸들러
    const handleToggle = useCallback((e) => {
        e.stopPropagation(); // 이벤트 버블링 방지
        
        // 현재 활성화된 장소의 개수 계산
        const currentEnabledCount = savedPlaces.filter(p => p.isEnabled !== false).length;
        
        // 비활성화 -> 활성화로 변경하려는 경우, 10개 제한 체크
        if (!isEnabled && currentEnabledCount >= 10) {
            showToast('경로는 10개 장소까지만 볼 수 있습니다.');
            return;
        }
        
        const updatedPlaces = savedPlaces.map(p => {
            if ((p.id || p.place_name || p.name) === (place.id || place.place_name || place.name)) {
                return { ...p, isEnabled: p.isEnabled === false ? true : false };
            }
            return p;
        });
        
        setSavedPlaces(updatedPlaces);
        
        // localStorage에도 업데이트
        try {
            localStorage.setItem('favoritePlaces', JSON.stringify(updatedPlaces));
            console.log('📝 스위치 토글로 장소 상태 변경:', updatedPlaces);
        } catch (error) {
            console.error('❌ localStorage 업데이트 실패:', error);
        }
    }, [place, savedPlaces, setSavedPlaces, isEnabled]);

    // 드래그 기능 설정
    const [{ isDragging }, drag, dragPreview] = useDrag({
        type: ITEM_TYPE,
        item: () => ({ index: arrayIndex, place }),
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
        canDrag: true,
        options: {
            dropEffect: 'move',
        },
        end: (item, monitor) => {
            // 드래그 종료 시 애니메이션 효과
            if (!monitor.didDrop()) {
                // 드롭되지 않았을 때의 처리
                console.log('드래그 취소됨');
            }
        },
    });

    // 드롭 기능 설정
    const [{ isOver, canDrop }, drop] = useDrop({
        accept: ITEM_TYPE,
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        }),
        drop: (item, monitor) => {
            console.log('드롭 완료:', item.place.place_name);
        },
        hover: (draggedItem, monitor) => {
            if (!ref.current) {
                return;
            }

            const dragIndex = draggedItem.index;
            const hoverIndex = arrayIndex;

            // 같은 아이템이면 무시
            if (dragIndex === hoverIndex) {
                return;
            }

            // 드래그된 아이템의 위치 정보
            const hoverBoundingRect = ref.current?.getBoundingClientRect();
            const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
            const clientOffset = monitor.getClientOffset();
            
            if (!clientOffset) return;
            
            const hoverClientY = clientOffset.y - hoverBoundingRect.top;

            // 아래로 드래그할 때는 커서가 중간을 넘어야 함
            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                return;
            }

            // 위로 드래그할 때는 커서가 중간을 넘어야 함
            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
                return;
            }

            // 순서 변경 실행
            movePlace(dragIndex, hoverIndex);
            
            // 드래그 아이템의 인덱스 업데이트 (중복 호출 방지)
            draggedItem.index = hoverIndex;
        },
    });

    // ref에 drag와 drop 기능 연결
    drag(drop(ref));
    
    // 빈 div를 드래그 프리뷰로 설정 (기본 브라우저 드래그 이미지 비활성화)
    useEffect(() => {
        dragPreview(document.createElement('div'), {
            captureDraggingState: true,
        });
    }, [dragPreview]);

    // 현재 날짜의 요일 계산 (0: 일요일, 1: 월요일, ...)
    const selectedDay = new Date().getDay();

    // running_time 처리 - 배열이면 요일별 영업시간, 문자열이면 그대로 사용
    let todaysRunningTime = '';
    if (place.running_time) {
        if (Array.isArray(place.running_time)) {
            // 배열인 경우 선택된 요일의 영업시간
            todaysRunningTime = place.running_time[selectedDay] || '';
        } else if (typeof place.running_time === 'string') {
            // 문자열인 경우 ("영업시간 정보 없음" 등)
            todaysRunningTime = place.running_time === '영업시간 정보 없음' ? '' : place.running_time;
        }
    }

    return (
        <RouteListContainer ref={ref}>
            <SavedPlaceItem 
                $isDragging={isDragging} 
                $isOver={isOver && canDrop}
                $isDisabled={!isEnabled}
            >
                {index && (
                    <LeftSection>
                        <OrderNumber $isDisabled={!isEnabled} $index={index}>{index}</OrderNumber>
                    </LeftSection>
                )}
                
                <PlaceInfo>
                    <PlaceName $isDisabled={!isEnabled}>
                        {place.place_name || place.name}
                    </PlaceName>
                    <RunningTimeContainer $isDisabled={!isEnabled}>
                        <img src={clockIcon} style={{ opacity: isEnabled ? 1 : 0.5 }} />
                        <RunningTime $isDisabled={!isEnabled}>
                            {todaysRunningTime || "영업시간 정보 미제공"}
                        </RunningTime>
                    </RunningTimeContainer>
                </PlaceInfo>
                
                <RightSection>
                    <Switch 
                        $isEnabled={isEnabled}
                        onClick={handleToggle}
                    />
                </RightSection>
            </SavedPlaceItem>
            
            {/* 드롭 가능한 영역 표시 */}
            {isOver && canDrop && !isDragging && (
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: '14px',
                    right: '14px',
                    height: '2px',
                    backgroundColor: '#25213B',
                    borderRadius: '1px',
                    zIndex: 1001,
                    boxShadow: '0 0 8px rgba(37, 33, 59, 0.5)',
                }} />
            )}
        </RouteListContainer>
    );
};

export default RouteListItem;