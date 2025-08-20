import { useState } from "react";
import { useNavigate } from "react-router-dom"; // 추가
import PageNavbar from "../components/common/PageNavbar";
import SearchBar from "../components/common/SearchBar";
import styled from "styled-components";
import TrendChart from "../components/search/TrendChart";
import Ads from "../components/Home/Ads";

const SearchContainer = styled.div`
    display: flex;
    flex-direction: column;
    background: white;
    height: 100%;
    width: 100%;
    align-items: center;
`;

const TrendKeyword = styled.div`
    display: flex;
    flex-direction: column;
    color: #2A2A2A;
    align-items: flex-start;
    width: 343px;
    p{
        font-size: 14px;
        margin: 8px 0;
    }
`;

const AdContainer = styled.div`
    display: flex;
    flex-direction: column;
    margin: 25px 0;
    gap: 25px;
`;


const Search = () => {
    const [q, setQ] = useState("");
    const navigate = useNavigate(); // 추가

    const handleSubmit = () => {
        if (!q.trim()) return;
        navigate(`/results?q=${encodeURIComponent(q)}`); // 검색 결과 페이지로 이동
    };

    return (
        <SearchContainer>
            <PageNavbar title="검색하기" />
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
            <TrendKeyword>
                <p>현재 인기있는 검색어</p>
                <TrendChart />
            </TrendKeyword>
            <Ads />
        </SearchContainer>
    );
};

export default Search;