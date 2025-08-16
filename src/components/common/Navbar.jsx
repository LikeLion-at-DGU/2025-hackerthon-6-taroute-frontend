import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import LocationIcon from '../../assets/icons/location.svg';
import CartIcon from '../../assets/icons/cart.svg';
import HomeIcon from '../../assets/icons/home.svg';


const NavbarContainer = styled.div`
    display: flex;
    width: 343px;
    height: 33px;
    justify-content: space-between;
    margin-top: 28px;
    margin-left: 9px;
    margin-right: 9px;
    font-size: 18px;
`;

const LocationBar = styled.div`
    display: flex;
    width: fit-content;
    height: 100%;
    gap: 7px;
    align-items: center;
    color: ${({ $color }) => $color || "white"};
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
    font-size: 17px;
`;

const Navbar = ({ LocationBarColor }) => {
    return (
        <NavbarContainer>
            <LocationBar $color={LocationBarColor}>
                <img src={LocationIcon} alt="Location" />
                {/*}나중에 API 연결 필요*/}
                <NowLocation >충무로 3가</NowLocation>
                <FontAwesomeIcon icon={faChevronDown} />
            </LocationBar>
            <ButtonBar>
                <img src={CartIcon} alt="Cart" />
                <img src={HomeIcon} alt="Home" />
            </ButtonBar>
        </NavbarContainer>
    );
};

export default Navbar;