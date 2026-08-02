import React, { useState } from 'react';
import { MapPin, Globe, Luggage, ShieldCheck, Award, MessageSquare, Phone, ChevronDown, ChevronUp, Sparkles, Hotel, Gift, Check, Star } from 'lucide-react';

export function ExploreView({ onSelectRoute }) {
  const destinations = [
    { city: 'Atlanta', code: 'ATL', country: 'United States', tag: 'Trending Route', image: '/hero_banner.png', desc: 'The world\'s busiest aviation hub with vibrant culture and dining.' },
    { city: 'Chennai', code: 'MAA', country: 'India', tag: 'Cultural Capital', image: '/airport_lounge.png', desc: 'Gateway to Southern India featuring rich heritage and coastal beauty.' },
    { city: 'Dubai', code: 'DXB', country: 'UAE', tag: 'Stopover Special', image: '/loyalty_banner.png', desc: 'Ultra-modern architecture, luxury shopping, and desert safaris.' },
    { city: 'London', code: 'LHR', country: 'United Kingdom', tag: 'Top International', image: '/airport_lounge.png', desc: 'Historic landmarks, world-class theatre, and global commerce.' },
    { city: 'Paris', code: 'CDG', country: 'France', tag: 'Romance & Art', image: '/cabin_experience.png', desc: 'The City of Light, exquisite dining, and iconic art galleries.' }
  ];

  return (
    <div style={{ padding: '24px 0' }}>
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: '900', color: '#0f172a', marginBottom: '8px' }}>
          Explore Popular Destinations & Trending Routes
        </h2>
        <p style={{ color: 'var(--text-sub)', fontSize: '1rem' }}>
          Discover top global cities served by AirwAy and book your next journey with exclusive airfares.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
        {destinations.map(d => (
          <div
            key={d.code}
            className="glass-panel"
            style={{ borderRadius: '18px', overflow: 'hidden', cursor: 'pointer' }}
            onClick={() => onSelectRoute && onSelectRoute('MAA', d.code)}
          >
            <div style={{
              height: '180px',
              backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.7) 100%), url("${d.image}")`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <span style={{ alignSelf: 'flex-start', background: 'var(--primary-cyan)', color: '#ffffff', fontSize: '0.75rem', fontWeight: '800', padding: '3px 10px', borderRadius: '12px' }}>
                {d.tag}
              </span>
              <div style={{ color: '#ffffff' }}>
                <h3 style={{ fontSize: '1.4rem', fontWeight: '800' }}>{d.city} ({d.code})</h3>
                <p style={{ fontSize: '0.85rem', opacity: 0.9 }}>{d.country}</p>
              </div>
            </div>
            <div style={{ padding: '18px' }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-sub)', marginBottom: '16px' }}>{d.desc}</p>
              <button className="btn-primary" style={{ width: '100%', padding: '10px', fontSize: '0.85rem' }}>
                Search Flights to {d.code}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PlanView() {
  const [selectedPassport, setSelectedPassport] = useState('India');

  return (
    <div style={{ padding: '24px 0' }}>
      <h2 style={{ fontSize: '2rem', fontWeight: '900', color: '#0f172a', marginBottom: '8px' }}>
        Plan Your Journey: Visa & Baggage Policies
      </h2>
      <p style={{ color: 'var(--text-sub)', fontSize: '1rem', marginBottom: '32px' }}>
        Everything you need to know before flying with AirwAy.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '28px' }}>
        
        {/* Visa Requirements */}
        <div className="glass-panel" style={{ padding: '28px' }}>
          <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--primary-cyan)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Globe size={22} /> Visa & Entry Requirements
          </h3>
          <div className="input-group" style={{ marginBottom: '16px' }}>
            <label className="input-label">Select Passport Country</label>
            <select
              className="custom-select"
              value={selectedPassport}
              onChange={(e) => setSelectedPassport(e.target.value)}
            >
              <option value="India">Indian Passport Holder (MAA Origin)</option>
              <option value="USA">United States Passport Holder (ATL Origin)</option>
              <option value="UK">United Kingdom Passport Holder</option>
            </select>
          </div>

          <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '0.85rem', color: '#0f172a' }}>
            {selectedPassport === 'India' ? (
              <div>
                <p style={{ fontWeight: '700', color: 'var(--primary-cyan)', marginBottom: '6px' }}>Requirement for US Transit/Entry (ATL):</p>
                <p>• Valid US Tourist B1/B2 or Work Visa required.</p>
                <p>• Complimentary UAE Stopover Visa available on Dubai/Doha transit flights.</p>
              </div>
            ) : (
              <div>
                <p style={{ fontWeight: '700', color: 'var(--primary-cyan)', marginBottom: '6px' }}>Requirement for India Entry (MAA):</p>
                <p>• Valid e-Visa or Regular Entry Visa required before departure.</p>
                <p>• Passport must have at least 6 months validity.</p>
              </div>
            )}
          </div>
        </div>

        {/* Baggage Policies */}
        <div className="glass-panel" style={{ padding: '28px' }}>
          <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--primary-cyan)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Luggage size={22} /> Baggage Policy Overview
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <strong style={{ color: '#0f172a' }}>Carry-on Baggage:</strong> 1 Piece up to 7 kg + 1 Personal item (Laptop bag / Purse).
            </div>
            <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <strong style={{ color: '#0f172a' }}>Economy Checked Allowance:</strong> 2 Pieces up to 23 kg each on trans-atlantic routes.
            </div>
            <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <strong style={{ color: '#0f172a' }}>Business & First Class Allowance:</strong> 2 Pieces up to 32 kg each + VIP priority tag.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export function ExperienceView() {
  const cabins = [
    { title: 'Economy Class', seats: '32-34" Legroom', dining: 'Hot Multi-Course Meals', wifi: 'High-speed Chat Wi-Fi', price: 'Standard' },
    { title: 'Premium Economy', seats: '38" Recline Seats', dining: 'Gourmet Plated Meals', wifi: 'Full Flight Wi-Fi', price: 'Enhanced Comfort' },
    { title: 'Business Class', seats: 'Flat-Bed Suites with Door', dining: 'À la Carte Dining & Champagne', wifi: 'Unlimited High-Speed Wi-Fi', price: 'Luxury Travel' },
    { title: 'First Class', seats: 'Private Enclosed Cabin Suite', dining: 'Caviar & Vintage Wines', wifi: 'Free High-Speed Wi-Fi & Lounge', price: 'Ultimate Prestige' }
  ];

  return (
    <div style={{ padding: '24px 0' }}>
      <h2 style={{ fontSize: '2rem', fontWeight: '900', color: '#0f172a', marginBottom: '8px' }}>
        The AirwAy Experience: Cabins & In-Flight Services
      </h2>
      <p style={{ color: 'var(--text-sub)', fontSize: '1rem', marginBottom: '32px' }}>
        Indulge in award-winning hospitality, world-class entertainment, and luxury dining.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
        {cabins.map((c, i) => (
          <div key={i} className="glass-panel" style={{ padding: '24px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--primary-cyan)', fontWeight: '800', textTransform: 'uppercase' }}>{c.price}</span>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#0f172a', margin: '6px 0 16px 0' }}>{c.title}</h3>
            
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem', color: 'var(--text-sub)' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={16} color="var(--accent-emerald)" /> {c.seats}</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={16} color="var(--accent-emerald)" /> {c.dining}</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={16} color="var(--accent-emerald)" /> {c.wifi}</li>
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export function LoyaltyView() {
  const tiers = [
    { name: 'Silver Tier', points: '10,000 Miles', perks: ['25% Bonus Miles', 'Priority Airport Check-In', 'Extra 10kg Baggage'] },
    { name: 'Gold Tier', points: '50,000 Miles', perks: ['50% Bonus Miles', 'Complimentary VIP Lounge Access', 'Priority Seat Selection'] },
    { name: 'Platinum Tier', points: '100,000 Miles', perks: ['100% Bonus Miles', 'Free Cabin Suite Upgrades', 'Dedicated 24/7 Concierge'] }
  ];

  return (
    <div style={{ padding: '24px 0' }}>
      <h2 style={{ fontSize: '2rem', fontWeight: '900', color: '#0f172a', marginBottom: '8px' }}>
        AirwAy SkyMiles Loyalty Program & Tier Perks
      </h2>
      <p style={{ color: 'var(--text-sub)', fontSize: '1rem', marginBottom: '32px' }}>
        Earn reward points on every flight and unlock exclusive tier status benefits worldwide.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
        {tiers.map((t, idx) => (
          <div key={idx} className="glass-panel" style={{ padding: '28px', border: idx === 2 ? '2px solid var(--primary-cyan)' : '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a' }}>{t.name}</h3>
              <Award size={24} color={idx === 0 ? '#94a3b8' : idx === 1 ? '#d97706' : '#0284c7'} />
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--primary-cyan)', fontWeight: '800', marginBottom: '20px' }}>
              {t.points} / year required
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {t.perks.map((p, i) => (
                <div key={i} style={{ fontSize: '0.85rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600' }}>
                  <Check size={16} color="var(--accent-emerald)" /> {p}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SupportView() {
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    { q: 'How do I change or cancel my AirwAy flight booking?', a: 'You can change or cancel your flight up to 24 hours before departure through the My Bookings portal or by contacting 24/7 AirwAy Support.' },
    { q: 'What passenger information is required to book?', a: 'Only minimal required details: Full Name, Email Address, and Phone Number, along with seat preference.' },
    { q: 'Can I add a stopover package in Dubai or Doha?', a: 'Yes! Check the Stopover option in the flight search engine to add 2-3 days complimentary stay on connecting routes.' }
  ];

  return (
    <div style={{ padding: '24px 0' }}>
      <h2 style={{ fontSize: '2rem', fontWeight: '900', color: '#0f172a', marginBottom: '8px' }}>
        AirwAy Support & Frequently Asked Questions
      </h2>
      <p style={{ color: 'var(--text-sub)', fontSize: '1rem', marginBottom: '32px' }}>
        We are here to assist you 24 hours a day, 7 days a week.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px' }}>
        
        {/* FAQs */}
        <div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '16px', color: '#0f172a' }}>FAQs</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {faqs.map((faq, idx) => (
              <div key={idx} className="glass-panel" style={{ padding: '16px', borderRadius: '12px' }}>
                <div
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', fontWeight: '700', fontSize: '0.95rem', color: '#0f172a' }}
                >
                  <span>{faq.q}</span>
                  {openFaq === idx ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
                {openFaq === idx && (
                  <p style={{ marginTop: '12px', fontSize: '0.85rem', color: 'var(--text-sub)', lineHeight: '1.5' }}>
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact Info */}
        <div className="glass-panel" style={{ padding: '28px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '16px', color: '#0f172a' }}>Contact AirwAy Support</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: '#f8fafc', borderRadius: '10px' }}>
              <Phone size={20} color="var(--primary-cyan)" />
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-sub)' }}>24/7 Hotline Toll-Free</div>
                <div style={{ fontSize: '1rem', fontWeight: '800', color: '#0f172a' }}>+1 (800) 247-929]</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: '#f8fafc', borderRadius: '10px' }}>
              <MessageSquare size={20} color="var(--accent-emerald)" />
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-sub)' }}>Live Chat Support</div>
                <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0f172a' }}>Instant Assistance Online</div>
              </div>
            </div>
          </div>

          <button className="btn-primary" style={{ width: '100%' }}>
            Start Live Chat Session
          </button>
        </div>

      </div>
    </div>
  );
}

export function OffersAndPackagesSection() {
  const deals = [
    { title: '20% OFF Business Class', code: 'BUSINESS20', desc: 'Save 20% on all MAA to ATL Business Class suites booked this month.', image: '/hero_banner.png' },
    { title: 'Complimentary 2-Day Dubai Stay', code: 'DUBAISTOP', desc: 'Includes 5-star hotel stay in Dubai on connecting Emirates flights.', image: '/airport_lounge.png' },
    { title: 'Flight + 7 Days Hotel Package', code: 'ATLPACKAGE', desc: 'Roundtrip flight + luxury downtown Atlanta hotel from $1,250.', image: '/loyalty_banner.png' }
  ];

  return (
    <div style={{ margin: '40px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a' }}>Offers, Deals & Packages</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-sub)' }}>Exclusive promotions for AirwAy travelers</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
        {deals.map((d, idx) => (
          <div key={idx} className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: '0.75rem', background: '#ecfdf5', color: '#059669', border: '1px solid #a7f3d0', padding: '3px 10px', borderRadius: '12px', fontWeight: '800', display: 'inline-block', marginBottom: '10px' }}>
                PROMO: {d.code}
              </span>
              <h4 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a', marginBottom: '6px' }}>{d.title}</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-sub)', marginBottom: '16px' }}>{d.desc}</p>
            </div>
            <button className="btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
              Claim Offer
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
