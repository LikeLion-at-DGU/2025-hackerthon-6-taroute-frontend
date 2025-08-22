import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getSearchPlace } from "../apis/searchApi";
import { useSelectedLocation } from "../hooks/useSelectedLocation";
import styled from "styled-components";
import PlaceCard from "../components/common/PlaceCards";
import noresult from "../assets/icons/noresult.png";
import PageNavbar from "../components/common/PageNavbar";
import SearchBar from "../components/common/SearchBar";
import RecommendPlace from "../components/search/RecommendPlace";
import { SortBar } from "../components/search/SortBar";

const SearchContainer = styled.div`
    display: flex;
    flex-direction: column;
    background-color: white;
    width: 100%;
    height: 812px;
    align-items: center;
`;

const ResultsContainer = styled.div`
    display: flex;
    flex-direction: row;
    gap: 16px;
    overflow-x: auto;
    width: 343px;          // 카드 컨테이너 너비 고정
    padding: 10px 0;
    margin-top: 5px;
    scrollbar-width: thin;
    scrollbar-color: #a18ae6 #f0f0f0;
`;

const NoResultContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 50px;
    gap: 10px;
    h3{
        color: #2A2A2A;
        font-weight: 600;
        font-size: 24px;
    }
`;


export default function SearchResults() {
    const [params] = useSearchParams();
    const initialQ = (params.get("q") || "").trim();

    const [q, setQ] = useState(initialQ);
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);
    const [sortType, setSortType] = useState("정확도순"); // 정렬 기준 상태 추가

    // 사용자 선택 위치 정보 훅 사용
    const { location: selectedLocation } = useSelectedLocation();

    // 정렬 기준에 따른 API 파라미터 생성
    const getSearchParams = (sortType) => {
        const baseParams = {
            q,
            x: selectedLocation.x,
            y: selectedLocation.y,
            sortType
        };

        switch (sortType) {
            case "정확도순":
                return {
                    ...baseParams,
                    rankPreference: "RELEVANCE"
                };
            case "거리순":
                return {
                    ...baseParams,
                    rankPreference: "DISTANCE"
                };
            case "가격낮은순":
                return {
                    ...baseParams,
                    rankPreference: "RELEVANCE",
                    priceLevel: "PRICE_LEVEL_INEXPENSIVE"
                };
            case "가격높은순":
                return {
                    ...baseParams,
                    rankPreference: "RELEVANCE",
                    priceLevel: "PRICE_LEVEL_MODERATE"
                };
            case "후기순":
            case "인기순":
            default:
                return {
                    ...baseParams,
                    rankPreference: "RELEVANCE"
                };
        }
    };

    // 검색 실행 함수
    const performSearch = async (currentSortType = sortType) => {
        if (!q || !selectedLocation?.x || !selectedLocation?.y) {
            console.log('⚠️ 검색 조건이 불충족:', { q, selectedLocation });
            return;
        }

        setLoading(true);
        console.log('🌐 검색 API 호출:', { q, sortType: currentSortType });

        try {
            const searchParams = getSearchParams(currentSortType);
            const data = await getSearchPlace(searchParams);
            
            console.log("✅ 검색 API 응답:", data);
            
            const arr = Array.isArray(data.google_place) ? data.google_place :
                       Array.isArray(data.results) ? data.results :
                       Array.isArray(data.items) ? data.items :
                       Array.isArray(data) ? data : [];
            
            console.log('📋 처리된 검색 결과:', { sortType: currentSortType, count: arr.length });
            setRows(arr);
        } catch (error) {
            console.error('❌ 검색 API 에러:', error);
            setRows([]);
        } finally {
            setLoading(false);
        }
    };
    const handleSubmit = () => {
        performSearch();
    };

    // 정렬 기준 변경 핸들러
    const handleSortChange = (newSortType) => {
        setSortType(newSortType);
        performSearch(newSortType); // 즉시 새로운 정렬로 검색
    };

    useEffect(() => {
        // 초기 검색 실행
        performSearch();
    }, [initialQ, selectedLocation?.x, selectedLocation?.y]); // sortType은 제외 (별도 핸들러에서 처리)

    return (
        <SearchContainer>
            <PageNavbar title="검색결과" />
            <SearchBar
                value={q}
                onChange={setQ}
                onSubmit={handleSubmit}
                onKeyDown={(e) => {
                    if (e.key === "Enter") handleSubmit();
                }}
                autoFocus
                bordered borderColor="#363636" borderWidth="0.5px"
            />
            {!loading && rows.length > 0 && <SortBar onSortChange={handleSortChange} selectedSort={sortType} />}
            {loading && <div>로딩중...</div>}
            {!loading && rows.length === 0 &&
                <NoResultContainer>
                    <img src={noresult} style={{ width: "126px"}} />
                    <h3>검색 결과가 없습니다.</h3>
                </NoResultContainer>}
            <ResultsContainer>
                {rows.map((place, idx) => (
                    <PlaceCard
                        key={place.place_id || place.id || idx}
                        place={{
                            id: place.place_id || place.id || idx,
                            place_name: place.place_name || place.name || "",
                            name: place.place_name || place.name || "",
                            address: place.address || "",
                            address_name: place.address || "",
                            location: place.location || null, // 좌표 객체를 그대로 전달
                            x: place.x, // API 응답의 x 좌표 추가
                            y: place.y, // API 응답의 y 좌표 추가
                            image: place.image || "", // 이미지가 없으면 기본 이미지 처리됨
                            place_photos: place.place_photos || [], // ✅ Google Places API 이미지 배열 추가!
                            category: place.category || "restaurant", // 기본값
                        }}
                        userLocation={selectedLocation ? {
                            latitude: selectedLocation.y,
                            longitude: selectedLocation.x
                        } : null}
                    />
                ))}
            </ResultsContainer>
            <RecommendPlace />
        </SearchContainer>
    );
}


