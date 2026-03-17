import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Button, Row, Col, Card, Statistic, Badge } from 'antd'
import {
  ThunderboltOutlined, TrophyOutlined, TeamOutlined, StarOutlined,
  ArrowRightOutlined, FireOutlined, ClockCircleOutlined
} from '@ant-design/icons'
import hnpLogo from '../assets/hnp-logo.png'

const CATEGORIES = [
  { icon: '💎', label: 'Luxury & Fashion', color: '#a855f7' },
  { icon: '🤖', label: 'High-Tech Gadgets', color: '#7b2fff' },
  { icon: '🏆', label: 'Collectibles', color: '#fbbf24' },
  { icon: '🎭', label: 'Experiences', color: '#c084fc' },
  { icon: '🎁', label: 'Mystery Boxes', color: '#9333ea' },
  { icon: '🎨', label: 'Art & Memorabilia', color: '#a78bfa' },
]

const LIVE_AUCTIONS = [
  { id: 1, title: 'Vintage Rolex Submariner', category: 'Luxury & Fashion', bid: '$4,200', time: '12:34', img: '⌚', hot: true },
  { id: 2, title: 'RTX 5090 Gaming PC', category: 'High-Tech Gadgets', bid: '$3,800', time: '08:15', img: '🖥️', hot: true },
  { id: 3, title: 'Signed Ronaldo Jersey', category: 'Collectibles', bid: '$1,500', time: '23:50', img: '👕', hot: false },
  { id: 4, title: 'Mystery Golden Box', category: 'Mystery Boxes', bid: '$750', time: '05:00', img: '🎁', hot: false },
]

const STATS = [
  { label: 'Live Auctions', value: '1,248', icon: <ThunderboltOutlined /> },
  { label: 'Active Bidders', value: '8,432', icon: <TeamOutlined /> },
  { label: 'Items Sold', value: '52,000+', icon: <TrophyOutlined /> },
  { label: 'Total GMV', value: '$9.4M', icon: <StarOutlined /> },
]

export default function Homepage() {
  const heroRef = useRef(null)

  useEffect(() => {
    const el = heroRef.current
    if (!el) return
    const handler = (e) => {
      const { left, top, width, height } = el.getBoundingClientRect()
      const x = (e.clientX - left) / width - 0.5
      const y = (e.clientY - top) / height - 0.5
      el.style.backgroundPosition = `${50 + x * 8}% ${50 + y * 8}%`
    }
    el.addEventListener('mousemove', handler)
    return () => el.removeEventListener('mousemove', handler)
  }, [])

  return (
    <div className="page-enter">
      {/* ── HERO ── */}
      <section ref={heroRef} style={{
        minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column', textAlign: 'center', padding: '60px 24px',
        background: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(123,47,255,0.18) 0%, transparent 70%)',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Animated particles */}
        {[...Array(20)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            width: Math.random() * 4 + 1,
            height: Math.random() * 4 + 1,
            borderRadius: '50%',
            background: i % 2 === 0 ? '#7b2fff' : '#a855f7',
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            opacity: Math.random() * 0.6 + 0.2,
            animation: `float ${3 + Math.random() * 4}s ease-in-out ${Math.random() * 2}s infinite`,
          }} />
        ))}

        <img
          src={hnpLogo}
          alt="HNP Logo"
          className="float-anim"
          style={{ height: 120, marginBottom: 32, filter: 'drop-shadow(0 0 30px rgba(168,85,247,0.9))' }}
        />

        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 24,
          background: 'rgba(123,47,255,0.15)', border: '1px solid rgba(123,47,255,0.4)',
          borderRadius: 999, padding: '6px 16px', fontSize: 13, color: '#c084fc',
        }}>
          <FireOutlined style={{ color: '#fbbf24' }} />
          1,248 Live Auctions Happening Now
        </div>

        <h1 style={{
          fontFamily: "'Orbitron', sans-serif",
          fontSize: 'clamp(2.2rem, 6vw, 4.5rem)',
          fontWeight: 900, lineHeight: 1.15, marginBottom: 24, maxWidth: 800,
        }}>
          <span className="gradient-text">Bid. Win.</span>
          <br />
          <span style={{ color: '#fff' }}>Own the Extraordinary.</span>
        </h1>

        <p style={{
          color: '#acacb8', fontSize: 'clamp(1rem, 2vw, 1.2rem)',
          maxWidth: 560, marginBottom: 40, lineHeight: 1.7,
        }}>
          Real-time live auctions for unique collectibles, luxury goods, tech gadgets, art,
          and once-in-a-lifetime experiences. Powered by HNP.
        </p>

        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link to="/products">
            <Button type="primary" size="large" icon={<ThunderboltOutlined />}
              className="pulse-glow"
              style={{ height: 52, padding: '0 32px', fontSize: 16, borderRadius: 12 }}>
              Explore Auctions
            </Button>
          </Link>
          <Link to="/login">
            <Button size="large"
              style={{
                height: 52, padding: '0 32px', fontSize: 16, borderRadius: 12,
                background: 'transparent', border: '1px solid rgba(123,47,255,0.5)',
                color: '#c084fc',
              }}>
              Join Now <ArrowRightOutlined />
            </Button>
          </Link>
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{ padding: '20px 24px 60px', maxWidth: 1100, margin: '0 auto' }}>
        <Row gutter={[20, 20]}>
          {STATS.map(({ label, value, icon }) => (
            <Col xs={12} sm={6} key={label}>
              <div className="glass-card" style={{
                padding: '24px 20px', textAlign: 'center',
                transition: 'all 0.3s',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#7b2fff'; e.currentTarget.style.boxShadow = '0 0 25px rgba(123,47,255,0.3)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = ''; e.currentTarget.style.boxShadow = '' }}
              >
                <div style={{ fontSize: 28, color: '#a855f7', marginBottom: 8 }}>{icon}</div>
                <div style={{ fontSize: 'clamp(1.3rem, 3vw, 1.8rem)', fontWeight: 800, color: '#fff', fontFamily: 'Orbitron, sans-serif' }}>{value}</div>
                <div style={{ color: '#acacb8', fontSize: 13, marginTop: 4 }}>{label}</div>
              </div>
            </Col>
          ))}
        </Row>
      </section>

      {/* ── CATEGORIES ── */}
      <section style={{ padding: '20px 24px 60px', maxWidth: 1100, margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontFamily: 'Orbitron, sans-serif', fontSize: 'clamp(1.4rem,3vw,2rem)', fontWeight: 700, marginBottom: 8 }}>
          <span className="gradient-text">Browse Categories</span>
        </h2>
        <p style={{ textAlign: 'center', color: '#acacb8', marginBottom: 36 }}>Find your next prized possession</p>
        <Row gutter={[16, 16]}>
          {CATEGORIES.map(({ icon, label, color }) => (
            <Col xs={12} sm={8} md={4} key={label}>
              <Link to="/products" style={{ textDecoration: 'none' }}>
                <div className="glass-card card-3d" style={{
                  padding: '28px 16px', textAlign: 'center', cursor: 'pointer',
                }}>
                  <div style={{ fontSize: 36, marginBottom: 12 }}>{icon}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: color }}>{label}</div>
                </div>
              </Link>
            </Col>
          ))}
        </Row>
      </section>

      {/* ── LIVE AUCTIONS ── */}
      <section style={{ padding: '20px 24px 80px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <h2 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 'clamp(1.4rem,3vw,2rem)', fontWeight: 700 }}>
            <FireOutlined style={{ color: '#fbbf24', marginRight: 10 }} />
            <span className="gradient-text">Live Right Now</span>
          </h2>
          <Link to="/products">
            <Button type="text" style={{ color: '#c084fc' }}>View All <ArrowRightOutlined /></Button>
          </Link>
        </div>
        <Row gutter={[20, 20]}>
          {LIVE_AUCTIONS.map(({ id, title, category, bid, time, img, hot }) => (
            <Col xs={24} sm={12} md={6} key={id}>
              <div className="glass-card card-3d" style={{
                overflow: 'hidden', cursor: 'pointer', position: 'relative',
              }}>
                {hot && (
                  <div style={{
                    position: 'absolute', top: 12, right: 12,
                    background: 'linear-gradient(135deg, #7b2fff, #a855f7)',
                    borderRadius: 999, padding: '3px 10px', fontSize: 11, fontWeight: 700, color: '#fff',
                    zIndex: 1,
                  }}>🔥 HOT</div>
                )}
                <div style={{
                  height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'linear-gradient(135deg, rgba(123,47,255,0.15), rgba(45,0,96,0.4))',
                  fontSize: 64, borderRadius: '12px 12px 0 0',
                }}>{img}</div>
                <div style={{ padding: '16px 16px 20px' }}>
                  <div style={{ fontSize: 11, color: '#a855f7', fontWeight: 600, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>{category}</div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: '#fff', marginBottom: 12 }}>{title}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                    <div>
                      <div style={{ fontSize: 11, color: '#acacb8' }}>Current Bid</div>
                      <div style={{ fontSize: 18, fontWeight: 800, color: '#fbbf24', fontFamily: 'Orbitron, sans-serif' }}>{bid}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 11, color: '#acacb8' }}>Ends In</div>
                      <div className="countdown-anim" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: 700, fontSize: 14 }}>
                        <ClockCircleOutlined style={{ marginRight: 4, WebkitTextFillColor: 'initial' }} />{time}
                      </div>
                    </div>
                  </div>
                  <Link to={`/bidding/${id}`}>
                    <Button type="primary" block style={{ borderRadius: 8 }}>
                      <ThunderboltOutlined /> Place Bid
                    </Button>
                  </Link>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </section>
    </div>
  )
}
