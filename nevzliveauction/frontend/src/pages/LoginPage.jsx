import React, { useState } from 'react'
import { Form, Input, Button, Checkbox, Divider, message } from 'antd'
import { UserOutlined, LockOutlined, ThunderboltOutlined, EyeTwoTone, EyeInvisibleOutlined } from '@ant-design/icons'
import { Link, useNavigate } from 'react-router-dom'
import hnpLogo from '../assets/hnp-logo.png'

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const onFinish = (values) => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      message.success({ content: '🎉 Welcome back to HNP Live Auction!', style: { marginTop: '10vh' } })
      setTimeout(() => navigate('/products'), 1000)
    }, 1800)
  }

  return (
    <div className="page-enter" style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '40px 20px',
      background: 'radial-gradient(ellipse 70% 70% at 50% 50%, rgba(123,47,255,0.15) 0%, transparent 70%)',
    }}>
      <div style={{ width: '100%', maxWidth: 460 }}>
        {/* Card */}
        <div className="glass-card purple-glow-box" style={{ padding: '48px 40px', textAlign: 'center' }}>
          {/* Logo */}
          <img
            src={hnpLogo}
            alt="HNP"
            className="float-anim"
            style={{ height: 80, marginBottom: 20, filter: 'drop-shadow(0 0 20px rgba(168,85,247,0.9))' }}
          />

          <h1 style={{
            fontFamily: 'Orbitron, sans-serif', fontSize: 22, fontWeight: 900, marginBottom: 6,
            background: 'linear-gradient(135deg, #a855f7, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            Welcome Back
          </h1>
          <p style={{ color: '#acacb8', marginBottom: 36, fontSize: 14 }}>
            Sign in to start bidding on exclusive items
          </p>

          <Form layout="vertical" onFinish={onFinish} autoComplete="off" requiredMark={false}>
            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Please enter your email or username' },
                { min: 3, message: 'Must be at least 3 characters' }
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Email or Username"
                size="large"
                style={{ height: 52 }}
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: 'Please enter your password' },
                { min: 6, message: 'Password must be at least 6 characters' }
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Password"
                size="large"
                style={{ height: 52 }}
                iconRender={(visible) => visible ? <EyeTwoTone twoToneColor="#7b2fff" /> : <EyeInvisibleOutlined />}
              />
            </Form.Item>

            <Form.Item style={{ marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox style={{ color: '#acacb8' }}>Remember me</Checkbox>
                </Form.Item>
                <a href="#" style={{ color: '#a855f7', fontSize: 13 }}>Forgot password?</a>
              </div>
            </Form.Item>

            <Form.Item style={{ marginBottom: 16 }}>
              <Button
                type="primary" htmlType="submit" block size="large"
                loading={loading}
                icon={<ThunderboltOutlined />}
                style={{ height: 52, fontSize: 16, borderRadius: 10 }}
              >
                {loading ? 'Signing In...' : 'Sign In to Bid'}
              </Button>
            </Form.Item>
          </Form>

          <Divider style={{ borderColor: 'rgba(123,47,255,0.25)', color: '#acacb8', fontSize: 12 }}>
            New to HNP?
          </Divider>

          <Button
            block size="large"
            style={{
              height: 48, borderRadius: 10,
              background: 'rgba(123,47,255,0.1)',
              border: '1px solid rgba(123,47,255,0.4)',
              color: '#c084fc', fontSize: 15,
              transition: 'all 0.25s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(123,47,255,0.2)'; e.currentTarget.style.boxShadow = '0 0 15px rgba(123,47,255,0.3)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(123,47,255,0.1)'; e.currentTarget.style.boxShadow = 'none' }}
          >
            Create Free Account
          </Button>

          <p style={{ marginTop: 24, color: '#6b7280', fontSize: 12 }}>
            By continuing you agree to our{' '}
            <a href="#" style={{ color: '#a855f7' }}>Terms</a> &{' '}
            <a href="#" style={{ color: '#a855f7' }}>Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  )
}
