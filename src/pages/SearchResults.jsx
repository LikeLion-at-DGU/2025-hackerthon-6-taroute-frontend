import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getSearchPlace } from "../apis/searchApi";
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
    background: linear-gradient(180deg, #23213a 0%, #a18ae6 100%);
    height: 100%;
    width: 100%;
    align-items: center;
`;

const ResultsContainer = styled.div`
    display: flex;
    flex-direction: row;
    gap: 16px;
    overflow-x: auto;
    width: 343px;          // 카드 컨테이너 너비 고정
    padding: 20px 0;
    scrollbar-width: thin;
    scrollbar-color: #a18ae6 #f0f0f0;
`;

const NoResultContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 80px;
    h3{
        color: white;
        font-weight: 500;
        font-size: 24px;
    }
`;


export default function SearchResults() {
    const [params] = useSearchParams();
    const initialQ = (params.get("q") || "").trim();

    const [q, setQ] = useState(initialQ);
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);

    //임시더미좌표
    const x = 126.9780;
    const y = 37.5665;

    const handleSubmit = () => {
        // 검색어가 바뀌면 useEffect가 실행되어 자동으로 검색됩니다.
        // 필요하다면 여기서 추가 동작(예: 페이지 이동)도 구현 가능
        setRows([]); // 이전 결과 초기화
        setLoading(true);
        getSearchPlace({ q, x, y })
            .then((data) => {
                console.log("API 응답:", data); // 응답 구조 확인
                // data.results, data.items, data가 배열이 아니면 빈 배열로 처리
                const arr =
                    Array.isArray(data.google_place) ? data.google_place :
                        Array.isArray(data.results) ? data.results :
                            Array.isArray(data.items) ? data.items :
                                Array.isArray(data) ? data : [];
                setRows(arr);
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        if (!q) return;
        setLoading(true);
        getSearchPlace({ q, x, y })
            .then((data) => {
                console.log("API 응답:", data); // 응답 구조 확인
                const arr =
                    Array.isArray(data.google_place) ? data.google_place :
                        Array.isArray(data.results) ? data.results :
                            Array.isArray(data.items) ? data.items :
                                Array.isArray(data) ? data : [];
                setRows(arr);
            })
            .finally(() => setLoading(false));
    }, [initialQ]);

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
            <SortBar />
            {loading && <div>로딩중...</div>}
            {!loading && rows.length === 0 &&
                <NoResultContainer>
                    <img src={noresult} style={{ width: "98px", height: "99px" }} />
                    <h3>검색 결과가 없습니다</h3>
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
                            category: place.category || "restaurant", // 기본값
                        }}
                    />
                ))}
            </ResultsContainer>
            <RecommendPlace />
        </SearchContainer>
    );
}


