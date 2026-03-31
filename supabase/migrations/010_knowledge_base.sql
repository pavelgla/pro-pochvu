CREATE TABLE knowledge_base (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR UNIQUE NOT NULL,
  title VARCHAR NOT NULL,
  content TEXT NOT NULL,
  type VARCHAR NOT NULL,
  product_ids UUID[],
  category VARCHAR,
  cover_image VARCHAR,
  video_url VARCHAR,
  sort_order INT DEFAULT 0,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT now()
);
