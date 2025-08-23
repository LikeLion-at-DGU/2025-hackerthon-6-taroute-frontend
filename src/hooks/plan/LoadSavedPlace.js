import { useState, useEffect } from 'react';
import { showToast } from '../common/toast';
import { getSavedPlaces, savePlaceToServer } from '../../apis/savePlaceApi';
import { getSessionKey, clearSessionKey } from '../../utils/sessionUtils';

/**
 * 저장된 장소들을 관리하는 커스텀 훅
 * @returns {Object} { savedPlaces, setSavedPlaces, loadSavedPlaces, handleClearAll, addPlace }
 */
const useLoadSavedPlace = () => {
    const [savedPlaces, setSavedPlaces] = useState([]);
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    // 서버에서 저장된 장소들 로드
    const loadSavedPlaces = async () => {
        try {
            console.log('🔄 저장된 장소 로딩 시작...');
            setIsLoading(true);

            const sessionKey = getSessionKey();
            console.log('🔍 현재 localStorage 상태:', {
                sessionKey: sessionKey,
                sessionKeyType: typeof sessionKey,
                sessionKeyLength: sessionKey ? sessionKey.length : 0,
                storageContent: localStorage.getItem('taroute_session_key')
            });
            
            if (!sessionKey) {
                console.log('🔑 세션 키가 없어서 빈 배열로 초기화');
                setSavedPlaces([]);
                return;
            }

            console.log('🌐 서버에서 저장된 장소 조회 시도...', { sessionKey });
            
            // 서버에서 데이터 가져오기
            const serverPlaces = await getSavedPlaces();
            
            console.log('✅ 서버에서 가져온 장소들:', {
                count: serverPlaces.length,
                places: serverPlaces
            });
            
            // 서버 데이터 필드명 호환성 확보 및 활성화 상태 설정
            const normalizedPlaces = serverPlaces.map((place, index) => ({
                ...place,
                // 필드명 통일
                place_name: place.place_name || place.name,
                address_name: place.address || place.address_name || place.location,
                name: place.name || place.place_name,
                location: place.location || place.address || place.address_name,
                address: place.address || place.address_name,
                // 상위 10개만 활성화, 기존에 isEnabled가 있으면 그 값을 존중
                isEnabled: place.isEnabled !== undefined ? place.isEnabled : (index < 10)
            }));
            
            setSavedPlaces(normalizedPlaces);
            
        } catch (error) { 
            console.error('❌ 서버에서 장소 로딩 실패:', error);
            // 에러 발생시 빈 배열로 초기화
            setSavedPlaces([]);
            console.log('🔄 에러 발생으로 빈 배열로 초기화');
        } finally {
            setIsLoading(false);
        }
    };

    // 새로운 장소를 추가하는 함수 (찜하기 성공 후 호출용)
    const addPlace = async (place) => {
        console.log('🔧 Context addPlace 함수 호출:', {
            받은장소데이터: place,
            place_photos존재: !!place.place_photos,
            place_photos길이: place.place_photos?.length,
            running_time존재: !!place.running_time,
            running_time길이: place.running_time?.length,
            모든키목록: Object.keys(place || {})
        });

        // try/catch 밖에서 선언해 catch에서도 접근 가능하도록 처리
        const googlePlaceId = place?.id || place?.place_id;

        try {
            // 1. 먼저 로컬 상태에서 중복 체크
            const isAlreadyExists = savedPlaces.some(p => {
                // ID가 있으면 ID로 매칭
                if (p.id && (place.id || place.place_id)) {
                    return p.id === (place.id || place.place_id);
                }
                
                // ID가 없으면 이름과 주소로 매칭
                const pName = p.place_name || p.name;
                const pAddress = p.address || p.address_name || p.location;
                const placeName = place.place_name || place.name;
                const placeAddress = place.address || place.address_name || place.location;
                
                return pName === placeName && pAddress === placeAddress;
            });
            
            if (isAlreadyExists) {
                console.log('⚠️ 이미 존재하는 장소:', place.id || place.place_name || place.name);
                showToast('이미 저장된 장소입니다.');
                return;
            }

            // 2. 최대 20개 제한 체크
            if (savedPlaces.length >= 20) {
                showToast('최대 20개 장소까지만 저장할 수 있습니다.');
                return;
            }

            // 3. 서버에 저장 요청
            const googlePlaceId = place.id || place.google_place_id || place.place_id;
            console.log('🔍 저장할 Google Place ID:', {
                place_id: place.id,
                google_place_id: place.google_place_id,
                place_id_field: place.place_id,
                선택된_ID: googlePlaceId
            });
            
            if (!googlePlaceId) {
                console.error('❌ Google Place ID를 찾을 수 없습니다:', place);
                showToast('장소 ID가 없어 저장할 수 없습니다.');
                return;
            }

            console.log('💾 서버에 장소 저장 요청...');
            const serverResponse = await savePlaceToServer(googlePlaceId);
            
            if (serverResponse) {
                // 서버에서 받은 데이터로 장소 객체 생성
                const serverPlace = {
                    ...place, // 원본 장소 데이터 유지
                    ...serverResponse, // 서버 응답 데이터로 덮어쓰기
                    id: googlePlaceId, // Google Place ID 유지
                    place_id: googlePlaceId,
                    isEnabled: savedPlaces.length < 10 // 상위 10개는 활성화
                };

                console.log('✅ 서버 저장 성공, 로컬 상태 업데이트:', serverPlace);
                setSavedPlaces(prev => [...prev, serverPlace]);
                showToast('장소가 저장되었습니다.');
            } else {
                throw new Error('서버 응답이 없습니다.');
            }
            
        } catch (error) {
            console.error('❌ 장소 저장 실패:', error);
            const isNetworkError = error?.code === 'ERR_NETWORK' || error?.message === 'Network Error';
            if (isNetworkError) {
                // 네트워크 오류 시 로컬 컨텍스트에 임시 저장 (오프라인 모드)
                const localPlace = {
                    id: googlePlaceId,
                    place_id: googlePlaceId,
                    place_name: place.place_name || place.name,
                    name: place.name || place.place_name,
                    address: place.address || place.address_name || place.location,
                    address_name: place.address || place.address_name || place.location,
                    location: place.location || place.address || place.address_name,
                    place_photos: Array.isArray(place.place_photos) ? place.place_photos : [],
                    running_time: Array.isArray(place.running_time) ? place.running_time : [],
                    isEnabled: savedPlaces.length < 10
                };
                setSavedPlaces(prev => [...prev, localPlace]);
                showToast('네트워크 문제로 임시 저장했어요. 나중에 다시 동기화됩니다.');
            } else {
                showToast('장소 저장에 실패했습니다.');
            }
        }
    };

    // 장소를 제거하는 함수 (찜 해제 시 호출용)
    const removePlace = (placeOrId) => {
        console.log('🗑️ Context removePlace 함수 호출:', placeOrId);
        
        setSavedPlaces(prev => {
            let updated;
            if (typeof placeOrId === 'string') {
                // ID로 제거
                updated = prev.filter(p => p.id !== placeOrId);
            } else {
                // 객체로 제거 - 여러 필드 조합으로 더 정확하게 매칭
                updated = prev.filter(p => {
                    // ID가 있으면 ID로 매칭
                    if (p.id && placeOrId.id) {
                        return p.id !== placeOrId.id;
                    }
                    
                    // ID가 없으면 이름과 주소로 매칭 (여러 필드명 고려)
                    const placeName = p.place_name || p.name;
                    const placeAddress = p.address || p.address_name || p.location;
                    const targetName = placeOrId.place_name || placeOrId.name;
                    const targetAddress = placeOrId.address || placeOrId.address_name || placeOrId.location;
                    
                    return !(placeName === targetName && placeAddress === targetAddress);
                });
            }
            
            console.log('✅ 로컬 상태에서 장소 제거 완료');
            showToast('장소를 찜 목록에서 제거했습니다.');
            return updated;
        });
    };

    // useEffect로 초기 데이터 로드
    useEffect(() => {
        if (isInitialLoad) {
            console.log('🚀 초기 로드 useEffect 실행 - 서버에서 데이터 가져오기');
            setIsInitialLoad(false);
            loadSavedPlaces();
        }
    }, [isInitialLoad]);

    // 전체 삭제 핸들러
    const handleClearAll = () => {
        try {
            // 로컬 상태 비우기
            setSavedPlaces([]);
            // 세션 키도 삭제 (새로 시작)
            clearSessionKey();
            console.log('✅ 전체 삭제 완료 (로컬 상태 + 세션 키)');
            showToast('모든 찜한 장소를 삭제했습니다.');
        } catch (error) {
            console.error('❌ 전체 삭제 실패:', error);
            showToast('전체 삭제에 실패했습니다.');
        }
    };

    console.log('🎁 useLoadSavedPlace return 준비:', { 
        savedPlacesCount: savedPlaces.length,
        isLoading,
        sessionKey: getSessionKey() 
    });
    
    return {
        savedPlaces,
        setSavedPlaces,
        loadSavedPlaces,
        handleClearAll,
        addPlace,
        removePlace,
        isLoading
    };
};

export default useLoadSavedPlace;