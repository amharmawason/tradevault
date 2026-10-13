export type CreationType = "video" | "photo" | "music" | "app" | "website" | "game" | "research";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  featherTier: string;
  featherBadge: string;
  computeTokens: number;
  apiKey: string;
  settings?: {
    turboMode: boolean;
    autoUpscale: boolean;
    modelEngine: string;
    soundEffects: boolean;
    darkTheme: boolean;
  };
}

export interface Creation {
  id: string;
  userId: string;
  type: CreationType;
  title: string;
  prompt: string;
  description?: string | null;
  status: "completed" | "generating" | "failed";
  isFavorite: boolean;
  tags?: string[] | null;
  outputData?: Record<string, any> | null;
  viewsCount: number;
  downloadsCount: number;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface UploadItem {
  id: string;
  userId: string;
  fileName: string;
  fileType: string;
  fileCategory: "video" | "photo" | "pdf" | "word" | "excel" | "code" | "other";
  fileSize: string;
  fileUrl?: string | null;
  parsedData?: Record<string, any> | null;
  aiInsights?: string | null;
  chatHistory?: Array<{
    id: string;
    role: "user" | "assistant" | "system";
    content: string;
    timestamp: string;
  }> | null;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface TemplateItem {
  id: string;
  category: string;
  title: string;
  description: string;
  prompt: string;
  badge: string;
  icon: string;
  tags?: string[] | null;
}
