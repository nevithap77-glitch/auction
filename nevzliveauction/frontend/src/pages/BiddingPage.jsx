import { supabase } from '../lib/supabaseClient'

export default function BiddingPage() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [currentBid, setCurrentBid] = useState(0)
  const [bidHistory, setBidHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [bidLoading, setBidLoading] = useState(false)
  const [timeLeft, setTimeLeft] = useState({ h: 0, m: 0, s: 0 })
  const [form] = Form.useForm()
  const [imgRotate, setImgRotate] = useState({ x: 0, y: 0 })
  const imgRef = useRef(null)

  useEffect(() => {
    if (id) {
      fetchProductDetails()
      fetchBidHistory()
      subscribeToBids()
    }
  }, [id])

  const fetchProductDetails = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching product:', error)
    } else {
      setProduct(data)
      setCurrentBid(data.current_bid)
      calculateTimeLeft(data.end_time)
    }
    setLoading(false)
  }

  const fetchBidHistory = async () => {
    const { data, error } = await supabase
      .from('bids')
      .select('*')
      .eq('product_id', id)
      .order('created_at', { ascending: false })
      .limit(10)

    if (!error) setBidHistory(data)
  }

  const subscribeToBids = () => {
    const subscription = supabase
      .channel(`prod-${id}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'bids',
        filter: `product_id=eq.${id}`
      }, (payload) => {
        const newBid = payload.new
        setCurrentBid(newBid.amount)
        setBidHistory(prev => [newBid, ...prev].slice(0, 10))
        message.info(`New bid placed: $${newBid.amount.toLocaleString()}`)
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'products',
        filter: `id=eq.${id}`
      }, (payload) => {
        setCurrentBid(payload.new.current_bid)
      })
      .subscribe()

    return () => {
      supabase.removeChannel(subscription)
    }
  }

  const calculateTimeLeft = (endTime) => {
    const diff = new Date(endTime) - new Date()
    if (diff > 0) {
      const h = Math.floor(diff / (1000 * 60 * 60))
      const m = Math.floor((diff / (1000 * 60)) % 60)
      const s = Math.floor((diff / 1000) % 60)
      setTimeLeft({ h, m, s })
    }
  }

  // Countdown timer effect
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        let { h, m, s } = prev
        if (s > 0) return { h, m, s: s - 1 }
        if (m > 0) return { h, m: m - 1, s: 59 }
        if (h > 0) return { h: h - 1, m: 59, s: 59 }
        return { h: 0, m: 0, s: 0 }
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // 3D image tilt
  const handleMouseMove = (e) => {
    if (!imgRef.current) return
    const { left, top, width, height } = imgRef.current.getBoundingClientRect()
    const x = ((e.clientX - left) / width - 0.5) * 30
    const y = -((e.clientY - top) / height - 0.5) * 30
    setImgRotate({ x, y })
  }

  const placeBid = async (values) => {
    const amount = parseFloat(values.bidAmount)
    if (amount <= currentBid) {
      message.error({ content: `Bid must be higher than current bid of $${currentBid.toLocaleString()}`, style: { marginTop: '10vh' } })
      return
    }
    
    setBidLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      const userId = user?.id || '00000000-0000-0000-0000-000000000000' // Fail-safe for demo
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/bids`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: id,
          userId: userId,
          amount: amount
        })
      })
      
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Failed to place bid')
      
      form.resetFields()
      message.success({ content: `🎉 Bid of $${amount.toLocaleString()} placed successfully!`, style: { marginTop: '10vh' } })
    } catch (err) {
      message.error(err.message)
    } finally {
      setBidLoading(true)
      setTimeout(() => setBidLoading(false), 500)
    }
  }

  const fmt = (n) => n.toString().padStart(2, '0')
  const timerClass = timeLeft.m < 2 && timeLeft.h === 0 ? 'countdown-anim' : ''

  if (loading) return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
    </div>
  )

  if (!product) return (
    <div style={{ textAlign: 'center', padding: '100px 20px' }}>
      <h2 style={{ color: '#fff' }}>Auction Item Not Found</h2>
      <Button type="primary" onClick={() => window.history.back()}>Go Back</Button>
    </div>
  )

  return (
    <div className="page-enter" style={{ minHeight: '100vh', padding: '30px 24px', maxWidth: 1100, margin: '0 auto' }}>
      <h1 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 'clamp(1.4rem,3vw,2rem)', fontWeight: 900, marginBottom: 28 }}>
        <ThunderboltOutlined style={{ color: '#a855f7', marginRight: 10 }} />
        <span className="gradient-text">Live Bidding</span>
      </h1>

      <Row gutter={[28, 28]}>
        {/* Left: Product */}
        <Col xs={24} lg={14}>
          <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
            {/* 3D Product Image */}
            <div
              ref={imgRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setImgRotate({ x: 0, y: 0 })}
              style={{
                height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'linear-gradient(135deg, rgba(123,47,255,0.15), rgba(45,0,96,0.5))',
                fontSize: 130, cursor: 'crosshair',
                transition: 'transform 0.1s ease',
                transform: `perspective(800px) rotateX(${imgRotate.y}deg) rotateY(${imgRotate.x}deg)`,
                position: 'relative',
              }}
            >
              <div style={{
                position: 'absolute', inset: 0,
                background: 'radial-gradient(ellipse at center, rgba(168,85,247,0.1), transparent 70%)',
              }} />
              {product.image_url}
              {/* Live badge */}
              <div style={{
                position: 'absolute', top: 16, left: 16,
                background: '#ef4444', borderRadius: 999, padding: '4px 12px',
                fontSize: 12, fontWeight: 700, color: '#fff',
                display: 'flex', alignItems: 'center', gap: 6,
                boxShadow: '0 0 12px rgba(239,68,68,0.6)',
              }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff', display: 'inline-block', animation: 'pulse-purple 1s infinite' }} />
                LIVE
              </div>
            </div>

            <div style={{ padding: '24px 28px' }}>
              <Tag style={{ marginBottom: 12 }}>{product.category}</Tag>
              <h2 style={{ fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 12 }}>{product.title}</h2>
              <p style={{ color: '#acacb8', lineHeight: 1.7, marginBottom: 24 }}>{product.description}</p>

              {/* Stats Row */}
              <Row gutter={16}>
                {[
                  { label: 'Current Bid', value: `$${currentBid.toLocaleString()}`, color: '#fbbf24' },
                  { label: 'Total Bids', value: bidHistory.length + '+', color: '#c084fc' },
                  { label: 'Watchers', value: '284', color: '#34d399' },
                ].map(({ label, value, color }) => (
                  <Col span={8} key={label}>
                    <div style={{
                      background: 'rgba(123,47,255,0.1)', borderRadius: 12,
                      border: '1px solid rgba(123,47,255,0.2)', padding: '14px 12px', textAlign: 'center',
                    }}>
                      <div style={{ fontSize: 10, color: '#acacb8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>{label}</div>
                      <div style={{ fontSize: 20, fontWeight: 800, color, fontFamily: 'Orbitron, sans-serif' }}>{value}</div>
                    </div>
                  </Col>
                ))}
              </Row>
            </div>
          </div>
        </Col>

        {/* Right: Bidding Panel */}
        <Col xs={24} lg={10}>
          {/* Countdown */}
          <div className="glass-card purple-glow-box" style={{ padding: '24px', marginBottom: 20, textAlign: 'center' }}>
            <div style={{ fontSize: 12, color: '#acacb8', marginBottom: 10, letterSpacing: 2, textTransform: 'uppercase' }}>
              <ClockCircleOutlined style={{ marginRight: 6 }} />Auction Ends In
            </div>
            <div className={timerClass} style={{
              fontFamily: 'Orbitron, sans-serif', fontSize: 40, fontWeight: 900, letterSpacing: 4,
              color: timeLeft.m < 2 && timeLeft.h === 0 ? '#fbbf24' : '#c084fc',
            }}>
              {fmt(timeLeft.h)}:{fmt(timeLeft.m)}:{fmt(timeLeft.s)}
            </div>
          </div>

          {/* Bid Form */}
          <div className="glass-card" style={{ padding: '24px', marginBottom: 20 }}>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, color: '#acacb8' }}>Current Highest Bid</div>
              <div style={{ fontSize: 32, fontWeight: 900, color: '#fbbf24', fontFamily: 'Orbitron, sans-serif' }}>
                ${currentBid.toLocaleString()}
              </div>
              <div style={{ fontSize: 12, color: '#a855f7', marginTop: 4 }}>
                Min. next bid: ${(currentBid + 50).toLocaleString()}
              </div>
            </div>

            <Form form={form} onFinish={placeBid} layout="vertical">
              <Form.Item
                name="bidAmount"
                rules={[
                  { required: true, message: 'Enter your bid amount' },
                  { validator: (_, val) => {
                    if (!val || isNaN(val)) return Promise.reject('Enter a valid number')
                    if (parseFloat(val) <= currentBid) return Promise.reject(`Bid must be > $${currentBid.toLocaleString()}`)
                    return Promise.resolve()
                  }}
                ]}
              >
                <Input
                  prefix={<span style={{ color: '#fbbf24', fontWeight: 800 }}>$</span>}
                  type="number"
                  placeholder={`e.g. ${currentBid + 100}`}
                  size="large"
                  style={{ height: 52 }}
                />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary" htmlType="submit" block size="large"
                  loading={loading}
                  icon={loading ? <LoadingOutlined /> : <ThunderboltOutlined />}
                  className="pulse-glow"
                  style={{ height: 52, fontSize: 16, borderRadius: 10 }}
                >
                  {loading ? 'Placing Bid...' : 'Place Bid Now'}
                </Button>
              </Form.Item>
            </Form>

            <div style={{ display: 'flex', gap: 8 }}>
              {[currentBid + 100, currentBid + 250, currentBid + 500].map(amt => (
                <Button key={amt} size="small" onClick={() => form.setFieldValue('bidAmount', amt)}
                  style={{
                    flex: 1, background: 'rgba(123,47,255,0.15)',
                    border: '1px solid rgba(123,47,255,0.3)', color: '#c084fc', fontSize: 12
                  }}>
                  +${(amt - currentBid).toLocaleString()}
                </Button>
              ))}
            </div>
          </div>

          {/* Bid History */}
          <div className="glass-card" style={{ padding: '20px' }}>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 14, color: '#c084fc' }}>
              <TrophyOutlined style={{ marginRight: 8 }} />Bid History
            </div>
            <div style={{ maxHeight: 260, overflowY: 'auto' }}>
              {bidHistory.map((bid, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '10px 0',
                  borderBottom: i < bidHistory.length - 1 ? '1px solid rgba(123,47,255,0.15)' : 'none',
                  animation: i === 0 ? 'pageIn 0.4s ease' : 'none',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: '50%',
                      background: i === 0 ? 'rgba(123,47,255,0.4)' : 'rgba(123,47,255,0.15)',
                      border: `1px solid ${i === 0 ? '#7b2fff' : 'rgba(123,47,255,0.2)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
                    }}>{bid.avatar}</div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 13, color: i === 0 ? '#c084fc' : '#fff' }}>{bid.user}</div>
                      <div style={{ fontSize: 11, color: '#6b7280' }}>{bid.time}</div>
                    </div>
                  </div>
                  <div style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: 800, color: i === 0 ? '#fbbf24' : '#acacb8', fontSize: 14 }}>
                    ${bid.amount.toLocaleString()}
                    {i === 0 && <ArrowUpOutlined style={{ marginLeft: 4, color: '#34d399' }} />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Col>
      </Row>
    </div>
  )
}
