import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import '../assets/styles/HeroSlider.css';

import slide1 from '../assets/images/hero5.png'; // replace with your animated images
import slide2 from '../assets/images/hero6.png';
import slide3 from '../assets/images/hero7.png';

const slides = [
  {
    title: 'Your Hub for Success',
    para: 'Connect with Alumni, Unlock Opportunities, and Achieve Your Goals',
    image: slide1,
  },
  {
    title: 'What is AlmaHub?',
    para: "Discover the Power of AlmaHub Learn how our platform connects alumni, fosters knowledge sharing, and unlocks new opportunities. Dive into our story and find out how AlmaHub can help you achieve your goals.",
    image: slide2,
  },
  {
    title: 'How its work?',
    para: 'At AlmaHub, we connect alumni with opportunities and resources to help them achieve their goals. Simply register, showcase your skills and projects, and engage with our community. Explore job opportunities, get help with assignments, and collaborate with like minded individuals. Our platform is designed to make it easy for you to succeed join us today and start unlocking your potential',
    image: slide3,
  },
];

function HeroSlider() {
  return (
    <section className="hero-slider">
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 4000 }}
        pagination={{ clickable: true }}
        loop
        className="hero-swiper"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="slide-content">
              <div className="text-content">
                <h1>{slide.title}</h1>
                <p>{slide.para}</p>
              </div>
              <div className="image-content">
                <img src={slide.image} alt={`Slide ${index + 1}`} />
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}

export default HeroSlider;
