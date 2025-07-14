/**
 * Advanced URL Protection and Security Utilities
 * Provides comprehensive protection against various attacks
 */

// SQL Injection patterns
const SQL_INJECTION_PATTERNS = [
  /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/i,
  /(--|\||;|'|"|`|\*|%|\+)/,
  /(\bOR\b|\bAND\b)\s+\d+\s*=\s*\d+/i,
  /(UNION.*SELECT|SELECT.*FROM|INSERT.*INTO|UPDATE.*SET)/i,
  /(EXEC\s*\(|EXEC\s+XP_|SP_PASSWORD)/i,
  /(INFORMATION_SCHEMA|SYSOBJECTS|SYSCOLUMNS)/i,
]

// XSS patterns
const XSS_PATTERNS = [
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /javascript:/gi,
  /on\w+\s*=/gi,
  /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
  /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi,
  /<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi,
  /<link.*href.*javascript:/gi,
  /<img.*src.*javascript:/gi,
]

// Path traversal patterns
const PATH_TRAVERSAL_PATTERNS = [
  /\.\.\//g,
  /\.\.\\|\.\.\//g,
  /%2e%2e%2f/gi,
  /%2e%2e\\|\.\.\//gi,
  /\.\.%2f/gi,
  /%252e%252e%252f/gi,
]

// Command injection patterns
const COMMAND_INJECTION_PATTERNS = [
  /[;&|`$]\s*[\w\/]/,  // More specific - requires word char or slash after injection char
  /\$\{[^}]*\}/,       // Variable expansion ${...}
  /`[^`]*`/,           // Backtick execution
  /\|\s*(cat|ls|dir|type|copy|del|rm|mv|cp|chmod|chown|wget|curl|nc|netcat|telnet|ssh|ftp|powershell|cmd|bash|sh|zsh|fish)/i,
  /(^|\s)(cat|ls|dir|type|copy|del|rm|mv|cp|chmod|chown)\s+/i,
  /(^|\s)(wget|curl|nc|netcat|telnet|ssh|ftp)\s+/i,
  /(^|\s)(powershell|cmd|bash|sh|zsh|fish)\s+/i,
  /&&\s*\w+/,         // Command chaining
  /\|\|\s*\w+/,       // Command or
]

// Common attack patterns
const COMMON_ATTACK_PATTERNS = [
  /\.(php|asp|aspx|jsp|cgi|pl)(\?|$)/i,
  /(wp-admin|wp-content|wp-includes)/i,
  /(admin|administrator|manager|root)/i,
  /\.(env|git|svn|htaccess|htpasswd)/i,
  /(phpmyadmin|mysqladmin|pma)/i,
  /\/\.well-known\/acme-challenge\//i,
]

// Rate limiting store (in production, use Redis or a database)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

// Legitimate application paths that should be allowed
const LEGITIMATE_PATHS = [
  '/dashboard',
  '/profile',
  '/settings',
  '/login',
  '/signup',
  '/auth',
  '/api',
  '/chat',
  '/tutor',
  '/learning-path',
  '/contests',
  '/leaderboard',
  '/library',
  '/subjects',
  '/activity',
  '/progress',
  '/admin',
  '/class',
  '/students',
  '/tutors',
  '/exams',
  '/research',
  '/career-path',
  '/recommendations',
  '/learning-tools',
  '/tutor-tools',
  '/diary',
  '/enroll',
  '/summarizer',
  '/security',
  '/favicon.ico',
  '/_next',
  '/images',
  '/static',
]

export class URLSecurityValidator {
  /**
   * Validate URL path for security threats
   */
  static validatePath(path: string): { isValid: boolean; threats: string[]; risk: 'low' | 'medium' | 'high' } {
    const threats: string[] = []
    let riskLevel: 'low' | 'medium' | 'high' = 'low'

    // Check if path starts with any legitimate application path
    const isLegitimate = LEGITIMATE_PATHS.some(legitPath => 
      path.startsWith(legitPath) || path === legitPath
    )

    // If it's a legitimate path, skip most security checks
    if (isLegitimate) {
      // Only check for very obvious attacks in legitimate paths
      let decodedPath = path
      try {
        decodedPath = decodeURIComponent(path)
      } catch {
        threats.push('MALFORMED_URL')
        riskLevel = 'high'
      }

      // Only check for clear script/SQL injection in legitimate paths
      if (decodedPath.includes('<script') || decodedPath.includes('javascript:')) {
        threats.push('XSS')
        riskLevel = 'high'
      }

      if (decodedPath.includes("' OR '") || decodedPath.includes('" OR "')) {
        threats.push('SQL_INJECTION')
        riskLevel = 'high'
      }

      return {
        isValid: threats.length === 0,
        threats,
        risk: riskLevel
      }
    }

    // For non-legitimate paths, perform full security validation
    // Decode URL to catch encoded attacks
    let decodedPath = path
    try {
      decodedPath = decodeURIComponent(path)
    } catch {
      threats.push('MALFORMED_URL')
      riskLevel = 'high'
    }

    // Check for SQL injection
    if (SQL_INJECTION_PATTERNS.some(pattern => pattern.test(decodedPath))) {
      threats.push('SQL_INJECTION')
      riskLevel = 'high'
    }

    // Check for XSS
    if (XSS_PATTERNS.some(pattern => pattern.test(decodedPath))) {
      threats.push('XSS')
      riskLevel = 'high'
    }

    // Check for path traversal
    if (PATH_TRAVERSAL_PATTERNS.some(pattern => pattern.test(decodedPath))) {
      threats.push('PATH_TRAVERSAL')
      riskLevel = 'high'
    }

    // Check for command injection
    if (COMMAND_INJECTION_PATTERNS.some(pattern => pattern.test(decodedPath))) {
      threats.push('COMMAND_INJECTION')
      riskLevel = 'high'
    }

    // Check for common attack patterns
    if (COMMON_ATTACK_PATTERNS.some(pattern => pattern.test(decodedPath))) {
      threats.push('SUSPICIOUS_PATH')
      riskLevel = riskLevel === 'high' ? 'high' : 'medium'
    }

    // Check path length (unusually long paths can be suspicious)
    if (decodedPath.length > 2048) {
      threats.push('EXCESSIVE_LENGTH')
      riskLevel = riskLevel === 'high' ? 'high' : 'medium'
    }

    // Check for excessive URL encoding
    const encodingCount = (path.match(/%[0-9a-f]{2}/gi) || []).length
    if (encodingCount > 10) {
      threats.push('EXCESSIVE_ENCODING')
      riskLevel = riskLevel === 'high' ? 'high' : 'medium'
    }

    return {
      isValid: threats.length === 0,
      threats,
      risk: riskLevel
    }
  }

  /**
   * Validate query parameters
   */
  static validateQueryParams(searchParams: URLSearchParams): { isValid: boolean; threats: string[] } {
    const threats: string[] = []

    for (const [key, value] of searchParams.entries()) {
      const combinedParam = `${key}=${value}`

      // Check for SQL injection in parameters
      if (SQL_INJECTION_PATTERNS.some(pattern => pattern.test(combinedParam))) {
        threats.push(`SQL_INJECTION_IN_PARAM_${key}`)
      }

      // Check for XSS in parameters
      if (XSS_PATTERNS.some(pattern => pattern.test(combinedParam))) {
        threats.push(`XSS_IN_PARAM_${key}`)
      }

      // Check for command injection in parameters
      if (COMMAND_INJECTION_PATTERNS.some(pattern => pattern.test(combinedParam))) {
        threats.push(`COMMAND_INJECTION_IN_PARAM_${key}`)
      }
    }

    return {
      isValid: threats.length === 0,
      threats
    }
  }

  /**
   * Rate limiting check
   */
  static checkRateLimit(
    identifier: string, 
    maxRequests: number = 100, 
    windowMs: number = 60000
  ): { allowed: boolean; remaining: number; resetTime: number } {
    const now = Date.now()
    const windowStart = now - windowMs
    
    // Clean expired entries
    for (const [key, data] of rateLimitStore.entries()) {
      if (data.resetTime < now) {
        rateLimitStore.delete(key)
      }
    }

    const current = rateLimitStore.get(identifier)
    
    if (!current || current.resetTime < now) {
      // New window
      rateLimitStore.set(identifier, {
        count: 1,
        resetTime: now + windowMs
      })
      return {
        allowed: true,
        remaining: maxRequests - 1,
        resetTime: now + windowMs
      }
    }

    if (current.count >= maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: current.resetTime
      }
    }

    current.count++
    return {
      allowed: true,
      remaining: maxRequests - current.count,
      resetTime: current.resetTime
    }
  }

  /**
   * Generate CSRF token
   */
  static generateCSRFToken(): string {
    const array = new Uint8Array(32)
    crypto.getRandomValues(array)
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
  }

  /**
   * Verify CSRF token
   */
  static verifyCSRFToken(token: string, expectedToken: string): boolean {
    if (!token || !expectedToken) return false
    if (token.length !== expectedToken.length) return false
    
    let result = 0
    for (let i = 0; i < token.length; i++) {
      result |= token.charCodeAt(i) ^ expectedToken.charCodeAt(i)
    }
    return result === 0
  }

  /**
   * Sanitize input string
   */
  static sanitizeInput(input: string): string {
    return input
      .replace(/[<>'"&]/g, (char) => {
        const entities: Record<string, string> = {
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#x27;',
          '&': '&amp;'
        }
        return entities[char] || char
      })
      .trim()
  }

  /**
   * Validate user agent for bot detection
   */
  static validateUserAgent(userAgent: string): { isBot: boolean; isKnownBad: boolean; category: string } {
    const knownBots = [
      'bot', 'crawl', 'spider', 'scrape', 'curl', 'wget', 'python', 'node',
      'postman', 'insomnia', 'test', 'monitor', 'check'
    ]

    const maliciousBots = [
      'sqlmap', 'nmap', 'masscan', 'nikto', 'dirb', 'gobuster', 'wfuzz',
      'burpsuite', 'owasp', 'zap', 'metasploit'
    ]

    const lowerUA = userAgent.toLowerCase()

    const isBot = knownBots.some(bot => lowerUA.includes(bot))
    const isKnownBad = maliciousBots.some(bot => lowerUA.includes(bot))

    let category = 'unknown'
    if (isKnownBad) category = 'malicious'
    else if (isBot) category = 'bot'
    else if (lowerUA.includes('mozilla')) category = 'browser'

    return { isBot, isKnownBad, category }
  }

  /**
   * Check for suspicious IP patterns
   */
  static validateIP(ip: string): { isSuspicious: boolean; reason?: string } {
    // Private IP ranges (these might be suspicious in production if not expected)
    const privateRanges = [
      /^10\./,
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
      /^192\.168\./,
      /^127\./,
      /^169\.254\./,
      /^::1$/,
      /^fc00:/,
      /^fe80:/
    ]

    // Known bad IP patterns (example - in production, use threat intelligence feeds)
    const suspiciousPatterns = [
      /^0\.0\.0\.0$/,
      /^255\.255\.255\.255$/,
    ]

    for (const pattern of suspiciousPatterns) {
      if (pattern.test(ip)) {
        return { isSuspicious: true, reason: 'Known bad IP pattern' }
      }
    }

    // In production environment, flag private IPs as potentially suspicious
    if (process.env.NODE_ENV === 'production') {
      for (const pattern of privateRanges) {
        if (pattern.test(ip)) {
          return { isSuspicious: true, reason: 'Private IP in production' }
        }
      }
    }

    return { isSuspicious: false }
  }
}

/**
 * Security middleware helper functions
 */
export class SecurityHelpers {
  /**
   * Generate security headers for responses
   */
  static getSecurityHeaders(isDev: boolean = false): Record<string, string> {
    const headers: Record<string, string> = {
      // XSS Protection
      'X-XSS-Protection': '1; mode=block',
      
      // Frame Options
      'X-Frame-Options': 'SAMEORIGIN',
      
      // Content Type Options
      'X-Content-Type-Options': 'nosniff',
      
      // Referrer Policy
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      
      // Permissions Policy
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), serial=(), bluetooth=()',
      
      // DNS Prefetch Control
      'X-DNS-Prefetch-Control': 'off',
    }

    // Content Security Policy
    const cspDirectives = [
      "default-src 'self'",
      isDev 
        ? "script-src 'self' 'unsafe-eval' 'unsafe-inline' 'wasm-unsafe-eval'" 
        : "script-src 'self' 'strict-dynamic'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' data: https: blob:",
      "font-src 'self' https://fonts.gstatic.com",
      "connect-src 'self' https: wss: ws:",
      "media-src 'self' https:",
      "object-src 'none'",
      "child-src 'none'",
      "frame-src 'none'",
      "worker-src 'self' blob:",
      "form-action 'self'",
      "base-uri 'self'",
      "manifest-src 'self'",
      "frame-ancestors 'none'",
    ]

    if (!isDev) {
      cspDirectives.push(
        "block-all-mixed-content",
        "upgrade-insecure-requests"
      )
      
      // HSTS for production
      headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains; preload'
    }

    headers['Content-Security-Policy'] = cspDirectives.join('; ')

    return headers
  }

  /**
   * Log security events
   */
  static logSecurityEvent(
    event: string, 
    ip: string, 
    userAgent: string, 
    path: string, 
    details?: any
  ) {
    const timestamp = new Date().toISOString()
    const logEntry = {
      timestamp,
      event,
      ip,
      userAgent,
      path,
      details,
      severity: this.getEventSeverity(event)
    }

    // In production, send to your logging service
    console.warn(`[SECURITY] ${timestamp}: ${event} from ${ip} on ${path}`, logEntry)
    
    // You could integrate with services like:
    // - Sentry for error tracking
    // - LogRocket for session replay
    // - DataDog for monitoring
    // - Your own security monitoring system
  }

  private static getEventSeverity(event: string): 'low' | 'medium' | 'high' | 'critical' {
    const highSeverityEvents = ['SQL_INJECTION', 'COMMAND_INJECTION', 'XSS']
    const mediumSeverityEvents = ['PATH_TRAVERSAL', 'SUSPICIOUS_PATH', 'RATE_LIMIT_EXCEEDED']
    
    if (highSeverityEvents.some(e => event.includes(e))) return 'critical'
    if (mediumSeverityEvents.some(e => event.includes(e))) return 'high'
    if (event.includes('MALICIOUS') || event.includes('BOT')) return 'medium'
    
    return 'low'
  }
}

export default URLSecurityValidator
