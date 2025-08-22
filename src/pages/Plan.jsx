import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/common/SearchBar';
import { useState, useEffect } from 'react';
import taru from '../assets/icons/taru/taruPlan.png';
import PlanWhiteBox from '../components/Plan/PlanWhitebox';
import { useSavedPlaceContext } from '../contexts/SavedPlaceContext';

const PlanContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: fit-content;
    color: #F0F0F0;
    overflow-y: hidden;
`;

const PlanInfo = styled.div`
    display: flex;
    width: 100%;
    flex-direction: column;
    padding: 7px 10px 32px 15px;
    font-weight: 600;
    font-size: 24px;
    p{
        margin: 0 0 18px 0;
        line-height: 1.2;
    }
    margin-bottom: 30px;
`;

const PlanInfoBox = styled.div`
    display: flex;
    width: 343px;
    height: 180px;
    align-items: center;
    justify-content: center;
    gap: 20px;
    background-color: rgba(0, 0, 0, 0.505);
    border-radius: 20px;
    font-weight: 300;
    font-size: 20px;
    p{
        padding-bottom: 5px;
        line-height: 1.4;
    }
`;

const Plan = () => {
    const navigate = useNavigate();
    const [q, setQ] = useState("");
    const { savedPlaces, loadSavedPlaces } = useSavedPlaceContext();

    // 최초 진입 또는 컨텍스트가 비어있을 때만 서버에서 로드
    useEffect(() => {
        if (!savedPlaces || savedPlaces.length === 0) {
            console.log('📋 Plan 페이지 - 컨텍스트 비어있음, 서버 로드 실행');
            loadSavedPlaces();
        } else {
            console.log('📋 Plan 페이지 - 컨텍스트에 데이터 존재, 서버 로드 건너뜀');
        }
    }, [savedPlaces?.length]);

    const handleSubmit = () => {
        if (!q.trim()) return;
        navigate(`/results?q=${encodeURIComponent(q)}`); // 검색 결과 페이지로 이동
    };

    return (
        <PlanContainer>
            <div>
                <SearchBar
                    asButton
                    onClick={() => navigate('/search')}
                />
            </div>
            <PlanInfo>
                <p>복잡한 동선계획? NO ! <br /> 타루트에서는
                    <span style={{ color: "#FFC500" }}> 한 번에</span></p>
                <PlanInfoBox>
                    <p>원하는 장소만 골라서 <br />
                        <span style={{ fontSize: "24px", color: "#FFC500", fontWeight: "500" }}>
                            동선 계획하기</span></p>
                    <img src={taru} />
                </PlanInfoBox>
            </PlanInfo>
            <PlanWhiteBox />
        </PlanContainer>
    );
};

export default Plan;