CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  product_id UUID NOT NULL REFERENCES products(id),
  variant_id VARCHAR,
  quantity INT DEFAULT 1,
  status VARCHAR DEFAULT 'active',
  interval_months INT DEFAULT 1,
  next_delivery DATE,
  last_payment_id VARCHAR,
  pause_until DATE,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
