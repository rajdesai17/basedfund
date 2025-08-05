/**
 * Security Configuration and Best Practices
 * 
 * This file centralizes security settings and provides utility functions
 * for implementing security best practices across the application.
 */

// Environment validation
export const validateEnvironment = () => {
  const requiredEnvVars = [
    'NEXT_PUBLIC_ONCHAINKIT_API_KEY',
    'NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME',
    'NEXT_PUBLIC_URL'
  ];

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }

  return true;
};

// API Key validation
export const validateApiKey = (apiKey: string): boolean => {
  if (!apiKey || apiKey === 'your_actual_coinbase_api_key_here') {
    return false;
  }

  // Check for common placeholder values
  const placeholders = [
    'your_actual_coinbase_api_key_here',
    'REPLACE_WITH_YOUR_API_KEY',
    'YOUR_API_KEY_HERE',
    'your_api_key_here'
  ];

  if (placeholders.includes(apiKey)) {
    return false;
  }

  // Basic format validation
  const newFormatRegex = /^[A-Za-z0-9]{32}$/;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  
  return newFormatRegex.test(apiKey) || uuidRegex.test(apiKey);
};

// Production logging utility
export const createLogger = (context: string) => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  return {
    info: (message: string, ...args: any[]) => {
      if (isDevelopment) {
        console.log(`[${context}] ${message}`, ...args);
      }
    },
    error: (message: string, ...args: any[]) => {
      if (isDevelopment) {
        console.error(`[${context}] ERROR: ${message}`, ...args);
      }
    },
    warn: (message: string, ...args: any[]) => {
      if (isDevelopment) {
        console.warn(`[${context}] WARN: ${message}`, ...args);
      }
    }
  };
};

// Input sanitization
export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .substring(0, 1000); // Limit length
};

// Rate limiting configuration
export const RATE_LIMIT_CONFIG = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
};

// CORS configuration
export const CORS_CONFIG = {
  origin: process.env.NEXT_PUBLIC_URL || 'https://basedfund.vercel.app',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Content Security Policy
export const CSP_CONFIG = {
  'default-src': ["'self'"],
  'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
  'style-src': ["'self'", "'unsafe-inline'"],
  'img-src': ["'self'", 'data:', 'https:'],
  'connect-src': ["'self'", 'https://api.developer.coinbase.com', 'https://api.farcaster.xyz'],
  'frame-src': ["'self'"],
  'object-src': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"]
};

// Security headers
export const SECURITY_HEADERS = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'X-DNS-Prefetch-Control': 'off'
};

// Error handling utility
export const handleSecurityError = (error: Error, context: string) => {
  const logger = createLogger('Security');
  
  // Log error in development only
  logger.error(`${context}: ${error.message}`);
  
  // Return generic error message for production
  return {
    success: false,
    error: 'An error occurred. Please try again later.',
    context
  };
};

// Token validation
export const validateToken = (token: string): boolean => {
  if (!token || typeof token !== 'string') {
    return false;
  }
  
  // Basic token format validation
  return token.length >= 10 && /^[A-Za-z0-9._-]+$/.test(token);
};

// URL validation
export const validateUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}; 