import styled from "styled-components";
import { useState, useEffect } from "react";
import { PlaceCard } from "../common/PlaceCards";
import { getRecommend } from "../../apis/searchApi";
import { useSelectedLocation } from "../../hooks/useSelectedLocation";
import searchHeart from "../../assets/icons/searchHeart.png";
import { useTranslation } from "react-i18next";


const RecommendPlaceContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 50px;
    color: #2a2a2a;
    width: 343px;
    font-weight: 600;
`;

const CardsContainer = styled.div`
    display: flex;
    gap: 16px;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    padding-bottom: 20px;
    &::-webkit-scrollbar {
    display: none;
    }

    scrollbar-width: none; 
    -ms-overflow-style: none;
    & > * {
    flex: 0 0 auto;           /* 줄바꿈 없이 가로로 나열 */
    scroll-snap-align: start; /* 카드 단위 스냅 */
    }
`;

const Title = styled.div`
    display: flex;
    align-items: center;
    font-size: 17px;
    gap: 10px;
    font-weight: 500;
    margin-bottom: 8px;
    p{
        margin: 0;
    }
`;


export default function RecommendPlace() {
    const { t } = useTranslation();
    const [recommendedPlaces, setRecommendedPlaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 사용자 선택 위치 정보 훅 사용
    const { location: selectedLocation } = useSelectedLocation();

    // 추천 장소 데이터 로드
    useEffect(() => {
        const loadRecommendedPlaces = async () => {

            if (!selectedLocation) {
                return; // 위치 정보가 아직 로드되지 않았으면 대기
            }

            try {
                setLoading(true);
                setError(null);


                const response = await getRecommend({ x: selectedLocation.x, y: selectedLocation.y });

                // API 응답 구조에 맞게 데이터 추출
                let places = [];

                if (response && response.data) {
                    console.log('API 응답 data 객체:', response.data);
                    
                    // response.data가 배열인 경우 (category_group_code 없이 호출될 때)
                    if (Array.isArray(response.data)) {
                        console.log('API 응답이 배열 형태:', response.data);
                        places = response.data.map(place => ({
                            ...place,
                            // API에서 이미 category 정보가 있으므로 그대로 사용
                            category: getCategoryType(place.category) || 'restaurant'
                        }));
                    } else {
                        // 카테고리별로 분류된 데이터를 하나의 배열로 합치기 (기존 로직 유지)
                        const categories = ['문화시설', '관광명소', '음식점', '카페'];
                        categories.forEach(category => {
                            if (response.data[category] && Array.isArray(response.data[category])) {
                                console.log(`${category} 카테고리:`, response.data[category]);
                                // 각 장소에 카테고리 정보 추가
                                const categoryPlaces = response.data[category].map(place => ({
                                    ...place,
                                    category: getCategoryType(category)
                                }));
                                places = places.concat(categoryPlaces);
                            }
                        });
                    }
                } else {
                    // 기존 구조 대응 (google_place 배열)
                    places = Array.isArray(response.google_place) ? response.google_place :
                        Array.isArray(response.results) ? response.results :
                            Array.isArray(response.items) ? response.items :
                                Array.isArray(response) ? response : [];
                }

                console.log('최종 처리된 추천 장소:', places); // 디버깅용 로그
                console.log('추천 장소 개수:', places.length);
                setRecommendedPlaces(places);
            } catch (err) {
                console.error('추천 장소 로딩 실패:', err);
                setError('추천 장소를 불러올 수 없습니다.');
            } finally {
                setLoading(false);
            }
        };

        loadRecommendedPlaces();
    }, [selectedLocation?.x, selectedLocation?.y]); // 위치가 변경되면 재로드

    // 카테고리 한글명을 영문 타입으로 변환하는 헬퍼 함수
    const getCategoryType = (koreanCategory) => {
        const categoryMap = {
            '문화시설': 'culture',
            '관광명소': 'tour',
            '음식점': 'restaurant',
            '카페': 'cafe'
        };
        return categoryMap[koreanCategory] || 'restaurant';
    };

    if (loading) {
        return (
            <RecommendPlaceContainer>
                <Title>
                    <img style={{ height: '24px' }} src={searchHeart} />
                    <p>{t("search.near")}</p>
                </Title>
                <div style={{ color: '#8A8A8A', fontSize: '14px', padding: '20px 0' }}>
                    {t("search.recommending")}
                </div>
            </RecommendPlaceContainer>
        );
    }

    if (error) {
        return (
            <RecommendPlaceContainer>
                <Title>
                    <img style={{ height: '24px' }} src={searchHeart} />
                    <p>{t("search.near")}</p>
                </Title>
                <div style={{ color: '#FF4444', fontSize: '14px', padding: '20px 0' }}>
                    {error}
                </div>
            </RecommendPlaceContainer>
        );
    }

    if (recommendedPlaces.length === 0) {
        return (
            <RecommendPlaceContainer>
                <Title>
                    <img style={{ height: '24px' }} src={searchHeart} />
                    <p>{t("search.near")}</p>
                </Title>
                <div style={{ color: '#8A8A8A', fontSize: '14px', padding: '20px 0' }}>
                    {t("search.norecommend")}
                </div>
            </RecommendPlaceContainer>
        );
    }

    return (
        <RecommendPlaceContainer>
            <Title>
                <img style={{ height: '24px' }} src={searchHeart} />
                <p>{t("search.near")}</p>
            </Title>
            <CardsContainer>
                {recommendedPlaces.map((place, idx) => (
                    <PlaceCard
                        key={place.place_id || place.id || idx}
                        place={{
                            id: place.place_id || place.id || idx,
                            place_name: place.place_name || place.name || "",
                            name: place.place_name || place.name || "",
                            address: place.address || "",
                            address_name: place.address || "",
                            location: place.location || null,
                            x: place.x, // API 응답의 x 좌표 추가
                            y: place.y, // API 응답의 y 좌표 추가
                            image: place.image || "",
                            place_photos: place.place_photos || [],
                            category: place.category || "restaurant",
                        }}
                        userLocation={selectedLocation ? {
                            latitude: selectedLocation.y,
                            longitude: selectedLocation.x
                        } : null}
                    />
                ))}
            </CardsContainer>
        </RecommendPlaceContainer>
    );
}