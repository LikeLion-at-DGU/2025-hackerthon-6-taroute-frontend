// MainLayout.jsx
import { Outlet, NavLink, useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { AnimatePresence, motion } from "framer-motion";
import { useSwipeable } from "react-swipeable";
import { useMemo } from "react";
import Navbar from "../components/common/Navbar";

const TABS = ["/", "/plan", "/wiki"]; // 탭 순서

export default function MainLayout() {
    const location = useLocation();
    const navigate = useNavigate();

    const idx = useMemo(() => {
        const i = TABS.indexOf(location.pathname);
        return i === -1 ? 0 : i;
    }, [location.pathname]);

    // 좌우 스와이프 → 이전/다음 탭으로 이동
    const swipe = useSwipeable({
        onSwipedLeft: () => idx < TABS.length - 1 && navigate(TABS[idx + 1], { state: { dir: 1 } }),
        onSwipedRight: () => idx > 0 && navigate(TABS[idx - 1], { state: { dir: -1 } }),
        delta: 30,                 // 최소 스와이프 거리
        preventScrollOnSwipe: true,
        trackTouch: true,
        trackMouse: true,
    });

    const dir = location.state?.dir ?? 0; // 이동 방향(좌/우)

    return (
        <Wrap>
            <Navbar />
            <Tabs>
                <TabLink to="/" end>HOME</TabLink>
                <TabLink to="/plan">PLAN</TabLink>
                <TabLink to="/wiki">WIKI</TabLink>
            </Tabs>

            <Content {...swipe}>
                <AnimatePresence mode="wait" custom={dir}>
                    <motion.div
                        key={location.pathname}
                        custom={dir}
                        variants={pageVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        style={{ height: "100%", willChange: "transform" }}
                    >
                        <Outlet />
                    </motion.div>
                </AnimatePresence>
            </Content>
        </Wrap>
    );
}

const pageVariants = {
    initial: (dir) => ({ x: dir >= 0 ? 40 : -40, opacity: 0 }),
    animate: { x: 0, opacity: 1, transition: { duration: 0.18, ease: "easeOut" } },
    exit: (dir) => ({ x: dir >= 0 ? -40 : 40, opacity: 0, transition: { duration: 0.16, ease: "easeIn" } }),
};

// 스타일
const Wrap = styled.div`width:375px; margin:0 auto; color:#fff;`;
const Tabs = styled.nav`
    display:flex; align-items:center; 
    height:44px; border-bottom:1px solid gray; 
    padding:0 40px; width: 100%; justify-content: space-between;
    margin-top: 15px;
`;
const TabLink = styled(NavLink)`
    font-weight:500; padding:10px 0; text-decoration:none; color:#fff; border-bottom:2px solid transparent;
    &.active{ color:#ffc400; border-color:#ffc400; }
`;
const Content = styled.main`
    min-height: calc(100dvh - 56px - 44px);
    overflow: hidden;          /* 옆으로 넘치는 부분 숨김 */
    touch-action: pan-y;       /* 세로 스크롤은 유지 + 가로 스와이프 동작 */
`;