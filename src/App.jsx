import { Navigate, Route, Routes } from 'react-router-dom'
import { Header } from './components/common/Header'
import { SideBar } from './components/common/SideBar'
import Statistic from './pages/Statistic'
import { VietNamMap } from './pages/VietNamMap'

function App() {
  return (
    <>
      <Header />
      <SideBar />
      <Routes>
        <Route path='/' element={<Navigate to='/map?type=rain' replace />} />
        <Route path='/statistic' element={<Statistic />} />
        <Route path='/map' element={<VietNamMap />} />
      </Routes>
    </>
  )
}

export default App
