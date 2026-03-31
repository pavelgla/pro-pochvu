CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR,
  phone VARCHAR,
  addresses JSONB DEFAULT '[]',
  loyalty_points INT DEFAULT 0,
  referral_code VARCHAR UNIQUE,
  referred_by UUID REFERENCES profiles(id),
  role VARCHAR DEFAULT 'customer',
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
