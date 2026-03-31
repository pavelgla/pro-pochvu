CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  variant_id VARCHAR,
  quantity INT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  name VARCHAR NOT NULL,
  image VARCHAR
);
