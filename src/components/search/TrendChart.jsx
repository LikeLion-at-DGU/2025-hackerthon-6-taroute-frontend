import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelectedLocation } from "../../hooks/useSelectedLocation";
import { searchWikiPlaces } from "../../apis/wikiApi";
import styled from "styled-components";
import rotateLeft from "../../assets/icons/rotateLeft.svg";
import { getTop10Keyword } from "../../apis/searchApi";


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
`;

const Keyword = styled.span`
    color: #363636;
    display: inline-block;
    max-width: 120px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: pointer;
`;


const TrendChart = () => {
    const [rankingList, setRankingList] = useState([
        "서브웨이", "홍콩반점", "스타벅스", "롯데리아", "이디야커피",
        "CGV", "노랑통닭", "투썸플레이스", "파리바게뜨", "GS25"
    ]); // 기본값으로 더미 데이터 사용
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { location: selectedLocation } = useSelectedLocation();

    const getFormattedDate = () => {
        const currentDate = new Date();
        const month = currentDate.getMonth() + 1;
        const day = currentDate.getDate();
        const hours = currentDate.getHours();
        const minutes = currentDate.getMinutes();
        return `${String(month).padStart(2, '0')}월 ${String(day).padStart(2, '0')}일 ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    };

    const [formattedDate, setFormattedDate] = useState(getFormattedDate);

    // Top 10 키워드 데이터 로드
    const loadTop10Keywords = async () => {
        try {
            setLoading(true);
            const response = await getTop10Keyword();
            console.log('🔥 Top 10 키워드 API 응답:', response);
            
            // API 응답 구조에 맞게 데이터 추출
            let keywords = [];
            if (response && Array.isArray(response.top10_keywords)) {
                keywords = response.top10_keywords;
            } else if (response && Array.isArray(response.data)) {
                keywords = response.data;
            } else if (Array.isArray(response)) {
                keywords = response;
            }
            
            // 각 키워드가 객체인 경우 place_name 값을 추출
            const processedKeywords = keywords.map(keyword => {
                if (typeof keyword === 'object' && keyword !== null) {
                    return keyword.place_name || keyword.keyword || keyword.name || String(keyword);
                }
                return String(keyword);
            });
            
            console.log('🔥 처리된 키워드 목록:', processedKeywords);
            setRankingList(processedKeywords);
            
            // 날짜도 함께 업데이트
            setFormattedDate(getFormattedDate());
        } catch (error) {
            console.error('❌ Top 10 키워드 로딩 실패:', error);
            // 에러 발생 시 기본 더미 데이터 유지
        } finally {
            setLoading(false);
        }
    };

    // 컴포넌트 마운트 시 데이터 로드
    useEffect(() => {
        loadTop10Keywords();
    }, []);

    const handleRefresh = () => {
        loadTop10Keywords(); // 새로고침 시 API 재호출
    };

    const handleKeywordClick = async (keyword) => {
        if (!keyword) return;
        try {
            // 위치 정보가 있으면 바로 위키 검색해서 첫 결과로 이동
            if (selectedLocation?.x && selectedLocation?.y) {
                const results = await searchWikiPlaces({
                    latitude: selectedLocation.y,
                    longitude: selectedLocation.x,
                    place_name: keyword,
                    radius: 20000,
                    rankPreference: 'RELEVANCE',
                });
                const first = Array.isArray(results) && results.length > 0 ? results[0] : null;
                const placeId = first?.place_id || first?.id;
                if (placeId) {
                    navigate(`/wiki/place/${encodeURIComponent(placeId)}`);
                    return;
                }
            }
        } catch (e) {
            // 무시하고 검색 페이지로 폴백
        }
        // 폴백: 위키 검색 페이지로 이동
        navigate(`/wiki/search?q=${encodeURIComponent(keyword)}`);
    };

    return (
        <TrendChartContainer>
            <Standard>
                <p style={{margin:'0'}}>{formattedDate} 기준</p>
                <img
                    src={rotateLeft}
                    alt="새로고침"
                    style={{ cursor: "pointer", opacity: loading ? 0.5 : 1 }}
                    onClick={handleRefresh}
                />
            </Standard>
            <RankingContainer>
                {loading ? (
                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        width: '100%', 
                        color: '#8A8A8A', 
                        fontSize: '12px',
                        height: '120px'
                    }}>
                        인기 키워드 로딩중...
                    </div>
                ) : (
                    <>
                        <Ranking>
                            {rankingList.slice(0, 5).map((place, idx) => (
                                <div key={`left-${idx}`} style={{ display: 'flex', alignItems: 'center', gap: 15, marginBottom: 8 }}>
                                    <span style={{ fontWeight: 700, color: '#271932', width: 18 }}>{idx + 1}</span>
                                    <Keyword title={place} role="button" onClick={() => handleKeywordClick(place)}>{place}</Keyword>
                                </div>
                            ))}
                        </Ranking>
                        <Ranking>
                            {rankingList.slice(5, 10).map((place, idx) => (
                                <div key={`right-${idx}`} style={{ display: 'flex', alignItems: 'center', gap: 15, marginBottom: 8 }}>
                                    <span style={{ fontWeight: 700, color: '#271932', width: 18 }}>{idx + 6}</span>
                                    <Keyword title={place} role="button" onClick={() => handleKeywordClick(place)}>{place}</Keyword>
                                </div>
                            ))}
                        </Ranking>
                    </>
                )}
            </RankingContainer>
        </TrendChartContainer>
    );
};

export default TrendChart;