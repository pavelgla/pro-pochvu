-- =============================================
-- Row Level Security policies
-- =============================================

-- Helper: check if current user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE user_id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- =============================================
-- Public read tables
-- =============================================

-- product_lines
ALTER TABLE product_lines ENABLE ROW LEVEL SECURITY;
CREATE POLICY "product_lines_public_read" ON product_lines
  FOR SELECT USING (true);
CREATE POLICY "product_lines_admin_all" ON product_lines
  FOR ALL USING (is_admin());

-- categories
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "categories_public_read" ON categories
  FOR SELECT USING (true);
CREATE POLICY "categories_admin_all" ON categories
  FOR ALL USING (is_admin());

-- products
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "products_public_read" ON products
  FOR SELECT USING (true);
CREATE POLICY "products_admin_all" ON products
  FOR ALL USING (is_admin());

-- blog_posts
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "blog_posts_public_read" ON blog_posts
  FOR SELECT USING (is_published = true);
CREATE POLICY "blog_posts_admin_all" ON blog_posts
  FOR ALL USING (is_admin());

-- knowledge_base
ALTER TABLE knowledge_base ENABLE ROW LEVEL SECURITY;
CREATE POLICY "knowledge_base_public_read" ON knowledge_base
  FOR SELECT USING (is_published = true);
CREATE POLICY "knowledge_base_admin_all" ON knowledge_base
  FOR ALL USING (is_admin());

-- =============================================
-- User-owned tables
-- =============================================

-- profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_own_read" ON profiles
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "profiles_own_update" ON profiles
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "profiles_admin_all" ON profiles
  FOR ALL USING (is_admin());

-- orders
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "orders_own_read" ON orders
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "orders_own_insert" ON orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "orders_admin_all" ON orders
  FOR ALL USING (is_admin());

-- order_items
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "order_items_own_read" ON order_items
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
  );
CREATE POLICY "order_items_own_insert" ON order_items
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
  );
CREATE POLICY "order_items_admin_all" ON order_items
  FOR ALL USING (is_admin());

-- favorites
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "favorites_own_select" ON favorites
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "favorites_own_insert" ON favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "favorites_own_delete" ON favorites
  FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "favorites_admin_all" ON favorites
  FOR ALL USING (is_admin());

-- subscriptions
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "subscriptions_own_read" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "subscriptions_own_insert" ON subscriptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "subscriptions_own_update" ON subscriptions
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "subscriptions_admin_all" ON subscriptions
  FOR ALL USING (is_admin());

-- notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "notifications_own_read" ON notifications
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "notifications_own_update" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "notifications_admin_all" ON notifications
  FOR ALL USING (is_admin());

-- =============================================
-- Reviews: public read, authenticated insert
-- =============================================

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "reviews_public_read" ON reviews
  FOR SELECT USING (is_visible = true);
CREATE POLICY "reviews_auth_insert" ON reviews
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "reviews_admin_all" ON reviews
  FOR ALL USING (is_admin());

-- =============================================
-- Promo codes: public read active only
-- =============================================

ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "promo_codes_public_read" ON promo_codes
  FOR SELECT USING (is_active = true);
CREATE POLICY "promo_codes_admin_all" ON promo_codes
  FOR ALL USING (is_admin());

-- =============================================
-- Sync log: admin only
-- =============================================

ALTER TABLE sync_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sync_log_admin_all" ON sync_log
  FOR ALL USING (is_admin());
