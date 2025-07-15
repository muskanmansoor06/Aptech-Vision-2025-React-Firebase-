import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import GraduationStory from './components/GraduationStory';
import HeroSlider from './components/HeroSlider';
import JobsPage from './components/Jobs/JobsPage'; // 👈 import your jobs page
import 'animate.css';

function App() {
  return (
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
        <Route path="/jobs" element={<JobsPage />} /> {/* 👈 Route for Jobs */}
      </Routes>
    </Router>
  );
}

export default App;
