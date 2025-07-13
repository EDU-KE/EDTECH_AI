export interface SessionData {
  userId: string
  email: string
  role: 'student' | 'teacher' | 'admin'
  displayName: string
  createdAt: number
  expiresAt: number
  lastActivity: number
  ipAddress?: string
  userAgent?: string
}

export class SessionManager {
  private static readonly SESSION_DURATION = 24 * 60 * 60 * 1000 // 24 hours
  private static readonly ACTIVITY_TIMEOUT = 30 * 60 * 1000 // 30 minutes
  private static readonly STORAGE_KEY = 'edtech_session'

  /**
   * Create a new session for a user
   */
  static async createSession(userData: {
    userId: string
    email: string
    role: 'student' | 'teacher' | 'admin'
    displayName: string
    ipAddress?: string
    userAgent?: string
  }): Promise<string> {
    const now = Date.now()
    const sessionData: SessionData = {
      userId: userData.userId,
      email: userData.email,
      role: userData.role,
      displayName: userData.displayName,
      createdAt: now,
      expiresAt: now + this.SESSION_DURATION,
      lastActivity: now,
      ipAddress: userData.ipAddress,
      userAgent: userData.userAgent
    }

    const sessionToken = this.generateSessionToken()
    
    // Store session data in localStorage for client-side
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(sessionData))
      localStorage.setItem(`${this.STORAGE_KEY}_token`, sessionToken)
    }

    return sessionToken
  }

  /**
   * Validate and get session data
   */
  static async getSession(sessionToken?: string): Promise<SessionData | null> {
    if (typeof window === 'undefined') return null

    try {
      const storedData = localStorage.getItem(this.STORAGE_KEY)
      const storedToken = localStorage.getItem(`${this.STORAGE_KEY}_token`)
      
      if (!storedData || !storedToken) {
        return null
      }

      if (sessionToken && sessionToken !== storedToken) {
        return null
      }

      const sessionData: SessionData = JSON.parse(storedData)
      const now = Date.now()

      // Check if session has expired
      if (now > sessionData.expiresAt) {
        this.destroySession()
        return null
      }

      // Check for activity timeout
      if (now - sessionData.lastActivity > this.ACTIVITY_TIMEOUT) {
        this.destroySession()
        return null
      }

      // Update last activity
      sessionData.lastActivity = now
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(sessionData))

      return sessionData
    } catch (error) {
      console.error('Error getting session:', error)
      this.destroySession()
      return null
    }
  }

  /**
   * Refresh session expiry
   */
  static async refreshSession(sessionToken?: string): Promise<boolean> {
    if (typeof window === 'undefined') return false

    try {
      const storedData = localStorage.getItem(this.STORAGE_KEY)
      const storedToken = localStorage.getItem(`${this.STORAGE_KEY}_token`)
      
      if (!storedData || !storedToken) {
        return false
      }

      if (sessionToken && sessionToken !== storedToken) {
        return false
      }

      const sessionData: SessionData = JSON.parse(storedData)
      const now = Date.now()
      
      sessionData.expiresAt = now + this.SESSION_DURATION
      sessionData.lastActivity = now

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(sessionData))
      return true
    } catch (error) {
      console.error('Error refreshing session:', error)
      return false
    }
  }

  /**
   * Destroy a session
   */
  static async destroySession(): Promise<void> {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.STORAGE_KEY)
      localStorage.removeItem(`${this.STORAGE_KEY}_token`)
    }
  }

  /**
   * Get all active sessions for a user (client-side only has one)
   */
  static async getUserSessions(userId: string): Promise<SessionData[]> {
    const session = await this.getSession()
    if (session && session.userId === userId) {
      return [session]
    }
    return []
  }

  /**
   * Destroy all sessions for a user
   */
  static async destroyUserSessions(userId: string): Promise<void> {
    const session = await this.getSession()
    if (session && session.userId === userId) {
      await this.destroySession()
    }
  }

  /**
   * Generate a secure session token
   */
  private static generateSessionToken(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < 64; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  /**
   * Check if we're on client side
   */
  static isClientSide(): boolean {
    return typeof window !== 'undefined'
  }

  /**
   * Get session time remaining
   */
  static async getTimeRemaining(): Promise<number> {
    const session = await this.getSession()
    if (!session) return 0
    
    const now = Date.now()
    return Math.max(0, session.expiresAt - now)
  }

  /**
   * Check if session is valid
   */
  static async isValid(): Promise<boolean> {
    const session = await this.getSession()
    return session !== null
  }
}
