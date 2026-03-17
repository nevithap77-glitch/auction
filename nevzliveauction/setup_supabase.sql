-- HNP Live Auction - Supabase Database Setup

-- 1. Create Products Table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  initial_price DECIMAL NOT NULL,
  current_bid DECIMAL DEFAULT 0,
  image_url TEXT,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create Bids Table (Linked to Products)
CREATE TABLE bids (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID,
  amount DECIMAL NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create Wishlist Table
CREATE TABLE wishlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- 4. Enable Realtime for Bids and Products tables
ALTER PUBLICATION supabase_realtime ADD TABLE bids;
ALTER PUBLICATION supabase_realtime ADD TABLE products;

-- 5. Insert Sample Data
INSERT INTO products (title, category, description, initial_price, current_bid, image_url, end_time)
VALUES 
('Vintage Rolex Submariner', 'Luxury & Fashion', 'A stunning 1970s Rolex Submariner in pristine condition.', 4000, 4200, '⌚', NOW() + INTERVAL '12 HOURS'),
('RTX 5090 Gaming PC', 'High-Tech Gadgets', 'Custom-built gaming powerhouse.', 3500, 3800, '🖥️', NOW() + INTERVAL '8 HOURS');
