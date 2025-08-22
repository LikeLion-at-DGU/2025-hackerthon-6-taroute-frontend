import styled from "styled-components";
import RouteBox from "../components/Spot/RouteBox.jsx";
import SpotWhiteBox from "../components/Spot/SpotWhitebox";
import PageNavbar from "../components/common/PageNavbar.jsx";
import SpotMap from "../components/Spot/SpotMap.jsx";

const Spotcontainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const Spot = () => {
    return (
        <Spotcontainer>
            <PageNavbar title="일정계획" />
            <SpotMap />
            <RouteBox />
            <SpotWhiteBox />
        </Spotcontainer>
    );
};

export default Spot;