# Taro Components

타로 상담 플로우를 위한 React 컴포넌트들입니다.

## 구조

```
src/components/taro/
├── steps/           # 각 단계별 컴포넌트
├── styles/          # 스타일 파일들
└── README.md        # 이 파일
```

## Steps (단계별 컴포넌트)

### 1. IntroStep
- 타로 상담 시작 화면
- 배경: `bg_2.jpg`
- 시작 버튼으로 다음 단계 진행

### 2. ConsentStep
- 상담 동의 및 소개 화면
- 타루 마스코트와 대화
- 텍스트 애니메이션 포함

### 3. QuestionStep
- 사용자 질문 입력 단계

### 4. ConfirmStep
- 질문 확인 단계

### 5. ShuffleStep
- 카드 섞기 단계

### 6. SpreadStep
- 카드 펼치기 단계

### 7. ReadyStep
- 결과 준비 단계

### 8. ResultStep
- 최종 결과 표시

## Styles (스타일)

### CommonStep.style.js
- 모든 step에서 공통으로 사용하는 스타일
- 배경, 오버레이, 마스코트, 말풍선, 버튼 등

### 각 Step별 스타일
- `ConsentStep.style.js`: ConsentStep 전용 스타일
- `IntroStep.style.js`: IntroStep 전용 스타일 (다른 배경 사용)
- 기타 step들은 필요시 추가

## 사용법

### 기본 사용
```jsx
import ConsentStep from '../components/taro/steps/ConsentStep.jsx'

<ConsentStep 
  next={goNext} 
  prev={goPrev} 
  goTo={goTo} 
  index={currentStepIndex}
/>
```

### 공통 스타일 사용
```jsx
import {
  CommonWrapper,
  CommonOverlay,
  CommonTaruMascot
} from '../styles/CommonStep.style.js'

// 전용 스타일이 필요한 경우 확장
export const CustomWrapper = styled(CommonWrapper)`
  // 추가 스타일
`
```

## Hooks

### useTaroFlow
- 타로 플로우의 상태 관리
- 단계별 네비게이션
- 진행률 추적
- 전환 애니메이션 제어

### useTextAnimation
- 텍스트 타이핑 애니메이션
- 단계별 텍스트 표시
- 자동 진행 제어

## 주요 기능

1. **단계별 네비게이션**: 이전/다음 단계 이동
2. **진행률 표시**: 상단에 진행률 바 표시
3. **텍스트 애니메이션**: 타이핑 효과와 단계별 표시
4. **반응형 디자인**: 모바일 최적화
5. **접근성**: ARIA 라벨과 키보드 네비게이션 지원

## 개발 가이드

### 새로운 Step 추가
1. `steps/` 폴더에 새 컴포넌트 생성
2. 필요한 경우 `styles/` 폴더에 스타일 파일 생성
3. `Taro.jsx`의 `stepComponents` 배열에 추가
4. 공통 스타일 사용 고려

### 스타일 수정
1. 공통 스타일은 `CommonStep.style.js`에서 수정
2. 전용 스타일은 각 step별 스타일 파일에서 수정
3. 일관성 유지를 위해 공통 스타일 우선 사용

### 애니메이션 추가
1. `useTaroFlow`의 `isTransitioning` 상태 활용
2. CSS transition과 React state 조합
3. 성능을 고려한 애니메이션 구현
