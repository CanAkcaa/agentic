import './App.css'
import { QueryClient, QueryClientProvider } from 'react-query'
import Router from './routes/index.route'
import { RecoilRoot } from 'recoil'
import { ConfigProvider } from 'antd'

function App() {
  
  const client = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        staleTime: 0,
        cacheTime: 0,
      },
    },
  })

  return (
    <>
      <QueryClientProvider client={client}>
      <RecoilRoot>
      <ConfigProvider
            theme={{
              token: {
                colorPrimary: "#D1D1D1",
                borderRadius: 8,
                colorBgContainer: "#fff",
                fontFamily: "Stolzl",
              },
              components: {
                Button:{
                  colorPrimary: "#F25451",
                  colorPrimaryHover:"#F25451",
                  colorBorder: "#F25451"
                },
                Input:{
                  colorBorder:"#D1D1D1",
                }
              },
              
            }}
          >
        <Router />
        </ConfigProvider>
        </RecoilRoot>
      </QueryClientProvider>
    </>
  )
}

export default App
