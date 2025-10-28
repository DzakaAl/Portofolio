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

-- 5. Messages Table
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
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  skills TEXT NOT NULL,
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

-- Enable Row Level Security (RLS)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE tech_stack ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create Policies for Public Read Access
CREATE POLICY "Allow public read access" ON projects FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON certificates FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON tech_stack FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON contact_info FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON about_info FOR SELECT USING (true);

-- Create Policies for Public Insert on Messages
CREATE POLICY "Allow public insert" ON messages FOR INSERT WITH CHECK (true);

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

CREATE POLICY "Allow authenticated read" ON admin_users FOR SELECT USING (true);

-- Insert Default Data
INSERT INTO contact_info (email, location, github, linkedin, instagram, twitter, website) VALUES
('dzaka@example.com', 'Yogyakarta, Indonesia', 'https://github.com/dzaka', 'https://linkedin.com/in/dzaka', 'https://instagram.com/dzaka', 'https://twitter.com/dzaka', 'https://dzaka.dev')
ON CONFLICT DO NOTHING;

INSERT INTO about_info (title, content, skills) VALUES
('Full Stack Developer', 'Passionate developer with expertise in modern web technologies.', 'React, TypeScript, Node.js, Python, Machine Learning')
ON CONFLICT DO NOTHING;

INSERT INTO admin_users (username, password, email) VALUES
('admin', 'admin123', 'admin@example.com')
ON CONFLICT DO NOTHING;

-- Sample Projects
INSERT INTO projects (title, description, image, technologies, github, demo) VALUES
('E-Commerce Platform', 'Full-stack e-commerce website with payment integration', 'https://via.placeholder.com/400x300', 'React, Node.js, MongoDB, Stripe', 'https://github.com', 'https://demo.com'),
('AI Chatbot', 'Intelligent chatbot using natural language processing', 'https://via.placeholder.com/400x300', 'Python, TensorFlow, Flask', 'https://github.com', 'https://demo.com'),
('Portfolio Website', 'Modern portfolio with admin panel', 'https://via.placeholder.com/400x300', 'React, TypeScript, Supabase', 'https://github.com', 'https://demo.com')
ON CONFLICT DO NOTHING;

-- Sample Certificates
INSERT INTO certificates (title, issuer, date, image, credential_url) VALUES
('TensorFlow Developer Certificate', 'DeepLearning.AI', '2024-01', 'https://via.placeholder.com/400x300', 'https://coursera.org/verify/123'),
('Full Stack Web Development', 'Coursera', '2023-12', 'https://via.placeholder.com/400x300', 'https://coursera.org/verify/456'),
('Machine Learning Specialization', 'Stanford University', '2023-11', 'https://via.placeholder.com/400x300', 'https://coursera.org/verify/789')
ON CONFLICT DO NOTHING;

-- Sample Tech Stack
INSERT INTO tech_stack (name, category, icon) VALUES
('React', 'Frontend', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg'),
('TypeScript', 'Frontend', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg'),
('Node.js', 'Backend', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg'),
('Python', 'Backend', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg'),
('PostgreSQL', 'Database', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg'),
('TensorFlow', 'ML/AI', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg')
ON CONFLICT DO NOTHING;
