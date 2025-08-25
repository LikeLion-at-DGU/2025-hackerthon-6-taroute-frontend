import styled from 'styled-components'
import { useMemo, useState } from 'react'
import { useSwipeable } from 'react-swipeable'
import BottomSheetSelect from '../common/BottomSheetSelect.jsx'
import { useTranslation } from "react-i18next";

const CATEGORIES = ['1', '2', '3', '4']

export function FilterBar({
    selectedCategory,
    onSelectCategory,
    distance,
    onChangeDistance,
    visitTime,
    onChangeVisitTime,
    visitDay,
    onChangeVisitDay,
}) {
    const { t } = useTranslation();
    const [sheet, setSheet] = useState({ type: null })
    const currentIndex = useMemo(() => {
        const i = CATEGORIES.indexOf(selectedCategory)
        return i === -1 ? 0 : i
    }, [selectedCategory])

    const swipe = useSwipeable({
        onSwipedLeft: (e) => {
            e.event.stopPropagation()
            onSelectCategory(CATEGORIES[(currentIndex + 1) % CATEGORIES.length])
        },
        onSwipedRight: (e) => {
            e.event.stopPropagation()
            onSelectCategory(CATEGORIES[(currentIndex - 1 + CATEGORIES.length) % CATEGORIES.length])
        },
        onSwiping: (e) => {
            // 수평 제스처만 처리
            if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) e.event.preventDefault()
        },
        delta: 20,
        preventScrollOnSwipe: true,
        trackTouch: true,
        trackMouse: true,
    })

    return (
        <Bar>
            <Chips {...swipe}>
                {CATEGORIES.map((c) => (
                    <Chip
                        key={c}
                        $active={selectedCategory === c}
                        onClick={() => onSelectCategory(c)}
                    >{t(`category.item${c}`)}
                    </Chip>
                ))}
            </Chips>

            <Selectors>
                <PillButton onClick={() => setSheet({ type: 'distance' })}>{distance || t("category.sortlocation")}</PillButton>
                <PillButton onClick={() => setSheet({ type: 'visitTime' })}>{visitTime || t("category.sorttime")}</PillButton>
                <PillButton onClick={() => setSheet({ type: 'visitDay' })}>{visitDay || t("category.sortday")}</PillButton>
                </Selectors>

            <BottomSheetSelect
              visible={sheet.type === 'distance'}
              title={t("category.sortlocation")}
              options={[
                { label: '전체', value: '전체' },
                { label: '500m 이내', value: '500m 이내' },
                { label: t("category.location1"), value: '1km 이내' },
                { label: t("category.location2"), value: '3km 이내' },
                { label: t("category.location3"), value: '5km 이내' },
              ]}
              value={distance}
              onSelect={(v) => { onChangeDistance(v); setSheet({ type: null }) }}
              onClose={() => setSheet({ type: null })}
            />

            <BottomSheetSelect
              visible={sheet.type === 'visitTime'}
              title={t("category.sorttime")}
              options={[
                { label: '전체', value: '전체' },
                { label: t("category.time1"), value: '아침 (6:00 - 12:00)' },
                { label: t("category.time2"), value: '낮 (12:00 - 17:00)' },
                { label: t("category.time3"), value: '저녁 (17:00 - 21:00)' },
                { label: t("category.time4"), value: '밤 (21:00 ~ 24:00)' },
                { label: t("category.time5"), value: '새벽 (00:00 ~ 6:00)' },
              ]}
              value={visitTime}
              onSelect={(v) => { onChangeVisitTime(v); setSheet({ type: null }) }}
              onClose={() => setSheet({ type: null })}
            />

            <BottomSheetSelect
              visible={sheet.type === 'visitDay'}
              title={t("category.sortday")}
              options={[
                { label: '전체', value: '전체' },
                { label: t("category.day1"), value: '월요일' },
                { label: t("category.day2"), value: '화요일' },
                { label: t("category.day3"), value: '수요일' },
                { label: t("category.day4"), value: '목요일' },
                { label: t("category.day5"), value: '금요일' },
                { label: t("category.day6"), value: '토요일' },
                { label: t("category.day7"), value: '일요일' },
              ]}
              value={visitDay}
              onSelect={(v) => { onChangeVisitDay(v === '전체' ? '' : v); setSheet({ type: null }) }}
              onClose={() => setSheet({ type: null })}
            />
        </Bar>
    )
}

const Bar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 10px; /* SearchBar와 간격 확보 */
`

const Chips = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 40px;
  border-bottom: 1px solid #c8c8c8;
  padding: 0 16px;
  gap: 18px;
  touch-action: pan-y;       /* 수직 스크롤만 허용 → 가로 스와이프 인식 */
  overscroll-behavior-x: contain;
  user-select: none;
`

const Chip = styled.button`
  background: transparent;
  border: none;
  border-bottom: 2px solid ${p => (p.$active ? '#ffc400' : 'transparent')};
  color: ${p => (p.$active ? '#ffc400' : '#2A2A2A')};
  font-weight: 600;
  font-size: 14px;
  padding: 8px 0;
  cursor: pointer;
`

const Selectors = styled.div`
  display: flex;
  gap: 6px;
  justify-content: flex-start;
  align-items: center;
`

const PillButton = styled.button`
  height: 32px;
  padding: 0 12px;
  border: 1.5px solid #bcbcbc;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.8);
  color: #555;
  font-size: 13px;
  cursor: pointer;
`


