import styled from 'styled-components';
import ImageSlider from '../common/ImageSlider.jsx';
import ad2 from '../../assets/images/ads_temp/temp2.JPG';
import ad3 from '../../assets/images/ads_temp/temp3.jpg';
import image2 from '../../assets/images/ads_temp/image2.png';

const AdsContainer = styled.section`
    width: 343px;
    height: fit-content;
    margin: 20px 0;
    display: flex;
    justify-content: center;
    box-sizing: border-box;
    position: relative;
    margin-bottom: 50px;
`;

const AdCard = styled.div`
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-around;
    background: #271932;
    font-weight: 600;
    color: #f3f4f6;
    text-align: center;
`;

const FirstAd = (
    <AdCard>
        <p>
            요즘 핫한 식당도<br />
            <span style={{ color: '#c6f62c' }}>예약</span>까지 한 번에
        </p>
        <img src={image2} />
    </AdCard>
);

/* 슬라이더 사용 예시 !! */

// 원하는 순서로 자유롭게 배치
const slides = [
    ad2,       // 1번째: 이미지2
    FirstAd,   // 2번째: 커스텀 박스 (이미지 말고 만들어놓은 컨테이너도 넣을 수 있음)
    ad3,       // 3번째: 이미지3
];

const Ads = () => {
    return (
        <AdsContainer>
            <ImageSlider
                slides={slides} /* 위에서 만든 리스트 */
                autoplay /* 자동 재생 on/off */
                interval={3000}
                width="343px"
                height="124px"
                showArrows={false} /* 넘김 화살표 on/off */
                dotsPlacement="below" //dots를 슬라이더 안에 할건지 밑에할건지
            />
        </AdsContainer>
    );
};

export default Ads;