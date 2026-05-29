-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_users_email ON users(email);

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  niche VARCHAR(100),
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  UNIQUE(user_id, title)
);

CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_created_at ON projects(created_at DESC);

-- Create drafts table
CREATE TABLE IF NOT EXISTS drafts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  prompt TEXT NOT NULL,
  tone VARCHAR(50),
  style VARCHAR(50),
  
  title VARCHAR(255),
  hook TEXT,
  script JSONB,
  scenes JSONB,
  assets JSONB,
  hashtags JSONB,
  description TEXT,
  
  voice VARCHAR(100),
  virality_score INT DEFAULT 0,
  duration INT DEFAULT 0,
  
  status VARCHAR(50) DEFAULT 'draft',
  ai_model VARCHAR(50) DEFAULT 'gpt-4-turbo',
  
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_drafts_user_id ON drafts(user_id);
CREATE INDEX idx_drafts_project_id ON drafts(project_id);
CREATE INDEX idx_drafts_status ON drafts(status);
CREATE INDEX idx_drafts_created_at ON drafts(created_at DESC);

-- Create voice_jobs table
CREATE TABLE IF NOT EXISTS voice_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  draft_id UUID NOT NULL REFERENCES drafts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id),
  
  text_input TEXT NOT NULL,
  voice_id VARCHAR(100),
  language VARCHAR(10) DEFAULT 'es',
  
  audio_url VARCHAR(500),
  audio_duration INT,
  
  status VARCHAR(50) DEFAULT 'pending',
  error_message TEXT,
  
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_voice_jobs_status ON voice_jobs(status);
CREATE INDEX idx_voice_jobs_draft_id ON voice_jobs(draft_id);

-- Create render_jobs table
CREATE TABLE IF NOT EXISTS render_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  draft_id UUID NOT NULL REFERENCES drafts(id),
  user_id UUID NOT NULL REFERENCES users(id),
  
  scenes JSONB NOT NULL,
  audio_url VARCHAR(500),
  background_color VARCHAR(7),
  font_style VARCHAR(50),
  
  video_url VARCHAR(500),
  video_duration INT,
  file_size_mb DECIMAL(10, 2),
  
  status VARCHAR(50) DEFAULT 'pending',
  progress INT DEFAULT 0,
  error_message TEXT,
  
  ffmpeg_command TEXT,
  processing_time_ms INT,
  
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_render_jobs_status ON render_jobs(status);
CREATE INDEX idx_render_jobs_draft_id ON render_jobs(draft_id);

-- Create scheduled_posts table
CREATE TABLE IF NOT EXISTS scheduled_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  draft_id UUID REFERENCES drafts(id),
  user_id UUID NOT NULL REFERENCES users(id),
  
  title VARCHAR(255),
  description TEXT,
  channels JSONB,
  
  scheduled_at TIMESTAMP NOT NULL,
  
  status VARCHAR(50) DEFAULT 'scheduled',
  published_urls JSONB,
  error_message TEXT,
  
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_scheduled_posts_status ON scheduled_posts(status);
CREATE INDEX idx_scheduled_posts_scheduled_at ON scheduled_posts(scheduled_at);
CREATE INDEX idx_scheduled_posts_user_id ON scheduled_posts(user_id);

-- Create connected_accounts table
CREATE TABLE IF NOT EXISTS connected_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  provider VARCHAR(50),
  provider_user_id VARCHAR(255),
  access_token VARCHAR(1000),
  refresh_token VARCHAR(1000),
  expires_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  UNIQUE(user_id, provider)
);

CREATE INDEX idx_connected_accounts_user_id ON connected_accounts(user_id);

-- Create analytics_snapshots table
CREATE TABLE IF NOT EXISTS analytics_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  scheduled_post_id UUID REFERENCES scheduled_posts(id),
  
  platform VARCHAR(50),
  video_id VARCHAR(255),
  
  views INT DEFAULT 0,
  likes INT DEFAULT 0,
  comments INT DEFAULT 0,
  shares INT DEFAULT 0,
  watch_time_sec INT DEFAULT 0,
  avg_view_duration_pct INT DEFAULT 0,
  
  captured_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_analytics_user_id ON analytics_snapshots(user_id);
CREATE INDEX idx_analytics_platform ON analytics_snapshots(platform);
