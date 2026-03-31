CREATE TABLE promo_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR UNIQUE NOT NULL,
  discount_type VARCHAR NOT NULL,
  discount_value DECIMAL(10, 2) NOT NULL,
  min_order_amount DECIMAL(10, 2) DEFAULT 0,
  valid_from DATE DEFAULT CURRENT_DATE,
  valid_until DATE,
  uses_limit INT,
  uses_count INT DEFAULT 0,
  applicable_brands TEXT[],
  applicable_product_lines UUID[],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT now()
);
