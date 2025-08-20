import { useState, useEffect } from 'react';
import { showToast } from '../common/toast';

/**
 * 저장된 장소들을 관리하는 커스텀 훅
 * @returns {Object} { savedPlaces, setSavedPlaces, loadSavedPlaces, handleClearAll, addPlace }
 */
const useLoadSavedPlace = () => {
    const [savedPlaces, setSavedPlaces] = useState([]);
    const [isInitialLoad, setIsInitialLoad] = useState(true);


    // localStorage에서 저장된 장소들 로드
    const loadSavedPlaces = () => {
        try {
            console.log('🔄 저장된 장소 로딩 시작...');
            console.log('� localStorage에서 저장된 장소 조회 시도...');
            
            // localStorage에서 데이터 가져오기
            const localPlaces = JSON.parse(localStorage.getItem('favoritePlaces') || '[]');
            
            // localStorage 데이터 필드명 호환성 확보 및 활성화 상태 설정
            const normalizedPlaces = localPlaces.map((place, index) => ({
                ...place,
                // 필드명 통일
                place_name: place.place_name || place.name,
                address_name: place.address_name || place.location,
                name: place.name || place.place_name,
                location: place.location || place.address_name,
                // 상위 10개만 활성화, 기존에 isEnabled가 있으면 그 값을 존중
                isEnabled: place.isEnabled !== undefined ? place.isEnabled : (index < 10)
            }));
            
            setSavedPlaces(normalizedPlaces);
            
        } catch (error) { 
            // 에러 발생시 빈 배열로 초기화
            setSavedPlaces([]);
            console.log('🔄 에러 발생으로 빈 배열로 초기화');
        }
    };

    // 새로운 장소를 추가하는 함수 (찜하기 성공 후 호출용)
    const addPlace = (place) => {
        console.log('🔧 Context addPlace 함수 호출:', {
            받은장소데이터: place,
            place_photos존재: !!place.place_photos,
            place_photos길이: place.place_photos?.length,
            running_time존재: !!place.running_time,
            running_time길이: place.running_time?.length,
            모든키목록: Object.keys(place || {})
        });
        
        setSavedPlaces(prev => {
            // 최대 20개 제한 체크
            if (prev.length >= 20) {
                showToast('최대 20개 장소까지만 저장할 수 있습니다.');
                return prev;
            }
            
            // 더 정확한 중복 체크
            const isAlreadyExists = prev.some(p => {
                // ID가 있으면 ID로 매칭
                if (p.id && place.id) {
                    return p.id === place.id;
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
                return prev;
            }
            
            // 새로 추가되는 장소의 활성화 상태 결정
            // 상위 10개는 활성화, 나머지는 비활성화
            const newPlace = {
                ...place,
                isEnabled: prev.length < 10 // 현재까지 10개 미만이면 활성화
            };
            
            const updated = [...prev, newPlace];
            
            // localStorage에도 동기화
            try {
                localStorage.setItem('favoritePlaces', JSON.stringify(updated));
                console.log('💾 localStorage 동기화 완료');
                
                // 동기화 후 실제 localStorage 내용 확인
                const savedInStorage = JSON.parse(localStorage.getItem('favoritePlaces') || '[]');
            } catch (error) {
                console.error('❌ localStorage 동기화 실패:', error);
            }
            
            return updated;
        });
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

            // localStorage에도 동기화
            try {
                localStorage.setItem('favoritePlaces', JSON.stringify(updated));
                console.log('💾 localStorage 동기화 완료 (제거)');
            } catch (error) {
                console.error('❌ localStorage 동기화 실패 (제거):', error);
            }
            
            return updated;
        });
    };

    // useEffect로 초기 데이터 로드
    useEffect(() => {
        if (isInitialLoad) {
            console.log('� 초기 로드 useEffect 실행 - 서버에서 데이터 가져오기');
            setIsInitialLoad(false);
            loadSavedPlaces();
        }
    }, [isInitialLoad]);

    // 컴포넌트 마운트 시 useEffect 실행 보장
    useEffect(() => {
    }, []);

    // 전체 삭제 핸들러
    const handleClearAll = () => {
        try {
            
            // 로컬 상태와 localStorage 모두 비우기
            setSavedPlaces([]);
            localStorage.removeItem('favoritePlaces');
            console.log('✅ 전체 삭제 완료 (로컬 상태 + localStorage)');
        } catch (error) {
            console.error('❌ 전체 삭제 실패:', error);
        }
    };

    console.log('🎁 useLoadSavedPlace return 준비:', { savedPlacesCount: savedPlaces.length });
    
    return {
        savedPlaces,
        setSavedPlaces,
        loadSavedPlaces,
        handleClearAll,
        addPlace,
        removePlace
    };
};

export default useLoadSavedPlace;