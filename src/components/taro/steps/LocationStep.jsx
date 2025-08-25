import { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import { Wrapper, Overlay, BackButton } from '../styles/ConsentStep.style.js'
import Map from '../../Location/Map.jsx'
import locationIcon from '../../../assets/icons/location.svg'
import { useTranslation } from "react-i18next";


const Panel = styled.div`
  position: relative;
  z-index: 10;
  width: 100%;
  height: 812px;
  display: flex;
  flex-direction: column;
`

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 18px 20px 12px;
  color: #fff;
  align-items: center;
  text-align: center;
`

const Title = styled.div`
  font-family: MaruBuriOTF;
  font-size: 18px;
  font-weight: 800;
  letter-spacing: -0.3px;
  text-align: center;
`

const Hint = styled.div`
  font-family: MaruBuriOTF;
  font-size: 13px;
  opacity: 0.9;
  text-align: center;
`

const AddressBar = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0 20px 12px;
  padding: 12px 14px;
  border-radius: 12px;
  background: rgba(255,255,255,0.92);
  color: #2A2A2A;
  box-shadow: 0 6px 18px rgba(0,0,0,0.25);
`

const AddressIcon = styled.img`
  width: 18px;
  height: 18px;
  opacity: 0.85;
`

const AddressText = styled.div`
  font-family: MaruBuriOTF;
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const MapBox = styled.div`
  flex: 1;
  min-height: 0;
  border-radius: 12px;
  overflow: hidden;
  margin: 0 16px;
  box-shadow: 0 10px 24px rgba(0,0,0,0.35);
`

const FooterActions = styled.div`
  display: flex;
  gap: 12px;
  padding: 14px 16px 18px;
`

const GhostButton = styled.button`
  flex: 1;
  height: 48px;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.7);
  background: rgba(255,255,255,0.06);
  color: #fff;
  font-family: MaruBuriOTF;
  font-weight: 700;
  cursor: pointer;
`

const PrimaryButton = styled.button`
  flex: 2;
  height: 48px;
  border-radius: 12px;
  border: none;
  background: #6C5CE7;
  color: #fff;
  font-family: MaruBuriOTF;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 8px 22px rgba(0,0,0,0.35);
`

function LocationStep({ goTo }) {
  const { t } = useTranslation();
  const [markerPosition, setMarkerPosition] = useState({ lat: 37.566826, lng: 126.9786567 })
  const [isLoading, setIsLoading] = useState(false)
  const [address, setAddress] = useState('')

  const getCurrentPosition = useCallback(() => {
    if (!navigator.geolocation) return
    setIsLoading(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        setMarkerPosition({ lat: latitude, lng: longitude })
        setIsLoading(false)
      },
      () => setIsLoading(false),
      { enableHighAccuracy: true, maximumAge: 60000, timeout: 10000 }
    )
  }, [])

  useEffect(() => {
    getCurrentPosition()
  }, [getCurrentPosition])

  const handleConfirm = () => {
    // 사용자가 선택한 위치 저장 후 질문 단계로 복귀
    sessionStorage.setItem('user_selected_location', JSON.stringify(markerPosition))
    sessionStorage.setItem('taro_resume_after_location', '1')
    if (typeof goTo === 'function') goTo(2) // QuestionStep
  }

  // 역지오코딩: 마커 좌표가 바뀔 때 주소 갱신 (지도가 콜백을 제공하지 않는 경우 대비)
  useEffect(() => {
    const { kakao } = window
    if (!kakao?.maps?.services) return
    try {
      const geocoder = new kakao.maps.services.Geocoder()
      geocoder.coord2Address(markerPosition.lng, markerPosition.lat, (result, status) => {
        if (status === kakao.maps.services.Status.OK) {
          const addr = result?.[0]?.address?.address_name || result?.[0]?.road_address?.address_name
          if (addr) setAddress(addr)
        }
      })
    } catch {}
  }, [markerPosition])

  return (
    <Wrapper>
      <Overlay style={{ pointerEvents: 'none' }} />
      <BackButton onClick={() => goTo(2)} />
      <Panel>
        <Header>
          <Title>{t("taro.locate")}</Title>
          <Hint>{t("taro.map")}<br></br> {t("taro.marker")}</Hint>
        </Header>

        <AddressBar>
          <AddressIcon src={locationIcon} alt="위치" />
          <AddressText>{address ? address : t("taro.addressing")}</AddressText>
        </AddressBar>

        <MapBox>
          <Map
            currentLocation={markerPosition}
            centerLocation={markerPosition}
            markerPosition={markerPosition}
            onMarkerDragEnd={setMarkerPosition}
            isDraggable
          />
        </MapBox>

        <FooterActions>
          <GhostButton type="button" onClick={getCurrentPosition} disabled={isLoading}>
            {isLoading ? t("taro.nowlocation") : t("taro.nowlocate")}
          </GhostButton>
          <PrimaryButton type="button" onClick={handleConfirm}>{t("taro.fixlocate")}</PrimaryButton>
        </FooterActions>
      </Panel>
    </Wrapper>
  )
}

export default LocationStep


