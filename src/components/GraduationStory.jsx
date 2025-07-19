import { useEffect, useRef, useState } from 'react';
import '../assets/styles/GraduationStory.css';
import cap from '/images/cp.png';
import boy from '/images/boy.png';
import highlight from '/images/highlight.png';
import AOS from 'aos';
import 'aos/dist/aos.css';

function GraduationScene() {
  const capRef = useRef();
  const boyRef = useRef();
  const [capMoved, setCapMoved] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 1000 });

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setCapMoved(true);
    }, { threshold: 0.5 });

    if (boyRef.current) observer.observe(boyRef.current);
    return () => boyRef.current && observer.unobserve(boyRef.current);
  }, []);

  return (
    <div className="grad-section">
      {/* Cap + Initial Text */}
      <div className="grad-row">
        <div className="grad-left">
          <div className="cap-wrapper">
            <img src={highlight} alt="Highlight" className="highlight" />
            <img
              src={cap}
              alt="Graduation Cap"
              ref={capRef}
              className={`cap-img ${capMoved ? 'cap-animated' : ''}`}
            />
          </div>
        </div>

        <div className="grad-right" data-aos="fade-left">
          <div className="text-area">
            <h2 className="animated-heading">Ready to Launch Your Future?</h2>
            <p className="animated-subheading">Graduating from Aptech is just the beginning. Discover endless opportunities ahead!</p>
          </div>
        </div>
      </div>

      {/* Answer + Boy Image */}
      <div className="grad-row grad-row-bottom">
        <div className="grad-left answer" data-aos="fade-right">
          <div className="text-area">
            <h2 className="animated-heading">We’re Here to Guide You!</h2>
            <p className="animated-subheading">Unlock your potential with expert mentors, hands-on projects, and a community that believes in you.</p>
          </div>
        </div>

        <div className="grad-right boy-wrapper" ref={boyRef}>
          <div className="boy-container">
            <img src={boy} alt="Student" className="boy-img" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default GraduationScene;
