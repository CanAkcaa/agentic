import React from 'react'
import { Routes, BrowserRouter, Route } from 'react-router-dom'
import RouteList from './routes'
import PublicRoute from './public.route'
import { useAuthStore } from '../stores/auth.store'
import CustomerLayout from '../layout/customer-layout'


const RoutesList = RouteList.getRoutes()

const Router: React.FunctionComponent<{}> = () => {
    const { isAuth } = useAuthStore()
    return (
        <BrowserRouter>
            <Routes>
                {RoutesList.map((route, index) => {
                    if (route?.isPublic && !route?.pageType) {
                        return (
                            <Route
                                key={index}
                                path={route.path}
                                element={<PublicRoute>{route.component}</PublicRoute>}
                            />
                        )
                    }
                    else if (route.pageType == "customer" && route?.isPublic) {
                        return (
                            <Route
                                key={index}
                                path={route.path}
                                element={<CustomerLayout>{route.component}</CustomerLayout>}
                            />
                        )
                    }
                    else if (route.pageType == "customer" && isAuth && !route?.isPublic) {
                        return (
                            <Route
                                key={index}
                                path={route.path}
                                element={<CustomerLayout>{route.component}</CustomerLayout>}
                            />
                        )
                    } else {
                        return (
                            <Route key={index} path={route.path} element={<>login page</>} />
                        )
                    }
                })}
                <Route path="*" element={<>not found page</>} />
            </Routes>
        </BrowserRouter>
    )
}

export default Router