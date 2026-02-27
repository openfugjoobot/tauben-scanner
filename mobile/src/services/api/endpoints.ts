export const ENDPOINTS = {
  HEALTH: '/health',
  PIGEONS: {
    LIST: '/pigeons',
    GET: (id: string) => `/pigeons/${id}`,
    CREATE: '/pigeons',
    UPDATE: (id: string) => `/pigeons/${id}`,
    DELETE: (id: string) => `/pigeons/${id}`,
    SIGHTINGS: (id: string) => `/pigeons/${id}/sightings`,
  },
  MATCH: {
    IMAGE: '/match',
  },
  IMAGES: {
    UPLOAD: '/images',
  },
} as const;
