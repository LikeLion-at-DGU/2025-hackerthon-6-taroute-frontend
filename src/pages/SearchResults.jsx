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

    // 사용자 선택 위치 정보 훅 사용
    const { location: selectedLocation } = useSelectedLocation();

    const handleSubmit = () => {
        
        if (!q) {
            console.log('⚠️ 검색어가 없어서 검색하지 않음');
            return;
        }
        
        if (!selectedLocation?.x || !selectedLocation?.y) {
            console.log('⚠️ 위치 정보가 없어서 검색하지 않음:', selectedLocation);
            return;
        }
        
        // 검색어가 바뀌면 useEffect가 실행되어 자동으로 검색됩니다.
        // 필요하다면 여기서 추가 동작(예: 페이지 이동)도 구현 가능
        setRows([]); // 이전 결과 초기화
        setLoading(true);
        
        console.log('🌐 handleSubmit 검색 API 호출:', { q, x: selectedLocation.x, y: selectedLocation.y });
        getSearchPlace({ q, x: selectedLocation.x, y: selectedLocation.y, radius:2000 })
            .then((data) => {
                console.log("✅ handleSubmit API 응답:", data); // 응답 구조 확인
                // data.results, data.items, data가 배열이 아니면 빈 배열로 처리
                const arr =
                    Array.isArray(data.google_place) ? data.google_place :
                        Array.isArray(data.results) ? data.results :
                            Array.isArray(data.items) ? data.items :
                                Array.isArray(data) ? data : [];
                console.log('📋 handleSubmit 처리된 검색 결과:', arr);
                setRows(arr);
            })
            .catch((error) => {
                console.error('❌ handleSubmit 검색 API 에러:', error);
                setRows([]);
            })
            .finally(() => {
                console.log('🏁 handleSubmit 검색 완료, 로딩 상태 해제');
                setLoading(false);
            });
    };

    useEffect(() => {

        
        if (!q) {
            console.log('⚠️ 검색어가 없어서 검색하지 않음');
            return;
        }
        
        if (!selectedLocation?.x || !selectedLocation?.y) {
            console.log('⚠️ 위치 정보가 없어서 검색하지 않음:', selectedLocation);
            return;
        }
        
        console.log('🌐 검색 API 호출 시작:', { q, x: selectedLocation.x, y: selectedLocation.y });
        setLoading(true);
        
        getSearchPlace({ q, x: selectedLocation.x, y: selectedLocation.y })
            .then((data) => {
                const arr =
                    Array.isArray(data.google_place) ? data.google_place :
                        Array.isArray(data.results) ? data.results :
                            Array.isArray(data.items) ? data.items :
                                Array.isArray(data) ? data : [];
                setRows(arr);
            })
            .catch((error) => {
                console.error('❌ 검색 API 에러:', error);
                setRows([]);
            })
            .finally(() => {
                console.log('🏁 검색 완료, 로딩 상태 해제');
                setLoading(false);
            });
    }, [initialQ, selectedLocation?.x, selectedLocation?.y]); // 위치 좌표가 변경되면 재검색

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
            {!loading && rows.length > 0 && <SortBar />}
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
                            image: place.image || "", // 이미지가 없으면 기본 이미지 처리됨
                            place_photos: place.place_photos || [], // ✅ Google Places API 이미지 배열 추가!
                            category: place.category || "restaurant", // 기본값
                        }}
                    />
                ))}
            </ResultsContainer>
            <RecommendPlace />
        </SearchContainer>
    );
}


