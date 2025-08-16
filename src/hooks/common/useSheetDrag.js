import { useState, useRef, useEffect } from "react";

function useSheetDrag({ expandedTop, collapsedTop, start = "collapsed" }) {
    const [y, setY] = useState(start === "expanded" ? expandedTop : collapsedTop);
    const [dragging, setDragging] = useState(false);
    const startRef = useRef({ startY: 0, startOffset: 0 });
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
        e.currentTarget.setPointerCapture?.(e.pointerId);
        setDragging(true);
        const clientY = e.clientY ?? (e.touches ? e.touches[0].clientY : 0);
        startRef.current.startY = clientY;
        startRef.current.startOffset = y;
    };

    const onPointerMove = (e) => {
        if (!dragging) return;
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
        const mid = (expandedTop + collapsedTop) / 2;
        const target = y <= mid ? expandedTop : collapsedTop;
        setY(target);
    };

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