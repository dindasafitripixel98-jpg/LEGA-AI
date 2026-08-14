import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Volume2,
  VolumeX,
  Sparkles,
  HelpCircle,
  Wind,
  BookOpen,
  RefreshCw,
  PhoneCall,
  User,
  MessageSquare
} from 'lucide-react';
import { ConversationMessage, UserProfile } from '../types';
import { sendChatMessage, generateGeminiTts } from '../lib/geminiApi';
import { speakIndonesianNarration, stopIndonesianNarration } from '../lib/audioEngine';

interface AICoachProps {
  userProfile: UserProfile;
  onOpenCrisis: () => void;
  onSelectModule: (module: string) => void;
}

const FLOW_STEPS = [
  '1. Dengarkan',
  '2. Pahami Konteks',
  '3. Identifikasi Emosi',
  '4. Identifikasi Tujuan',
  '5. Validasi Sederhana',
  '6. Pertanyaan Reflektif',
  '7. Pengalaman Batin',
  '8. Latihan Sesuai',
  '9. Insight & Pembelajaran',
  '10. Langkah Kecil Next',
];

const PRESET_PROMPTS = [
  'Aku merasa sangat cemas dengan beban pekerjaan hari ini.',
  'Dadaku terasa sesak dan kepalaku pusing.',
  'Bagaimana cara berdamai dengan ekspektasi orang lain?',
  'Aku merasa lelah mental dan ingin jeda sebentar.',
];

export const AICoach: React.FC<AICoachProps> = ({
  userProfile,
  onOpenCrisis,
  onSelectModule,
}) => {
  const [messages, setMessages] = useState<ConversationMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: `Halo ${userProfile.name}, selamat datang di LEGA AI. Saya di sini untuk mendampingi refleksi dirimu dengan tenang, lembut, dan tanpa menghakimi. Apa yang sedang kamu rasakan atau alami saat ini?`,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      stage: 1,
      structuredOutput: {
        reflectiveQuestions: [
          'Bagaimana napasmu saat ini?',
          'Apa satu hal utama yang memenuhi pikiranmu?',
        ],
        summaryInsight: 'Mulai dengan menyadari kehadiranmu saat ini.',
      },
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentStage, setCurrentStage] = useState(1);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [ttsLoadingId, setTtsLoadingId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input.trim();
    if (!query || loading) return;

    // Safety check for severe distress
    const lowerQuery = query.toLowerCase();
    if (
      lowerQuery.includes('bunuh diri') ||
      lowerQuery.includes('ingin mati') ||
      lowerQuery.includes('menyakiti diri') ||
      lowerQuery.includes('akhiri hidup')
    ) {
      onOpenCrisis();
    }

    const userMsg: ConversationMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const responseData = await sendChatMessage([...messages, userMsg], userProfile);

      const nextStage = Math.min(currentStage + 1, 10);
      setCurrentStage(nextStage);

      const aiMsg: ConversationMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: responseData.replyText || 'Terima kasih telah berbagi cerita secara jujur.',
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        stage: nextStage,
        structuredOutput: {
          emotionAnalysis: responseData.identifiedEmotion,
          reflectiveQuestions: responseData.reflectiveQuestions,
          mindfulnessExercise:
            responseData.suggestedExercise?.type === 'grounding'
              ? responseData.suggestedExercise.title
              : undefined,
          breathingExercise:
            responseData.suggestedExercise?.type === 'breathing'
              ? responseData.suggestedExercise.title
              : undefined,
          summaryInsight: responseData.summaryInsight,
        },
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error('Chat error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayTts = async (msgId: string, textToSpeak: string) => {
    if (playingAudioId === msgId) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      stopIndonesianNarration();
      setPlayingAudioId(null);
      return;
    }

    stopIndonesianNarration();
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    setTtsLoadingId(msgId);
    const audioData = await generateGeminiTts(textToSpeak, 'Kore');
    setTtsLoadingId(null);

    if (audioData) {
      const audioUrl = audioData.startsWith('data:') || audioData.startsWith('blob:') || audioData.startsWith('http')
        ? audioData
        : `data:audio/wav;base64,${audioData}`;
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onended = () => {
        setPlayingAudioId(null);
      };

      audio.play().catch(() => {
        speakIndonesianNarration(textToSpeak, {
          onEnd: () => setPlayingAudioId(null),
          onError: () => setPlayingAudioId(null)
        });
      });
      setPlayingAudioId(msgId);
    } else {
      setPlayingAudioId(msgId);
      speakIndonesianNarration(textToSpeak, {
        onEnd: () => setPlayingAudioId(null),
        onError: () => setPlayingAudioId(null)
      });
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-5xl mx-auto p-3 sm:p-5 text-stone-100">
      {/* Stage Indicator Header */}
      <div className="bg-stone-900/90 p-3 rounded-2xl border border-stone-800 mb-3 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-emerald-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Alur Refleksi LEGA: Tahap {currentStage}/10
          </span>
          <span className="text-stone-400 font-medium">
            {FLOW_STEPS[currentStage - 1]}
          </span>
        </div>
        <div className="w-full bg-stone-800 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-emerald-500 h-full transition-all duration-500"
            style={{ width: `${(currentStage / 10) * 100}%` }}
          />
        </div>
      </div>

      {/* Messages Thread */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin scrollbar-thumb-stone-800">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex gap-3 max-w-3xl ${
              m.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
            }`}
          >
            {/* Avatar */}
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                m.sender === 'user'
                  ? 'bg-stone-700 text-stone-200'
                  : 'bg-emerald-600 text-white shadow-md shadow-emerald-900/30'
              }`}
            >
              {m.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            {/* Bubble */}
            <div className="space-y-2 max-w-[85%] sm:max-w-[80%]">
              <div
                className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-emerald-700 text-white rounded-tr-none'
                    : 'bg-stone-900 border border-stone-800 text-stone-200 rounded-tl-none shadow-md'
                }`}
              >
                <div className="whitespace-pre-wrap">{m.text}</div>

                <div className="mt-2 pt-2 border-t border-stone-800/60 flex items-center justify-between text-[10px] text-stone-400">
                  <span>{m.timestamp}</span>
                  {m.sender === 'ai' && (
                    <button
                      onClick={() => handlePlayTts(m.id, m.text)}
                      disabled={ttsLoadingId === m.id}
                      className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition"
                    >
                      {ttsLoadingId === m.id ? (
                        <RefreshCw className="w-3 h-3 animate-spin" />
                      ) : playingAudioId === m.id ? (
                        <VolumeX className="w-3 h-3 text-rose-400" />
                      ) : (
                        <Volume2 className="w-3 h-3" />
                      )}
                      <span>
                        {ttsLoadingId === m.id
                          ? 'Generasi Suara...'
                          : playingAudioId === m.id
                          ? 'Hentikan'
                          : 'Dengarkan TTS'}
                      </span>
                    </button>
                  )}
                </div>
              </div>

              {/* Structured Output Cards */}
              {m.sender === 'ai' && m.structuredOutput && (
                <div className="space-y-2">
                  {/* Identified Emotion Tag */}
                  {m.structuredOutput.emotionAnalysis && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-950/60 border border-emerald-800/60 rounded-lg text-emerald-300 text-xs font-medium">
                      <span>Emosi Terdeteksi:</span>
                      <strong className="capitalize">{m.structuredOutput.emotionAnalysis}</strong>
                    </div>
                  )}

                  {/* Reflective Questions */}
                  {m.structuredOutput.reflectiveQuestions &&
                    m.structuredOutput.reflectiveQuestions.length > 0 && (
                      <div className="p-3 bg-stone-900/80 rounded-xl border border-stone-800 text-xs space-y-1.5">
                        <p className="font-semibold text-emerald-400 flex items-center gap-1">
                          <HelpCircle className="w-3.5 h-3.5" /> Pertanyaan Reflektif:
                        </p>
                        <ul className="space-y-1 list-disc list-inside text-stone-300">
                          {m.structuredOutput.reflectiveQuestions.map((q, idx) => (
                            <li
                              key={idx}
                              onClick={() => handleSend(q)}
                              className="cursor-pointer hover:text-emerald-300 transition"
                            >
                              "{q}"
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                  {/* Suggested Exercise Launcher */}
                  {(m.structuredOutput.breathingExercise || m.structuredOutput.mindfulnessExercise) && (
                    <div className="p-3 bg-emerald-950/40 border border-emerald-800/50 rounded-xl text-xs flex items-center justify-between">
                      <div className="flex items-center gap-2 text-emerald-300">
                        <Wind className="w-4 h-4 text-emerald-400" />
                        <span>
                          Rekomendasi:{' '}
                          <strong>
                            {m.structuredOutput.breathingExercise || m.structuredOutput.mindfulnessExercise}
                          </strong>
                        </span>
                      </div>
                      <button
                        onClick={() =>
                          onSelectModule(m.structuredOutput?.breathingExercise ? 'breathing' : 'mindfulness')
                        }
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[11px] font-medium transition"
                      >
                        Mulai Latihan
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-stone-400 bg-stone-900/80 p-3 rounded-xl border border-stone-800 w-fit">
            <Bot className="w-4 h-4 text-emerald-400 animate-bounce" />
            <span>LEGA AI sedang merespons dengan tenang...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Preset Chips */}
      <div className="py-2 flex items-center gap-2 overflow-x-auto scrollbar-none text-xs">
        <span className="text-stone-500 text-[11px] shrink-0 font-medium">Contoh Refleksi:</span>
        {PRESET_PROMPTS.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            className="shrink-0 px-3 py-1 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-full border border-stone-700 transition"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="pt-2 flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ceritakan perasaan atau apa yang sedang terjadi..."
          className="flex-1 bg-stone-900 border border-stone-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl px-4 py-3 text-xs sm:text-sm text-stone-100 placeholder-stone-500 outline-none transition"
        />
        <button
          onClick={() => handleSend()}
          disabled={!input.trim() || loading}
          className="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-stone-800 disabled:text-stone-500 text-white rounded-xl text-xs font-semibold transition flex items-center gap-2 shadow-lg shadow-emerald-900/30"
        >
          <span>Kirim</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
