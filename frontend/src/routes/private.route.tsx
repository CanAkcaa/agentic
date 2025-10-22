import PrivateLayout from "../layout/private"


interface IProps{
    children: JSX.Element
}

const PrivateRoutes = ({children}:IProps) => {
    return(
        <>
        <PrivateLayout>{children}</PrivateLayout>
      </>
    )
}

export default PrivateRoutes