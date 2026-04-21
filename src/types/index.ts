// ==========================================
// TypeScript Types — matches backend DB schema
// ==========================================

// Hero Content (hero_content table)
export interface HeroContent {
  id?: number;
  name: string;
  title: string;
  bio: string;
  email: string;
  github?: string;
  linkedin?: string;
  instagram?: string;
  avatar?: string;
  cv_url?: string;
  created_at?: string;
  updated_at?: string;
}

// About Content (about_content table)
export interface AboutContent {
  id?: number;
  title?: string;
  description?: string;
  bio?: string;
  skills: Skill[];
  experience: Experience[];
  education: Education[];
  strengths: Strength[];
  stats: Stat[];
  image?: string;
  profile_image?: string;
  name?: string;
  role?: string;
  subtitle?: string;
  location?: string;
  certification?: string;
  availability?: string;
  summary1?: string;
  summary2?: string;
  summary3?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Skill {
  name: string;
  level?: number;
}

export interface Experience {
  title: string;
  company: string;
  period: string;
  description?: string;
}

export interface Education {
  degree: string;
  institution: string;
  period: string;
  description?: string;
}

export interface Strength {
  icon: string;
  text: string;
}

export interface Stat {
  color: string;
  label: string;
  value: string;
}

// Project (projects table)
export interface Project {
  id?: number;
  title: string;
  description: string;
  category?: string;
  image?: string;
  technologies: string;
  github?: string;
  github_url?: string;
  demo?: string;
  live_url?: string;
  featured?: boolean;
  show_github?: boolean;
  show_demo?: boolean;
  display_order?: number;
  created_at?: string;
}

// Certificate (certificates table)
export interface Certificate {
  id?: number;
  title: string;
  issuer: string;
  date: string;
  description?: string;
  image?: string;
  credential_url?: string;
  credentialUrl?: string;
  display_order?: number;
  created_at?: string;
}

// Tech Stack (tech_stack table)
export interface TechStack {
  id?: number;
  name: string;
  category: string;
  icon: string;
  display_order?: number;
  created_at?: string;
}

// Contact Info (contact_info table)
export interface ContactInfo {
  id?: number;
  email: string;
  location: string;
  github?: string;
  linkedin?: string;
  instagram?: string;
  twitter?: string;
  website?: string;
  updated_at?: string;
}

// Message (messages table)
export interface Message {
  id?: number;
  name: string;
  email: string;
  message: string;
  created_at?: string;
}

// Visitor Stats
export interface VisitorStat {
  id: string;
  session_id: string;
  device: string;
  browser: string;
  os: string;
  ipAddress: string;
  visitCount: number;
  componentsViewed: string[];
  totalComponentViews: number;
  lastVisit: string;
  isBot: boolean;
}

export interface VisitorSummary {
  totalVisitors: number;
  totalViews: number;
  todayVisitors: number;
  weekVisitors: number;
}

// Auth
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  token: string;
  user: {
    username: string;
    role: string;
  };
}

// Chat Message (via WebSocket)
export interface ChatMessage {
  id: string;
  text: string;
  user: {
    name: string;
    email: string;
    image: string;
  };
  timestamp: string;
}

// API Response helpers
export interface ApiError {
  error: string;
  message?: string;
  details?: unknown[];
}
