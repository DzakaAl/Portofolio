// Authentication utility functions

import { logout as apiLogout } from '../services/api'

export const isAuthenticated = (): boolean => {
  return localStorage.getItem('portfolio_admin_auth') === 'true'
}

export const logout = async (): Promise<void> => {
  await apiLogout()
  localStorage.removeItem('portfolio_admin_auth')
  localStorage.removeItem('portfolio_admin_user')
  window.dispatchEvent(new Event('adminLogout'))
}

export const getAdminUser = () => {
  const userStr = localStorage.getItem('portfolio_admin_user')
  return userStr ? JSON.parse(userStr) : null
}
