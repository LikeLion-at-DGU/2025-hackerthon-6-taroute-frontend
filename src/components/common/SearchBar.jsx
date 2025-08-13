import React from 'react';
import styled from 'styled-components';
import searchIcon from '../../assets/icons/search.svg';

const Bar = styled.form`
    width: 343px;
    height: 51px;
    flex-shrink: 0;        /* 부모가 column flex일 때 눌림 방지 */
`;

const Box = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 343px;
    height: 51px;
    padding: 6px 22px 6px 15px;
    border-radius: 30px;
    background: #fff;
    cursor: ${props => (props.$clickable ? 'pointer' : 'text')};
    font-family: MaruBuri;
    margin: 20px;
    box-sizing: border-box; /* padding 포함해서 총 높이 51px 유지 */
    flex: 0 0 auto;         /* flex 줄어듦 방지 */
`;

const ButtonLike = styled.button`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 343px;
    height: 51px;
    padding: 6px 22px 6px 15px;
    border-radius: 30px;
    background: #fff;
    cursor: pointer;
    font-family: MaruBuri;
    margin: 20px;
    box-sizing: border-box; /* padding 포함해서 총 높이 51px 유지 */
    flex: 0 0 auto;         /* flex 줄어듦 방지 */
`;

const SearchIconImg = styled.img`
  width: 17px;
  height: 17px;
  flex: 0 0 auto;
`;

const PlaceholderText = styled.span`
  color: gray;
  font-size: 13px;
`;

const Input = styled.input`
  flex: 1 1 auto;
  border: none;
  outline: none;
  font-size: 15px;
  background: transparent;
  &::placeholder { color: #9ca3af; } /* gray-400 */
`;

export default function SearchBar({
    placeholder = '검색어를 입력해주세요',
    value, /*입력 값(문자열)  */
    onChange, /* 값이 바뀔때마다 호출 */
    onSubmit,
    onKeyDown, /* 키를 누르는 순간마다 실행 */
    onClick,
    autoFocus = false, /* 커서 깜빡임 */
    name,
    asButton = false,
    readOnly = false,
}) {
    const handleSubmit = (e) => {
        e.preventDefault();
        if (onSubmit) onSubmit();
    };

    if (asButton) {
        return (
            <ButtonLike type="button" onClick={onClick} aria-label="검색 열기">
                <PlaceholderText>{placeholder}</PlaceholderText>
                <SearchIconImg src={searchIcon} />
            </ButtonLike>
        );
    }

    return (
        <Bar role="search" onSubmit={handleSubmit}>
            <Box $clickable={readOnly} onClick={readOnly ? onClick : undefined}>
                <SearchIconImg src={searchIcon}/>
                <Input
                    type="text"
                    name={name}
                    placeholder={placeholder}
                    value={value ?? ''}
                    onChange={onChange ? (e) => onChange(e.target.value) : undefined}
                    onKeyDown={onKeyDown}
                    autoFocus={autoFocus}
                    inputMode="search"
                />
            </Box>
        </Bar>
    );
}