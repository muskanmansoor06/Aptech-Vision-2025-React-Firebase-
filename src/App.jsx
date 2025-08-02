import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import GraduationStory from './components/GraduationStory';
import HeroSlider from './components/HeroSlider';
import JobsPage from './components/Jobs/JobsPage';
import RoleBasedProfile from './components/RoleBasedProfile';
import QueryPage from './components/QueryPage';
import FirebaseDiagnostic from './components/FirebaseDiagnostic';
import FirebaseTroubleshooter from './components/FirebaseTroubleshooter';
import 'animate.css';
import { UserContextProvider } from './context/UserContext';

function App() {
  return (
    <UserContextProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={
            <>
              <Hero />
              <GraduationStory />
              <HeroSlider />
            </>
          } />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/queries" element={<QueryPage />} />
          <Route path="/profile" element={<RoleBasedProfile />} />
        </Routes>
        {/* Firebase Diagnostic - Commented out for static mode */}
        <FirebaseDiagnostic />
        {/* <FirebaseTroubleshooter /> */}
      </Router>
    </UserContextProvider>
  );
}

export default App;
