CREATE TABLE product_lines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR UNIQUE NOT NULL,
  name VARCHAR NOT NULL,
  brand VARCHAR NOT NULL,
  description TEXT,
  image VARCHAR,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT now()
);
