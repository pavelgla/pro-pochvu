CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR UNIQUE NOT NULL,
  title VARCHAR NOT NULL,
  content TEXT NOT NULL,
  excerpt VARCHAR(300),
  category VARCHAR,
  tags TEXT[],
  cover_image VARCHAR,
  seo_title VARCHAR(70),
  seo_description VARCHAR(160),
  author VARCHAR DEFAULT 'Эко Конь',
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
