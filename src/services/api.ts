import { supabase } from '../config/supabase'

// ==================== HELPERS ====================
// Convert camelCase to snake_case for database
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const toSnakeCase = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map(toSnakeCase)
  }
  if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((acc, key) => {
      const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)
      acc[snakeKey] = toSnakeCase(obj[key])
      return acc
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }, {} as any)
  }
  return obj
}

// Convert snake_case to camelCase for frontend
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const toCamelCase = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map(toCamelCase)
  }
  if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((acc, key) => {
      const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
      acc[camelKey] = toCamelCase(obj[key])
      return acc
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }, {} as any)
  }
  return obj
}

// ==================== UPLOAD IMAGE ====================
export const uploadImage = async (file: File, bucket: string = 'images'): Promise<string> => {
  try {
    // Check if Supabase is configured
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('YOUR_') || supabaseKey.includes('YOUR_')) {
      return convertToBase64(file)
    }

    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`
    const filePath = `${fileName}`

    const { error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      // If bucket doesn't exist or other error, fallback to base64
      if (error.message.includes('not found') || error.message.includes('Bucket')) {
        return convertToBase64(file)
      }
      
      // RLS policy error
      if (error.message.includes('row-level security') || error.message.includes('policy')) {
        return convertToBase64(file)
      }
      
      throw error
    }

    // Get public URL (safer access and fallback construction)
    const { data: publicData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath)

    // publicData may be undefined in some runtimes; construct fallback URL using project URL
    const constructedPublicUrl = publicData?.publicUrl || `${supabaseUrl.replace(/\/$/, '')}/storage/v1/object/public/${bucket}/${filePath}`

    return constructedPublicUrl
  } catch (error) {
    // Fallback to base64
    return convertToBase64(file)
  }
}

// Helper function to convert file to base64
const convertToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      resolve(reader.result as string)
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

// ==================== PROJECTS ====================
export interface Project {
  id?: number
  title: string
  description: string
  category?: string
  image: string
  technologies: string | string[] // Support both formats
  githubUrl?: string
  liveUrl?: string
  featured?: boolean
  displayOrder?: number
  createdAt?: string
}

export const getProjects = async (): Promise<Project[]> => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('display_order', { ascending: true })

  if (error) {
    return []
  }

  // Convert snake_case to camelCase
  return toCamelCase(data) || []
}

export const createProject = async (project: Omit<Project, 'id'>): Promise<Project> => {
  // Remove id field if exists (even if it's 0)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, createdAt, ...projectData } = project as Project
  
  // Convert camelCase to snake_case for database
  const dbProject = toSnakeCase(projectData)
  
  const { data, error } = await supabase
    .from('projects')
    .insert([dbProject])
    .select()
    .single()

  if (error) throw error
  
  // Convert snake_case back to camelCase
  return toCamelCase(data)
}

export const updateProject = async (id: number, project: Partial<Project>): Promise<Project> => {
  // Remove id and createdAt from update data
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id: _, createdAt, ...projectData } = project
  
  // Convert camelCase to snake_case for database
  const dbProject = toSnakeCase(projectData)
  
  const { data, error } = await supabase
    .from('projects')
    .update(dbProject)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  
  // Convert snake_case back to camelCase
  return toCamelCase(data)
}

export const deleteProject = async (id: number): Promise<void> => {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// ==================== CERTIFICATES ====================
export interface Certificate {
  id?: number
  title: string
  issuer: string
  date: string // Display format (e.g., "Jan 2024") - juga digunakan untuk sorting
  description?: string
  image: string
  verificationUrl?: string
  skills?: string[] | string
  displayOrder?: number
  createdAt?: string
}

export const getCertificates = async (): Promise<Certificate[]> => {
  const { data, error } = await supabase
    .from('certificates')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return []
  }

  const certificates = toCamelCase(data) || []
  
  // Sort by date string (parse and sort newest first)
  return certificates.sort((a: Certificate, b: Certificate) => {
    const parseDate = (dateStr: string): Date => {
      if (!dateStr) return new Date(0)
      
      const monthMap: { [key: string]: number } = {
        'jan': 0, 'january': 0, 'feb': 1, 'february': 1,
        'mar': 2, 'march': 2, 'apr': 3, 'april': 3,
        'may': 4, 'jun': 5, 'june': 5,
        'jul': 6, 'july': 6, 'aug': 7, 'august': 7,
        'sep': 8, 'september': 8, 'oct': 9, 'october': 9,
        'nov': 10, 'november': 10, 'dec': 11, 'december': 11
      }
      
      // Try ISO format first (2024-01, 2024-01-15)
      if (/^\d{4}-\d{1,2}/.test(dateStr)) {
        return new Date(dateStr)
      }
      
      // Try "Jan 2024" or "January 2024" format
      const parts = dateStr.toLowerCase().trim().split(/[\s-/]+/)
      if (parts.length >= 2) {
        const monthStr = parts[0]
        const year = parseInt(parts[1])
        const month = monthMap[monthStr]
        
        if (month !== undefined && !isNaN(year)) {
          return new Date(year, month, 1)
        }
      }
      
      // Fallback: try to parse as-is
      const parsed = new Date(dateStr)
      return isNaN(parsed.getTime()) ? new Date(0) : parsed
    }
    
    const dateA = parseDate(a.date)
    const dateB = parseDate(b.date)
    return dateB.getTime() - dateA.getTime() // Descending (newest first)
  })
}

export const createCertificate = async (certificate: Omit<Certificate, 'id'>): Promise<Certificate> => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, createdAt, ...certData } = certificate as Certificate
  const dbCertificate = toSnakeCase(certData)
  
  const { data, error } = await supabase
    .from('certificates')
    .insert([dbCertificate])
    .select()
    .single()

  if (error) throw error
  return toCamelCase(data)
}

export const updateCertificate = async (id: number, certificate: Partial<Certificate>): Promise<Certificate> => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id: _, createdAt, ...certData } = certificate
  const dbCertificate = toSnakeCase(certData)
  
  const { data, error } = await supabase
    .from('certificates')
    .update(dbCertificate)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return toCamelCase(data)
}

export const deleteCertificate = async (id: number): Promise<void> => {
  const { error } = await supabase
    .from('certificates')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// ==================== TECH STACK ====================
export interface TechStack {
  id?: number
  name: string
  category: string
  icon: string // Kode SVG lengkap
  displayOrder?: number
  createdAt?: string
}

export const getTechStack = async (): Promise<TechStack[]> => {
  const { data, error } = await supabase
    .from('tech_stack')
    .select('*')
    .order('display_order', { ascending: true })

  if (error) {
    return []
  }

  return toCamelCase(data) || []
}

export const createTechStack = async (tech: Omit<TechStack, 'id'>): Promise<TechStack> => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, createdAt, ...techData } = tech as TechStack
  const dbTech = toSnakeCase(techData)
  
  const { data, error } = await supabase
    .from('tech_stack')
    .insert([dbTech])
    .select()
    .single()

  if (error) throw error
  return toCamelCase(data)
}

export const updateTechStack = async (id: number, tech: Partial<TechStack>): Promise<TechStack> => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id: _, createdAt, ...techData } = tech
  const dbTech = toSnakeCase(techData)
  
  const { data, error} = await supabase
    .from('tech_stack')
    .update(dbTech)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return toCamelCase(data)
}

export const deleteTechStack = async (id: number): Promise<void> => {
  const { error } = await supabase
    .from('tech_stack')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// ==================== CONTACT INFO ====================
export interface ContactInfo {
  id?: number
  email: string
  location: string
  github?: string
  linkedin?: string
  instagram?: string
  twitter?: string
  website?: string
  updated_at?: string
}

export const getContactInfo = async (): Promise<ContactInfo | null> => {
  const { data, error } = await supabase
    .from('contact_info')
    .select('*')
    .single()

  if (error) {
    return null
  }

  return toCamelCase(data)
}

export const updateContactInfo = async (contactInfo: Partial<ContactInfo>): Promise<ContactInfo> => {
  const dbContactInfo = toSnakeCase(contactInfo)
  
  // Always update the first row (id = 1)
  const { data, error } = await supabase
    .from('contact_info')
    .update(dbContactInfo)
    .eq('id', 1)
    .select()
    .single()

  if (error) throw error
  return toCamelCase(data)
}

// ==================== MESSAGES ====================
export interface ContactMessage {
  id?: number
  name: string
  email: string
  subject: string
  message: string
  isRead?: boolean
  createdAt?: string
  updatedAt?: string
}

export interface Message {
  id?: number
  name: string
  email: string
  subject: string
  message: string
  created_at?: string
}

export const getContactMessages = async (): Promise<ContactMessage[]> => {
  const { data, error } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return []
  }

  return toCamelCase(data) || []
}

export const submitContactMessage = async (message: Omit<ContactMessage, 'id' | 'isRead' | 'createdAt' | 'updatedAt'>): Promise<ContactMessage> => {
  const dbMessage = toSnakeCase({ ...message, isRead: false })
  
  try {
    // Try to insert into contact_messages table
    const { data, error } = await supabase
      .from('contact_messages')
      .insert([dbMessage])
      .select()
      .single()

    if (error) {
      // Fallback to messages table if contact_messages doesn't exist
      const fallbackData = await createMessage(message)
      return {
        id: fallbackData.id,
        name: fallbackData.name,
        email: fallbackData.email,
        subject: fallbackData.subject,
        message: fallbackData.message,
        isRead: false,
        createdAt: fallbackData.created_at
      }
    }
    
    return toCamelCase(data)
  } catch (err) {
    throw err
  }
}

export const markMessageAsRead = async (id: number): Promise<ContactMessage> => {
  const { data, error } = await supabase
    .from('contact_messages')
    .update({ is_read: true })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return toCamelCase(data)
}

export const deleteContactMessage = async (id: number): Promise<void> => {
  const { error } = await supabase
    .from('contact_messages')
    .delete()
    .eq('id', id)

  if (error) throw error
}

export const getMessages = async (): Promise<Message[]> => {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return []
  }

  return toCamelCase(data) || []
}

export const createMessage = async (message: Omit<Message, 'id'>): Promise<Message> => {
  const dbMessage = toSnakeCase(message)
  
  const { data, error } = await supabase
    .from('messages')
    .insert([dbMessage])
    .select()
    .single()

  if (error) throw error
  return toCamelCase(data)
}

export const deleteMessage = async (id: number): Promise<void> => {
  const { error } = await supabase
    .from('messages')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// ==================== ABOUT INFO ====================
export interface AboutInfo {
  id?: number
  profileImage?: string
  name: string
  title: string
  subtitle?: string
  location?: string
  certification?: string
  availability?: string
  summary1?: string
  summary2?: string
  summary3?: string
  strengths?: Array<{ icon: string; text: string }>
  stats?: Array<{ value: string; label: string; color: string }>
  updated_at?: string
}

export const getAboutInfo = async (): Promise<AboutInfo | null> => {
  // First try to get the row with id=1 (standard)
  let { data, error } = await supabase
    .from('about_info')
    .select('*')
    .eq('id', 1)
    .single()

  // If not found (maybe using old ID), try to get ANY row
  if (error || !data) {
    console.log('About info with id=1 not found, trying fallback...')
    const { data: fallbackData, error: fallbackError } = await supabase
      .from('about_info')
      .select('*')
      .limit(1)
      .single()
      
    if (!fallbackError && fallbackData) {
      data = fallbackData
      // If we found a row with wrong ID, we should probably migrate it to ID=1 next time we save
      console.log('Found fallback about info:', data)
    } else {
      return null
    }
  }

  // Manual conversion to preserve JSONB structure
  if (data) {
    return {
      id: data.id,
      profileImage: data.profile_image,
      name: data.name,
      title: data.title,
      subtitle: data.subtitle,
      location: data.location,
      certification: data.certification,
      availability: data.availability,
      summary1: data.summary1,
      summary2: data.summary2,
      summary3: data.summary3,
      // JSONB fields - keep structure as-is
      strengths: data.strengths,
      stats: data.stats,
      updated_at: data.updated_at
    }
  }

  return null
}

export const updateAboutInfo = async (aboutInfo: Partial<AboutInfo>): Promise<AboutInfo> => {
  // Manual conversion to avoid deep conversion on JSONB fields
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dbAboutInfo: any = {}
  
  if (aboutInfo.profileImage !== undefined) dbAboutInfo.profile_image = aboutInfo.profileImage
  if (aboutInfo.name !== undefined) dbAboutInfo.name = aboutInfo.name
  if (aboutInfo.title !== undefined) dbAboutInfo.title = aboutInfo.title
  if (aboutInfo.subtitle !== undefined) dbAboutInfo.subtitle = aboutInfo.subtitle
  if (aboutInfo.location !== undefined) dbAboutInfo.location = aboutInfo.location
  if (aboutInfo.certification !== undefined) dbAboutInfo.certification = aboutInfo.certification
  if (aboutInfo.availability !== undefined) dbAboutInfo.availability = aboutInfo.availability
  if (aboutInfo.summary1 !== undefined) dbAboutInfo.summary1 = aboutInfo.summary1
  if (aboutInfo.summary2 !== undefined) dbAboutInfo.summary2 = aboutInfo.summary2
  if (aboutInfo.summary3 !== undefined) dbAboutInfo.summary3 = aboutInfo.summary3
  // Keep JSONB fields as-is (don't convert nested keys)
  if (aboutInfo.strengths !== undefined) dbAboutInfo.strengths = aboutInfo.strengths
  if (aboutInfo.stats !== undefined) dbAboutInfo.stats = aboutInfo.stats

  // Upsert row with id = 1 to guarantee existence
  const { data, error } = await supabase
    .from('about_info')
    .upsert([{ id: 1, ...dbAboutInfo }], { onConflict: 'id' })
    .select()
    .single()

  if (error) throw error

  if (data) {
    return {
      id: data.id,
      profileImage: data.profile_image,
      name: data.name,
      title: data.title,
      subtitle: data.subtitle,
      location: data.location,
      certification: data.certification,
      availability: data.availability,
      summary1: data.summary1,
      summary2: data.summary2,
      summary3: data.summary3,
      strengths: data.strengths,
      stats: data.stats,
      updated_at: data.updated_at
    }
  }

  throw new Error('Failed to update about info')
}

// ==================== AUTHENTICATION ====================
export interface LoginCredentials {
  email: string
  password: string
}

export interface LoginResponse {
  success: boolean
  user: {
    id: string
    email: string
  } | null
  error?: string
}

export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: credentials.email,
    password: credentials.password,
  })

  if (error) {
    return {
      success: false,
      user: null,
      error: error.message
    }
  }

  return {
    success: true,
    user: {
      id: data.user.id,
      email: data.user.email || ''
    }
  }
}

export const logout = async (): Promise<void> => {
  await supabase.auth.signOut()
}

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

// ==================== ALIASES FOR COMPATIBILITY ====================
// Aliases to match old API function names used in components

// Projects
export const getPortfolioProjects = getProjects
export const createPortfolioProject = createProject
export const updatePortfolioProject = updateProject
export const deletePortfolioProject = deleteProject
export type PortfolioProject = Project

// Tech Stack
export const createTechStackItem = createTechStack
export const updateTechStackItem = updateTechStack
export const deleteTechStackItem = deleteTechStack
export type TechStackItem = TechStack

// About (for components that might use old interface)
export interface AboutContent {
  id?: string
  profileImage: string
  name: string
  title: string
  subtitle: string
  location: string
  certification: string
  availability: string
  summary1: string
  summary2: string
  summary3: string
  strengths: Array<{ icon: string; text: string }>
  stats: Array<{ value: string; label: string; color: string }>
  updatedAt?: string
}

// Wrapper functions to convert between AboutInfo and AboutContent
export const getAboutContent = async (): Promise<AboutContent> => {
  const info = await getAboutInfo()
  
  // Direct mapping from new structure, with null check
  return {
    id: info?.id?.toString(),
    profileImage: info?.profileImage || ' ',
    name: info?.name || '',
    title: info?.title || '',
    subtitle: info?.subtitle || '',
    location: info?.location || '',
    certification: info?.certification || '',
    availability: info?.availability || '',
    summary1: info?.summary1 || '',
    summary2: info?.summary2 || '',
    summary3: info?.summary3 || '',
    strengths: info?.strengths || [],
    stats: info?.stats || [],
    updatedAt: info?.updated_at
  }
}

export const updateAboutContent = async (content: AboutContent): Promise<AboutContent> => {
  const aboutInfo: Partial<AboutInfo> = {
    profileImage: content.profileImage,
    name: content.name,
    title: content.title,
    subtitle: content.subtitle,
    location: content.location,
    certification: content.certification,
    availability: content.availability,
    summary1: content.summary1,
    summary2: content.summary2,
    summary3: content.summary3,
    strengths: content.strengths,
    stats: content.stats
  }
  
  await updateAboutInfo(aboutInfo)
  
  return content
}

// ==================== VISITOR ANALYTICS ====================
export interface VisitorAnalytics {
  id?: number
  visitorId: string
  firstVisit?: string
  lastVisit?: string
  visitCount?: number
  userAgent?: string
  ipAddress?: string
  country?: string
  city?: string
}

export interface PageView {
  id?: number
  pageName: string
  visitorId: string
  viewedAt?: string
  sessionId?: string
  referrer?: string
  userAgent?: string
}

export interface VisitorStats {
  totalVisitors: number
  totalPageViews: number
  todayVisitors: number
  todayPageViews: number
}

export interface VisitorActivity {
  visitorId: string
  device: string
  browser: string
  os: string
  firstVisit: string
  lastVisit: string
  visitCount: number
  pagesVisited: string[]
  totalPageViews: number
}

// Generate or get visitor ID from localStorage
const getVisitorId = (): string => {
  let visitorId = localStorage.getItem('visitorId')
  if (!visitorId) {
    // Check if user is admin, mark visitor ID differently
    const isAdmin = localStorage.getItem('portfolio_admin_auth') === 'true'
    if (isAdmin) {
      visitorId = 'admin_session'
      localStorage.setItem('visitorId', visitorId)
    } else {
      visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
      localStorage.setItem('visitorId', visitorId)
    }
  }
  return visitorId
}

// Track visitor
export const trackVisitor = async (): Promise<void> => {
  try {
    // Don't track if user is admin - check using the auth utility
    const isAdmin = localStorage.getItem('portfolio_admin_auth') === 'true'
    if (isAdmin) {
      return
    }
    
    const visitorId = getVisitorId()
    const userAgent = navigator.userAgent
    
    // Check if visitor exists
    const { data: existingVisitor } = await supabase
      .from('visitor_analytics')
      .select('*')
      .eq('visitor_id', visitorId)
      .single()

    if (existingVisitor) {
      // Update existing visitor
      await supabase
        .from('visitor_analytics')
        .update({
          last_visit: new Date().toISOString(),
          visit_count: (existingVisitor.visit_count || 0) + 1,
          user_agent: userAgent
        })
        .eq('visitor_id', visitorId)
    } else {
      // Create new visitor
      await supabase
        .from('visitor_analytics')
        .insert([{
          visitor_id: visitorId,
          first_visit: new Date().toISOString(),
          last_visit: new Date().toISOString(),
          visit_count: 1,
          user_agent: userAgent
        }])
    }
  } catch (error) {
    
  }
}

// Track page view
export const trackPageView = async (pageName: string): Promise<void> => {
  try {
    const isAdmin = localStorage.getItem('portfolio_admin_auth') === 'true'
    if (isAdmin) {
      return
    }
    
    const visitorId = getVisitorId()
    const sessionId = sessionStorage.getItem('sessionId') || `session_${Date.now()}`
    sessionStorage.setItem('sessionId', sessionId)
    
    await supabase
      .from('page_views')
      .insert([{
        page_name: pageName,
        visitor_id: visitorId,
        viewed_at: new Date().toISOString(),
        session_id: sessionId,
        referrer: document.referrer || 'direct',
        user_agent: navigator.userAgent
      }])
  } catch (error) {
    
  }
}

// Get visitor statistics
export const getVisitorStats = async (): Promise<VisitorStats> => {
  try {
    // Get total visitors (exclude admin)
    const { count: totalVisitors } = await supabase
      .from('visitor_analytics')
      .select('*', { count: 'exact', head: true })
      .neq('visitor_id', 'admin_session') // Exclude admin

    // Get total page views (exclude admin)
    const { count: totalPageViews } = await supabase
      .from('page_views')
      .select('*', { count: 'exact', head: true })
      .neq('visitor_id', 'admin_session') // Exclude admin

    // Get today's date range
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayStr = today.toISOString()

    // Get today's visitors (exclude admin)
    const { data: todayVisitorsData } = await supabase
      .from('visitor_analytics')
      .select('visitor_id')
      .gte('last_visit', todayStr)
      .neq('visitor_id', 'admin_session') // Exclude admin

    // Get today's page views (exclude admin)
    const { count: todayPageViews } = await supabase
      .from('page_views')
      .select('*', { count: 'exact', head: true })
      .gte('viewed_at', todayStr)
      .neq('visitor_id', 'admin_session') // Exclude admin

    return {
      totalVisitors: totalVisitors || 0,
      totalPageViews: totalPageViews || 0,
      todayVisitors: todayVisitorsData?.length || 0,
      todayPageViews: todayPageViews || 0
    }
  } catch (error) {
    return {
      totalVisitors: 0,
      totalPageViews: 0,
      todayVisitors: 0,
      todayPageViews: 0
    }
  }
}

// Get page views by page name
export const getPageViewsByPage = async (): Promise<Record<string, number>> => {
  try {
    const { data } = await supabase
      .from('page_views')
      .select('page_name')
      .neq('visitor_id', 'admin_session')

    if (!data) return {}

    const viewsByPage: Record<string, number> = {}
    data.forEach((view) => {
      viewsByPage[view.page_name] = (viewsByPage[view.page_name] || 0) + 1
    })

    return viewsByPage
  } catch (error) {
    return {}
  }
}

const parseUserAgent = (userAgent: string) => {
  const ua = userAgent.toLowerCase()
  
  let device = 'Desktop'
  if (/mobile|android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(ua)) {
    if (/ipad|tablet/i.test(ua)) {
      device = 'Tablet'
    } else {
      device = 'Mobile'
    }
  }
  
  let browser = 'Unknown'
  if (ua.includes('firefox')) browser = 'Firefox'
  else if (ua.includes('edg')) browser = 'Edge'
  else if (ua.includes('chrome')) browser = 'Chrome'
  else if (ua.includes('safari')) browser = 'Safari'
  else if (ua.includes('opera')) browser = 'Opera'
  
  let os = 'Unknown'
  if (ua.includes('windows')) os = 'Windows'
  else if (ua.includes('mac')) os = 'macOS'
  else if (ua.includes('linux')) os = 'Linux'
  else if (ua.includes('android')) os = 'Android'
  else if (ua.includes('ios') || ua.includes('iphone') || ua.includes('ipad')) os = 'iOS'
  
  return { device, browser, os }
}

export const getVisitorActivities = async (): Promise<VisitorActivity[]> => {
  try {
    const { data: visitors } = await supabase
      .from('visitor_analytics')
      .select('*')
      .neq('visitor_id', 'admin_session')
      .order('last_visit', { ascending: false })
      .limit(50)

    if (!visitors) return []

    const activities: VisitorActivity[] = await Promise.all(
      visitors.map(async (visitor) => {
        const { data: pageViews } = await supabase
          .from('page_views')
          .select('page_name')
          .eq('visitor_id', visitor.visitor_id)

        const pagesVisited = Array.from(
          new Set(pageViews?.map(pv => pv.page_name) || [])
        )

        const { device, browser, os } = parseUserAgent(visitor.user_agent || '')

        return {
          visitorId: visitor.visitor_id,
          device,
          browser,
          os,
          firstVisit: visitor.first_visit,
          lastVisit: visitor.last_visit,
          visitCount: visitor.visit_count || 0,
          pagesVisited,
          totalPageViews: pageViews?.length || 0
        }
      })
    )

    return activities
  } catch (error) {
    return []
  }
}



