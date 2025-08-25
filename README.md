# Taroute Frontend

<img width="1920" height="1080" alt="ppt 1" src="https://github.com/user-attachments/assets/d01ece31-533a-4d1a-9a68-966f4731ea6a" />

<br/>
<br/>
2025 멋쟁이사자처럼 중앙해커톤 동국대 6팀 **taroute** 프론트엔드 레포지토리입니다.  
**Taroute**는 **Tarot(타로)** 와 **Route(경로)** 를 결합한 웹 앱으로, 사용자의 감정/상황에 맞는 Tarot 상담을 통해 최적의 장소 추천과 동선 계획을 제공합니다.  
"Taru"라는 Tarot 마스터 캐릭터가 안내하며, **위치 기반 검색**, **위키 스타일 장소 정보**, **공유 기능**을 지원합니다.
<br/>
<br/>

---

## 📌 프로젝트 개요
- **주요 테마**: Tarot 상담 + 위치 기반 장소 추천 + 동선 계획  
- **타겟 사용자**: 여행자, 데이트/여가 계획자, Tarot에 관심 있는 사람  
- **주요 기능**
  - **Tarot 상담**: 사용자 질문과 위치를 입력받아 Tarot 카드를 뽑고, AI 기반으로 장소 추천  
    (예: "슬픈 날"에 맞는 카페/공원 추천)
  - **장소 검색/추천**: 카테고리(카페, 레스토랑, 관광, 문화)별 검색, 트렌드 키워드 기반 추천, 위키 검색
  - **동선 계획**: 찜한 장소로 루트 생성, 드래그 앤 드롭 순서 변경, 교통 수단(자동차/대중교통/도보) 선택, 캘린더 연동
  - **위키 시스템**: 장소 상세 정보(AI 요약, 사진, 운영 시간, 리뷰), 리뷰 작성/신고 기능
  - **공유**: 생성된 동선/장소 리스트를 링크로 공유
  - **기타**: 다국어 지원(한국어/영어), 현재 위치 자동 감지, 즐겨찾기(찜) 관리

---

## 🛠 기술 스택
- **프레임워크**: React (v18.3.1)  
- **빌드 도구**: Vite (v7.1.0)  
- **라우팅**: React Router (v7.8.0)  
- **상태 관리**: Recoil (v0.7.7)  
- **스타일링**: Styled Components (v6.1.19), Framer Motion (v12.23.12) for animations  
- **국제화**: i18next (v25.4.1), React i18next (v15.7.2)  
- **드래그 앤 드롭**: React DnD (v16.0.1)  
- **API 통신**: Axios (v1.11.0)  
- **기타**: Font Awesome, React Swipeable  

---

## 📄 페이지 소개

### 1. 메인페이지, 스크롤된 화면, 다국어 버튼

<img width="476" height="1026" alt="KakaoTalk_Photo_2025-08-25-22-54-37 001" src="https://github.com/user-attachments/assets/46158b20-214b-4775-b3a6-b58959cfda86" />


### 2. 장소 검색 및 추천

<img width="461" height="890" alt="KakaoTalk_Photo_2025-08-25-22-54-43 003" src="https://github.com/user-attachments/assets/bf83e080-d676-4c55-84e5-2b5323edf075" />


### 3. 플랜페이지, 스크롤된 화면


<img width="471" height="1033" alt="KakaoTalk_Photo_2025-08-25-22-54-45 005" src="https://github.com/user-attachments/assets/e70bbc33-49a7-4899-9789-8ec826d99dc1" />


### 4. 동선페이지


<img width="479" height="1048" alt="KakaoTalk_Photo_2025-08-25-22-54-47 006" src="https://github.com/user-attachments/assets/147b6ddc-76d6-4b69-80c9-fcd769f967dc" />



### 5. 위키페이지


<img width="474" height="1038" alt="KakaoTalk_Photo_2025-08-25-22-54-49 009" src="https://github.com/user-attachments/assets/3a36ae1c-a3bc-49b6-be85-a86b604a040e" />


### 6. 푸드위키, 위키 작성, 신고


<img width="477" height="1008" alt="KakaoTalk_Photo_2025-08-25-22-54-50 010" src="https://github.com/user-attachments/assets/d30f581d-6205-4549-861e-324c117894fd" />






