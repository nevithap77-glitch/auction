import React, { useState } from 'react'
import { Row, Col, Tag, Button, Badge } from 'antd'
import { TrophyOutlined, CheckCircleOutlined, ClockCircleOutlined, ThunderboltOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'

const ORDERS = [
  { id: 1, title: 'Vintage Rolex Submariner', category: 'Luxury & Fashion', finalBid: 4550, img: '⌚', status: 'Completed', date: 'Mar 14, 2026', orderNo: 'HNP-00412' },
  { id: 3, title: 'Signed Ronaldo Jersey', category: 'Collectibles', finalBid: 1620, img: '👕', status: 'Pending', date: 'Mar 16, 2026', orderNo: 'HNP-00431' },
  { id: 7, title: 'Apple Vision Pro Max', category: 'High-Tech Gadgets', finalBid: 2350, img: '🥽', status: 'Completed', date: 'Mar 10, 2026', orderNo: 'HNP-00398' },
  { id: 9, title: 'Ancient Roman Coin Set', category: 'Collectibles', finalBid: 3400, img: '🪙', status: 'Pending', date: 'Mar 17, 2026', orderNo: 'HNP-00441' },
]

const StatusBadge = ({ status }) => {
  const isPending = status === 'Pending'
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '5px 14px', borderRadius: 999, fontSize: 12, fontWeight: 700,
      background: isPending ? 'rgba(251,191,36,0.15)' : 'rgba(52,211,153,0.15)',
      border: `1px solid ${isPending ? 'rgba(251,191,36,0.4)' : 'rgba(52,211,153,0.4)'}`,
      color: isPending ? '#fbbf24' : '#34d399',
    }}>
      {isPending ? <ClockCircleOutlined /> : <CheckCircleOutlined />}
      {status}
    </div>
  )
}

export default function MyOrders() {
  const total = ORDERS.reduce((sum, o) => sum + o.finalBid, 0)

  return (
    <div className="page-enter" style={{ minHeight: '100vh', padding: '30px 24px', maxWidth: 1000, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 36 }}>
        <h1 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 'clamp(1.6rem,4vw,2.4rem)', fontWeight: 900, marginBottom: 8 }}>
          <TrophyOutlined style={{ color: '#fbbf24', marginRight: 12 }} />
          <span className="gradient-text">My Won Auctions</span>
        </h1>
        <p style={{ color: '#acacb8' }}>{ORDERS.length} items won • Total spent: <span style={{ color: '#fbbf24', fontWeight: 700 }}>${total.toLocaleString()}</span></p>
      </div>

      {/* Summary Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 36 }}>
        {[
          { label: 'Total Won', value: ORDERS.length, icon: <TrophyOutlined />, color: '#fbbf24' },
          { label: 'Completed', value: ORDERS.filter(o => o.status === 'Completed').length, icon: <CheckCircleOutlined />, color: '#34d399' },
          { label: 'Pending', value: ORDERS.filter(o => o.status === 'Pending').length, icon: <ClockCircleOutlined />, color: '#fbbf24' },
          { label: 'Total Spent', value: `$${total.toLocaleString()}`, icon: <ThunderboltOutlined />, color: '#c084fc' },
        ].map(({ label, value, icon, color }) => (
          <Col xs={12} sm={6} key={label}>
            <div className="glass-card" style={{ padding: '20px 16px', textAlign: 'center' }}>
              <div style={{ fontSize: 24, color, marginBottom: 6 }}>{icon}</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#fff', fontFamily: 'Orbitron, sans-serif' }}>{value}</div>
              <div style={{ fontSize: 12, color: '#acacb8', marginTop: 4 }}>{label}</div>
            </div>
          </Col>
        ))}
      </Row>

      {/* Orders List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {ORDERS.map(({ id, title, category, finalBid, img, status, date, orderNo }) => (
          <div key={id} className="glass-card" style={{
            padding: '20px 24px', display: 'flex', alignItems: 'center',
            gap: 20, flexWrap: 'wrap',
            transition: 'all 0.3s',
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#7b2fff'; e.currentTarget.style.boxShadow = '0 0 25px rgba(123,47,255,0.2)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = ''; e.currentTarget.style.boxShadow = '' }}
          >
            {/* Emoji img */}
            <div style={{
              width: 72, height: 72, borderRadius: 14, flexShrink: 0,
              background: 'linear-gradient(135deg, rgba(123,47,255,0.2), rgba(45,0,96,0.5))',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 38,
              border: '1px solid rgba(123,47,255,0.3)',
            }}>{img}</div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 180 }}>
              <div style={{ fontSize: 10, color: '#a855f7', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>{category}</div>
              <div style={{ fontWeight: 700, fontSize: 16, color: '#fff', marginBottom: 6 }}>{title}</div>
              <div style={{ fontSize: 12, color: '#6b7280' }}>Order #{orderNo} • {date}</div>
            </div>

            {/* Bid + Status */}
            <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10 }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: '#fbbf24', fontFamily: 'Orbitron, sans-serif' }}>
                ${finalBid.toLocaleString()}
              </div>
              <StatusBadge status={status} />
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div style={{ textAlign: 'center', marginTop: 48 }}>
        <Link to="/products">
          <Button type="primary" size="large" icon={<ThunderboltOutlined />} style={{ height: 48, padding: '0 28px', borderRadius: 10 }}>
            Bid on More Items
          </Button>
        </Link>
      </div>
    </div>
  )
}
