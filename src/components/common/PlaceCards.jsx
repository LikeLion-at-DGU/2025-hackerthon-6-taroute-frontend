import styled from "styled-components";
import bg1 from '../../assets/images/bg_1.jpg';
import maapin from "../../assets/icons/mappin.svg";

// 카테고리: restaurant, cafe, culture, tour
export const CATEGORIES = ["restaurant", "cafe", "culture", "tour"];

/**
 * @typedef {Object} Place
 * @property {string} id
 * @property {string} name
 * @property {string} location
 * @property {string} image
 * @property {("restaurant"|"cafe"|"culture"|"tour")} category
 */

/** @type {Place[]} */
export const DUMMY_PLACES = [
  {
    id: "p1",
    name: "섹터커피 충무로점",
    location: "서울특별시 중구 필동 퇴계로 198",
    image: bg1,
    category: "cafe",
  },
  {
    id: "p2",
    name: "고냉지",
    location: "서울특별시 중구 퇴계로 42-3 2층",
    image: bg1,
    category: "restaurant",
  },
  {
    id: "p3",
    name: "플레이온 보드게임카페 충무로점",
    location: "서울특별시 중구 퇴계로 226 3층",
    image: bg1,
    category: "culture",
  },
  {
    id: "p4",
    name: "남산서울타워",
    location: "서울특별시 용산구 남산공원길 105",
    image: bg1,
    category: "tour",
  },
];

export const isValidCategory = (cat) => CATEGORIES.includes(cat);

/**
 * 단일 카테고리로 필터링 (category가 'all'이면 전체 반환)
 * @param {Place[]} places
 * @param {string} category - 'restaurant'|'cafe'|'culture'|'tour'|'all'
 * @returns {Place[]}
 */
export function filterByCategory(places, category = "all") {
  if (!category || category === "all") return places;
  return places.filter((p) => p.category === category);
}

/**
 * 카테고리별 그룹핑 결과 반환
 * @param {Place[]} places
 * @returns {{restaurant: Place[], cafe: Place[], culture: Place[], tour: Place[]}}
 */
export function groupByCategory(places) {
  const acc = { restaurant: [], cafe: [], culture: [], tour: [] };
  for (const p of places) {
    if (isValidCategory(p.category)) acc[p.category].push(p);
  }
  return acc;
}

/**
 * 더미데이터를 주어진 카테고리로 필터링해 반환 (유틸용)
 */
export function getDummyByCategory(category = "all") {
  return filterByCategory(DUMMY_PLACES, category);
}

/**
 * 단일 카드 컴포넌트 (개별 카드 UI만 담당)
 * @param {{ place: Place }} props
 */
export const PlaceCard = ({ place }) => {
  return (
    <Card>
      <Cover $src={place.image} role="img" aria-label={place.name} />
      <Body>
        <Title>{place.name}</Title>
        <Address>{place.location}</Address>
      </Body>
      <Location>
        <img src={maapin} alt="map pin" />
        <p>내 위치에서 222m</p>
      </Location>
    </Card>
  );
};

export default PlaceCard;

// ---------------- styled-components (카드 UI) ----------------
const Card = styled.div`
  border-radius: 12px;
  overflow: hidden;
  background: #F0F0F0;
  display: flex;
  flex-direction: column;
  width: 137px;
  height: 186px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.06), 2px 3px 6px -4px rgba(0,0,0,0.12);
`;

const Cover = styled.div`
  width: 100%;
  height: 123px;           /* 항상 123px 고정 */
  flex: 0 0 123px;
  background-image: url(${(props) => props.$src});
  background-size: cover;  /* 이미지를 꽉 채우고 넘치는 부분은 크롭 */
  background-position: center;
  background-repeat: no-repeat;
  overflow: hidden;
`;

const Body = styled.div`
  padding: 5px 8px 0;
`;

const Title = styled.h3`
  font-size: 12px;
  margin: 0 0 4px;
  color: black;
`;

const Address = styled.p`
  font-size: 7px;
  color: #666;
  margin: 0;
`;

const Location = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  margin-left: 7px;
  margin-top: 2px;
  gap: 4px;
  p{
    font-size: 7px;
    color: black;
    margin: 0;
  }
`;