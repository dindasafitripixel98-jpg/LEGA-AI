export type ModuleType =
  | 'dashboard'
  | 'profile'
  | 'self-discovery'
  | 'ai-coach'
  | 'emotion-analysis'
  | 'mindfulness'
  | 'gratitude'
  | 'forgiveness'
  | 'inner-child'
  | 'overthinking'
  | 'anxiety'
  | 'stress'
  | 'anger'
  | 'sadness'
  | 'guilt'
  | 'shame'
  | 'fear'
  | 'life-purpose'
  | 'spiritual-reflection'
  | 'observer'
  | 'body-awareness'
  | 'breathing'
  | 'emotional-release'
  | 'journal'
  | 'ai-insights'
  | 'audio-ai'
  | 'articles'
  | 'mind-body'
  | 'progress'
  | 'settings'
  | 'admin';

export type EmotionCategory =
  | 'marah'
  | 'sedih'
  | 'takut'
  | 'kecewa'
  | 'bersalah'
  | 'malu'
  | 'iri'
  | 'dendam'
  | 'cemas'
  | 'panik'
  | 'kosong'
  | 'bahagia'
  | 'tenang'
  | 'lega'
  | 'haru'
  | 'bingung'
  | 'frustrasi'
  | 'kesepian'
  | 'putus_asa'
  | 'gelisah'
  | 'lelah'
  | 'bersyukur'
  | 'senang';

export interface EmotionLog {
  id: string;
  timestamp: string;
  emotion: EmotionCategory;
  intensity: number; // 1-10
  physicalSensations: string[];
  triggers: string[];
  notes?: string;
  aiAnalysis?: {
    summary: string;
    primaryEmotion?: string;
    secondaryEmotions?: string[];
    intensityLevel?: string;
    possibleTriggers?: string[];
    bodySensations?: string;
    thoughtPatterns?: string;
    underlyingNeed: string;
    reflectiveQuestion?: string;
    reflectiveQuestions?: string[];
    suggestedExercise?: string;
    recommendedModules?: {
      moduleName: string;
      reason: string;
      targetModuleKey: ModuleType;
    }[];
    emergencyNotice?: string | null;
    mindBodyPerspective?: string;
  };
}

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  date: string;
  mood?: EmotionCategory;
  tags: string[];
  aiFeedback?: {
    reflection: string;
    keyInsight: string;
    gentleSuggestion: string;
  };
}

export interface ConversationMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  stage?: number; // 1-10 corresponding to LEGA flow
  structuredOutput?: {
    emotionAnalysis?: string;
    reflectiveQuestions?: string[];
    mindfulnessExercise?: string;
    breathingExercise?: string;
    journalPrompt?: string;
    audioRecommendation?: string;
    summary?: string;
    summaryInsight?: string;
    learningInsight?: string;
  };
  audioBase64?: string;
}

export interface ArticleReference {
  title: string;
  authorOrOrg: string;
  year?: string;
  publication?: string;
  urlOrDoi?: string;
}

export interface Article {
  id: string;
  title: string;
  category: string;
  readTime: string;
  summary: string;
  content: string;
  author: string;
  tags: string[];
  status?: 'DRAFT' | 'REVIEW' | 'APPROVED' | 'PUBLISHED' | 'ARCHIVED';
  readingLevel?: 'Pemula' | 'Menengah' | 'Lanjutan' | string;
  seoTitle?: string;
  metaDescription?: string;
  slug?: string;
  primaryKeyword?: string;
  secondaryKeywords?: string[];
  keyTakeaways?: string[];
  reflectionQuestions?: string[];
  recommendedExercise?: string;
  recommendedAudio?: string;
  relatedModules?: string[];
  relatedArticles?: string[];
  references?: ArticleReference[];
  safetyNote?: string;
  publishedAt?: string;
  updatedAt?: string;
}

export interface AudioTrack {
  id: string;
  title: string;
  category: 'guided' | 'nature' | 'binaural' | 'tts';
  duration: string;
  description: string;
  audioUrl?: string;
  isAiGenerated?: boolean;
}

export interface MindBodySensation {
  part: string;
  label: string;
  commonEmotions: string[];
  description: string;
  somaticExercise: string;
}

export interface SelfDiscoveryItem {
  id: string;
  category: 'pola-pikir' | 'pemicu' | 'nilai-hidup' | 'kelebihan' | 'kebutuhan';
  title: string;
  question: string;
  userAnswer?: string;
  reflectionNote?: string;
}

export interface UserProfile {
  name: string;
  age?: number;
  reflectionGoal: string;
  preferredTone: 'hangat' | 'tenang' | 'fokus';
  streakDays: number;
  totalReflections: number;
  registeredDate: string;
}
