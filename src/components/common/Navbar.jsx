import styled from "styled-components";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faChevronDown, faHouse, faCartShopping, faCar } from '@fortawesome/free-solid-svg-icons';


const NavbarContainer = styled.div`
    display: flex;
    width: 343px;
    height: 33px;
    justify-content: space-between;
    margin-top: 15px;
    margin-left: 9px;
    margin-right: 9px;
    font-size: 18px;
`;

const LocationBar = styled.div`
    display: flex;
    width: 153px;
    height: 100%;
    gap: 7px;
    align-items: center;
`;

const ButtonBar = styled.div`
    display: flex;
    height: 100%;
    width: 67px;
    justify-content: space-between;
    align-items: center;
`;

const NowLocation = styled.div`
    font-weight: 700;
`;

const Navbar = () => {
    return (
        <NavbarContainer>
            <LocationBar>
                <FontAwesomeIcon icon={faLocationDot} color="#FFC500"/>
                {/*}나중에 API 연결 필요*/}
                <NowLocation>충무로 3가</NowLocation>
                <FontAwesomeIcon icon={faChevronDown} />
            </LocationBar>
            <ButtonBar>
                <FontAwesomeIcon icon={faCartShopping} />
                <FontAwesomeIcon icon={faHouse} />
            </ButtonBar>
        </NavbarContainer>
    );
};

export default Navbar;