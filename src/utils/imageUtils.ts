const API_BASE_URL = 'http://localhost:3001'

/**
 * Convert relative image path to full URL
 * @param imagePath - Relative path like '/uploads/filename.jpg' or full URL
 * @returns Full URL to the image
 */
export const getImageUrl = (imagePath: string | undefined | null): string => {
  if (!imagePath) return ''
  
  // If already a full URL (starts with http:// or https://), return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath
  }
  
  // If it's a data URL (base64), return as is
  if (imagePath.startsWith('data:')) {
    return imagePath
  }
  
  // If it's a local path (starts with /), return as is for local files
  if (imagePath.startsWith('/') && !imagePath.startsWith('/uploads')) {
    return imagePath
  }
  
  // If it starts with /uploads, convert to full URL
  if (imagePath.startsWith('/uploads')) {
    return `${API_BASE_URL}${imagePath}`
  }
  
  // Otherwise assume it's a filename and prepend the uploads path
  return `${API_BASE_URL}/uploads/${imagePath}`
}
