import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AdminPage from './pages/AdminPage'
import DisplayPage from './pages/DisplayPage'
import ParticipantPage from './pages/ParticipantPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ParticipantPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/display" element={<DisplayPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
