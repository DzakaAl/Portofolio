import { createClient } from '@supabase/supabase-js'

// IMPORTANT: Ganti dengan credentials Supabase Anda
// Dapatkan dari: https://app.supabase.com/project/_/settings/api
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database Types
export interface Project {
  id: number
  title: string
  description: string
  image: string
  technologies: string
  github?: string
  demo?: string
  created_at?: string
}

export interface Certificate {
  id: number
  title: string
  issuer: string
  date: string
  image: string
  credential_url?: string
  created_at?: string
}

export interface TechStack {
  id: number
  name: string
  category: string
  icon: string
  created_at?: string
}

export interface ContactInfo {
  id: number
  email: string
  location: string
  github?: string
  linkedin?: string
  instagram?: string
  twitter?: string
  website?: string
  updated_at?: string
}

export interface Message {
  id: number
  name: string
  email: string
  subject: string
  message: string
  created_at: string
}

export interface AboutInfo {
  id: number
  title: string
  content: string
  skills: string
  updated_at?: string
}
