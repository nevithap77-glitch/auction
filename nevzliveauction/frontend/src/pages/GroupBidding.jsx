import React, { useState } from 'react'
import { Row, Col, Button, Input, Progress, Tag, Divider, message, Form, Avatar } from 'antd'
import {
  TeamOutlined, PlusOutlined, LinkOutlined, ThunderboltOutlined,
  CrownOutlined, CopyOutlined, CheckOutlined
} from '@ant-design/icons'
import { Link } from 'react-router-dom'

const FEATURED_PRODUCT = {
  title: 'Monet Original Print',
  category: 'Art & Memorabilia',
  img: '🎨',
  targetBid: 6500,
  currentBid: 4750,
}

const INITIAL_MEMBERS = [
  { name: 'You', contribution: 1500, avatar: '⭐', role: 'Leader' },
  { name: 'AuctionKing99', contribution: 1800, avatar: '👑', role: 'Member' },
  { name: 'BidMaster_X', contribution: 950, avatar: '⚡', role: 'Member' },
  { name: 'LuxuryHunter', contribution: 500, avatar: '💎', role: 'Member' },
]

export default function GroupBidding() {
  const [members, setMembers] = useState(INITIAL_MEMBERS)
  const [form] = Form.useForm()
  const [copied, setCopied] = useState(false)
  const [bidLoading, setBidLoading] = useState(false)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  const inviteLink = 'https://hnp.live/group/J7K2PX'
  const totalContributed = members.reduce((sum, m) => sum + m.contribution, 0)
  const progress = Math.min((totalContributed / FEATURED_PRODUCT.targetBid) * 100, 100)

  const copyLink = () => {
    navigator.clipboard.writeText(inviteLink).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      message.success({ content: 'Invite link copied!', style: { marginTop: '10vh' } })
    })
  }

  const addContribution = (values) => {
    const amt = parseFloat(values.amount)
    setMembers(prev => prev.map((m, i) => i === 0 ? { ...m, contribution: m.contribution + amt } : m))
    form.resetFields()
    message.success({ content: `✅ $${amt} added to group pool!`, style: { marginTop: '10vh' } })
  }

  const placeBid = () => {
    if (totalContributed < FEATURED_PRODUCT.targetBid) {
      message.warning({ content: 'Pool not fully funded yet!', style: { marginTop: '10vh' } })
      return
    }
    setBidLoading(true)
    setTimeout(() => {
      setBidLoading(false)
      message.success({ content: '🎉 Group bid placed successfully!', style: { marginTop: '10vh' } })
    }, 1800)
  }

  const handleTilt = (e) => {
    const el = e.currentTarget
    const { left, top, width, height } = el.getBoundingClientRect()
    setTilt({
      x: ((e.clientX - left) / width - 0.5) * 25,
      y: -((e.clientY - top) / height - 0.5) * 25,
    })
  }

  return (
    <div className="page-enter" style={{ minHeight: '100vh', padding: '30px 24px', maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ marginBottom: 36 }}>
        <h1 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 'clamp(1.6rem,4vw,2.4rem)', fontWeight: 900, marginBottom: 8 }}>
          <TeamOutlined style={{ color: '#a855f7', marginRight: 12 }} />
          <span className="gradient-text">Group Bidding</span>
        </h1>
        <p style={{ color: '#acacb8' }}>Pool resources with friends and win big-ticket auctions together</p>
      </div>

      <Row gutter={[28, 28]}>
        {/* Left: Product + Pool */}
        <Col xs={24} lg={14}>
          {/* 3D Product Card */}
          <div
            className="glass-card"
            onMouseMove={handleTilt}
            onMouseLeave={() => setTilt({ x: 0, y: 0 })}
            style={{
              marginBottom: 24, overflow: 'hidden',
              transform: `perspective(900px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
              transition: 'transform 0.1s ease',
            }}
          >
            <div style={{
              height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'linear-gradient(135deg, rgba(123,47,255,0.2), rgba(45,0,96,0.5))',
              fontSize: 110,
            }}>{FEATURED_PRODUCT.img}</div>
            <div style={{ padding: '20px 24px' }}>
              <Tag style={{ marginBottom: 8 }}>{FEATURED_PRODUCT.category}</Tag>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 16 }}>{FEATURED_PRODUCT.title}</h2>

              {/* Progress */}
              <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, color: '#acacb8' }}>Pool Progress</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: progress >= 100 ? '#34d399' : '#c084fc' }}>
                  {progress.toFixed(0)}%
                </span>
              </div>
              <Progress
                percent={parseFloat(progress.toFixed(1))}
                showInfo={false}
                strokeColor={{ '0%': '#7b2fff', '100%': '#c084fc' }}
                trailColor="rgba(123,47,255,0.15)"
                style={{ marginBottom: 12 }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#34d399', fontWeight: 700, fontFamily: 'Orbitron, sans-serif', fontSize: 15 }}>
                  ${totalContributed.toLocaleString()} raised
                </span>
                <span style={{ color: '#acacb8', fontSize: 14 }}>
                  Goal: <span style={{ color: '#fbbf24', fontWeight: 700 }}>${FEATURED_PRODUCT.targetBid.toLocaleString()}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Members */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <div style={{ fontWeight: 700, fontSize: 16, color: '#c084fc', marginBottom: 20 }}>
              <TeamOutlined style={{ marginRight: 8 }} />Group Members ({members.length})
            </div>
            {members.map(({ name, contribution, avatar, role }, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '12px 0',
                borderBottom: i < members.length - 1 ? '1px solid rgba(123,47,255,0.15)' : 'none',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: '50%', fontSize: 20,
                    background: i === 0 ? 'rgba(123,47,255,0.4)' : 'rgba(123,47,255,0.15)',
                    border: `1px solid ${i === 0 ? '#7b2fff' : 'rgba(123,47,255,0.2)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>{avatar}</div>
                  <div>
                    <div style={{ fontWeight: 600, color: '#fff', fontSize: 14 }}>
                      {name}
                      {role === 'Leader' && <CrownOutlined style={{ color: '#fbbf24', marginLeft: 6, fontSize: 12 }} />}
                    </div>
                    <div style={{ fontSize: 11, color: '#6b7280' }}>{role}</div>
                  </div>
                </div>
                <div style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: 800, color: '#fbbf24', fontSize: 15 }}>
                  ${contribution.toLocaleString()}
                </div>
              </div>
            ))}

            {/* Add Contribution */}
            <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid rgba(123,47,255,0.15)' }}>
              <Form form={form} layout="inline" onFinish={addContribution}>
                <Form.Item name="amount"
                  rules={[
                    { required: true, message: '' },
                    { validator: (_, v) => !v || isNaN(v) || v <= 0 ? Promise.reject('Enter valid amount') : Promise.resolve() }
                  ]}
                  style={{ flex: 1, marginRight: 8 }}
                >
                  <Input prefix={<span style={{ color: '#fbbf24', fontWeight: 800 }}>$</span>}
                    type="number" placeholder="Add your contribution" />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit" icon={<PlusOutlined />} style={{ borderRadius: 8 }}>Add</Button>
                </Form.Item>
              </Form>
            </div>
          </div>
        </Col>

        {/* Right: Controls */}
        <Col xs={24} lg={10}>
          {/* Invite Link */}
          <div className="glass-card purple-glow-box" style={{ padding: '24px', marginBottom: 20 }}>
            <div style={{ fontWeight: 700, fontSize: 16, color: '#c084fc', marginBottom: 16 }}>
              <LinkOutlined style={{ marginRight: 8 }} />Invite Link
            </div>
            <div style={{
              background: 'rgba(123,47,255,0.1)', borderRadius: 10,
              border: '1px solid rgba(123,47,255,0.3)', padding: '12px 16px',
              fontSize: 13, color: '#acacb8', fontFamily: 'monospace',
              marginBottom: 12, wordBreak: 'break-all',
            }}>{inviteLink}</div>
            <Button
              block icon={copied ? <CheckOutlined /> : <CopyOutlined />}
              onClick={copyLink}
              style={{
                background: copied ? 'rgba(52,211,153,0.15)' : 'rgba(123,47,255,0.15)',
                border: `1px solid ${copied ? 'rgba(52,211,153,0.4)' : 'rgba(123,47,255,0.35)'}`,
                color: copied ? '#34d399' : '#c084fc',
                borderRadius: 8, height: 40, fontWeight: 600,
              }}
            >
              {copied ? 'Copied!' : 'Copy Invite Link'}
            </Button>
          </div>

          {/* Place Bid */}
          <div className="glass-card" style={{ padding: '24px', marginBottom: 20 }}>
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <div style={{ fontSize: 12, color: '#acacb8', marginBottom: 6 }}>Group Pool Total</div>
              <div style={{ fontSize: 36, fontWeight: 900, color: '#fbbf24', fontFamily: 'Orbitron, sans-serif' }}>
                ${totalContributed.toLocaleString()}
              </div>
              <div style={{ fontSize: 12, color: progress >= 100 ? '#34d399' : '#acacb8', marginTop: 6 }}>
                {progress >= 100 ? '✅ Ready to bid!' : `$${(FEATURED_PRODUCT.targetBid - totalContributed).toLocaleString()} more needed`}
              </div>
            </div>

            <Button
              type="primary" block size="large"
              onClick={placeBid} loading={bidLoading}
              icon={<ThunderboltOutlined />}
              disabled={totalContributed < FEATURED_PRODUCT.targetBid}
              className={totalContributed >= FEATURED_PRODUCT.targetBid ? 'pulse-glow' : ''}
              style={{ height: 52, fontSize: 16, borderRadius: 10 }}
            >
              {bidLoading ? 'Placing Group Bid...' : 'Place Group Bid'}
            </Button>
          </div>

          {/* Rules */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: '#c084fc', marginBottom: 14 }}>📋 Group Rules</div>
            {[
              '💰 All members split the winning item proportionally by contribution',
              '🔐 The group leader sets the target product and bid amount',
              '⏰ Pool must be funded before the auction ends',
              '↩️ Contributions are refunded if the group bid fails',
            ].map((rule, i) => (
              <div key={i} style={{ fontSize: 13, color: '#acacb8', marginBottom: 10, lineHeight: 1.5 }}>{rule}</div>
            ))}
          </div>
        </Col>
      </Row>
    </div>
  )
}
