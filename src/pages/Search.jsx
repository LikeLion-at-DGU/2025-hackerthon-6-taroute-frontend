import { useState } from "react";
import { useNavigate } from "react-router-dom"; // 추가
import PageNavbar from "../components/common/PageNavbar";
import SearchBar from "../components/common/SearchBar";
import styled from "styled-components";
import TrendChart from "../components/search/TrendChart";
import Ads from "../components/Home/Ads";
import { useTranslation } from "react-i18next";


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



const Search = () => {
    const { t } = useTranslation();
    const [q, setQ] = useState("");
    const navigate = useNavigate(); // 추가

    const handleSubmit = () => {
        if (!q.trim()) return;
        navigate(`/results?q=${encodeURIComponent(q)}`); // 검색 결과 페이지로 이동
    };

    return (
        <SearchContainer>
            <PageNavbar title={t("search.title")} />
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
                <p>{t("search.recent")}</p>
                <TrendChart />
            </TrendKeyword>
            <Ads />
        </SearchContainer>
    );
};

export default Search;