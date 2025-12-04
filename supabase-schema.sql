-- Supabase SQL Schema
-- Jalankan di Supabase SQL Editor: https://app.supabase.com/project/_/sql

-- 1. Projects Table
CREATE TABLE IF NOT EXISTS projects (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT,
  image TEXT NOT NULL,
  technologies TEXT NOT NULL,
  github TEXT,
  githubUrl TEXT,
  demo TEXT,
  liveUrl TEXT,
  featured BOOLEAN DEFAULT false,
  displayOrder INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Certificates Table
CREATE TABLE IF NOT EXISTS certificates (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  issuer TEXT NOT NULL,
  date TEXT NOT NULL,
  image TEXT NOT NULL,
  credential_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Tech Stack Table
CREATE TABLE IF NOT EXISTS tech_stack (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  icon TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Contact Info Table
CREATE TABLE IF NOT EXISTS contact_info (
  id BIGSERIAL PRIMARY KEY,
  email TEXT NOT NULL,
  location TEXT NOT NULL,
  github TEXT,
  linkedin TEXT,
  instagram TEXT,
  twitter TEXT,
  website TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Contact Messages Table (New - With read status tracking)
-- This is the main table for contact form submissions
CREATE TABLE IF NOT EXISTS contact_messages (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_contact_messages_is_read ON contact_messages(is_read);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at DESC);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_contact_messages_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_contact_messages_updated_at ON contact_messages;

CREATE TRIGGER trigger_update_contact_messages_updated_at
BEFORE UPDATE ON contact_messages
FOR EACH ROW
EXECUTE FUNCTION update_contact_messages_updated_at();

-- 5b. Messages Table (Legacy - Keep for backward compatibility)
CREATE TABLE IF NOT EXISTS messages (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. About Info Table
CREATE TABLE IF NOT EXISTS about_info (
  id BIGSERIAL PRIMARY KEY,
  profile_image TEXT,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  location TEXT,
  certification TEXT,
  availability TEXT,
  summary1 TEXT,
  summary2 TEXT,
  summary3 TEXT,
  strengths JSONB, -- Array of {icon, text}
  stats JSONB, -- Array of {value, label, color}
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Admin Users Table
CREATE TABLE IF NOT EXISTS admin_users (
  id BIGSERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Visitor Analytics Table
CREATE TABLE IF NOT EXISTS visitor_analytics (
  id BIGSERIAL PRIMARY KEY,
  visitor_id TEXT UNIQUE NOT NULL,
  first_visit TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_visit TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  visit_count INTEGER DEFAULT 1,
  user_agent TEXT,
  ip_address TEXT,
  country TEXT,
  city TEXT
);

-- 9. Page Views Table
CREATE TABLE IF NOT EXISTS page_views (
  id BIGSERIAL PRIMARY KEY,
  page_name TEXT NOT NULL,
  visitor_id TEXT NOT NULL,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  session_id TEXT,
  referrer TEXT,
  user_agent TEXT
);

-- Create indexes for visitor analytics
CREATE INDEX IF NOT EXISTS idx_visitor_analytics_visitor_id ON visitor_analytics(visitor_id);
CREATE INDEX IF NOT EXISTS idx_page_views_page_name ON page_views(page_name);
CREATE INDEX IF NOT EXISTS idx_page_views_viewed_at ON page_views(viewed_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_views_visitor_id ON page_views(visitor_id);

-- Enable Row Level Security (RLS)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE tech_stack ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitor_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

-- Create Policies for Public Read Access
CREATE POLICY "Allow public read access" ON projects FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON certificates FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON tech_stack FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON contact_info FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON about_info FOR SELECT USING (true);

-- Create Policies for Visitor Analytics
CREATE POLICY "Allow public insert" ON visitor_analytics FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update own" ON visitor_analytics FOR UPDATE USING (true);
CREATE POLICY "Allow public insert" ON page_views FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated read" ON visitor_analytics FOR SELECT USING (true);
CREATE POLICY "Allow authenticated read" ON page_views FOR SELECT USING (true);

-- Create Policies for Public Insert on Messages
CREATE POLICY "Allow public insert" ON messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert" ON contact_messages FOR INSERT WITH CHECK (true);

-- Create Policies for Authenticated Users (Admin)
-- Note: You'll need to set up Supabase Auth or use service role key for admin operations
CREATE POLICY "Allow authenticated insert" ON projects FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated update" ON projects FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated delete" ON projects FOR DELETE USING (true);

CREATE POLICY "Allow authenticated insert" ON certificates FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated update" ON certificates FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated delete" ON certificates FOR DELETE USING (true);

CREATE POLICY "Allow authenticated insert" ON tech_stack FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated update" ON tech_stack FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated delete" ON tech_stack FOR DELETE USING (true);

CREATE POLICY "Allow authenticated update" ON contact_info FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated update" ON about_info FOR UPDATE USING (true);

CREATE POLICY "Allow authenticated read" ON messages FOR SELECT USING (true);
CREATE POLICY "Allow authenticated delete" ON messages FOR DELETE USING (true);

CREATE POLICY "Allow authenticated read" ON contact_messages FOR SELECT USING (true);
CREATE POLICY "Allow authenticated update" ON contact_messages FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated delete" ON contact_messages FOR DELETE USING (true);

CREATE POLICY "Allow authenticated read" ON admin_users FOR SELECT USING (true);

