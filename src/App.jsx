import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import HomePage from './pages/HomePage'
import PresentPage from './pages/PresentPage'
import FinalPage from './pages/FinalPage'
import FotosPage from './pages/FotosPage'
import MuralDesabafosPage from './pages/MuralDesabafosPage'
import AdminLoginPage from './pages/AdminLoginPage'
import MatteoPage from './pages/MatteoPage'
import MatteoChatbot from './components/MatteoChatbot'

// Componente para mostrar o chatbot apenas fora da página do Matteo
const ConditionalChatbot = () => {
  const location = useLocation()
  // Não mostrar o chatbot flutuante na página dedicada do Matteo
  if (location.pathname === '/matteo') return null
  return <MatteoChatbot />
}

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
          <Route path="/matteo" element={<MatteoPage />} />
        </Routes>
        <ConditionalChatbot />
      </div>
    </Router>
  )
}

export default App

