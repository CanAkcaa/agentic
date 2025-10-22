import HomePage from "../pages/home"

interface  IRoute {
    path: string
    component: JSX.Element
    isPublic: boolean,
    pageType?: 'customer' | 'merchant' | 'backoffice'
}

class RouteList {
    public static routes: IRoute[] = [
        {
            path: '/',
            component: <HomePage />,
            isPublic: true,
            pageType: 'customer',
        }
    ]

    public static getRoutes = (): IRoute[] => {
        return this.routes
    }

    public static getPublicRoutes = () => {
        return this.routes.filter((route) => route.isPublic)
    }

    public static getPrivateRoutes = () => {
        return this.routes.filter((route) => !route.isPublic)
    }

    public static getRouteName = (route: string) => {
        let pageName = ''
        if (route === '/') pageName = 'Home'
        else if (route.split('/').length > 2) {
            let splitedPath = route.split('/')
            if (splitedPath.slice(-1)[0].includes(':')) {
                pageName =
                    splitedPath.slice(-2)[0].charAt(0).toUpperCase() +
                    splitedPath.slice(-2)[0].slice(1)
            } else {
                pageName =
                    splitedPath.slice(-1)[0].charAt(0).toUpperCase() +
                    splitedPath.slice(-1)[0].slice(1)
            }
        } else pageName = route.charAt(1).toUpperCase() + route.slice(2)
        return pageName
    }

    public static getRoutesPath = () => {
        return this.routes.map((route) => route.path)
    }
}

export default RouteList