import styled from "styled-components";
import { PlaceCard, DUMMY_PLACES } from "../common/PlaceCards.jsx";

const RecommendPlaceContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 10px;
    color: black;
    width: 343px;
    font-weight: 600;
`;

const CardsContainer = styled.div`
    display: flex;
    gap: 10px;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    padding-bottom: 20px;
    & > * {
    flex: 0 0 auto;           /* 줄바꿈 없이 가로로 나열 */
    scroll-snap-align: start; /* 카드 단위 스냅 */
    }
`;

export default function RecommendPlace() {
    return (
        <RecommendPlaceContainer>
            <p>주변에 가볼만한 곳</p>
            <CardsContainer>
                {DUMMY_PLACES.map((place) => (
                    <PlaceCard key={place.id} place={place} />
                ))}
            </CardsContainer>
        </RecommendPlaceContainer>
    );
}