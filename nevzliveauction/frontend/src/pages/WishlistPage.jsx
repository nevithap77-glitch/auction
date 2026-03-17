import React, { useState } from 'react'
import { Row, Col, Button, Empty, message, Tag } from 'antd'
import { HeartFilled, DeleteOutlined, ThunderboltOutlined, ShoppingCartOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'

const INITIAL_WISHLIST = [
  { id: 1, title: 'Vintage Rolex Submariner', category: 'Luxury & Fashion', price: 4200, img: '⌚', time: '12:34' },
  { id: 5, title: 'Monet Original Print', category: 'Art & Memorabilia', price: 6500, img: '🎨', time: '02:20' },
  { id: 6, title: 'Private Island Stay', category: 'Experiences', price: 9900, img: '🏝️', time: '47:00' },
  { id: 11, title: 'Formula 1 Pit Stop Exp.', category: 'Experiences', price: 4800, img: '🏎️', time: '20:00' },
]

export default function WishlistPage() {
  const [items, setItems] = useState(INITIAL_WISHLIST)
  const [removing, setRemoving] = useState(null)

  const remove = (id) => {
    setRemoving(id)
    setTimeout(() => {
      setItems(prev => prev.filter(item => item.id !== id))
      setRemoving(null)
      message.success({ content: 'Removed from wishlist', style: { marginTop: '10vh' } })
    }, 400)
  }

  return (
    <div className="page-enter" style={{ minHeight: '100vh', padding: '30px 24px', maxWidth: 1000, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 36 }}>
        <h1 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 'clamp(1.6rem,4vw,2.4rem)', fontWeight: 900, marginBottom: 8 }}>
          <HeartFilled style={{ color: '#f87171', marginRight: 12 }} />
          <span className="gradient-text">My Wishlist</span>
        </h1>
        <p style={{ color: '#acacb8' }}>{items.length} saved items</p>
      </div>

      {items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 20px' }}>
          <div style={{ fontSize: 72, marginBottom: 20 }}>💜</div>
          <h2 style={{ color: '#fff', marginBottom: 12 }}>Your wishlist is empty</h2>
          <p style={{ color: '#acacb8', marginBottom: 24 }}>Save items you love and bid on them later</p>
          <Link to="/products">
            <Button type="primary" size="large" icon={<ShoppingCartOutlined />} style={{ borderRadius: 10 }}>
              Browse Auctions
            </Button>
          </Link>
        </div>
      ) : (
        <Row gutter={[20, 20]}>
          {items.map(({ id, title, category, price, img, time }) => (
            <Col xs={24} sm={12} md={8} key={id}>
              <div
                className="glass-card card-3d"
                style={{
                  overflow: 'hidden', position: 'relative',
                  opacity: removing === id ? 0 : 1,
                  transform: removing === id ? 'scale(0.9)' : 'scale(1)',
                  transition: 'opacity 0.35s, transform 0.35s',
                }}
              >
                {/* Remove btn */}
                <Button
                  danger type="text" icon={<DeleteOutlined />}
                  onClick={() => remove(id)}
                  style={{
                    position: 'absolute', top: 8, right: 8, zIndex: 2,
                    background: 'rgba(239,68,68,0.15)', borderRadius: 8,
                    border: '1px solid rgba(239,68,68,0.3)', color: '#f87171',
                  }}
                />

                {/* Image */}
                <div style={{
                  height: 150, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'linear-gradient(135deg, rgba(123,47,255,0.15), rgba(45,0,96,0.4))',
                  fontSize: 70,
                }}>{img}</div>

                <div style={{ padding: '16px 16px 20px' }}>
                  <Tag style={{ marginBottom: 8 }}>{category}</Tag>
                  <div style={{ fontWeight: 700, fontSize: 15, color: '#fff', marginBottom: 10, paddingRight: 24 }}>{title}</div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                    <div>
                      <div style={{ fontSize: 11, color: '#acacb8' }}>Current Bid</div>
                      <div style={{ fontSize: 18, fontWeight: 800, color: '#fbbf24', fontFamily: 'Orbitron, sans-serif' }}>${price.toLocaleString()}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 11, color: '#acacb8' }}>Ends In</div>
                      <div className="countdown-anim" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: 700, fontSize: 13 }}>{time}</div>
                    </div>
                  </div>

                  <Link to={`/bidding/${id}`}>
                    <Button type="primary" block style={{ borderRadius: 8 }}>
                      <ThunderboltOutlined /> Bid Now
                    </Button>
                  </Link>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      )}
    </div>
  )
}
