import React from 'react';
import styled from 'styled-components';
import searchIcon from '../../assets/icons/search.svg';

const Bar = styled.form`
    width: 343px;
    height: 51px;
    flex-shrink: 0;        /* 부모가 column flex일 때 눌림 방지 */
    margin: 0 auto 24px;   /* 가운데 정렬 + 바깥쪽 아래 여백 */
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
    border: ${({ $bordered, $borderColor, $borderWidth }) => (
        $bordered ? `${$borderWidth || '1px'} solid ${$borderColor || '#000'}` : 'none'
    )};
    cursor: ${props => (props.$clickable ? 'pointer' : 'text')};
    margin: 0 auto;        /* 박스 내부 여백 제거, 바깥 여백은 Bar에서 담당 */
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
    border: ${({ $bordered, $borderColor, $borderWidth }) => (
        $bordered ? `${$borderWidth || '1px'} solid ${$borderColor || '#000'}` : 'none'
    )};
    cursor: pointer;
    margin: 24px auto;
    box-sizing: border-box; /* padding 포함해서 총 높이 51px 유지 */
    flex: 0 0 auto;         /* flex 줄어듦 방지 */
`;

const SearchIconImg = styled.img`
  width: 17px;
  height: 17px;
  flex: 0 0 auto;
`;

const PlaceholderText = styled.span`
  color: #8A8A8A;
  font-size: 14px;
`;

const Input = styled.input`
    flex: 1 1 auto;
    border: none;
    outline: none;
    font-size: 14px;
    background: transparent;
    &::placeholder { color: #8A8A8A; } /* gray-400 */
    color: black;
    font-weight: 400;
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
    bordered = false,
    borderColor = '#000',
    borderWidth = '1px',
}) {
    const handleSubmit = (e) => {
        e.preventDefault();
        if (onSubmit) onSubmit();
    };

    if (asButton) {
        return (
            <ButtonLike type="button" onClick={onClick} aria-label="검색 열기" $bordered={bordered} $borderColor={borderColor} $borderWidth={borderWidth}>
                <PlaceholderText>{placeholder}</PlaceholderText>
                <SearchIconImg src={searchIcon} />
            </ButtonLike>
        );
    }

    return (
        <Bar role="search" onSubmit={handleSubmit}>
            <Box $clickable={readOnly} onClick={readOnly ? onClick : undefined} $bordered={bordered} $borderColor={borderColor} $borderWidth={borderWidth}>
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
                <SearchIconImg src={searchIcon} onClick={handleSubmit} style={{ cursor: "pointer" }} />
            </Box>
        </Bar>
    );
}