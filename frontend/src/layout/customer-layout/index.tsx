import { Button, Drawer, Input, Layout } from "antd";
import { HambergerMenu, SearchNormal } from "iconsax-react";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Logo from "../../assets/images/Logo.svg";
import PlusIconCırcle from "../../assets/icons/plusIconCircle.svg";
import SearchNormalIcon from "../../assets/icons/searchIcon.svg";
import HambergerMenuIcon from "../../assets/icons/hamburgerIcon.svg";
import BackButtonIcon from "../../assets/icons/backIcon.svg";
import ArrowRightIconGray from "../../assets/icons/arrowRightIconGray.svg";
import LineIcon from "../../assets/icons/lineIcon.svg";
import BellIcon from "../../assets/icons/bellIcon.svg";
import MessageIcon from '../../assets/icons/messageIcon.svg';
import StarIcon from '../../assets/icons/starIcon.svg';
import footerLogo from "../../assets/images/footerLogo.png";
import instagramLogo from "../../assets/images/instagramLogo.png";
import twitterLogo from "../../assets/images/x-twiiter-logo.png";
import facebookLogo from "../../assets/images/facebook-logo.png";
import linkedinLogo from "../../assets/images/linkedin-logo.png";
import "./index.scss";
import { useAuthStore } from "../../stores/auth.store";
import { useLocation } from "react-router-dom";


const { Header, Sider, Content, Footer } = Layout;
interface IProps {
    children: JSX.Element;
}

const CustomerLayout = ({ children }: IProps) => {
    const { t } = useTranslation();
    const [collapsed, setCollapsed] = useState(false);
    const { isAuth } = useAuthStore()
    const onClose = () => {
        setCollapsed(false);
    }
    const location = useLocation()
    const [breadcrumb, setBreadcrumb] = useState<{ title: string, href: string }[]>([])
    const getBreadcrumb = useCallback(() => {
        const path = location.pathname
        const pathArray = path.split('/')
        const breadcrumb = pathArray.map((item, index) => {
            return {
                title: item,
                href: pathArray.slice(0, index + 1).join('/')
            }
        })
        setBreadcrumb(breadcrumb)
    }, [location])

    useEffect(() => {
        getBreadcrumb()
    }, [getBreadcrumb])

    return (
        <Layout className="customer-layout font-medium layout font-sans bg-[white] min-h-screen">
            <Layout className="bg-[white] font-medium">
                <Content
                    className="p-0 m-0 container mx-auto font-medium"
                >
                    {children}
                </Content>
            </Layout>
        </Layout>
    )
}

export default CustomerLayout;