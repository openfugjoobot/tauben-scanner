export type ApiErrorCode =
  | 'NETWORK_ERROR'
  | 'UNAUTHORIZED'
  | 'NOT_FOUND'
  | 'VALIDATION_ERROR'
  | 'SERVER_ERROR'
  | 'UNKNOWN_ERROR';

export interface Sighting {
  id: string;
  date: string;
  location: {
    lat: number;
    lng: number;
    address?: string;
  };
  notes?: string;
}

export interface ApiError {
  code: ApiErrorCode;
  message: string;
  status?: number;
  details?: Record<string, unknown>;
}

export interface Pigeon {
  id: string;
  name: string;
  description?: string;
  photoUrl?: string;
  ownerId: string;
  sightingsCount: number;
  firstSeen: string;
  lastSeen?: string;
  createdAt: string;
  updatedAt: string;
  sightings?: Sighting[];
}

export interface MatchResponse {
  success: boolean;
  pigeon: Pigeon | null;
  confidence: number;
  message: string;
  isNewPigeon: boolean;
}

export interface CreatePigeonRequest {
  name: string;
  description?: string;
  location?: {
    lat: number;
    lng: number;
  };
  photo?: string; // base64
}
