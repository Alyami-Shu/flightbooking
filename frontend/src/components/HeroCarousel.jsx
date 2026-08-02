import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, ShieldCheck, Zap, Award, Globe } from 'lucide-react';

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFading, setIsFading] = useState(false);

  const slides = [
    {
      id: 1,
      image: '/hero_aviation_bg.png',
      title: 'Discover Smarter Travel: Book AirwAy in Seconds',
      sub: 'Earn exclusive travel rewards on international flights and unlock benefits including cabin upgrades, extra baggage, and complimentary flight opportunities.',
      features: [
        { name: 'Flagship Rewards', icon: <Award size={14} color="var(--accent-gold)" /> },
        { name: 'Instant Booking Guarantee', icon: <Zap size={14} color="var(--primary-cyan)" /> },
        { name: '24/7 Priority Support', icon: <ShieldCheck size={14} color="var(--accent-emerald)" /> }
      ]
    },
    {
      id: 2,
      image: '/lounge_bg.png',
      title: 'Travel in Comfort Before You Take Off',
      sub: 'Access premium airport lounges with elegant spaces, gourmet dining, high-speed Wi-Fi, and priority services at global destinations.',
      features: [
        { name: 'Luxury Airport Experience', icon: <Sparkles size={14} color="var(--accent-gold)" /> },
        { name: 'VIP Lounge Access', icon: <ShieldCheck size={14} color="var(--primary-cyan)" /> },
        { name: 'Priority Boarding Included', icon: <Award size={14} color="var(--accent-emerald)" /> }
      ]
    },
    {
      id: 3,
      image: '/skyline_bg.png',
      title: 'Your Booking Journey Begins with AirwAy',
      sub: 'Explore the world with seamless flight, hotel, and travel experiences designed around your preferences.',
      features: [
        { name: 'Global Destination Hubs', icon: <Globe size={14} color="var(--primary-cyan)" /> },
        { name: 'Seamless Package Deals', icon: <Zap size={14} color="var(--accent-emerald)" /> },
        { name: 'Verified 5-Star Hotels', icon: <Sparkles size={14} color="var(--accent-gold)" /> }
      ]
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      triggerSlideChange((currentSlide + 1) % slides.length);
    }, 6000);
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
      borderRadius: '20px',
      overflow: 'hidden',
      marginBottom: '28px',
      height: '270px',
      border: '1px solid #cbd5e1',
      boxShadow: '0 12px 32px rgba(15, 23, 42, 0.08)',
      background: '#0f172a'
    }}>
      
      {/* Background Image Layer with Smooth Fade Transition */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `linear-gradient(180deg, rgba(255, 255, 255, 0.65) 0%, rgba(255, 255, 255, 0.94) 100%), url("${active.image}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: isFading ? 0.3 : 1,
        transition: 'opacity 0.4s ease-in-out, background-image 0.6s ease-in-out'
      }} />

      {/* Content Container - Consistent Hierarchy (Headline -> Subheading -> Secondary Features) */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '0 42px',
        textAlign: 'center',
        opacity: isFading ? 0.2 : 1,
        transform: isFading ? 'translateY(6px)' : 'translateY(0)',
        transition: 'opacity 0.3s ease-in-out, transform 0.3s ease-in-out'
      }}>
        
        {/* 1. Main Headline (Travel Experience & Value Proposition) */}
        <h2 style={{
          fontSize: '2.2rem',
          fontWeight: '900',
          letterSpacing: '-0.5px',
          marginBottom: '10px',
          color: '#0f172a',
          maxWidth: '860px',
          lineHeight: '1.2'
        }}>
          {active.title}
        </h2>

        {/* 2. Subheading (Clear Benefit Explanation) */}
        <p style={{
          fontSize: '0.94rem',
          color: '#334155',
          maxWidth: '740px',
          marginBottom: '18px',
          fontWeight: '600',
          lineHeight: '1.5'
        }}>
          {active.sub}
        </p>

        {/* 3. Supporting Features & Benefits (Secondary Highlights at the End) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          {active.features.map((feat, idx) => (
            <div
              key={idx}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #cbd5e1',
                borderRadius: '16px',
                padding: '5px 14px',
                fontSize: '0.78rem',
                color: '#0f172a',
                fontWeight: '700',
                backdropFilter: 'blur(6px)',
                boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
              }}
            >
              {feat.icon}
              <span>{feat.name}</span>
            </div>
          ))}
        </div>

      </div>

      {/* Prev / Next Controls */}
      <button
        onClick={prevSlide}
        aria-label="Previous Slide"
        style={{
          position: 'absolute',
          left: '16px',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 20,
          background: '#ffffff',
          border: '1px solid #cbd5e1',
          borderRadius: '50%',
          width: '38px',
          height: '38px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#0f172a',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}
      >
        <ChevronLeft size={18} />
      </button>

      <button
        onClick={nextSlide}
        aria-label="Next Slide"
        style={{
          position: 'absolute',
          right: '16px',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 20,
          background: '#ffffff',
          border: '1px solid #cbd5e1',
          borderRadius: '50%',
          width: '38px',
          height: '38px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#0f172a',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}
      >
        <ChevronRight size={18} />
      </button>

      {/* Carousel Navigation Dots */}
      <div style={{
        position: 'absolute',
        bottom: '12px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 20,
        display: 'flex',
        gap: '6px'
      }}>
        {slides.map((s, idx) => (
          <div
            key={s.id}
            onClick={() => triggerSlideChange(idx)}
            style={{
              width: currentSlide === idx ? '26px' : '8px',
              height: '8px',
              borderRadius: '4px',
              background: currentSlide === idx ? 'var(--primary-cyan)' : '#cbd5e1',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          />
        ))}
      </div>

    </div>
  );
}
