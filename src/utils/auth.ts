// Authentication utility functions

export const isAuthenticated = (): boolean => {
  return localStorage.getItem('portfolio_admin_auth') === 'true'
}

export const logout = (): void => {
  localStorage.removeItem('portfolio_admin_auth')
  localStorage.removeItem('portfolio_admin_user')
  window.dispatchEvent(new Event('adminLogout'))
}

export const getAdminUser = () => {
  const userStr = localStorage.getItem('portfolio_admin_user')
  return userStr ? JSON.parse(userStr) : null
}
