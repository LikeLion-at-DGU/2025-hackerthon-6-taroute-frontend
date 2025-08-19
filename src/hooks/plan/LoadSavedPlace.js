import { useState, useEffect } from 'react';
import { getSavedPlaces } from '../../apis/savePlaceApi';
import { showToast } from '../common/toast';

/**
 * 저장된 장소들을 관리하는 커스텀 훅
 * @returns {Object} { savedPlaces, setSavedPlaces, loadSavedPlaces, handleClearAll, addPlace }
 */
const useLoadSavedPlace = () => {
    const [savedPlaces, setSavedPlaces] = useState([]);

    // 서버에서 저장된 장소들 로드
    const loadSavedPlaces = async () => {
        try {
            console.log('🔄 저장된 장소 로딩 시작...');
            console.log('📡 서버에서 저장된 장소 조회 시도...');
            
            const serverPlaces = await getSavedPlaces();
            console.log('✅ 서버에서 가져온 저장된 장소들:', serverPlaces);
            console.log('📊 데이터 상세 정보:', {
                type: typeof serverPlaces,
                isArray: Array.isArray(serverPlaces),
                length: Array.isArray(serverPlaces) ? serverPlaces.length : 'Not an array',
                data: serverPlaces
            });
            
            // 서버에서 데이터를 가져올 수 있으면 서버 데이터 사용
            if (serverPlaces && Array.isArray(serverPlaces) && serverPlaces.length > 0) {
                // 상위 10개만 활성화 상태로 설정
                const processedPlaces = serverPlaces.map((place, index) => ({
                    ...place,
                    isEnabled: place.isEnabled !== undefined ? place.isEnabled : (index < 10)
                }));
                
                setSavedPlaces(processedPlaces);
                console.log('📡 서버 데이터 사용 (활성화 상태 처리 완료)');
            } else {
                // 서버에 데이터가 없으면 localStorage 확인 (임시 해결책)
                const localPlaces = JSON.parse(localStorage.getItem('favoritePlaces') || '[]');
                
                // localStorage 데이터 필드명 호환성 확보 및 활성화 상태 설정
                const normalizedPlaces = localPlaces.map((place, index) => ({
                    ...place,
                    // 필드명 통일 (서버 응답 형식에 맞춤)
                    place_name: place.place_name || place.name,
                    address_name: place.address_name || place.location,
                    name: place.name || place.place_name,
                    location: place.location || place.address_name,
                    // 상위 10개만 활성화, 기존에 isEnabled가 있으면 그 값을 존중
                    isEnabled: place.isEnabled !== undefined ? place.isEnabled : (index < 10)
                }));
                
                console.log('📱 localStorage 원본 데이터:', localStorage.getItem('favoritePlaces'));
                console.log('📱 localStorage 파싱된 데이터:', localPlaces);
                console.log('📱 localStorage 정규화된 데이터:', normalizedPlaces);
                setSavedPlaces(normalizedPlaces);
                console.log('📱 서버에 데이터가 없어서 localStorage 사용:', normalizedPlaces);
            }
            
        } catch (error) {
            console.error('❌ 서버에서 저장된 장소 조회 실패:', error);
            console.error('상세 에러:', {
                message: error.message,
                status: error.response?.status,
                statusText: error.response?.statusText,
                data: error.response?.data
            });
            
            // 서버 실패시 localStorage 사용
            const localPlaces = JSON.parse(localStorage.getItem('favoritePlaces') || '[]');
            
            // localStorage 데이터 필드명 호환성 확보 및 활성화 상태 설정
            const normalizedPlaces = localPlaces.map((place, index) => ({
                ...place,
                place_name: place.place_name || place.name,
                address_name: place.address_name || place.location,
                name: place.name || place.place_name,
                location: place.location || place.address_name,
                // 상위 10개만 활성화, 기존에 isEnabled가 있으면 그 값을 존중
                isEnabled: place.isEnabled !== undefined ? place.isEnabled : (index < 10)
            }));
            
            setSavedPlaces(normalizedPlaces);
            console.log('🔄 서버 실패 -> localStorage 대체 사용 (정규화 + 활성화 처리):', normalizedPlaces);
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
            
            console.log('✅ Context 상태 업데이트 완료:', {
                이전상태: prev,
                추가된장소: newPlace,
                업데이트된상태: updated,
                추가된장소사진: newPlace.place_photos,
                추가된장소영업시간: newPlace.running_time,
                총개수: updated.length,
                활성화상태: newPlace.isEnabled
            });
            
            // localStorage에도 동기화
            try {
                localStorage.setItem('favoritePlaces', JSON.stringify(updated));
                console.log('💾 localStorage 동기화 완료');
                
                // 동기화 후 실제 localStorage 내용 확인
                const savedInStorage = JSON.parse(localStorage.getItem('favoritePlaces') || '[]');
                console.log('🔍 localStorage 동기화 후 확인:', {
                    저장된데이터: savedInStorage,
                    마지막항목: savedInStorage[savedInStorage.length - 1],
                    마지막항목사진: savedInStorage[savedInStorage.length - 1]?.place_photos,
                    마지막항목영업시간: savedInStorage[savedInStorage.length - 1]?.running_time
                });
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
            
            console.log('✅ Context 상태에서 장소 제거 완료:', {
                제거대상: placeOrId,
                이전상태길이: prev.length,
                업데이트된상태길이: updated.length,
                제거된개수: prev.length - updated.length
            });
            
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

    // 컴포넌트 마운트 시 데이터 로드
    useEffect(() => {
        loadSavedPlaces();

        // 주기적으로 서버와 동기화 (30초마다로 증가) - 드래그 앤 드롭 기능과 충돌을 피하기 위해 비활성화
        // const interval = setInterval(() => {
        //     console.log('⏰ 주기적 동기화...');
        //     loadSavedPlaces();
        // }, 30000);

        // return () => {
        //     clearInterval(interval);
        // };
    }, []);

    // 전체 삭제 핸들러
    const handleClearAll = async () => {
        try {
            console.log('🗑️ 전체 삭제 시도...');
            
            // TODO: 서버에서 모든 저장된 장소 삭제하는 API가 있다면 호출
            // await deleteAllSavedPlaces(); 
            
            // 로컬 상태와 localStorage 모두 비우기
            setSavedPlaces([]);
            localStorage.removeItem('favoritePlaces');
            console.log('✅ 전체 삭제 완료 (로컬 상태 + localStorage)');
        } catch (error) {
            console.error('❌ 전체 삭제 실패:', error);
        }
    };

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