
export type Tag = string;

export interface ActivityLogEntry {
  questId: number;
  questTitle: string;
  feedback: string;
  timestamp: string;
}

export interface WisdomEntry {
  id: number;
  authorId: number;
  problem: string;
  solution: string;
  tags: Tag[];
  timestamp: string;
}

export interface User {
  id: number;
  name: string;
  avatarUrl: string;
  bio: string;
  skills: Tag[];
  activityLog: ActivityLogEntry[];
  wisdomLog: WisdomEntry[];
  prefecture?: string;
}

export enum QuestStatus {
  Open = "募集中",
  InProgress = "進行中",
  Completed = "完了",
}

export interface Quest {
  id: number;
  title: string;
  description: string;
  clientId: number;
  reward: string;
  requiredTags: Tag[];
  participants: number[];
  status: QuestStatus;
  prefecture: string;
}

export interface CommunityEvent {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
}

export interface ChatMessage {
  id: number;
  userId: number;
  message: string;
  timestamp: string;
}

export interface ProjectTask {
  id: number;
  text: string;
  completed: boolean;
}