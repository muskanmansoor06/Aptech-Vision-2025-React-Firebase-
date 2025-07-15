import { useEffect, useRef, useState } from 'react';
import '../assets/styles/GraduationStory.css';
import cap from '../assets/images/cp.png';
import boy from '../assets/images/boy.png';
import highlight from '../assets/images/highlight.png';
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
            <h2 className="animated-heading">Are you graduating from Aptech?</h2>
            <p className="animated-subheading">Wondering what's next?</p>
          </div>
        </div>
      </div>

      {/* Answer + Boy Image */}
      <div className="grad-row grad-row-bottom">
        <div className="grad-left answer" data-aos="fade-right">
          <div className="text-area">
            <h2 className="animated-heading">We’ve got you.</h2>
            <p className="animated-subheading">Your learning path is guided by mentors and real-world practice.</p>
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
