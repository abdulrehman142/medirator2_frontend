export type Role = "user";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  picture?: string | null;
  role: Role;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export type Category = "patients" | "medicines" | "inventory" | "instruments";

export interface RetrievedItem {
  category: string;
  id: string;
  score: number;
  data: Record<string, unknown>;
}

export interface QueryResponse {
  query: string;
  category: Category | string;
  answer: string;
  structured: Record<string, unknown> | null;
  retrieved: RetrievedItem[];
  confidence: number;
  model: string;
  raw_context: Record<string, unknown>[];
}

export interface HealthResponse {
  status: string;
  llm_provider?: string;
  llm_configured?: boolean;
  llm_reachable?: boolean;
  llm_model?: string | null;
  /** @deprecated use llm_reachable */
  ollama_running?: boolean;
  /** @deprecated use llm_model */
  ollama_model?: string | null;
  knowledge_base: {
    ready: boolean;
    counts: Record<string, number>;
    source: string;
  };
}

export interface DataCategoryResponse {
  category: string;
  count: number;
  items: Record<string, unknown>[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  category?: string;
  structured?: Record<string, unknown> | null;
  retrieved?: RetrievedItem[];
  confidence?: number;
  model?: string;
  rawContext?: Record<string, unknown>[];
}
