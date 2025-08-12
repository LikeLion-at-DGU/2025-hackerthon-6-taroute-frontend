import { useEffect, useRef, useState } from 'react';

export function useSlider(len, { autoplay = false, interval = 3000 } = {}) {
    const [index, setIndex] = useState(0);
    const timerRef = useRef(null);

    const clamp = (i) => (i < 0 ? len - 1 : i >= len ? 0 : i);
    const goTo = (i) => setIndex(clamp(i));
    const next = () => goTo(index + 1);
    const prev = () => goTo(index - 1);

    useEffect(() => {
        if (!autoplay || len <= 1) return;
        clearInterval(timerRef.current);
        timerRef.current = setInterval(next, interval);
        return () => clearInterval(timerRef.current);
    }, [index, autoplay, interval, len]);

    return { index, goTo, next, prev };

}