export interface Song {
  videoId: string;
  title: string;
  artist: string;
  thumbnail: string;
  duration: number;
  durationFormatted: string;
  views?: number;
  uploadedAt?: string;
}

export interface SearchResult {
  songs: Song[];
  nextPageToken?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
