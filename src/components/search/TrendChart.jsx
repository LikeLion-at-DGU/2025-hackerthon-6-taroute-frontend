import { useState } from "react";
import styled from "styled-components";
import rotateLeft from "../../assets/icons/rotateLeft.svg";


const TrendChartContainer = styled.div`
    display: flex;
    flex-direction: column;
    background-color: #F0F0F0;
    border-radius: 5px;
    width: 343px;
    height: 193px;
    padding: 10px;
`;

const Standard = styled.div`
    display: flex;
    align-items: center;
    gap: 4px;
    color: #8A8A8A; 
    font-size: 11px;
    padding-left: 4px;
    width: 100%;
    padding-bottom: 10px;
    border-bottom: 1px solid white;
    p{
        margin: 0;
    }
`;

const RankingContainer = styled.div`
    display: flex;
    justify-content: space-around;
    margin-top: 10px;
`;

const Ranking = styled.div`
    display: flex;
    flex-direction: column;
    font-size: 13px;
    align-items: flex-start;
    width: 147px;
    margin-left: 20px;
`;


const rankingList = [
    "서브웨이", "홍콩반점", "스타벅스", "롯데리아", "이디야커피",
    "CGV", "노랑통닭", "투썸플레이스", "파리바게뜨", "GS25"
];

const TrendChart = () => {
    const getFormattedDate = () => {
        const currentDate = new Date();
        const month = currentDate.getMonth() + 1;
        const day = currentDate.getDate();
        const hours = currentDate.getHours();
        const minutes = currentDate.getMinutes();
        return `${String(month).padStart(2, '0')}월 ${String(day).padStart(2, '0')}일 ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    };

    const [formattedDate, setFormattedDate] = useState(getFormattedDate);

    const handleRefresh = () => {
        setFormattedDate(getFormattedDate());
    };

    return (
        <TrendChartContainer>
            <Standard>
                <p style={{margin:'0'}}>{formattedDate} 기준</p>
                <img
                    src={rotateLeft}
                    alt="새로고침"
                    style={{ cursor: "pointer" }}
                    onClick={handleRefresh}
                />
            </Standard>
            <RankingContainer>
                <Ranking>
                    {rankingList.slice(0, 5).map((place, idx) => (
                        <div key={place} style={{ display: 'flex', alignItems: 'center', gap: 15, marginBottom: 8 }}>
                            <span style={{ fontWeight: 700, color: '#271932', width: 18 }}>{idx + 1}</span>
                            <span style={{ color: '#363636' }}>{place}</span>
                        </div>
                    ))}
                </Ranking>
                <Ranking>
                    {rankingList.slice(5, 10).map((place, idx) => (
                        <div key={place} style={{ display: 'flex', alignItems: 'center', gap: 15, marginBottom: 8 }}>
                            <span style={{ fontWeight: 700, color: '#271932', width: 18 }}>{idx + 6}</span>
                            <span style={{ color: '#363636' }}>{place}</span>
                        </div>
                    ))}
                </Ranking>
            </RankingContainer>
        </TrendChartContainer>
    );
};

export default TrendChart;