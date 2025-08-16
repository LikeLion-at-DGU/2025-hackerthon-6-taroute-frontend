import { useState } from "react";
import { useNavigate } from "react-router-dom"; // 추가
import Navbar from "../components/common/Navbar";
import SearchBar from "../components/common/SearchBar";
import styled from "styled-components";
import TrendChart from "../components/search/TrendChart";
import ads2 from "../assets/images/ads2.png";
import ads3 from "../assets/images/ads3.png";

const SearchContainer = styled.div`
    display: flex;
    flex-direction: column;
    background: linear-gradient(
        180deg,
        #23213a 0%,
        #3d3570 50%,
        #7062b2 100%
    );
    height: 100%;
    width: 100%;
    align-items: center;
`;

const TrendKeyword = styled.div`
    display: flex;
    flex-direction: column;
    color: white;
    margin-top: 30px;
    align-items: flex-start;
    width: 343px;
    p{
        font-size: 14px;
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
            <Navbar LocationBarColor="white" />
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
            <AdContainer>
                <img src={ads2} />
                <img src={ads3} />
            </AdContainer>
        </SearchContainer>
    );
};

export default Search;