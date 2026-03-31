CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  source VARCHAR DEFAULT 'site',
  source_id VARCHAR,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  author_name VARCHAR,
  text TEXT,
  images TEXT[],
  is_verified BOOLEAN DEFAULT false,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT now()
);
