import { useState, useRef, useEffect } from "react";

function useSheetDrag({ expandedTop, collapsedTop, start = "collapsed" }) {
    const [y, setY] = useState(start === "expanded" ? expandedTop : collapsedTop);
    const [dragging, setDragging] = useState(false);
    const startRef = useRef({ startY: 0, startOffset: 0, startTime: 0 });
    const initRef = useRef(false);

    // expandedTop / collapsedTop이 바뀔 때 보정
    useEffect(() => {
        if (!initRef.current) {
            setY(start === "expanded" ? expandedTop : collapsedTop);
            initRef.current = true;
            return;
        }
        setY(prev => Math.max(expandedTop, Math.min(collapsedTop, prev)));
    }, [expandedTop, collapsedTop, start]);

    const onPointerDown = (e) => {
        e.preventDefault();
        e.currentTarget.setPointerCapture?.(e.pointerId);
        setDragging(true);
        const clientY = e.clientY ?? (e.touches ? e.touches[0].clientY : 0);
        startRef.current.startY = clientY;
        startRef.current.startOffset = y;
        startRef.current.startTime = Date.now();
    };

    const onPointerMove = (e) => {
        if (!dragging) return;
        e.preventDefault();
        const clientY = e.clientY ?? (e.touches ? e.touches[0].clientY : 0);
        const delta = clientY - startRef.current.startY;
        const next = Math.max(
            expandedTop,
            Math.min(collapsedTop, startRef.current.startOffset + delta)
        );
        setY(next);
    };

    const onPointerUp = () => {
        if (!dragging) return;
        setDragging(false);
        
        const totalDistance = collapsedTop - expandedTop;
        const currentDistance = y - expandedTop;
        const dragTime = Date.now() - startRef.current.startTime;
        const dragDistance = Math.abs(y - startRef.current.startOffset);
        const velocity = dragDistance / Math.max(dragTime, 1); // px/ms
        
        // 빠른 드래그 감지 (0.5px/ms 이상)
        const isFastDrag = velocity > 0.5;
        
        // 더 쉽게 확장되도록 임계값을 60%로 조정 (원래 50%)
        const threshold = totalDistance * 0.6;
        
        let target;
        if (isFastDrag) {
            // 빠른 드래그인 경우 드래그 방향에 따라 결정
            const dragDirection = y - startRef.current.startOffset;
            target = dragDirection < 0 ? expandedTop : collapsedTop;
        } else {
            // 일반 드래그인 경우 임계값 기준
            target = currentDistance <= threshold ? expandedTop : collapsedTop;
        }
        
        setY(target);
    };

    // 전역 이벤트 리스너 설정
    useEffect(() => {
        if (!dragging) return;

        const handleGlobalMove = (e) => onPointerMove(e);
        const handleGlobalUp = () => onPointerUp();

        // 포인터 이벤트와 터치 이벤트 모두 처리
        document.addEventListener('pointermove', handleGlobalMove, { passive: false });
        document.addEventListener('pointerup', handleGlobalUp);
        document.addEventListener('pointercancel', handleGlobalUp);
        document.addEventListener('touchmove', handleGlobalMove, { passive: false });
        document.addEventListener('touchend', handleGlobalUp);
        document.addEventListener('touchcancel', handleGlobalUp);

        return () => {
            document.removeEventListener('pointermove', handleGlobalMove);
            document.removeEventListener('pointerup', handleGlobalUp);
            document.removeEventListener('pointercancel', handleGlobalUp);
            document.removeEventListener('touchmove', handleGlobalMove);
            document.removeEventListener('touchend', handleGlobalUp);
            document.removeEventListener('touchcancel', handleGlobalUp);
        };
    }, [dragging, y, expandedTop, collapsedTop]);

    const snapTo = (pos) => {
        if (pos === "expanded") setY(expandedTop);
        else if (pos === "collapsed") setY(collapsedTop);
    };

    return {
        y,
        dragging,
        onPointerDown,
        onPointerMove,
        onPointerUp,
        snapTo,
    };
}

export default useSheetDrag;