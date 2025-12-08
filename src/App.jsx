import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import PresentPage from './pages/PresentPage'
import FinalPage from './pages/FinalPage'
import FotosPage from './pages/FotosPage'
import MuralDesabafosPage from './pages/MuralDesabafosPage'
import AdminLoginPage from './pages/AdminLoginPage'
import AdminDashboard from './pages/AdminDashboard'
import MatteoPage from './pages/MatteoPage'

function App() {
  return (
    <Router>
      <div className="h-screen w-screen overflow-hidden">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/presente" element={<PresentPage />} />
          <Route path="/fotos" element={<FotosPage />} />
          <Route path="/final" element={<FinalPage />} />
          <Route path="/desabafos" element={<MuralDesabafosPage />} />
          <Route path="/mural" element={<MuralDesabafosPage />} />
          <Route path="/admin" element={<AdminLoginPage />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/matteo" element={<MatteoPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App

