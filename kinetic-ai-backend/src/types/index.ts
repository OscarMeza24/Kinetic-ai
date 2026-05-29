// API Request/Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code: string;
    details?: Record<string, any>;
  };
  timestamp: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// Auth types
export interface AuthPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    fullName: string;
  };
  accessToken: string;
  refreshToken: string;
}

export interface JwtPayload {
  userId: string;
  email: string;
  iat: number;
  exp: number;
}

// Database types
export interface DbUser {
  id: string;
  email: string;
  password_hash: string;
  full_name: string;
  created_at: string;
  updated_at: string;
}

export interface DbProject {
  id: string;
  user_id: string;
  title: string;
  description: string;
  niche: string;
  created_at: string;
  updated_at: string;
}

export interface DbDraft {
  id: string;
  project_id: string;
  user_id: string;
  prompt: string;
  tone: string;
  style: string;
  title: string;
  hook: string;
  script: string[];
  scenes: ScriptScene[];
  assets: string[];
  hashtags: string[];
  description: string;
  voice: string;
  virality_score: number;
  duration: number;
  status: 'draft' | 'generating' | 'ready' | 'editing';
  ai_model: string;
  created_at: string;
  updated_at: string;
}

export interface ScriptScene {
  id: string;
  label: string;
  narration: string;
  visual: string;
  duration: number;
}

export interface DbVoiceJob {
  id: string;
  draft_id: string;
  user_id: string;
  text_input: string;
  voice_id: string;
  language: string;
  audio_url: string;
  audio_duration: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  error_message: string;
  created_at: string;
  updated_at: string;
}

export interface DbRenderJob {
  id: string;
  draft_id: string;
  user_id: string;
  scenes: ScriptScene[];
  audio_url: string;
  background_color: string;
  font_style: string;
  video_url: string;
  video_duration: number;
  file_size_mb: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  error_message: string;
  ffmpeg_command: string;
  processing_time_ms: number;
  created_at: string;
  updated_at: string;
}

export interface DbScheduledPost {
  id: string;
  draft_id: string;
  user_id: string;
  title: string;
  description: string;
  channels: string[];
  scheduled_at: string;
  status: 'scheduled' | 'processing' | 'published' | 'failed';
  published_urls: Record<string, string>;
  error_message: string;
  created_at: string;
  updated_at: string;
}
