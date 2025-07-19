import React from 'react';
import '../assets/styles/Hero.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { FaPlay } from 'react-icons/fa';

const slides = [
  {
    category: 'Our Courses',
    heading: 'With Scholar Teachers, Everything Is Easier',
    desc: 'Scholar is free CSS template designed by TemplateMo for online educational related websites. This layout is based on the famous Bootstrap v5.3.0 framework.',
    img: '/images/bg1.jpg',
    btn1: 'Request Demo',
    btn2: "What's Scholar?",
  },
  {
    category: 'Best Result',
    heading: 'Get the best result out of your effort',
    desc: 'You are allowed to use this template for any educational or commercial purpose. You are not allowed to re-distribute the template ZIP file on any other website.',
    img: '/images/bg2.jpg',
    btn1: 'Request Demo',
    btn2: "What's the best result?",
  },
  {
    category: 'Online Learning',
    heading: 'Online Learning helps you save the time',
    desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod temporious incididunt ut labore et dolore magna aliqua suspendisse.',
    img: '/images/bg5.jpg',
    btn1: 'Request Demo',
    btn2: "What's Online Course?",
  },
];

function HeroSection() {
  return (
    <div className="main-banner" id="top">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <Swiper
              modules={[Autoplay, Pagination]}
              autoplay={{ delay: 4000 }}
              pagination={{ clickable: true }}
              loop
              className="owl-carousel owl-banner"
            >
              {slides.map((slide, idx) => (
                <SwiperSlide key={idx}>
                  <div className={`item item-${idx + 1}`} style={{backgroundImage: `url(${slide.img})`}}>
                    <div className="header-text">
                      <span className="category">{slide.category}</span>
                      <h2>{slide.heading}</h2>
                      <p>{slide.desc}</p>
                      <div className="buttons">
                        <div className="main-button">
                          <a href="#">{slide.btn1}</a>
                        </div>
                        <div className="icon-button">
                          <a href="#"><FaPlay /> {slide.btn2}</a>
                        </div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
