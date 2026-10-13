import { pgTable, text, timestamp, boolean, integer, jsonb } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  avatar: text("avatar").notNull(),
  role: text("role").notNull().default("VIP Master"),
  featherTier: text("feather_tier").notNull().default("FEATHER_UNLOCKED_SUPREME"),
  featherBadge: text("feather_badge").notNull().default("Feather Sovereign VIP"),
  computeTokens: integer("compute_tokens").notNull().default(99999999),
  apiKey: text("api_key").notNull(),
  settings: jsonb("settings").$type<{
    turboMode: boolean;
    autoUpscale: boolean;
    modelEngine: string;
    soundEffects: boolean;
    darkTheme: boolean;
  }>().default({
    turboMode: true,
    autoUpscale: true,
    modelEngine: "Amhar-Omni-v5-Ultra",
    soundEffects: true,
    darkTheme: true,
  }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const creations = pgTable("creations", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  type: text("type").notNull(), // 'video' | 'photo' | 'music' | 'app' | 'website' | 'game' | 'research'
  title: text("title").notNull(),
  prompt: text("prompt").notNull(),
  description: text("description"),
  status: text("status").notNull().default("completed"), // 'completed' | 'generating' | 'failed'
  isFavorite: boolean("is_favorite").notNull().default(false),
  tags: jsonb("tags").$type<string[]>().default([]),
  outputData: jsonb("output_data").$type<Record<string, any>>().default({}),
  viewsCount: integer("views_count").notNull().default(0),
  downloadsCount: integer("downloads_count").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const uploads = pgTable("uploads", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  fileName: text("file_name").notNull(),
  fileType: text("file_type").notNull(),
  fileCategory: text("file_category").notNull(), // 'video' | 'photo' | 'pdf' | 'word' | 'excel' | 'code' | 'other'
  fileSize: text("file_size").notNull(),
  fileUrl: text("file_url"),
  parsedData: jsonb("parsed_data").$type<Record<string, any>>().default({}),
  aiInsights: text("ai_insights"),
  chatHistory: jsonb("chat_history").$type<Array<{
    id: string;
    role: "user" | "assistant" | "system";
    content: string;
    timestamp: string;
  }>>().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const templates = pgTable("templates", {
  id: text("id").primaryKey(),
  category: text("category").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  prompt: text("prompt").notNull(),
  badge: text("badge").notNull().default("Feather VIP"),
  icon: text("icon").notNull(),
  tags: jsonb("tags").$type<string[]>().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
