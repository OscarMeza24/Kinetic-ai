export type ScreenId =
  | 'dashboard'
  | 'studio'
  | 'editor'
  | 'trends'
  | 'scheduler'
  | 'analytics'
  | 'library'
  | 'brain'
  | 'settings'
  | 'support'
  | 'more';

export type AutomationStatus = 'processing' | 'ready' | 'scheduled' | 'published';

export type Automation = {
  id: string;
  title: string;
  status: AutomationStatus;
  stage: string;
  progress: number;
  channel: string;
  eta: string;
  updatedAt: string;
  steps: string[];
};

export type ScriptScene = {
  id: string;
  label: string;
  narration: string;
  visual: string;
  duration: number;
};

export type DraftShort = {
  title: string;
  prompt: string;
  tone: string;
  style: string;
  hook: string;
  script: string[];
  scenes: ScriptScene[];
  assets: string[];
  hashtags: string[];
  description: string;
  thumbnailText: string;
  voice: string;
  viralityScore: number;
  duration: number;
};

export type Trend = {
  id: string;
  tag: string;
  niche: string;
  potential: number;
  idea: string;
};

export type ScheduledPost = {
  id: string;
  title: string;
  description: string;
  channels: string[];
  day: string;
  time: string;
  status: 'scheduled' | 'published';
  hashtags: string[];
};

export type LibraryItem = {
  id: string;
  title: string;
  type: 'Generated' | 'Uploaded' | 'Music' | 'Brand';
  meta: string;
  color: string;
  tags: string[];
};
