import React, { useState } from "react";
import styled from "styled-components";
import check from "../../assets/icons/check.svg";
import arrow_down from "../../assets/icons/arrow-down.svg";

const SortBarContainer = styled.div`
    display: flex;
    justify-content: space-between;
    width: 343px;
    align-items: center;
    color: black;
    font-size: 14px;
    font-weight: 600;
    padding: 0 10px;
    margin-top: 30px;
`;

const Barbutton = styled.div`
    cursor: pointer;
`;

const BarbuttonInner = styled.span`
    display: flex;
    align-items: center;
    gap: 6px;
`;

const Overlay = styled.div`
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0, 0, 0, 0.717);
    z-index: 1000;
`;

const SelectContainer = styled.div`
    position: fixed;
    left: 0; right: 0; bottom: 0;
    background: #fff;
    border-radius: 16px 16px 0 0;
    box-shadow: 0 -2px 8px rgba(0,0,0,0.1);
    z-index: 1001;
    min-height: 200px;
    color: black;
    padding-bottom: 20px;
    padding-top: 3px;
    padding-left: 14px;
    padding-right: 14px;
`;

const Title = styled.p`
    font-weight: 600;
    margin-bottom: 16px;
    text-align: center;
    font-size: 18px;
    padding-bottom: 10px;
    border-bottom: 1px solid #F0F0F0;
`;

const OptionButton = styled.button`
    display: block;
    width: 100%;
    padding: 8px ;
    margin-bottom: 8px;
    font-size: 16px;
    background: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    color: black;
    text-align: left;
    font-weight: ${({ selected }) => (selected ? 700 : 400)};
`;

const OptionButtonInner = styled.span`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
`;

const sortOptions = [
    "정확도순",
    "거리순",
    "후기순",
    "인기순",
    "가격낮은순",
    "가격높은순"
];

export const SortBar = () => {
    const [showSelect, setShowSelect] = useState(false);
    const [select, setSelect] = useState("정확도순");

    const handleSelect = (option) => {
        setSelect(option);
        setShowSelect(false);
    };

    return (
        <>
            <SortBarContainer>
                <p>검색결과</p>
                <Barbutton onClick={() => setShowSelect(true)}>
                    <BarbuttonInner>
                        <p style={{ fontSize: "10px", fontWeight:"400" }}>{select}</p>
                        <img src={arrow_down} style={{ width: 10 }} />
                    </BarbuttonInner>
                </Barbutton>
            </SortBarContainer>
            {showSelect && (
                <>
                    <Overlay onClick={() => setShowSelect(false)} />
                    <SelectSort
                        onSelect={handleSelect}
                        selected={select}
                    />
                </>
            )}
        </>
    );
};

export const SelectSort = ({ onSelect, selected }) => {
    return (
        <SelectContainer>
            <Title>정렬 기준</Title>
            {sortOptions.map(option => (
                <OptionButton
                    key={option}
                    onClick={() => onSelect(option)}
                    selected={selected === option}
                >
                    <OptionButtonInner>
                        <span>{option}</span>
                        {selected === option && (
                            <img src={check} style={{ width: 14, height: 14 }} />
                        )}
                    </OptionButtonInner>
                </OptionButton>
            ))}
        </SelectContainer>
    );
};