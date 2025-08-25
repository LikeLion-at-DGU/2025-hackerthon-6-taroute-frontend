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
import { useTranslation } from "react-i18next";



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
    width: 100%;
    align-items: center;
    box-sizing: border-box;
    box-shadow: 0 -8px 24px rgba(0,0,0,0.12);
    will-change: transform;
    overflow-y: auto;
    overflow-x: hidden;
    &::-webkit-scrollbar {
        display: none;
    }

    scrollbar-width: none; 
    -ms-overflow-style: none;

    max-width: 375px;
    margin: 0 auto;
    /* 812px 프레임 기준으로 최대 높이 제한 */
    max-height: 712px;
    
`;

const DragHandle = styled.div`
    position: sticky;
    top: 0;
    z-index: 2;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 12px 0 8px 0;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    touch-action: none; /* 브라우저 기본 터치 동작 방지 */
    user-select: none; /* 텍스트 선택 방지 */
    cursor: grab;
    transition: opacity 0.2s ease;
    
    &::before {
        content: "";
        width: 40px;
        height: 4px;
        border-radius: 2px;
        background: #E5E7EB;
        transition: all 0.2s ease;
    }
    
    &:hover::before {
        background: #9CA3AF;
        height: 5px;
    }
    
    &:active { 
        cursor: grabbing; 
        opacity: 0.7;
    }
    
    /* 모바일에서 더 큰 터치 영역 */
    @media (max-width: 768px) {
        padding: 16px 0 12px 0;
        
        &::before {
            width: 48px;
            height: 5px;
        }
    }
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
    margin-bottom: 60px;
    gap: 8px;
`;


const WhiteBox = ({ expandedTop = 96, collapsedTop = 360 }) => {
    const navigate = useNavigate();
    const { t } = useTranslation();


    const {
        y,
        dragging,
        onPointerDown,
    } = useSheetDrag({ expandedTop, collapsedTop, start: 'collapsed' });

    return (
        <WhiteBoxContainer
            style={{
                transform: `translate3d(0, ${y}px, 0)`,
                height: `${712 - y}px`, // 고정된 812px 프레임 기준으로 계산
                maxHeight: `${712 - y}px`,
                minHeight: `${712 - y}px`, // 최소 높이도 설정해서 강제로 스크롤 생성
                transition: dragging ? 'none' : 'transform 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94), height 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            }}
        >
            <DragHandle
                onPointerDown={onPointerDown}
                onTouchStart={onPointerDown}
            />
            <WhatWonder>
                <Title>
                    <p>{t("home.category")}</p>
                </Title>
                <CategoryContainer>
                    <CategoryItem onClick={() => navigate('/category', { state: { initialCategory: '식당' } })}> {/* 식당 */}
                        <Tile>
                            <Icon src={restaurant} />
                        </Tile>
                        <Label>{t("home.item1")}</Label>
                    </CategoryItem>
                    <CategoryItem onClick={() => navigate('/category', { state: { initialCategory: '카페' } })}> {/* 카페 */}
                        <Tile>
                            <Icon src={cafe} />
                        </Tile>
                        <Label>{t("home.item2")}</Label>
                    </CategoryItem>
                    <CategoryItem onClick={() => navigate('/category', { state: { initialCategory: '문화시설' } })}> {/* 문화시설 */}
                        <Tile>
                            <Icon src={culture} />
                        </Tile>
                        <Label>{t("home.item3")}</Label>
                    </CategoryItem>
                    <CategoryItem onClick={() => navigate('/category', { state: { initialCategory: '관광명소' } })}> {/* 관광명소 */}
                        <Tile>
                            <Icon src={tour} />
                        </Tile>
                        <Label>{t("home.item4")}</Label>
                    </CategoryItem>
                </CategoryContainer>

                {/* 하 이거 혹시 쓰일까봐 일단  킵,,
                <GoWikiButton onClick={() => navigate('/taro')}>
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
                    <p style={{ fontWeight: "600", fontSize: '20', color: '#2A2A2A' }}>{t("home.recent")}</p>
                </Title>
                <SelectCategory />
            </HotPlace>
        </WhiteBoxContainer>
    );
};

export default WhiteBox;