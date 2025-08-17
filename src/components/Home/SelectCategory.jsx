import { useMemo, useState } from "react";
import styled from "styled-components";
import { PlaceCard, CATEGORIES, DUMMY_PLACES, filterByCategory } from "../common/PlaceCards.jsx";
import { useNavigate } from 'react-router-dom';

const LABELS = {
  restaurant: "식당",
  cafe: "카페",
  culture: "문화시설",
  tour: "관광명소",
};

const SelectCategory = () => {
  const [activeCat, setActiveCat] = useState("restaurant"); // 기본: 식당
  const navigate = useNavigate();

  // 선택된 카테고리의 아이템을 4장으로 복제 (원소가 1~3개여도 순환 복제)
  const base = useMemo(() => filterByCategory(DUMMY_PLACES, activeCat), [activeCat]);
  const places = useMemo(() => {
    if (!base.length) return [];
    return Array.from({ length: 4 }).map((_, i) => {
      const src = base[i % base.length];
      return { ...src, id: `${src.id}#${i}` }; // key 충돌 방지를 위해 고유 id 부여
    });
  }, [base]);

  return (
    <CategoryContainer>
      <CategoryBar>
        {CATEGORIES.map((key) => (
          <Category
            key={key}
            $active={activeCat === key}
            onClick={() => {
              setActiveCat(key);
              const label = LABELS[key];
              navigate(`/category?cat=${encodeURIComponent(label)}`, {
                state: { initialCategory: label },
              });
            }}
            role="button"
            aria-pressed={activeCat === key}
          >
            <p>{LABELS[key]}</p>
          </Category>
        ))}
      </CategoryBar>

      {/* 여기서 배치 (그리드/리스트) 결정 */}
      <CardsGrid>
        {places.map((p) => (
          <PlaceCard key={p.id} place={p} />
        ))}
      </CardsGrid>
    </CategoryContainer>
  );
};

export default SelectCategory;

// ---------------- styled-components ----------------
const CategoryContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 375px;
  align-items: center;
`;

const CategoryBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  gap: 20px;
  font-size: 13px;
  width: 343px;
  position: relative;
  font-weight: 500;
  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    height: 1px;
    width: 100%;
    background-color: white;
    z-index: 0;
  }
`;

const Category = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: ${(props) => (props.$active ? "#FFC500" : "gray")};
  padding: 6px 2px;
  cursor: pointer;
  user-select: none;
  position: relative;
  background: transparent;

  &::after {
    content: "";
    display: ${(props) => (props.$active ? "block" : "none")};
    position: absolute;
    bottom: 0;
    left: 0;
    height: 2px;
    width: 100%;
    background-color: #FFC500;
    z-index: 1;
  }

  p {
    font-weight: ${(props) => (props.$active ? "bold" : "normal")};
    margin: 0;
  }
`;

const CardsGrid = styled.div`
  display: flex;              /* 가로 배치 */
  flex-direction: row;
  gap: 20px;
  width: 343px;
  margin-bottom: 10px;
  overflow-x: auto;           /* 가로 스크롤 */
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch; /* iOS 부드러운 스크롤 */
  padding-bottom: 4px;        /* 스크롤바 여백 */
  & > * {
    flex: 0 0 auto;           /* 줄바꿈 없이 가로로 나열 */
    scroll-snap-align: start; /* 카드 단위 스냅 */
  }
`;