import styled from 'styled-components';
import { useState, useEffect } from 'react';
import clockIcon from '../../assets/icons/time.svg';
import heartIcon from '../../assets/icons/Heart.svg';
import blackHeartIcon from '../../assets/icons/BlackHeart.svg';
import { useSavedPlaceContext } from '../../contexts/SavedPlaceContext';
import runningArrow from '../../assets/icons/arrow-down.svg';
import placeNoImage from '../../assets/icons/placeNoImage.png';

const SavedPlaceItem = styled.div`
    display: flex;
    padding: 12px;
    gap: 12px;
    align-items: center;
`;

const PlaceImage = styled.div`
    width: 80px;
    height: 80px;
    border-radius: 10px;
    background-image: url(${props => props.$src});
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
`;

const NoImagePlaceholder = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    color: #2A2A2A;
    font-size: 10px;
    font-weight: 400;
    text-align: center;
    gap: 4px;
    border: 1px solid #8A8A8A;
    border-radius: 10px;
    
    // 이미지가 있을 때는 숨김
    ${props => props.$hasImage && 'display: none;'}
`;

const PlaceInfo = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 0; // flexbox에서 텍스트 오버플로우 방지
`;

const PlaceName = styled.h3`
    font-size: 14px;
    font-weight: 600;
    color: #2A2A2A;
    margin: 0;
    line-height: 1.2;
`;

const PlaceAddress = styled.p`
    font-size: 11px;
    color: #666;
    margin: 0 0 5px 0;
    line-height: 1.2;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

const RunningTimeContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 4px;
    margin-top: 2px;
    cursor: pointer;
    
    &:hover {
        opacity: 0.7;
    }
`;

const RunningTime = styled.p`
    font-size: 11px;
    color: #2A2A2A;
    font-weight: 400;
    margin: 0;
    line-height: 1.2;
`;

const LeftSection = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 8px;
    flex-shrink: 0;
`;

// 영업시간 모달 관련 스타일
const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 2000;
`;

const ModalContainer = styled.div`
    background: #F0F0F0;
    border-radius: 12px;
    padding: 12px 14px 14px 14px;
    width: 253px;
    height: 125px;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 2001;
`;


const TimeList = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1px 12px;
    margin-bottom: 8px;
`;

const TimeItem = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1px 0;
`;

const DayLabel = styled.span`
    font-size: 11px;
    font-weight: 500;
    color: #374151;
    min-width: 24px;
`;

const TimeText = styled.span`
    font-size: 11px;
    font-weight: 300;
    color: ${props => props.$isHoliday ? '#F03F40' : '#6B7280'};
    text-align: right;
`;

const BreakTimeSection = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
`;

const BreakTimeLabel = styled.span`
    font-size: 11px;
    font-weight: 500;
    color: #F03F40;
`;

const BreakTimeText = styled.span`
    font-size: 11px;
    color: #6B7280;
`;

const SavedPlaceListItem = ({ place, selectedDate, onRemove }) => {
    const { removePlace } = useSavedPlaceContext();
    const [showTimeModal, setShowTimeModal] = useState(false);

    // 선택된 날짜의 요일 계산 (0: 일요일, 1: 월요일, ...)
    const selectedDay = selectedDate ? selectedDate.getDay() : new Date().getDay();

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

    // 이미지 URL 처리 - place_photos 배열의 첫 번째 이미지 또는 image 필드 사용
    const imageUrl = place.place_photos?.[0] || place.image || '/default-place.jpg';

    const handleRemoveClick = () => {
        // 먼저 토스트 콜백 호출 (복구를 위해 장소 정보 전달)
        if (onRemove) {
            onRemove(place);
        }

        // 그 다음 실제 제거 실행 - place 객체 전체를 전달
        removePlace(place);
    };

    // 영업시간 모달 열기
    const handleTimeClick = () => {
        setShowTimeModal(true);
        
        // 키보드 이벤트 리스너 추가
        document.addEventListener('keydown', handleKeyDown);
    };

    // 영업시간 모달 닫기 - 오버레이 클릭이나 ESC 키
    const handleCloseModal = (e) => {
        // 모달 컨테이너 클릭은 무시
        if (e.target.closest('[data-modal-container]')) {
            return;
        }
        setShowTimeModal(false);
    };

    // ESC 키로 모달 닫기
    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            setShowTimeModal(false);
        }
    };

    // 요일 라벨 배열
    const dayLabels = ['일', '월', '화', '수', '목', '금', '토'];

    // 영업시간 데이터 정리
    const getRunningTimeData = () => {
        if (!place.running_time || !Array.isArray(place.running_time)) {
            return Array(7).fill('정보없음');
        }
        
        return place.running_time.map(time => {
            if (!time || time === '정보없음') {
                return '정보없음';
            }
            
            // "일요일 휴무일" 형태에서 "휴무일"만 추출
            if (time.includes('휴무일')) {
                return '휴무일';
            }
            
            // "월요일 10:30-22:30" 형태에서 시간 부분만 추출
            const timeMatch = time.match(/\d{1,2}:\d{2}-\d{1,2}:\d{2}/);
            return timeMatch ? timeMatch[0] : time;
        });
    };

    // 휴무일인지 확인하는 함수
    const isHoliday = (timeText) => {
        return timeText === '휴무일';
    };

    // 쉬는시간 데이터 API에서 추출
    const getBreakTime = () => {
        if (!place.running_time || !Array.isArray(place.running_time)) {
            return '정보없음';
        }
        
        // "쉬는 시간 매일 14:50-17:00" 형태의 데이터 찾기
        const breakTimeEntry = place.running_time.find(time => 
            time && time.includes('쉬는 시간')
        );
        
        if (breakTimeEntry) {
            // "쉬는 시간 매일 14:50-17:00"에서 시간 부분만 추출
            const timeMatch = breakTimeEntry.match(/\d{1,2}:\d{2}-\d{1,2}:\d{2}/);
            return timeMatch ? timeMatch[0] : '정보없음';
        }
        
        return '정보없음';
    };

    // 컴포넌트 언마운트 시 이벤트 리스너 정리
    useEffect(() => {
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    console.log('🖼️ SavedPlaceListItem 렌더링:', {
        placeName: place.place_name || place.name,
        address: place.address || place.address_name || place.location,
        selectedDay: selectedDay,
        todaysRunningTime: todaysRunningTime,
        place_photos_count: place.place_photos?.length || 0,
        finalImageUrl: imageUrl,
        hasRunningTime: !!todaysRunningTime
    });

    return (
        <>
            <SavedPlaceItem>
                <LeftSection>
                    <button onClick={handleRemoveClick}>
                        <img src={blackHeartIcon} alt="찜 해제" />
                    </button>
                </LeftSection>
                <PlaceInfo>
                    <PlaceName>{place.place_name || place.name}</PlaceName>
                    <PlaceAddress>{place.address || place.address_name || place.location}</PlaceAddress>
                    <RunningTimeContainer onClick={handleTimeClick}>
                        <img src={clockIcon} />
                        <RunningTime>
                            {todaysRunningTime || "영업시간 정보 미제공"}
                        </RunningTime>
                        <img src={runningArrow} />
                    </RunningTimeContainer>
                </PlaceInfo>

                <PlaceImage $src={imageUrl && imageUrl !== '/default-place.jpg' ? imageUrl : ''}>
                    <NoImagePlaceholder $hasImage={!!(imageUrl && imageUrl !== '/default-place.jpg' && imageUrl !== '')}>
                        <img src={placeNoImage} />
                        <span>사진 준비중</span>
                    </NoImagePlaceholder>
                </PlaceImage>
            </SavedPlaceItem>

            {/* 영업시간 상세 모달 */}
            {showTimeModal && (
                <>
                    <ModalOverlay onClick={handleCloseModal} />
                    <ModalContainer data-modal-container>
                        <TimeList>
                            {/* 월-목 (왼쪽 열) */}
                            <TimeItem>
                                <DayLabel>월요일</DayLabel>
                                <TimeText $isHoliday={isHoliday(getRunningTimeData()[1])}>
                                    {getRunningTimeData()[1]}
                                </TimeText>
                            </TimeItem>
                            <TimeItem>
                                <DayLabel>금요일</DayLabel>
                                <TimeText $isHoliday={isHoliday(getRunningTimeData()[5])}>
                                    {getRunningTimeData()[5]}
                                </TimeText>
                            </TimeItem>
                            <TimeItem>
                                <DayLabel>화요일</DayLabel>
                                <TimeText $isHoliday={isHoliday(getRunningTimeData()[2])}>
                                    {getRunningTimeData()[2]}
                                </TimeText>
                            </TimeItem>
                            <TimeItem>
                                <DayLabel>토요일</DayLabel>
                                <TimeText $isHoliday={isHoliday(getRunningTimeData()[6])}>
                                    {getRunningTimeData()[6]}
                                </TimeText>
                            </TimeItem>
                            <TimeItem>
                                <DayLabel>수요일</DayLabel>
                                <TimeText $isHoliday={isHoliday(getRunningTimeData()[3])}>
                                    {getRunningTimeData()[3]}
                                </TimeText>
                            </TimeItem>
                            <TimeItem>
                                <DayLabel>일요일</DayLabel>
                                <TimeText $isHoliday={isHoliday(getRunningTimeData()[0])}>
                                    {getRunningTimeData()[0]}
                                </TimeText>
                            </TimeItem>
                            <TimeItem>
                                <DayLabel>목요일</DayLabel>
                                <TimeText $isHoliday={isHoliday(getRunningTimeData()[4])}>
                                    {getRunningTimeData()[4]}
                                </TimeText>
                            </TimeItem>
                        </TimeList>
                        <BreakTimeSection>
                            <BreakTimeLabel>쉬는시간</BreakTimeLabel>
                            <BreakTimeText>{getBreakTime()}</BreakTimeText>
                        </BreakTimeSection>
                    </ModalContainer>
                </>
            )}
        </>
    );
};

export default SavedPlaceListItem;
