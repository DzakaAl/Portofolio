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

-- 5. Contact Messages Table
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

-- 7. Visitor Analytics Table
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

-- 8. Page Views Table
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
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitor_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

-- RLS POLICIES

-- PROJECTS
CREATE POLICY "Public Read Projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Admin Insert Projects" ON projects FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admin Update Projects" ON projects FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Admin Delete Projects" ON projects FOR DELETE TO authenticated USING (true);

-- CERTIFICATES
CREATE POLICY "Public Read Certificates" ON certificates FOR SELECT USING (true);
CREATE POLICY "Admin Insert Certificates" ON certificates FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admin Update Certificates" ON certificates FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Admin Delete Certificates" ON certificates FOR DELETE TO authenticated USING (true);

-- TECH STACK
CREATE POLICY "Public Read TechStack" ON tech_stack FOR SELECT USING (true);
CREATE POLICY "Admin Insert TechStack" ON tech_stack FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admin Update TechStack" ON tech_stack FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Admin Delete TechStack" ON tech_stack FOR DELETE TO authenticated USING (true);

-- CONTACT INFO
CREATE POLICY "Public Read ContactInfo" ON contact_info FOR SELECT USING (true);
CREATE POLICY "Admin Update ContactInfo" ON contact_info FOR UPDATE TO authenticated USING (true);

-- ABOUT INFO
CREATE POLICY "Public Read AboutInfo" ON about_info FOR SELECT USING (true);
CREATE POLICY "Admin Insert AboutInfo" ON about_info FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admin Update AboutInfo" ON about_info FOR UPDATE TO authenticated USING (true);

-- CONTACT MESSAGES (Public can insert, Admin can read/update/delete)
CREATE POLICY "Public Insert ContactMessages" ON contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin Read ContactMessages" ON contact_messages FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin Update ContactMessages" ON contact_messages FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Admin Delete ContactMessages" ON contact_messages FOR DELETE TO authenticated USING (true);

-- VISITOR ANALYTICS
CREATE POLICY "Public Insert Analytics" ON visitor_analytics FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Analytics" ON visitor_analytics FOR UPDATE USING (true);
CREATE POLICY "Admin Read Analytics" ON visitor_analytics FOR SELECT TO authenticated USING (true);

-- PAGE VIEWS
CREATE POLICY "Public Insert PageViews" ON page_views FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin Read PageViews" ON page_views FOR SELECT TO authenticated USING (true);

