// components/common/ImageSlider.jsx
import { Children, isValidElement } from "react";
import { useSlider } from "../../hooks/common/useSlider";

export default function ImageSlider({
    images = [],            // fallback 이미지 배열
    slides = [],            // 우선 사용: 순서 제어 가능한 혼합 배열 (URL | {src,alt,style} | ReactNode)
    children,               // 추가/대체용 사용자 정의 노드
    autoplay = false,
    interval = 3000,
    width = "100%",
    height = 320,
    showArrows = true,      // 화살표 표시 여부
    dotsPlacement = "inside", // "inside" | "below"
}) {
    const normalizedWidth = typeof width === "number" ? `${width}px` : width;
    const normalizedHeight = typeof height === "number" ? `${height}px` : height;

    // slides 우선 처리: 문자열(URL) | {src, alt?, style?} | ReactNode 모두 허용
    let slideNodes = [];
    if (Array.isArray(slides) && slides.length > 0) {
        slideNodes = slides
            .map((item, i) => {
                if (item == null) return null;
                if (typeof item === "string") {
                    // 문자열: 이미지 URL
                    return (
                        <img
                            key={`s-${i}`}
                            src={item}
                            alt=""
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                    );
                }
                if (!isValidElement(item) && typeof item === "object" && "src" in item) {
                    // 객체: { src, alt?, style? }
                    const { src, alt = "", style } = item;
                    return (
                        <img
                            key={`s-${i}`}
                            src={src}
                            alt={alt}
                            style={{ width: "100%", height: "100%", objectFit: "cover", ...(style || {}) }}
                        />
                    );
                }
                // ReactNode 그대로 사용
                return (
                    <div key={`s-${i}`} style={{ width: "100%", height: "100%" }}>
                        {item}
                    </div>
                );
            })
            .filter(Boolean);
    } else {
        // fallback: children + images (children이 앞, 그 다음 images)
        const childSlides = Children.toArray(children ?? null);
        const imageSlides = (images ?? []).map((src, i) => (
            <img
                key={`img-${i}`}
                src={src}
                alt=""
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
        ));
        slideNodes = [...childSlides, ...imageSlides];
    }

    const len = slideNodes.length;
    const { index, next, prev, goTo } = useSlider(len, { autoplay, interval });

    if (len === 0) {
        console.warn("[ImageSlider] slides 길이가 0입니다.");
        return <div style={{ height, background: '#fee' }}>슬라이드 없음</div>;
    }

    const dots = (
        <div className={`dots ${dotsPlacement === 'below' ? 'dots-below' : 'dots-inside'}`}>
            {Array.from({ length: len }).map((_, i) => (
                <button
                    type="button"
                    key={i}
                    className={i === index ? "dot active" : "dot"}
                    onClick={() => goTo(i)}
                    aria-label={`Go to slide ${i + 1}`}
                />
            ))}
        </div>
    );

    return (
        <div
            className="slider-wrap"
            style={{ width: normalizedWidth }}
            aria-roledescription="carousel"
            tabIndex={0}
        >
            <style>{`
        .slider-wrap { position: relative; }
        .slider { position: relative; overflow: hidden; border-radius: 12px; }
        .track  { display: flex; transition: transform .35s ease; }
        .slide  { min-width: 100%; height: ${normalizedHeight}; }
        .nav { position:absolute; top:50%; transform:translateY(-50%); width:36px; height:36px; border:0; border-radius:999px; background:rgba(0,0,0,.35); color:#fff; cursor:pointer; }
        .nav.left { left:8px; } .nav.right { right:8px; }

        /* Slide counter (top-right) */
        .counter {
          position:absolute; top:8px; right:8px;
          padding:1px 12px; border-radius:12px;
          background:rgba(0, 0, 0, 0.358); color:#fff;
          font-size:12px; font-weight:600; line-height:1.6;
          pointer-events:none;
        }

        /* Dots base */
        .dots { display:flex; gap:2px; align-items:center; }
        /* Inside overlay */
        .dots-inside { position:absolute; left:50%; transform:translateX(-50%); bottom:10px; }
        /* Below the slider (normal flow) */
        .dots-below { justify-content:center; margin-top:8px; }

        .dot {
          appearance:none; -webkit-appearance:none;
          display:inline-flex; align-items:center; justify-content:center;
          width:14px; height:14px; /* 클릭 영역 (시각 점은 ::before) */
          padding:0; border:0; background:transparent; cursor:pointer;
          line-height: 0;            /* inline content 높이 영향 제거 */
          flex: 0 0 auto;            /* flex 수축/늘어남 방지 */
          box-sizing: content-box;   /* 사이즈 왜곡 방지 */
        }
        .dot::before {
          content:"";
          width:6px; height:6px; border-radius:999px;
          background:#9aa0a6; /* 회색 점 */
          opacity:.5;         /* 선택되지 않은 점: 50% */
          transition: opacity .2s ease;
          display: block;            /* width/height 정확 적용 */
          aspect-ratio: 1 / 1;       /* 항상 정원 유지 */
        }
        .dot:hover::before { opacity:.7; }
        .dot.active::before {
          opacity:1;
          width:6px; height:6px;            /* 고정: 활성도 동일 크기 */
          transform:none !important;        /* 예전 scale 잔존 방지 */
          box-shadow:none !important;       /* 예전 링 효과 제거 */
        }
      `}</style>

            <div className="slider">
                <div className="track" style={{ transform: `translateX(-${index * 100}%)` }}>
                    {slideNodes.map((node, i) => (
                        <div className="slide" key={i}>
                            {node}
                        </div>
                    ))}
                </div>

                {/* 화살표: showArrows가 true일 때만 */}
                {len > 1 && showArrows && (
                    <>
                        <button className="nav left" onClick={prev}>‹</button>
                        <button className="nav right" onClick={next}>›</button>
                    </>
                )}

                {/* 현재 슬라이드 / 전체 */}
                {len > 0 && (
                  <div className="counter" aria-live="polite" aria-atomic="true">
                    {index + 1}/{len}
                  </div>
                )}

                {/* 도트 - inside 모드일 때만 오버레이로 출력 */}
                {len > 1 && dotsPlacement !== 'below' && dots}
            </div>

            {/* 도트 - below 모드일 때 트랙 아래 출력 */}
            {len > 1 && dotsPlacement === 'below' && dots}
        </div>
    );
}