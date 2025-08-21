import { useState, useEffect } from 'react';

/**
 * 사용자가 Location 페이지에서 선택한 위치 정보를 관리하는 커스텀 훅
 * localStorage에 저장된 위치 정보를 읽어오고, 변경사항을 감지합니다.
 * 
 * @returns {Object} 
 * @returns {Object} return.location - 선택된 위치 정보 { x: 경도, y: 위도 }
 * @returns {string|null} return.address - 선택된 위치의 주소
 * @returns {string|null} return.fullAddress - 선택된 위치의 전체 주소
 * @returns {boolean} return.isDefault - 기본값(서울 중심부)을 사용하는지 여부
 */
export const useSelectedLocation = () => {
  const [locationData, setLocationData] = useState(null);
  
  // 기본값: 서울 중심부
  const DEFAULT_LOCATION = {
    x: 126.9780, // 경도
    y: 37.5665   // 위도
  };

  const getSelectedLocation = () => {
    try {
      const savedLocation = localStorage.getItem('selectedLocation');
      if (savedLocation) {
        const locationData = JSON.parse(savedLocation);
        return {
          location: {
            x: locationData.coordinates?.lng || DEFAULT_LOCATION.x,
            y: locationData.coordinates?.lat || DEFAULT_LOCATION.y,
          },
          address: locationData.address || null,
          fullAddress: locationData.fullAddress || null,
          isDefault: false
        };
      }
    } catch (error) {
      console.error('저장된 위치 정보를 불러올 수 없습니다:', error);
    }
    
    // 저장된 위치가 없으면 기본값 반환
    return {
      location: DEFAULT_LOCATION,
      address: '서울 중심부',
      fullAddress: '서울특별시 중구',
      isDefault: true
    };
  };

  // 컴포넌트 마운트시 위치 정보 로드
  useEffect(() => {
    const updateLocation = () => {
      setLocationData(getSelectedLocation());
    };

    // 초기 로드
    updateLocation();

    // localStorage 변경 감지 (다른 탭에서 위치가 변경될 때)
    const handleStorageChange = (e) => {
      if (e.key === 'selectedLocation') {
        updateLocation();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // 같은 탭에서의 변경사항 감지를 위한 커스텀 이벤트
    const handleLocationUpdate = () => {
      updateLocation();
    };

    window.addEventListener('locationUpdated', handleLocationUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('locationUpdated', handleLocationUpdate);
    };
  }, []);

  return locationData || {
    location: DEFAULT_LOCATION,
    address: '서울 중심부',
    fullAddress: '서울특별시 중구',
    isDefault: true
  };
};

/**
 * 위치 정보가 업데이트되었을 때 다른 컴포넌트에 알리는 헬퍼 함수
 */
export const triggerLocationUpdate = () => {
  window.dispatchEvent(new CustomEvent('locationUpdated'));
};
