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

export interface Playlist {
  id: string;
  name: string;
  cover: string | null;
  userId: string;
  songs: PlaylistSong[];
  createdAt: string;
}

export interface PlaylistSong {
  id: string;
  playlistId: string;
  videoId: string;
  title: string;
  artist: string;
  thumbnail: string;
  duration: number;
  durationFormatted: string;
  addedAt: string;
}
