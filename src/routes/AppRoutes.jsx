import { Routes, Route } from 'react-router-dom'
import Layout from '../layouts/Layout.jsx'
import Home from '../pages/Home.jsx'
import Taro from '../pages/Taro.jsx'
import NotFound from '../pages/NotFound.jsx'
import Search from '../pages/Search.jsx'
import SearchResults from '../pages/SearchResults.jsx'

function AppRoutes() {
    return (
        <Routes>
            <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/taro" element={<Taro />} />
                <Route path="/search" element={<Search />} />
                <Route path="/results" element={<SearchResults />} />
                <Route path="*" element={<NotFound />} />
            </Route>
        </Routes>
    )
}

export default AppRoutes


