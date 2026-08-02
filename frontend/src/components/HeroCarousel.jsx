import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFading, setIsFading] = useState(false);

  const slides = [
    {
      id: 1,
      image: '/hero_aviation_bg.png',
      title: 'Discover Smarter Travel: Book AirwAy in Seconds',
      sub: 'Earn exclusive travel rewards on international flights and unlock benefits including cabin upgrades, extra baggage, and complimentary flight opportunities.'
    },
    {
      id: 2,
      image: '/lounge_bg.png',
      title: 'Travel in Comfort Before You Take Off',
      sub: 'Access premium airport lounges with elegant spaces, gourmet dining, high-speed Wi-Fi, and priority services at global destinations.'
    },
    {
      id: 3,
      image: '/skyline_bg.png',
      title: 'Your Booking Journey Begins with AirwAy',
      sub: 'Explore the world with seamless flight, hotel, and travel experiences designed around your preferences.'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      triggerSlideChange((currentSlide + 1) % slides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [currentSlide, slides.length]);

  const triggerSlideChange = (newIndex) => {
    setIsFading(true);
    setTimeout(() => {
      setCurrentSlide(newIndex);
      setIsFading(false);
    }, 300);
  };

  const prevSlide = () => {
    const newIdx = currentSlide === 0 ? slides.length - 1 : currentSlide - 1;
    triggerSlideChange(newIdx);
  };

  const nextSlide = () => {
    const newIdx = (currentSlide + 1) % slides.length;
    triggerSlideChange(newIdx);
  };

  const active = slides[currentSlide];

  return (
    <div style={{
      position: 'relative',
      borderRadius: '24px',
      overflow: 'hidden',
      marginBottom: '32px',
      height: '340px',
      border: '1px solid #e2e8f0',
      boxShadow: '0 20px 45px rgba(15, 23, 42, 0.08)',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
    }}>
      
      {/* High-Resolution Aviation Background Image */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `url("${active.image}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: isFading ? 0.4 : 1,
        transition: 'opacity 0.4s ease-in-out'
      }} />

      {/* Professional Platinum & Dark Gradient Overlay for Maximum Readability */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.88) 0%, rgba(15, 23, 42, 0.65) 50%, rgba(15, 23, 42, 0.35) 100%)',
        backdropFilter: 'blur(1px)'
      }} />

      {/* Content Container - Headline & Subtitle Only (Promotional badges removed) */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '0 56px',
        textAlign: 'center',
        opacity: isFading ? 0.3 : 1,
        transform: isFading ? 'translateY(6px)' : 'translateY(0)',
        transition: 'opacity 0.3s ease-in-out, transform 0.3s ease-in-out'
      }}>
        
        {/* Main Headline */}
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: '900',
          letterSpacing: '-0.8px',
          marginBottom: '14px',
          color: '#ffffff',
          maxWidth: '920px',
          lineHeight: '1.18',
          textShadow: '0 4px 12px rgba(0,0,0,0.3)'
        }}>
          {active.title}
        </h1>

        {/* Subheading */}
        <p style={{
          fontSize: '1.02rem',
          color: '#cbd5e1',
          maxWidth: '780px',
          fontWeight: '500',
          lineHeight: '1.6',
          margin: 0,
          textShadow: '0 2px 6px rgba(0,0,0,0.3)'
        }}>
          {active.sub}
        </p>

      </div>

      {/* Slide Navigation Controls */}
      <button
        onClick={prevSlide}
        aria-label="Previous Slide"
        style={{
          position: 'absolute',
          left: '20px',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 20,
          background: 'rgba(255, 255, 255, 0.15)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          backdropFilter: 'blur(8px)',
          borderRadius: '50%',
          width: '42px',
          height: '42px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        }}
      >
        <ChevronLeft size={20} />
      </button>

      <button
        onClick={nextSlide}
        aria-label="Next Slide"
        style={{
          position: 'absolute',
          right: '20px',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 20,
          background: 'rgba(255, 255, 255, 0.15)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          backdropFilter: 'blur(8px)',
          borderRadius: '50%',
          width: '42px',
          height: '42px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        }}
      >
        <ChevronRight size={20} />
      </button>

      {/* Carousel Navigation Dots */}
      <div style={{
        position: 'absolute',
        bottom: '16px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 20,
        display: 'flex',
        gap: '8px'
      }}>
        {slides.map((s, idx) => (
          <div
            key={s.id}
            onClick={() => triggerSlideChange(idx)}
            style={{
              width: currentSlide === idx ? '28px' : '8px',
              height: '8px',
              borderRadius: '4px',
              background: currentSlide === idx ? '#38bdf8' : 'rgba(255, 255, 255, 0.4)',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          />
        ))}
      </div>

    </div>
  );
}
