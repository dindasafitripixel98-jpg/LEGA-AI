export type ModuleType =
  | 'dashboard'
  | 'profile'
  | 'self-discovery'
  | 'ai-coach'
  | 'emotion-analysis'
  | 'pattern-awareness'
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
    suggestedModuleKey?: ModuleType;
    suggestedModuleName?: string;
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

export type NatureSoundType =
  | 'aliran-sungai'
  | 'gemericik-air'
  | 'air-terjun-lembut'
  | 'burung-pagi'
  | 'angin-pepohonan'
  | 'ombak-pantai'
  | 'hutan-alami'
  | 'hujan-lembut'
  | 'hujan-kaca'
  | 'gemericik-bambu-zen'
  | 'ombak-samudra-dalam'
  | 'angin-lembah-gunung'
  | 'suasana-malam'
  | 'suasana-alam-tenang'
  | 'fajar-tenang';

export type AmbientMusicType =
  | 'piano-lembut'
  | 'petikan-gitar'
  | 'akustik-hangat'
  | 'harp-kalimba'
  | 'gitar-reflektif'
  | 'ambient-minimal'
  | 'tibetan-bowl-deep'
  | 'pad-sinematik'
  | 'string-halus'
  | 'piano-hangat'
  | 'lullaby-malam'
  | 'zen-flute-432hz'
  | 'solfeggio-528hz-healing'
  | 'celestial-binaural-theta'
  | 'deep-delta-sleep-wave'
  | 'acoustic-meditation-chimes'
  | 'rain-glass-piano'
  | 'piano-pagi-positif';

export interface AudioRelaxationMetadata {
  atmosphereTheme: string; // Tema suasana (e.g. "Ketenangan Senja")
  natureSoundType: NatureSoundType; // Jenis backsound utama (e.g. "Gemericik air")
  natureSoundTypes?: NatureSoundType[]; // Multi-layer backsound (e.g. ['aliran-sungai', 'burung-pagi', 'angin-pepohonan'])
  natureSoundLabel: string;
  ambientMusicType: AmbientMusicType; // Jenis musik (e.g. "Pad Sinematik 432Hz")
  ambientMusicLabel: string;
  narrationVolume: number; // 0-100% (default: 80-90%)
  natureVolume: number; // 0-100% (default: 60%)
  musicVolume: number; // 0-100% (default: 40%)
  fadeInSeconds: number; // e.g. 4.0
  fadeOutSeconds: number; // e.g. 5.5
  loopRecommendation: string; // Rekomendasi loop jika sesi lebih panjang (e.g. "Seamless Crossfade Loop 30 Detik")
  voiceWarmthDescription?: string;
}

export interface AudioTrack {
  id: string;
  title: string;
  category: 'guided' | 'nature' | 'binaural' | 'tts';
  duration: string;
  description: string;
  audioUrl?: string;
  isAiGenerated?: boolean;
  metadata?: AudioRelaxationMetadata;
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
  email?: string;
  avatar?: string;
  bio?: string;
  age?: number;
  reflectionGoal: string;
  preferredTone: 'hangat' | 'tenang' | 'fokus';
  preferredVoice?: string;
  primaryEmotionFocus?: string;
  dailyReminderTime?: string;
  enableSoundscapes?: boolean;
  streakDays: number;
  totalReflections: number;
  registeredDate: string;
}

export interface PatternAwarenessData {
  event: string;
  impactfulPart?: string;
  factVsInterpretation?: string;
  thought: string;
  selfTalk?: string;
  emotions: string[];
  bodySensations: string[];
  bodyLocation?: string;
  impulses: string[];
  response: string;
  consequences: string;
  hasSimilarPast: 'ya' | 'tidak' | 'mungkin';
  pastSimilarExperience?: string;
  underlyingNeeds?: {
    expected?: string;
    needed?: string;
    feared?: string;
    protecting?: string;
    seeking?: string;
    avoiding?: string;
  };
  learning?: string;
  newResponseChoices: string[];
  presentMomentNotes?: string;
}

export interface PatternAnalysisResult {
  summary: string;
  cycleOverview: {
    eventFact: string;
    coreThought: string;
    identifiedEmotions: string[];
    somaticExperience: string;
    feltImpulse: string;
    actualResponse: string;
    resultingImpact: string;
  };
  patternRecognition: {
    similarityInsight: string;
    recurringTendency: string;
    protectiveIntent: string;
  };
  deeperNeedsAnalysis: {
    coreNeed: string;
    whatIsProtected: string;
    fearsOrLoss: string;
  };
  learningSummary: string;
  consciousResponseChoices: {
    title: string;
    description: string;
    practicalAction: string;
  }[];
  groundingGuidance: string;
  recommendedNextModule?: {
    moduleName: string;
    reason: string;
    targetModuleKey: ModuleType;
  };
}

export interface LandingPageGalleryItem {
  id: string;
  imageUrl?: string;
  url?: string;
  title: string;
  description: string;
  category?: string;
}

export interface LandingPageConfig {
  topBrandTag?: string;
  topBrandSlogan?: string;
  heroBadge?: string;
  heroHeadline?: string;
  heroSubheadline?: string;
  heroDescription?: string;
  heroDetailsBox?: string;
  heroApprochNote?: string;
  heroCtaPrimaryText?: string;
  heroCtaSecondaryText?: string;
  
  // Media Section (Image / Video)
  mediaType?: 'image' | 'video' | 'youtube' | 'none';
  heroImageUrl?: string;
  heroImageCaption?: string;
  heroVideoUrl?: string;
  heroVideoTitle?: string;
  heroVideoSubtitle?: string;
  
  // Announcement / Promo Banner
  enablePromoBanner?: boolean;
  promoBannerText?: string;
  promoBannerBadge?: string;
  
  // Transformation Before/After
  beforeTitle?: string;
  beforePoints?: string[];
  afterTitle?: string;
  afterPoints?: string[];
  
  // Gallery / Screenshots
  galleryImages?: LandingPageGalleryItem[];
  
  // Footer & Contact
  contactWhatsapp?: string;
  contactEmail?: string;
  footerTagline?: string;
}

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  serviceRoleKey?: string;
  isEnabled: boolean;
  autoSync: boolean;
  tablePrefix?: string;
}

export interface DeveloperConfig {
  geminiApiKey: string;
  noizApiKey: string;
  openaiApiKey?: string;
  isCustomGeminiSet: boolean;
  isCustomNoizSet: boolean;
  appTitle: string;
  appTagline: string;
  developerName: string;
  developerEmail: string;
  defaultVoice: string;
  defaultMasterVolume: number;
  enableSpiritualModule: boolean;
  enableCrisisHotline: boolean;
  enableDemoMode24h: boolean;
  customAiCoachPrompt?: string;
  landingPage?: LandingPageConfig;
  supabase?: SupabaseConfig;
}

export interface CustomerAccount {
  id: string;
  name: string;
  email: string;
  phone?: string;
  password?: string;
  role: 'USER' | 'PREMIUM' | 'VIP' | 'DEVELOPER' | 'ADMIN';
  plan: 'TRIAL' | 'MONTHLY' | 'YEARLY' | 'LIFETIME';
  status: 'ACTIVE' | 'SUSPENDED' | 'EXPIRED';
  licenseKey: string;
  createdAt: string;
  expiresAt: string;
  maxDevices: number;
  notes?: string;
  streakCount: number;
  lastLogin?: string;
}

export interface ServiceHealthStatus {
  service: 'gemini' | 'noiz' | 'database' | 'supabase' | 'audioEngine' | 'auth';
  name: string;
  status: 'ONLINE' | 'DEGRADED' | 'OFFLINE' | 'CHECKING';
  latencyMs: number;
  message: string;
  lastChecked: string;
}

