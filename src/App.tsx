import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import CreateSession from './pages/CreateSession'
import SpeakerRoom from './pages/SpeakerRoom'
import AudienceFeedback from './pages/AudienceFeedback'
import Report from './pages/Report'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CreateSession />} />
        <Route path="/session/:id" element={<SpeakerRoom />} />
        <Route path="/session/:id/report" element={<Report />} />
        <Route path="/join/:id" element={<AudienceFeedback />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App
