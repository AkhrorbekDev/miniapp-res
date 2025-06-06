// src/services/tokenService.js
import { ofetch } from 'ofetch'
import Cookies from 'js-cookie'
import { jwtDecode } from 'jwt-decode'

const API_URL = import.meta.env.VITE_API_URL || '/api'
// Cookie names
export const AUTH_TOKEN_COOKIE = 'auth_token'
const REFRESH_TOKEN_COOKIE = 'refresh_token'
// Token expiration time in days
export const TOKEN_EXPIRY = 7

export const getTokenExpiration = (token) => {
  try {
    const { exp } = jwtDecode(token)
    return exp ? exp * 1000 : null // Convert to milliseconds
  } catch (error) {
    console.error('Invalid JWT:', error)
    return null
  }
}

export const isTokenExpiringSoon = (token) => {
  try {
    const { exp } = jwtDecode(token)
    return exp * 1000 - Date.now() <= 5 * 60 * 1000 // Check if ≤ 5 minutes left
  } catch (error) {
    console.error('Invalid JWT:', error)
    return true // Assume expired if decoding fails
  }
}
/**
 * Obtain JWT tokens using session ID from SessionStorage
 * @returns {Promise<boolean>} - Success status
 */
export const obtainToken = async (data: { initData: string; user: any }) => {
  try {
    // Get session ID from SessionStorage

    const response = await ofetch(`${API_URL}/auth/sad7JHV4dHjkbK7df/`, {
      method: 'POST',
      body: data,
    })
    if (response && response.access) {
      sessionStorage.setItem(AUTH_TOKEN_COOKIE, response.access)
      sessionStorage.setItem(REFRESH_TOKEN_COOKIE, response.refresh)
      return Promise.resolve(response)
    }
    return Promise.reject(new Error('Invalid response from server'))
  } catch (error) {
    console.error('Error obtaining token:', error)
    return Promise.reject(error)
  }
}

/**
 * Refresh JWT tokens
 * @returns {Promise<boolean>} - Success status
 */
export const refreshTokens = async () => {
  const refreshToken = sessionStorage.getItem(REFRESH_TOKEN_COOKIE)
  if (!refreshToken) return false

  try {
    const response = await ofetch(`${API_URL}/refresh-token/`, {
      method: 'POST',
      body: { refresh_token: refreshToken },
      headers: { 'Content-Type': 'application/json' },
    })

    if (response && response.auth_token) {
      sessionStorage.setItem(AUTH_TOKEN_COOKIE, response.auth_token)
      if (response.refresh_token) {
        sessionStorage.setItem(REFRESH_TOKEN_COOKIE, response.refresh_token)
      }
      return true
    }
    return false
  } catch (error) {
    console.error('Error refreshing token:', error)
    return false
  }
}

/**
 * Get the current auth token
 * @returns {string|null} - The auth token or null if not found
 */
export const getAuthToken = () => {
  return sessionStorage.getItem(AUTH_TOKEN_COOKIE)
}

/**
 * Get the current refresh token
 * @returns {string|null} - The refresh token or null if not found
 */
export const getRefreshToken = () => {
  return sessionStorage.getItem(REFRESH_TOKEN_COOKIE)
}

/**
 * Clear all tokens from cookies
 */
export const clearTokens = () => {
  sessionStorage.removeItem(AUTH_TOKEN_COOKIE)
  sessionStorage.removeItem(REFRESH_TOKEN_COOKIE)
}

export default {
  obtainToken,
  refreshTokens,
  getAuthToken,
  getRefreshToken,
  clearTokens,
}
