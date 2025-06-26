import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface'

export const corsConfig: CorsOptions = {
  origin: (origin, callback) => {
    // Get allowed origins from environment
    const allowedOrigins = process.env.CORS_ORIGIN?.split(',').map(o => o.trim()) || [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:8080',
    ]

    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) {
      return callback(null, true)
    }

    // Check if origin is allowed
    if (allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error(`Origin ${origin} not allowed by CORS policy`))
    }
  },

  // Allow credentials (cookies, authorization headers)
  credentials: process.env.CORS_CREDENTIALS === 'true',

  // Allowed HTTP methods
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],

  // Allowed headers
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'X-API-Key',
    'X-Request-ID',
  ],

  // Headers exposed to the client
  exposedHeaders: [
    'X-RateLimit-Limit',
    'X-RateLimit-Remaining',
    'X-RateLimit-Reset',
    'X-Request-ID',
    'X-API-Version',
  ],

  // Preflight cache duration (24 hours)
  maxAge: 86400,

  // Handle preflight requests
  preflightContinue: false,
  optionsSuccessStatus: 204,
}
