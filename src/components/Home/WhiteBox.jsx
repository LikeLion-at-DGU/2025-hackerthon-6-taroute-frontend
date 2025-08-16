import Ads from "./Ads";
import SelectCategory from "./SelectCategory";
import styled from "styled-components";
import { useEffect, useRef, useState } from "react";
import title from '../../assets/icons/title.svg';
import restaurant from '../../assets/icons/category/restaurant.png'
import cafe from '../../assets/icons/category/cafe.png'
import culture from '../../assets/icons/category/culture.png'
import tour from '../../assets/icons/category/tour.png'
import wikibook from '../../assets/icons/wikibook.png'
import { useNavigate } from 'react-router-dom';
import useSheetDrag from "../../hooks/common/useSheetDrag";

const WhiteBoxContainer = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 50;
    display: flex;
    flex-direction: column;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    background: linear-gradient(90deg, #EBF3FF 0%, #F5F8FF 80%);
    /* 높이는 런타임에서 y에 따라 동적으로 설정 (height: calc(100dvh - y)) */
    width: 100%;
    align-items: center;
    box-sizing: border-box;
    box-shadow: 0 -8px 24px rgba(0,0,0,0.12);
    will-change: transform;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    overscroll-behavior: contain;
    margin-top: 60px;
    padding-bottom: 150px;
`;

const DragHandle = styled.div`
    position: sticky;
    top: 0;
    z-index: 2;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 8px 0 6px 0;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    touch-action: none; /* 가로/세로 스와이프 충돌 방지 */
    cursor: grab;
    &::before {
      content: "";
      width: 40px;
      height: 4px;
      border-radius: 2px;
      background: #E5E7EB;
    }
    &:active { cursor: grabbing; }
`;

const WhatWonder = styled.div`
    display: flex;
    flex-direction: column;
`;

const Title = styled.div`
    display: flex;
    color: #2A2A2A;
    align-items: center;
    font-weight: 500;
    font-size: 20px;
    gap: 15px;
    padding: 0px 10px 0px 2px;
    width: 343px;
    /* 기본 마진 리셋: p의 위아래 마진이 간격을 왜곡하지 않게 */
    & > p { margin: 0; }
     /* 이미지의 베이스라인 여백 제거 */
    & > img { display: block; }
`;

const CategoryContainer = styled.div`
    display: flex;
    justify-content: space-between;
    margin: 20px 0 15px 0;
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
    width: 60px;
    aspect-ratio: 1 / 1;  
    border-radius: 16px;
    background: white;
`;

const Icon = styled.img`
    height: auto;
    display: block;
`;

const Label = styled.span`
    margin: 0;
    font: inherit;
    line-height: 1.2;
    color: #2A2A2A;
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
    margin-bottom: 90px;
    gap: 8px;
`;


const WhiteBox = ({ expandedTop = 96, collapsedTop = 360 }) => {
    const navigate = useNavigate();

    const {
        y,
        dragging,
        onPointerDown,
        onPointerMove,
        onPointerUp,
        snapTo,
    } = useSheetDrag({ expandedTop, collapsedTop, start: 'collapsed' });

    return (
        <WhiteBoxContainer
            style={{
                transform: `translate3d(0, ${y}px, 0)`,
                height: `calc(100dvh - ${y}px)`,
                transition: dragging ? 'none' : 'transform 240ms cubic-bezier(0.22, 1, 0.36, 1), height 240ms cubic-bezier(0.22, 1, 0.36, 1)'
            }}
        >
            <DragHandle
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerUp}
            />
            <WhatWonder>
                <Title>
                    <p>카테고리별 장소</p>
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

                {/* 하 이거 혹시 쓰일까봐 일단  킵,,
                <GoWikiButton onClick={() => navigate('/Taro')}>
                    <img src={wikibook} />
                    <div className="text">
                        <p>식당의 리얼 후기가 궁금하다면?</p>
                        <p style={{ color: '#C6F62C', fontWeight: '600' }}>푸드 위키 보러가기 &gt;</p>
                    </div>
                </GoWikiButton>
                <hr style={{
                    border: '2px solid #F0F0F0',
                    width: '100%', marginTop: '20px'
                }} />  */}
                <Ads />
            </WhatWonder>
            <HotPlace>
                <Title>
                    <img src={title} />
                    <p style={{fontWeight:"600", fontSize:'20', color:'#2A2A2A'}}>요즘 뜨는 운명의 장소</p>
                </Title>
                <SelectCategory />
            </HotPlace>
        </WhiteBoxContainer>
    );
};

export default WhiteBox;