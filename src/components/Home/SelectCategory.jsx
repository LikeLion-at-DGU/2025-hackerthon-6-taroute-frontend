import { useMemo, useState, useEffect } from "react";
import styled from "styled-components";
import { PlaceCard, CATEGORIES, DUMMY_PLACES, filterByCategory } from "../common/PlaceCards";
import { useNavigate } from 'react-router-dom';
import { getRecommend } from "../../apis/searchApi";

const LABELS = {
  restaurant: "음식점", // "식당" -> "음식점"으로 변경 (API 응답과 일치)
  cafe: "카페",
  culture: "문화시설",
  tour: "관광명소",
};

// 카테고리별 API 코드 매핑
const CATEGORY_GROUP_CODES = {
  restaurant: "FD6", // 음식점
  cafe: "CE7",       // 카페
  culture: "CT1",    // 문화시설
  tour: "AT4",       // 관광명소
};

const SelectCategory = () => {
  const [activeCat, setActiveCat] = useState("restaurant"); // 기본: 식당
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [error, setError] = useState(null);
  const [allPlacesData, setAllPlacesData] = useState(null); // 전체 데이터 캐싱
  const navigate = useNavigate();

  // 사용자 위치 정보 가져오기
  useEffect(() => {
    const getUserLocation = () => {
      if (!navigator.geolocation) {
        setError('위치 서비스를 지원하지 않습니다');
        setLoading(false);
        return;
      }

      const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5분간 캐시
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
          console.log('📍 사용자 위치 획득:', location);
          setUserLocation(location);
          setError(null);
        },
        (error) => {
          console.error('❌ 위치 정보 가져오기 실패:', error);
          setError('위치 정보를 가져올 수 없습니다');
          setLoading(false);
        },
        options
      );
    };

    getUserLocation();
  }, []);

  // 추천 장소 데이터 로드 (한 번만 호출)
  const loadAllRecommendPlaces = async () => {
    if (!userLocation) return;

    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 모든 추천 장소 API 호출:', {
        x: userLocation.longitude,
        y: userLocation.latitude
      });

      const response = await getRecommend({
        x: userLocation.longitude,
        y: userLocation.latitude
        // category_group_code 제거 - 모든 카테고리 데이터를 받아옴
      });

      console.log('✅ 추천 장소 API 응답:', response);
      
      if (response && response.data && typeof response.data === 'object') {
        setAllPlacesData(response.data);
        
        // 현재 선택된 카테고리의 데이터로 places 설정
        const categoryLabel = LABELS[activeCat];
        const categoryPlaces = response.data[categoryLabel] || [];
        const limitedPlaces = categoryPlaces.slice(0, 4);
        setPlaces(limitedPlaces);
        
        console.log('📋 전체 데이터 로드 완료:', response.data);
      } else {
        throw new Error('API 응답 형식이 올바르지 않습니다');
      }
      
    } catch (error) {
      console.error(`❌ 추천 장소 로딩 실패:`, error);
      setError('추천 장소를 불러올 수 없습니다');
      
      // 에러 발생 시 더미 데이터로 폴백
      const fallbackPlaces = filterByCategory(DUMMY_PLACES, activeCat).slice(0, 4);
      console.log(`🔄 폴백 더미 데이터 사용:`, fallbackPlaces);
      setPlaces(fallbackPlaces);
      
    } finally {
      setLoading(false);
    }
  };

  // 캐싱된 데이터에서 카테고리별 장소 추출
  const updatePlacesFromCache = (category) => {
    if (!allPlacesData) return;
    
    const categoryLabel = LABELS[category];
    console.log(`🔍 카테고리 "${category}" -> 라벨 "${categoryLabel}"`);
    console.log('📦 전체 데이터 키들:', Object.keys(allPlacesData));
    
    const categoryPlaces = allPlacesData[categoryLabel] || [];
    const limitedPlaces = categoryPlaces.slice(0, 4);
    
    console.log(`📋 ${categoryLabel} 카테고리 장소 ${limitedPlaces.length}개:`, limitedPlaces);
    setPlaces(limitedPlaces);
  };

  // 위치 정보가 있을 때 전체 데이터 로드 (한 번만)
  useEffect(() => {
    if (userLocation && !allPlacesData) {
      loadAllRecommendPlaces();
    }
  }, [userLocation]);

  // 카테고리 변경 시 캐싱된 데이터에서 업데이트
  useEffect(() => {
    if (allPlacesData) {
      updatePlacesFromCache(activeCat);
    }
  }, [activeCat, allPlacesData]);

  // 카테고리 클릭 핸들러
  const handleCategoryClick = (category) => {
    setActiveCat(category);
    const label = LABELS[category];
    console.log(`🏷️ 카테고리 변경: ${label}`);
  };

  return (
    <CategoryContainer>
      <CategoryBar>
        {CATEGORIES.map((key) => (
          <Category
            key={key}
            $active={activeCat === key}
            onClick={() => handleCategoryClick(key)}
            role="button"
            aria-pressed={activeCat === key}
          >
            <p>{LABELS[key]}</p>
          </Category>
        ))}
      </CategoryBar>

      {/* 로딩 또는 에러 상태 */}
      {loading && (
        <LoadingContainer>
          <p>추천 장소 로딩중...</p>
        </LoadingContainer>
      )}

      {error && !loading && (
        <ErrorContainer>
          <p>{error}</p>
        </ErrorContainer>
      )}

      {/* 장소 카드 그리드 */}
      {!loading && !error && places.length > 0 && (
        <CardsGrid>
          {places.map((place, idx) => (
            <PlaceCard 
              key={place.id || `${activeCat}-${idx}`} 
              place={place}
              userLocation={userLocation}
            />
          ))}
        </CardsGrid>
      )}

      {/* 데이터가 없는 경우 */}
      {!loading && !error && places.length === 0 && (
        <NoDataContainer>
          <p>추천할 {LABELS[activeCat]}가 없습니다</p>
        </NoDataContainer>
      )}
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
  display: flex;
  flex-direction: row;
  gap: 20px;
  width: 100%;                /* 343px -> 100%로 변경 */
  max-width: 343px;           /* 최대 너비 제한 */
  margin-bottom: 10px;
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
  padding-bottom: 4px;
  scrollbar-width: thin;      /* Firefox용 얇은 스크롤바 */
  
  /* 웹킷 브라우저용 스크롤바 스타일링 */
  &::-webkit-scrollbar {
    height: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 2px;
  }
  
  & > * {
    flex: 0 0 auto;
    scroll-snap-align: start;
    min-width: 137px;          /* 카드의 최소 너비 명시 */
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 343px;
  height: 120px;
  color: #8A8A8A;
  font-size: 14px;
  p {
    margin: 0;
  }
`;

const ErrorContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 343px;
  height: 120px;
  color: #FF6B6B;
  font-size: 12px;
  p {
    margin: 0;
  }
`;

const NoDataContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 343px;
  height: 120px;
  color: #8A8A8A;
  font-size: 12px;
  p {
    margin: 0;
  }
`;