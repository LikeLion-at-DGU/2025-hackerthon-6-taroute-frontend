import Ads from "./Ads";
import SelectCategory from "./SelectCategory";
import styled from "styled-components";
import title from '../../assets/icons/title.svg';
import restaurant from '../../assets/icons/category/restaurant.svg'
import cafe from '../../assets/icons/category/cafe.svg'
import culture from '../../assets/icons/category/culture.svg'
import tour from '../../assets/icons/category/tour.svg'
import wikibook from '../../assets/icons/wikibook.svg'
import { useNavigate } from 'react-router-dom';

const WhiteBoxContainer = styled.div`
    display: flex;
    flex-direction: column;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    background-color: white;
    height: 100%;
    width: 100%;
    align-items: center;
    padding-bottom: 40px;
`;

const WhatWonder = styled.div`
    display: flex;
    flex-direction: column;
`;

const Title = styled.div`
    display: flex;
    color: black;
    align-items: center;
    font-weight: 700;
    font-size: 18px;
    gap: 15px;
    padding: 20px 10px 0px 2px;
    width: 343px;
    /* 기본 마진 리셋: p의 위아래 마진이 간격을 왜곡하지 않게 */
    & > p { margin: 0; }
     /* 이미지의 베이스라인 여백 제거 */
    & > img { display: block; }
`;

const CategoryContainer = styled.div`
    display: flex;
    justify-content: space-between;
    margin: 15px 0 20px 0;
    border-top: 1px solid #F0F0F0;
    padding-top: 20px;
`;

const CategoryItem = styled.button`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    padding: 0;
    border: 0;
    background: none;
    cursor: pointer;
    font: inherit;        /* ← 전역 폰트 상속 */
    font-size: 14px;
`;

const Tile = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 72px;
    aspect-ratio: 1 / 1;  
    border-radius: 16px;
    background: #f5f5f5;
`;

const Icon = styled.img`
    height: auto;
    display: block;
`;

const Label = styled.span`
    margin: 0;
    font: inherit;
    line-height: 1.2;
`;


const GoWikiButton = styled.div`
    display: flex;
    width: 343px;
    height: 124px;
    background-color: #271932;
    font-size: 14px;
    align-items: center;
    gap: 15px;
    padding: 15px 0 15px 15px;
    border-radius: 12px;
    cursor: pointer;
`;

const HotPlace = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
`;


const WhiteBox = () => {
    const navigate = useNavigate();

    return (
        <WhiteBoxContainer>
            <WhatWonder>
                <Title>
                    <img src={title} />
                    <p>어떤게 궁금하세요?</p>
                </Title>
                <CategoryContainer>
                    <CategoryItem> {/* 식당 */}
                        <Tile>
                            <Icon src={restaurant} />
                        </Tile>
                        <Label>식당</Label>
                    </CategoryItem>
                    <CategoryItem> {/* 카페 */}
                        <Tile>
                            <Icon src={cafe} />
                        </Tile>
                        <Label>카페</Label>
                    </CategoryItem>
                    <CategoryItem> {/* 문화시설 */}
                        <Tile>
                            <Icon src={culture} />
                        </Tile>
                        <Label>문화시설</Label>
                    </CategoryItem>
                    <CategoryItem> {/* 관광명소 */}
                        <Tile>
                            <Icon src={tour} />
                        </Tile>
                        <Label>관광명소</Label>
                    </CategoryItem>
                </CategoryContainer>
                <GoWikiButton onClick={() => navigate('/Taro')}>
                    <img src={wikibook} />
                    <div class="text">
                        <p>식당의 리얼 후기가 궁금하다면?</p>
                        <p style={{color:'#C6F62C', fontWeight:'600'}}>푸드 위키 보러가기 &gt;</p>
                    </div>
                </GoWikiButton>
                <hr style={{border:'2px solid #F0F0F0', 
                    width:'100%', marginTop:'20px'}} />
            </WhatWonder>
            <HotPlace>
                <Title>
                    <img src={title} />
                    <p>지금 이 지역에서 뜨고 있는</p>
                </Title>
                <SelectCategory />
                <Ads />
            </HotPlace>
        </WhiteBoxContainer>
    );
};

export default WhiteBox;