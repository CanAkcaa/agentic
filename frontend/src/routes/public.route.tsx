import { Layout } from 'antd'

type PublicRouteProps = {
    children: JSX.Element
}

const PublicRoute = ({ children }: PublicRouteProps) => {
    return <Layout >{children}</Layout>
}

export default PublicRoute