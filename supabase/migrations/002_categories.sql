CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR UNIQUE NOT NULL,
  name VARCHAR NOT NULL,
  parent_id UUID REFERENCES categories(id),
  product_line_id UUID REFERENCES product_lines(id),
  description TEXT,
  image VARCHAR,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT now()
);
