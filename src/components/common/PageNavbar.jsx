import styled from "styled-components";
import { useNavigate } from 'react-router-dom';
import gobackIcon from '../../assets/icons/goback.svg';
import homeIcon from '../../assets/icons/home.svg';


const NavbarWrapper = styled.div`
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: space-between;
    padding: 0 14px;
    background: linear-gradient(180deg, #25213B 100%, #655AA1 0%);
    padding-top: 5px;
`;

const Title = styled.h3`
    font-size: 18px;
    font-weight: 600;
    color: white;
`;

const IconButton = styled.img`
    cursor: pointer;
    transition: opacity 0.2s ease;
    
    &:hover {
        opacity: 0.7;
    }
    
    &:active {
        opacity: 0.5;
    }
`;

export default function PageNavbar({ title = "" }) {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1); // 브라우저 히스토리에서 뒤로가기
    };

    const handleGoHome = () => {
        navigate('/'); // 홈으로 이동
    };

    return (
        <NavbarWrapper>
            <IconButton src={gobackIcon} alt="goback" onClick={handleGoBack} />
            <Title>{title}</Title>
            <IconButton src={homeIcon} alt="home" onClick={handleGoHome} /> 
        </NavbarWrapper>
    );
};
