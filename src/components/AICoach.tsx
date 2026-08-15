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
import { VoiceGuideButton } from './VoiceGuideButton';

interface AICoachProps {
  userProfile: UserProfile;
  onOpenCrisis: () => void;
  onSelectModule: (module: string) => void;
}

const FLOW_STEPS = [
  '1. Dengarkan & Terima',
  '2. Pahami Konteks',
  '3. Identifikasi Emosi',
  '4. Kenali Kebutuhan Batin',
  '5. Validasi Penuh Kasih',
  '6. Pertanyaan Reflektif',
  '7. Sadari Tubuh & Napas',
  '8. Latihan Terarah',
  '9. Wawasan & Pembelajaran',
  '10. Langkah Kecil Berikutnya',
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
          'Bagaimana sensasi napas dan tubuhmu saat ini?',
          'Apa satu hal utama yang sedang paling memenuhi pikiranmu?',
        ],
        summaryInsight: 'Mulai dengan menyadari kehadiranmu saat ini dengan lembut.',
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
        text: responseData?.replyText || 'Terima kasih telah berbagi cerita secara jujur.',
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        stage: nextStage,
        structuredOutput: {
          emotionAnalysis: responseData?.identifiedEmotion || undefined,
          reflectiveQuestions: responseData?.reflectiveQuestions || [],
          mindfulnessExercise:
            responseData?.suggestedExercise?.type === 'grounding'
              ? responseData.suggestedExercise.title
              : undefined,
          breathingExercise:
            responseData?.suggestedExercise?.type === 'breathing'
              ? responseData.suggestedExercise.title
              : undefined,
          summaryInsight: responseData?.summaryInsight || undefined,
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
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-5xl mx-auto p-3 sm:p-5 text-white">
      {/* Stage Indicator Header */}
      <div className="bg-sky-950/80 backdrop-blur-md p-3.5 rounded-2xl border border-sky-600/40 mb-3 space-y-2 shadow-lg shadow-sky-950/40">
        <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sky-200 flex items-center gap-1.5 bg-sky-800/80 px-2.5 py-1 rounded-lg border border-sky-500/40">
              <Sparkles className="w-3.5 h-3.5 text-sky-300" /> Tahap {currentStage}/10
            </span>
            <span className="text-sky-100 font-semibold tracking-wide">
              {FLOW_STEPS[currentStage - 1]}
            </span>
          </div>
          <VoiceGuideButton
            text="Selamat datang di sesi pendampingan LEGA AI Coach. Anda berada di ruang aman tanpa penghakiman. Bagikan apa yang sedang Anda rasakan atau alami, dan mari kita uraikan bersama langkah demi langkah secara terarah."
            title="Panduan LEGA AI Coach"
            subtitle="Sesi Dialog Refleksi Terpandu"
            variant="compact"
          />
        </div>
        <div className="w-full bg-sky-900/80 h-2 rounded-full overflow-hidden border border-sky-700/30">
          <div
            className="bg-gradient-to-r from-sky-400 to-cyan-300 h-full transition-all duration-500 rounded-full shadow-sm"
            style={{ width: `${(currentStage / 10) * 100}%` }}
          />
        </div>
      </div>

      {/* Messages Thread */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin scrollbar-thumb-sky-700">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex gap-3 max-w-3xl ${
              m.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
            }`}
          >
            {/* Avatar */}
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 shadow-md ${
                m.sender === 'user'
                  ? 'bg-sky-600 border border-sky-400 text-white shadow-sky-900/40'
                  : 'bg-gradient-to-br from-sky-500 to-cyan-600 text-white shadow-cyan-900/40'
              }`}
            >
              {m.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            {/* Bubble */}
            <div className="space-y-2 max-w-[88%] sm:max-w-[82%]">
              <div
                className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-md ${
                  m.sender === 'user'
                    ? 'bg-sky-600 text-white rounded-tr-none border border-sky-400'
                    : 'bg-sky-950/90 border border-sky-700/60 text-sky-50 rounded-tl-none'
                }`}
              >
                <div className="whitespace-pre-wrap">{m.text}</div>

                <div className="mt-2.5 pt-2 border-t border-sky-800/60 flex items-center justify-between text-[11px] text-sky-300">
                  <span>{m.timestamp}</span>
                  {m.sender === 'ai' && (
                    <button
                      onClick={() => handlePlayTts(m.id, m.text)}
                      disabled={ttsLoadingId === m.id}
                      className="text-sky-300 hover:text-white font-medium flex items-center gap-1.5 transition px-2 py-0.5 rounded-md hover:bg-sky-800/60"
                    >
                      {ttsLoadingId === m.id ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : playingAudioId === m.id ? (
                        <VolumeX className="w-3.5 h-3.5 text-rose-300" />
                      ) : (
                        <Volume2 className="w-3.5 h-3.5" />
                      )}
                      <span>
                        {ttsLoadingId === m.id
                          ? 'Memproses Suara...'
                          : playingAudioId === m.id
                          ? 'Hentikan'
                          : 'Dengarkan Suara'}
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
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-900/80 border border-sky-500/50 rounded-lg text-sky-200 text-xs font-semibold shadow-sm">
                      <span className="text-sky-300">Emosi Terdeteksi:</span>
                      <strong className="capitalize text-white">{m.structuredOutput.emotionAnalysis}</strong>
                    </div>
                  )}

                  {/* Reflective Questions */}
                  {m.structuredOutput.reflectiveQuestions &&
                    m.structuredOutput.reflectiveQuestions.length > 0 && (
                      <div className="p-3.5 bg-sky-950/90 rounded-xl border border-sky-700/60 text-xs space-y-2 shadow-sm">
                        <p className="font-bold text-sky-200 flex items-center gap-1.5">
                          <HelpCircle className="w-4 h-4 text-sky-400" /> Pertanyaan Reflektif:
                        </p>
                        <ul className="space-y-1.5 list-disc list-inside text-sky-100">
                          {m.structuredOutput.reflectiveQuestions.map((q, idx) => (
                            <li
                              key={idx}
                              onClick={() => handleSend(q)}
                              className="cursor-pointer hover:text-sky-300 hover:underline transition py-0.5"
                            >
                              "{q}"
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                  {/* Suggested Exercise Launcher */}
                  {(m.structuredOutput.breathingExercise || m.structuredOutput.mindfulnessExercise) && (
                    <div className="p-3 bg-sky-900/80 border border-sky-600/60 rounded-xl text-xs flex items-center justify-between shadow-sm">
                      <div className="flex items-center gap-2 text-sky-100 font-medium">
                        <Wind className="w-4 h-4 text-sky-300 shrink-0" />
                        <span>
                          Rekomendasi Latihan:{' '}
                          <strong className="text-white">
                            {m.structuredOutput.breathingExercise || m.structuredOutput.mindfulnessExercise}
                          </strong>
                        </span>
                      </div>
                      <button
                        onClick={() =>
                          onSelectModule(m.structuredOutput?.breathingExercise ? 'breathing' : 'mindfulness')
                        }
                        className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-bold transition shadow-sm"
                      >
                        Mulai Latihan
                      </button>
                    </div>
                  )}

                  {/* Summary Insight */}
                  {m.structuredOutput.summaryInsight && (
                    <div className="p-3 bg-cyan-950/70 border border-cyan-700/50 rounded-xl text-xs text-cyan-100 flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-cyan-300 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-cyan-200 block mb-0.5">Wawasan Refleksi:</span>
                        <p>{m.structuredOutput.summaryInsight}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-sky-200 bg-sky-950/80 p-3.5 rounded-xl border border-sky-700/60 w-fit shadow-md">
            <Bot className="w-4 h-4 text-sky-300 animate-bounce" />
            <span>LEGA AI sedang merespons dengan penuh kesadaran...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Preset Chips */}
      <div className="py-2 flex items-center gap-2 overflow-x-auto scrollbar-none text-xs">
        <span className="text-sky-300 text-[11px] shrink-0 font-bold">Contoh Cepat:</span>
        {PRESET_PROMPTS.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            className="shrink-0 px-3 py-1.5 bg-sky-900/90 hover:bg-sky-800 text-sky-100 hover:text-white rounded-full border border-sky-600/60 transition shadow-sm font-medium"
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
          placeholder="Ceritakan apa yang sedang Anda rasakan atau alami saat ini..."
          className="flex-1 bg-sky-950/90 border border-sky-600/70 focus:border-sky-300 focus:ring-1 focus:ring-sky-300 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-sky-400/80 outline-none transition shadow-inner"
        />
        <button
          onClick={() => handleSend()}
          disabled={!input.trim() || loading}
          className="px-5 py-3 bg-sky-600 hover:bg-sky-500 disabled:bg-sky-950 disabled:text-sky-600 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-md shadow-sky-950/50"
        >
          <span>Kirim</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

