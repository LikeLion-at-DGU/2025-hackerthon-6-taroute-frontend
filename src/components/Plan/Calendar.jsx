import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import calendarIcon from '../../assets/icons/calendar.svg';

// 모달 오버레이 - 화면 전체를 덮음 (매우 높은 z-index)
const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999; /* 매우 높은 z-index로 모든 것을 덮음 */
`;

// 달력 모달
const CalendarModal = styled.div`
    background: #F0F0F0;
    border-radius: 10px;
    padding: 16px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    width: 343px;
    height: fit-content;
`;

// 달력 헤더
const CalendarHeader = styled.div`
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin-bottom: 8px;
`;

const MonthNavButton = styled.button`
    background: none;
    border: none;
    font-size:20px;
    cursor: pointer;
    padding: 5px;
    border-radius: 5px;
    margin: 0;
    color: #8A8A8A;
    
    &:hover {
        background-color: #f0f0f0;
    }
`;

const MonthDisplay = styled.h3`
    margin: 0;
    color: #333;
    font-size: 16px;
    font-weight: 600;
`;

// 요일 헤더
const WeekdaysContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 2px;
`;

const WeekdayLabel = styled.div`
    text-align: center;
    font-size: 12px;
    color: #666;
    font-weight: 800;
    padding: 6px 0;
`;

// 날짜 그리드
const DaysContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 2px;
    margin-bottom: 12px;
`;

const DayButton = styled.button`
    aspect-ratio: 1;
    border: none;
    background: ${props => props.$selected ? '#FFC500' : 'transparent'};
    color: ${props => props.$otherMonth ? '#ccc' : '#333'};
    font-weight: ${props => props.$selected ? '700' : '400'};
    border-radius: 20px;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.2s ease;
    
    &:hover:not(:disabled) {
        background: ${props => props.$selected ? '#FFC500' : '#f0f0f0'};
    }
    
    &:disabled {
        cursor: not-allowed;
        opacity: 0.3;
    }
`;

// 버튼 컨테이너
const ButtonContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 6px;
    p{
        font-size: 14px;
        font-weight: 700;
        margin: 0;
    }
`;

const ConfirmButton = styled.button`
    padding: 6px 16px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 400;
    transition: background-color 0.2s ease;
    height: fit-content;
    text-align: center;
    background: #25213B;
    color: white;
    
    &:hover {
        background: #FFC500;
    }
    
    &:disabled {
        background: #ccc;
        cursor: not-allowed;
    }
`;


const Calendar = ({ isModalOpen, onModalClose, selectedDate, onDateSelect }) => {
    const [displayDate, setDisplayDate] = useState(new Date()); // 달력에서 보여줄 년월
    const [tempSelectedDate, setTempSelectedDate] = useState(selectedDate); // 임시 선택된 날짜
    
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];

    // 모달이 열릴 때마다 displayDate와 tempSelectedDate 초기화
    useEffect(() => {
        if (isModalOpen) {
            setDisplayDate(selectedDate || new Date());
            setTempSelectedDate(selectedDate);
        }
    }, [isModalOpen, selectedDate]);
    
    // 달력에서 보여줄 날짜들 생성
    const generateCalendarDays = () => {
        const year = displayDate.getFullYear();
        const month = displayDate.getMonth();
        
        // 이번 달 첫째 날과 마지막 날
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        
        // 첫째 날의 요일 (0: 일요일)
        const firstDayOfWeek = firstDay.getDay();
        
        // 마지막 날의 날짜
        const lastDate = lastDay.getDate();
        
        const days = [];
        
        // 이전 달의 날짜들로 빈 칸 채우기
        const prevMonth = new Date(year, month - 1, 0);
        for (let i = firstDayOfWeek - 1; i >= 0; i--) {
            const date = new Date(year, month - 1, prevMonth.getDate() - i);
            days.push({ date, isOtherMonth: true });
        }
        
        // 이번 달의 날짜들
        for (let day = 1; day <= lastDate; day++) {
            const date = new Date(year, month, day);
            days.push({ date, isOtherMonth: false });
        }
        
        // 다음 달의 날짜들로 나머지 칸 채우기
        const remainingDays = 42 - days.length; // 6주 * 7일 = 42
        for (let day = 1; day <= remainingDays; day++) {
            const date = new Date(year, month + 1, day);
            days.push({ date, isOtherMonth: true });
        }
        
        return days;
    };
    
    // 이전 달로 이동
    const goToPrevMonth = () => {
        setDisplayDate(new Date(displayDate.getFullYear(), displayDate.getMonth() - 1, 1));
    };
    
    // 다음 달로 이동
    const goToNextMonth = () => {
        setDisplayDate(new Date(displayDate.getFullYear(), displayDate.getMonth() + 1, 1));
    };
    
    // 날짜 선택
    const handleDateSelect = (date) => {
        setTempSelectedDate(date);
    };
    
    // 달력 닫기
    const closeModal = () => {
        setTempSelectedDate(selectedDate); // 선택을 취소하면 기존 선택으로 되돌림
        onModalClose();
    };
    
    // 선택 완료
    const confirmSelection = () => {
        onDateSelect(tempSelectedDate);
        onModalClose();
    };
    
    // 오버레이 클릭으로 모달 닫기
    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            closeModal();
        }
    };
    
    // 날짜가 같은지 비교
    const isSameDay = (date1, date2) => {
        if (!date1 || !date2) return false;
        return date1.toDateString() === date2.toDateString();
    };
    
    const calendarDays = generateCalendarDays();
    
    // 모달이 열려있지 않으면 아무것도 렌더링하지 않음
    if (!isModalOpen) return null;
    
    // React Portal을 사용하여 body 직하위에 렌더링
    return createPortal(
        <ModalOverlay onClick={handleOverlayClick}>
            <CalendarModal>
                <CalendarHeader>
                    <MonthNavButton onClick={goToPrevMonth}>‹</MonthNavButton>
                    <MonthDisplay>
                        {displayDate.getMonth() + 1}월
                    </MonthDisplay>
                    <MonthNavButton onClick={goToNextMonth}>›</MonthNavButton>
                </CalendarHeader>
                
                <WeekdaysContainer>
                    {weekdays.map(day => (
                        <WeekdayLabel key={day}>{day}</WeekdayLabel>
                    ))}
                </WeekdaysContainer>
                
                <DaysContainer>
                    {calendarDays.map(({ date, isOtherMonth }, index) => (
                        <DayButton
                            key={index}
                            $selected={isSameDay(date, tempSelectedDate)}
                            $otherMonth={isOtherMonth}
                            onClick={() => handleDateSelect(date)}
                        >
                            {date.getDate()}
                        </DayButton>
                    ))}
                </DaysContainer>
                
                <ButtonContainer>
                    <p>계획할 날짜를 선택해주세요</p>
                    <ConfirmButton 
                        onClick={confirmSelection}
                        disabled={!tempSelectedDate}
                    >    선택완료
                    </ConfirmButton>
                </ButtonContainer>
            </CalendarModal>
        </ModalOverlay>,
        document.body
    );
};

export default Calendar;