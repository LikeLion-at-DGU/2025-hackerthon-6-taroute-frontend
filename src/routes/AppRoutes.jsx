import { Routes, Route } from 'react-router-dom'
import Layout from '../layouts/Layout.jsx'
import Home from '../pages/Home.jsx'
import Taro from '../pages/Taro.jsx'
import NotFound from '../pages/NotFound.jsx'
import Search from '../pages/Search.jsx'
import SearchResults from '../pages/SearchResults.jsx'
import MainLayout from '../layouts/MainLayout.jsx'
import Plan from '../pages/Plan.jsx'
import Wiki from '../pages/Wiki.jsx'
import Location from '../pages/Location.jsx'

function AppRoutes() {
    return (
        <Routes>
            <Route element={<MainLayout />}>
                <Route index element={<Home />} />     {/* "/" */}
                <Route path="plan" element={<Plan />} />
                <Route path="wiki" element={<Wiki />} />
            </Route>
            <Route element={<Layout />}>
                <Route path="/taro" element={<Taro />} />
                <Route path="/search" element={<Search />} />
                <Route path="/results" element={<SearchResults />} />
                <Route path="*" element={<NotFound />} />
                <Route path="/location" element={<Location />} />
            </Route>
        </Routes>
    )
}

export default AppRoutes


