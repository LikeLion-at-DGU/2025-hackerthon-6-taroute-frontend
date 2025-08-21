import styled from "styled-components";
import { useState, useEffect } from "react";
import { useSavedPlaceContext } from "../../contexts/SavedPlaceContext";
import bg1 from '../../assets/images/bg_1.jpg';
import maapin from "../../assets/icons/mappin.svg";
import heartIcon from "../../assets/icons/Heart.svg"; // 빈 하트
import blackHeartIcon from "../../assets/icons/BlackHeart.svg"; // 찜한 하트
import { savePlaceToServer } from "../../apis/savePlaceApi";

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

// 텍스트를 특정 길이로 자르고 말줄임표 추가하는 함수
function truncateText(text, maxLength = 10) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

// 두 위치 간의 거리를 계산하는 함수 (Haversine 공식)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // 지구 반지름 (km)
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // km
  
  // km를 m로 변환하고 적절한 단위로 표시
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m`;
  } else {
    return `${distance.toFixed(1)}km`;
  }
}

// 사용자 위치를 가져오는 커스텀 훅
function useUserLocation() {
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError('위치 서비스를 지원하지 않습니다');
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000 // 5분간 캐시
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
        setLocationError(null);
      },
      (error) => {
        console.error('위치 정보 가져오기 실패:', error);
        setLocationError('위치 정보를 가져올 수 없습니다');
      },
      options
    );
  }, []);

  return { userLocation, locationError };
}

/**
 * 단일 카드 컴포넌트 (개별 카드 UI만 담당)
 * @param {{ place: Place, isFavorited?: boolean }} props
 */
const PlaceCard = ({ place, category }) => {
  const { savedPlaces, addPlace, removePlace } = useSavedPlaceContext();
  const { userLocation, locationError } = useUserLocation();
  
  // 각 카드마다 개별적으로 저장 상태 계산
  const isSaved = savedPlaces.some(savedPlace => {
    const nameMatch = (savedPlace.place_name || savedPlace.name) === (place.place_name || place.name);
    const addressMatch = (savedPlace.address_name || savedPlace.location) === (place.address_name || place.location);
    const idMatch = savedPlace.id && place.id && savedPlace.id === place.id;
    
    return idMatch || (nameMatch && addressMatch);
  });

  // 거리 계산
  const getDistanceText = () => {
    if (!userLocation) return '위치 확인중...';
    if (locationError) return '위치 정보 없음';
    
    // 장소의 위치 정보 추출
    let placeLat, placeLon;
    
    // API 응답 구조에 맞게 위치 정보 추출
    if (place.location && typeof place.location === 'object') {
      // API에서 받은 location 객체의 경우
      placeLat = place.location.latitude || place.location.lat;
      placeLon = place.location.longitude || place.location.lng;
    } else if (place.geometry && place.geometry.location) {
      // Google Places API 형태의 경우
      placeLat = place.geometry.location.lat;
      placeLon = place.geometry.location.lng;
    }
    
    if (!placeLat || !placeLon) {
      return '거리 정보 없음';
    }
    
    const distance = calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      placeLat,
      placeLon
    );
    
    return `내 위치에서 ${distance}`;
  };

  const handleFavoriteClick = async (e) => {
    e.stopPropagation();
    
    if (isSaved) {
      // 찜 해제
      removePlace(place);
    } else {
      // 찜하기 - Google Place ID를 savePlaceAPI에 전달
      const googlePlaceId = place.id;
      
      if (!googlePlaceId) {
        console.error('❌ Google Place ID가 없어서 저장할 수 없습니다:', place);
        return;
      }
      
      try {
        console.log('💾 SavePlaceAPI 호출 시작:', {
          googlePlaceId: googlePlaceId,
          originalPlace: place
        });
        
        // SavePlaceAPI로 Google Place ID 전달하여 풍부한 데이터 받기
        const serverResponse = await savePlaceToServer(googlePlaceId);
        
        console.log('✅ SavePlaceAPI 응답:', serverResponse);
        
        if (serverResponse && serverResponse.data) {
          // 서버에서 받은 순수 데이터를 그대로 사용
          const serverData = serverResponse.data;
          
          const enrichedPlace = {
            id: googlePlaceId,
            place_name: serverData.place_name,
            address: serverData.address,
            location: serverData.location,
            running_time: serverData.running_time || [],
            place_photos: serverData.place_photos || [],
            // 호환성을 위한 추가 필드
            name: serverData.place_name,
            address_name: serverData.address,
            image: serverData.place_photos?.[0] || place.image,
          };
          
          console.log('🔄 Context에 저장할 데이터:', {
            enrichedPlace,
            place_photos: enrichedPlace.place_photos,
            place_photos_length: enrichedPlace.place_photos?.length,
            running_time: enrichedPlace.running_time,
            running_time_length: enrichedPlace.running_time?.length
          });
          
          addPlace(enrichedPlace);
        } else {
          console.error('❌ SavePlaceAPI 응답에 data가 없습니다:', serverResponse);
          
          // 서버 응답이 없으면 기본 SearchAPI 데이터로 대체
          const fallbackPlace = {
            id: googlePlaceId,
            place_name: place.place_name || place.name,
            address_name: place.address_name || place.location,
            name: place.place_name || place.name,
            location: place.address_name || place.location,
            image: place.image,
            place_photos: [],
            running_time: []
          };
          
          addPlace(fallbackPlace);
        }
      } catch (error) {
        console.error('❌ SavePlaceAPI 호출 실패:', error);
        
        // API 실패시 기본 SearchAPI 데이터로 대체
        const fallbackPlace = {
          id: googlePlaceId,
          place_name: place.place_name || place.name,
          address_name: place.address_name || place.location,
          name: place.place_name || place.name,
          location: place.address_name || place.location,
          image: place.image,
          place_photos: [],
          running_time: []
        };
        
        addPlace(fallbackPlace);
      }
    }
  };

  return (
    <Card>
      <CardImageContainer>
        <Cover>
          <img 
            src={place.place_photos?.[0] || place.image || bg1}
            alt={place.place_name || place.name || '장소 이미지'}
            onError={(e) => {
              e.target.src = bg1; // 폴백 이미지로 변경
            }}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center'
            }}
          />
        </Cover>
        <HeartButton onClick={handleFavoriteClick}>
          <img 
            src={isSaved ? blackHeartIcon : heartIcon} 
            alt="찜하기" 
          />
        </HeartButton>
      </CardImageContainer>
      <Body>
        <Title>
          {truncateText(place.place_name || place.name)}
        </Title>
        <Address>
          {place.address || place.address_name || place.location}
        </Address>
        <Location>
          <img src={maapin} width="16" height="16" />
          <p>{getDistanceText()}</p>
        </Location>
      </Body>
    </Card>
  );
};


export { PlaceCard };
export default PlaceCard;


// ---------------- styled-components (카드 UI) ----------------
const Card = styled.div`
  border-radius: 20px;
  overflow: hidden;
  background: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 137px;
  height: 186px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.06), 2px 3px 6px -4px rgba(0,0,0,0.12);
  flex: 0 0 auto;   // 카드가 줄어들지 않게 추가!
`;

const CardImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 123px;
  flex: 0 0 123px;
`;

const Cover = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const HeartButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 28px;
  height: 28px;
  background: rgba(255, 255, 255, 0.8);
  border: none;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.9);
    transform: scale(1.05);
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  img {
    width: 16px;
    height: 16px;
  }
`;

const Body = styled.div`
  padding: 5px 8px 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h3`
  font-size: 12px;
  margin: 0 0 2px;
  color: black;
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 2px;
  font-weight: 600;
`;

const Address = styled.p`
  font-size: 7px;
  color: #666;
  margin: 0;
  font-weight: 300;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: center;
`;

const Location = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  margin-top: 2px;
  gap: 4px;
  p{
    font-size: 7px;
    color: black;
    margin: 0;
    font-weight: 400;
  }
`;