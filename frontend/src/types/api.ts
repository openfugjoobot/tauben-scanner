export interface Location {
  lat: number;
  lng: number;
  name?: string;
}

export interface Pigeon {
  id: string;
  name: string;
  description?: string;
  photo_url?: string;
  first_seen?: string;
  sightings_count?: number;
}

export interface MatchRequest {
  photo: string;  // base64 encoded image
  embedding?: number[];  // optional: client-extracted embedding
  location?: Location;
  threshold?: number;  // default: 0.80
}

export interface MatchResponse {
  match: boolean;
  pigeon?: Pigeon;
  confidence: number;
  similar_pigeons?: Pigeon[];
  suggestion?: string;
}

export interface ApiError {
  error: string;
  message: string;
  field?: string;
}
