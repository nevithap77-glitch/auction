import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Button, Drawer, Badge } from 'antd'
import {
  HomeOutlined, LoginOutlined, AppstoreOutlined,
  ThunderboltOutlined, HeartOutlined, OrderedListOutlined,
  TeamOutlined, MenuOutlined, CloseOutlined
} from '@ant-design/icons'
import hnpLogo from '../assets/hnp-logo.png'

const navLinks = [
  { to: '/',              label: 'Home',          icon: <HomeOutlined /> },
  { to: '/login',         label: 'Login',         icon: <LoginOutlined /> },
  { to: '/products',      label: 'Products',      icon: <AppstoreOutlined /> },
  { to: '/bidding',       label: 'Bidding',       icon: <ThunderboltOutlined /> },
  { to: '/wishlist',      label: 'Wishlist',      icon: <HeartOutlined /> },
  { to: '/orders',        label: 'My Orders',     icon: <OrderedListOutlined /> },
  { to: '/group-bidding', label: 'Group Bidding', icon: <TeamOutlined /> },
]

export default function Navbar() {
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path)

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        background: scrolled
          ? 'rgba(13,0,16,0.95)'
          : 'rgba(13,0,16,0.75)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(123,47,255,0.3)',
        boxShadow: scrolled ? '0 4px 30px rgba(123,47,255,0.3)' : 'none',
        transition: 'all 0.3s ease',
        padding: '0 24px',
        height: 64,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <img src={hnpLogo} alt="HNP Logo" style={{ height: 42, width: 'auto', filter: 'drop-shadow(0 0 10px rgba(168,85,247,0.8))' }} />
          <span style={{
            fontFamily: "'Orbitron', sans-serif",
            fontSize: 16, fontWeight: 900, letterSpacing: 2,
            background: 'linear-gradient(135deg, #a855f7, #c084fc, #fbbf24)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>LIVE AUCTION</span>
        </Link>

        {/* Desktop Links */}
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }} className="desktop-nav">
          {navLinks.map(({ to, label, icon }) => (
            <Link key={to} to={to} style={{ textDecoration: 'none' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '8px 14px', borderRadius: 8,
                background: isActive(to) ? 'rgba(123,47,255,0.25)' : 'transparent',
                border: isActive(to) ? '1px solid rgba(123,47,255,0.6)' : '1px solid transparent',
                color: isActive(to) ? '#c084fc' : '#acacb8',
                fontSize: 13, fontWeight: 500, cursor: 'pointer',
                transition: 'all 0.25s',
                boxShadow: isActive(to) ? '0 0 12px rgba(123,47,255,0.3)' : 'none',
              }}
                onMouseEnter={e => {
                  if (!isActive(to)) {
                    e.currentTarget.style.color = '#ffffff'
                    e.currentTarget.style.background = 'rgba(123,47,255,0.15)'
                    e.currentTarget.style.border = '1px solid rgba(123,47,255,0.3)'
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive(to)) {
                    e.currentTarget.style.color = '#acacb8'
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.border = '1px solid transparent'
                  }
                }}
              >
                {icon} {label}
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile Hamburger */}
        <Button
          type="text"
          icon={<MenuOutlined style={{ color: '#c084fc', fontSize: 22 }} />}
          onClick={() => setDrawerOpen(true)}
          style={{ display: 'none' }}
          className="mobile-menu-btn"
        />
      </nav>

      {/* Mobile Drawer */}
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        placement="right"
        width={280}
        styles={{
          body: { background: '#0d0010', padding: 24 },
          header: { background: '#0d0010', borderBottom: '1px solid rgba(123,47,255,0.3)' },
        }}
        title={
          <img src={hnpLogo} alt="HNP Logo" style={{ height: 36, filter: 'drop-shadow(0 0 8px rgba(168,85,247,0.8))' }} />
        }
        closeIcon={<CloseOutlined style={{ color: '#c084fc' }} />}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {navLinks.map(({ to, label, icon }) => (
            <Link key={to} to={to} style={{ textDecoration: 'none' }} onClick={() => setDrawerOpen(false)}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '14px 16px', borderRadius: 10,
                background: isActive(to) ? 'rgba(123,47,255,0.25)' : 'transparent',
                border: isActive(to) ? '1px solid rgba(123,47,255,0.5)' : '1px solid rgba(255,255,255,0.05)',
                color: isActive(to) ? '#c084fc' : '#acacb8',
                fontSize: 15, fontWeight: 500, transition: 'all 0.2s',
              }}>
                {icon} {label}
              </div>
            </Link>
          ))}
        </div>
      </Drawer>

      {/* Responsive style overrides */}
      <style>{`
        @media (max-width: 900px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: inline-flex !important; }
        }
      `}</style>

      {/* Spacer */}
      <div style={{ height: 64 }} />
    </>
  )
}
