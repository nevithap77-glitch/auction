import { supabase } from '../lib/supabaseClient'

export default function ProductListing() {
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [priceRange, setPriceRange] = useState([0, 10000])
  const [wishlist, setWishlist] = useState([])
  const [sortBy, setSortBy] = useState('hot')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching products:', error)
    } else {
      setProducts(data)
    }
    setLoading(false)
  }

  const toggleWish = (id) => {
    setWishlist(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  const filtered = products
    .filter(p => {
      const matchSearch = p.title.toLowerCase().includes(search.toLowerCase())
      const matchCat = category === 'All' || p.category === category
      const matchPrice = p.current_bid >= priceRange[0] && p.current_bid <= priceRange[1]
      return matchSearch && matchCat && matchPrice
    })
    .sort((a, b) => {
      if (sortBy === 'hot') return b.hot - a.hot
      if (sortBy === 'price_asc') return a.price - b.price
      if (sortBy === 'price_desc') return b.price - a.price
      if (sortBy === 'bids') return b.bids - a.bids
      return 0
    })

  return (
    <div className="page-enter" style={{ minHeight: '100vh', padding: '30px 24px', maxWidth: 1200, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 36, textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 'clamp(1.6rem,4vw,2.4rem)', fontWeight: 900, marginBottom: 8 }}>
          <span className="gradient-text">Live Auction Products</span>
        </h1>
        <p style={{ color: '#acacb8' }}>{filtered.length} items available for bidding right now</p>
      </div>

      {/* Filters */}
      <div className="glass-card" style={{ padding: '24px 28px', marginBottom: 32 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={8} md={7}>
            <Input
              prefix={<SearchOutlined />}
              placeholder="Search products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={12} sm={8} md={5}>
            <Select value={category} onChange={setCategory} style={{ width: '100%' }}>
              {CATEGORIES.map(c => <Option key={c} value={c}>{c}</Option>)}
            </Select>
          </Col>
          <Col xs={12} sm={8} md={4}>
            <Select value={sortBy} onChange={setSortBy} style={{ width: '100%' }}>
              <Option value="hot">🔥 Hot</Option>
              <Option value="price_asc">$ Low → High</Option>
              <Option value="price_desc">$ High → Low</Option>
              <Option value="bids">Most Bids</Option>
            </Select>
          </Col>
          <Col xs={24} md={8}>
            <div style={{ color: '#acacb8', fontSize: 13, marginBottom: 4 }}>
              <FilterOutlined style={{ marginRight: 6, color: '#a855f7' }} />
              Price: ${priceRange[0].toLocaleString()} – ${priceRange[1].toLocaleString()}
            </div>
            <Slider
              range min={0} max={10000} step={100}
              value={priceRange}
              onChange={setPriceRange}
            />
          </Col>
        </Row>
      </div>

      {/* Category Tags */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 28 }}>
        {CATEGORIES.map(c => (
          <Tag
            key={c}
            onClick={() => setCategory(c)}
            style={{
              cursor: 'pointer', padding: '6px 14px', borderRadius: 999,
              background: category === c ? 'rgba(123,47,255,0.35)' : 'rgba(123,47,255,0.1)',
              borderColor: category === c ? '#7b2fff' : 'rgba(123,47,255,0.25)',
              color: category === c ? '#fff' : '#acacb8',
              fontWeight: category === c ? 700 : 400,
              transition: 'all 0.2s',
            }}
          >
            {c}
          </Tag>
        ))}
      </div>

      {/* Product Grid */}
      <Row gutter={[20, 24]}>
        {filtered.map(({ id, title, category: cat, price, img, hot, bids, time }) => (
          <Col xs={24} sm={12} md={8} lg={6} key={id}>
            <div className="glass-card card-3d" style={{ overflow: 'hidden', position: 'relative', cursor: 'pointer' }}>
              {hot && (
                <div style={{
                  position: 'absolute', top: 10, left: 10, zIndex: 2,
                  background: 'linear-gradient(135deg, #7b2fff, #a855f7)',
                  borderRadius: 999, padding: '3px 10px', fontSize: 10, fontWeight: 700, color: '#fff',
                }}>🔥 HOT</div>
              )}
              <div
                style={{ position: 'absolute', top: 10, right: 10, zIndex: 2, cursor: 'pointer', fontSize: 20 }}
                onClick={() => toggleWish(id)}
              >
                {wishlist.includes(id)
                  ? <HeartFilled style={{ color: '#f87171' }} />
                  : <HeartOutlined style={{ color: '#acacb8' }} />}
              </div>

              {/* Product Image */}
              <div style={{
                height: 150, display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'linear-gradient(135deg, rgba(123,47,255,0.12), rgba(45,0,96,0.4))',
                fontSize: 72,
              }}>{img}</div>

              <div style={{ padding: '16px 16px 20px' }}>
                <div style={{ fontSize: 10, color: '#a855f7', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>{cat}</div>
                <div style={{ fontWeight: 700, fontSize: 14, color: '#fff', marginBottom: 12, lineHeight: 1.4 }}>{title}</div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <div>
                    <div style={{ fontSize: 10, color: '#acacb8' }}>Current Bid</div>
                    <div style={{ fontSize: 17, fontWeight: 800, color: '#fbbf24', fontFamily: 'Orbitron, sans-serif' }}>${price.toLocaleString()}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 10, color: '#acacb8' }}>{bids} bids</div>
                    <div className="countdown-anim" style={{ fontSize: 13, fontFamily: 'Orbitron, sans-serif', fontWeight: 700 }}>
                      <ClockCircleOutlined style={{ marginRight: 3, WebkitTextFillColor: 'initial' }} />{time}
                    </div>
                  </div>
                </div>

                <Link to={`/bidding/${id}`}>
                  <Button type="primary" block style={{ borderRadius: 8, marginTop: 8 }}>
                    <ThunderboltOutlined /> View Auction
                  </Button>
                </Link>
              </div>
            </div>
          </Col>
        ))}
      </Row>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '80px 20px', color: '#6b7280' }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>🔍</div>
          <p style={{ fontSize: 17 }}>No products match your filters.</p>
        </div>
      )}
    </div>
  )
}
