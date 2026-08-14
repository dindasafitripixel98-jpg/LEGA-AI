import React, { useState } from 'react';
import {
  HeartPulse,
  BrainCircuit,
  Activity,
  Sparkles,
  ShieldCheck,
  BookOpen,
  Info,
  Apple,
  Moon,
  Dumbbell,
  Users,
  Dna,
  Trees,
  Layers,
  ArrowRight,
  HelpCircle,
  RefreshCw,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { ModuleType } from '../types';
import { emotionBodyKnowledgeReflect } from '../lib/geminiApi';
import { VoiceGuideButton } from './VoiceGuideButton';

interface MindBodyConnectionProps {
  onSelectModule?: (module: ModuleType | string) => void;
  onOpenCrisis?: () => void;
}

interface TopicDetail {
  id: string;
  name: string;
  category: string;
  shortDesc: string;
  symptoms: string[];
  scientificMechanism: string;
  lifestyleTips: string[];
  medicalAdvice: string;
}

const TOPICS: TopicDetail[] = [
  {
    id: 'stress',
    name: 'Stres Berkepanjangan',
    category: 'Sistem Saraf & Hormonal',
    shortDesc: 'Bagaimana aktivasi kronis respon lawan-atau-lari (fight-or-flight) berdampak pada tubuh.',
    symptoms: ['Gangguan tidur', 'Kelelahan fisik', 'Ketegangan otot', 'Sakit kepala', 'Perubahan nafsu makan', 'Penurunan konsentrasi'],
    scientificMechanism: 'Penelitian menunjukkan bahwa stres memicu pelepasan hormon kortisol dan adrenalin melalui aksis HPA (Hypothalamic-Pituitary-Adrenal). Jika berlangsung lama, ketegangan otot dan fluktuasi energi dapat terjadi.',
    lifestyleTips: ['Tidur teratur 7-8 jam', 'Teknik relaksasi / LEGA Breathing', 'Aktivitas fisik ringan harian', 'Jeda dari paparan layar'],
    medicalAdvice: 'Stres adalah salah satu faktor, bukan satu-satunya penyebab. Jika kelelahan atau pusing menetap, tetap diperlukan pemeriksaan dokter.'
  },
  {
    id: 'anxiety',
    name: 'Kecemasan & Somatisasi',
    category: 'Respon Otomatis Saraf',
    shortDesc: 'Sensasi fisik saat kecemasan mengaktifkan sistem saraf simpatis.',
    symptoms: ['Jantung berdebar', 'Napas terasa cepat', 'Perut tidak nyaman', 'Mual', 'Keringat berlebih', 'Gelisah'],
    scientificMechanism: 'Beberapa studi menunjukkan kecemasan mengaktifkan sistem saraf otonom yang mempersiapkan tubuh menghadapi ancaman, memicu perubahan irama napas dan denyut jantung.',
    lifestyleTips: ['Latihan pernapasan lambat (LEGA Breathing)', 'Mengurangi konsumsi kafein', 'Jurnal refleksi kecemasan'],
    medicalAdvice: 'Gejala seperti jantung berdebar atau mual juga dapat disebabkan kondisi medis lain. Evaluasi dokter tetap penting bila gejala berat.'
  },
  {
    id: 'anger',
    name: 'Kemarahan & Tekanan Darah',
    category: 'Vaskular & Saraf',
    shortDesc: 'Fluktuasi sistem vaskular saat mengalami emosi marah yang intens.',
    symptoms: ['Denyut jantung meningkat', 'Tekanan darah sementara naik', 'Otot rahang/tangan tegang', 'Sensasi panas'],
    scientificMechanism: 'Kemarahan intens berkaitan dengan lonjakan mendadak adrenalin yang menyempitkan pembuluh darah secara sementara dan meningkatkan frekuensi jantung.',
    lifestyleTips: ['Berhenti sejenak (Pause) sebelum merespon', 'Pelepasan emosi aman (LEGA Release)', 'Jalan kaki membakar ketegangan'],
    medicalAdvice: 'Mengelola kemarahan adalah salah satu bagian dari gaya hidup sehat, namun bukan pengganti terapi medis hipertensi.'
  },
  {
    id: 'sadness',
    name: 'Kesedihan & Energi Tubuh',
    category: 'Nurotransmiter',
    shortDesc: 'Dampak kesedihan sebagai respons normal manusia terhadap kehilangan.',
    symptoms: ['Energi menurun', 'Penurunan motivasi', 'Perubahan tidur', 'Nafsu makan berubah', 'Sulit fokus'],
    scientificMechanism: 'Kesedihan berhubungan dengan penurunan sementara aktivitas neurotransmiter dopamin dan serotonin, serta peningkatan sitokin inflamasi secara halus.',
    lifestyleTips: ['Paparan sinar matahari pagi', 'Interaksi sosial yang suportif', 'Self-compassion & jurnal emosi'],
    medicalAdvice: 'Kesedihan adalah respon emosional wajar. Namun bila rasa hampa berlangsung lebih dari 2 minggu, konsultasikan ke profesional kesehatan jiwa.'
  },
  {
    id: 'guilt',
    name: 'Rasa Bersalah (Guilt)',
    category: 'Ketegangan Batin',
    shortDesc: 'Beban mental akibat penyesalan atau persepsi kegagalan moral.',
    symptoms: ['Sensasi berat di dada', 'Perut mulas', 'Restlessness', 'Kualitas tidur terganggu'],
    scientificMechanism: 'Rasa bersalah yang disimpan memicu ruminasi pikiran berkepanjangan, menjaga respon stres tingkat rendah tetap aktif di otak.',
    lifestyleTips: ['Latihan memaafkan diri sendiri', 'Eksplorasi jurnal nilai diri', 'Diskusi terbuka bersama AI Coach'],
    medicalAdvice: 'Sensasi fisik berat akibat rasa bersalah bersifat somatis, namun keluhan fisik menetap tetap perlu evaluasi medis.'
  },
  {
    id: 'shame',
    name: 'Rasa Malu (Shame)',
    category: 'Sistem Saraf & Sosial',
    shortDesc: 'Reaksi kecenderungan menarik diri dan persepsi diri tidak cukup baik.',
    symptoms: ['Wajah/tubuh terasa panas', 'Postur tubuh membungkuk', 'Kening tegang', 'Menghindari kontak mata'],
    scientificMechanism: 'Rasa malu mengaktifkan respon ancaman sosial (social threat system) yang sering memicu respon vasodilatasi kulit (blushing) dan dorongan isolasi.',
    lifestyleTips: ['Mindfulness presence (LEGA Presence)', 'Validasi emosi tanpa menghakimi', 'Edukasi penerimaan diri'],
    medicalAdvice: 'Konsultasi psikologi dapat membantu memulihkan luka rasa malu berkepanjangan.'
  },
  {
    id: 'emotional-fatigue',
    name: 'Kelelahan Emosional',
    category: 'Kapasitas Batin',
    shortDesc: 'Kondisi saat kapasitas pengolahan emosi telah melampaui batas harian.',
    symptoms: ['Mudah tersinggung', 'Merasa hampa', 'Sakit kepala tegang', 'Ingin mengisolasi diri'],
    scientificMechanism: 'Terjadi penurunan cadangan glikogen otak dan kejenuhan kortikal akibat mengolah stresor emosional berturut-turut.',
    lifestyleTips: ['Menetapkan batas tegas (boundaries)', 'Istirahat dari stimulasi emosional', 'Somatic body scan'],
    medicalAdvice: 'Istirahat emosional adalah kebutuhan biologis mendasar manusia.'
  },
  {
    id: 'burnout',
    name: 'Burnout (Kelelahan Kronis)',
    category: 'Sistemic Fatigue',
    shortDesc: 'Kelelahan fisik, emosional, dan mental akibat tekanan berkepanjangan.',
    symptoms: ['Kelelahan total', 'Penurunan produktivitas', 'Sinis / Apatis', 'Daya tahan tubuh menurun'],
    scientificMechanism: 'Burnout dihubungkan dengan disregulasi kronis aksis HPA dan kelelahan adrenal fisiologis, berdampak pada fungsi eksekutif otak.',
    lifestyleTips: ['Cuti / Istirahat pemulihan total', 'Evaluasi beban kerja & prioritas', 'Dukungan sosial dan relaksasi'],
    medicalAdvice: 'Burnout membutuhkan restrukturisasi gaya hidup dan bila perlu pendampingan profesional medis/psikologis.'
  },
  {
    id: 'trauma',
    name: 'Respon Trauma & Memori Somatis',
    category: 'Sistem Saraf Otonom',
    shortDesc: 'Jejak pengalaman masa lalu yang tetap tersimpan dalam sistem saraf.',
    symptoms: ['Kewaspadaan berlebih (Hypervigilance)', 'Mudah kaget', 'Ketegangan kronis', 'Mimpi buruk'],
    scientificMechanism: 'Trauma memengaruhi amigdala dan hipokampus, menyebabkan sistem saraf tetap mempersepsikan bahaya meskipun kondisi sudah aman.',
    lifestyleTips: ['Latihan rasa aman (Grounding LEGA)', 'Somatic tracking lembut', 'Orientasi pada ruang saat ini'],
    medicalAdvice: 'Sangat disarankan melakukan pemulihan trauma bersama psikolog atau psikiater terapis trauma.'
  },
  {
    id: 'loneliness',
    name: 'Kesepian & Kesejahteraan',
    category: 'Kebutuhan Sosial',
    shortDesc: 'Dampak kekurangan koneksi emosional yang bermakna.',
    symptoms: ['Perasaan hampa', 'Tidur kurang nyenyak', 'Gelisah di malam hari', 'Kelelahan emosional'],
    scientificMechanism: 'Penelitian menunjukkan kesepian kronis memicu respon biologis serupa dengan stres kronis dan mengganggu persepsi kualitas tidur.',
    lifestyleTips: ['Bergabung dalam komunitas positif', 'Koneksi kecil dengan kerabat', 'Refleksi diri yang hangat'],
    medicalAdvice: 'Koneksi sosial merupakan salah satu pilar pendorong kesehatan yang krusial.'
  },
  {
    id: 'overthinking',
    name: 'Overthinking & Ruminasi',
    category: 'Kognitif & Kepala',
    shortDesc: 'Siklus pikiran berulang yang melelahkan energi mental.',
    symptoms: ['Sakit kepala tegang', 'Mata lelah', 'Perut bergejolak', 'Insomnia'],
    scientificMechanism: 'Overthinking memicu hiperaktivitas pada Default Mode Network (DMN) di otak, menjaga tubuh tetap dalam siaga kognitif.',
    lifestyleTips: ['Jurnal dump (LEGA Journal)', 'Jangkar perhatian napas', 'Teknik pembatasan waktu berpikir'],
    medicalAdvice: 'Overthinking dapat dikelola dengan latihan kognitif dan bantuan profesional bila mengganggu fungsi harian.'
  },
  {
    id: 'panic',
    name: 'Lonjakan Panik (Panic Surge)',
    category: 'Simpatis Akut',
    shortDesc: 'Gelombang cemas mendadak yang memicu respon fisik kuat.',
    symptoms: ['Sensasi sesak napas', 'Jantung berdebar keras', 'Gemetar', 'Takut kehilangan kendali'],
    scientificMechanism: 'Terjadi alarm palsu sistem saraf simpatis yang melepaskan adrenalin dalam jumlah besar dalam hitungan detik.',
    lifestyleTips: ['Grounding 5-4-3-2-1', 'LEGA Breathing pernapasan lambat', 'Menyadari bahwa lonjakan panik akan mereda'],
    medicalAdvice: 'Jika ini pertama kali dialami, lakukan pemeriksaan medis untuk memastikan tidak ada kondisi kardiovaskular akut.'
  }
];

const MULTIFACTORS = [
  { name: 'Emosi & Pikiran', icon: BrainCircuit, color: 'text-rose-400', desc: 'Respon kognitif dan emosional memengaruhi pelepasan hormon dan ketegangan otot.' },
  { name: 'Kualitas Tidur', icon: Moon, color: 'text-indigo-400', desc: 'Tidur 7-8 jam sangat krusial untuk perbaikan jaringan tubuh dan regulasi emosi.' },
  { name: 'Nutrisi & Hidrasi', icon: Apple, color: 'text-emerald-400', desc: 'Asupan gizi seimbang dan hidrasi memengaruhi mikrobioma usus dan energi seluler.' },
  { name: 'Aktivitas Fisik', icon: Dumbbell, color: 'text-amber-400', desc: 'Olahraga teratur melepaskan endorfin dan meredakan ketegangan vaskular.' },
  { name: 'Genetik & Biologi', icon: Dna, color: 'text-teal-400', desc: 'Faktor bawaan memengaruhi kecenderungan fisiologis dan metabolisme tubuh.' },
  { name: 'Lingkungan & Sosial', icon: Users, color: 'text-sky-400', desc: 'Dukungan sosial dan lingkungan yang aman menstabilkan sistem saraf otonom.' }
];

export const MindBodyConnection: React.FC<MindBodyConnectionProps> = ({
  onSelectModule,
  onOpenCrisis
}) => {
  const [activeTab, setActiveTab] = useState<'topics' | 'multifactor' | 'ai-consult'>('topics');
  const [selectedTopic, setSelectedTopic] = useState<TopicDetail>(TOPICS[0]);

  // AI Psychoeducation Form State
  const [userQuery, setUserQuery] = useState<string>('');
  const [reportedSymptoms, setReportedSymptoms] = useState<string>('Tegang bahu & kadang pusing');
  const [hasMedicalCondition, setHasMedicalCondition] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [aiEducationOutput, setAiEducationOutput] = useState<any | null>(null);

  const handleConsultAi = async () => {
    setIsProcessing(true);
    const result = await emotionBodyKnowledgeReflect({
      topicId: selectedTopic.id,
      topicName: selectedTopic.name,
      userQuery: userQuery || `Ingin memahami lebih lanjut tentang ${selectedTopic.name}`,
      reportedPhysicalSymptoms: [reportedSymptoms],
      hasMedicalCondition
    });
    setAiEducationOutput(result);
    setIsProcessing(false);
  };

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-6 text-stone-100">
      {/* Header Banner */}
      <div className="bg-stone-900/90 border border-stone-800 p-5 md:p-6 rounded-3xl space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-rose-950/80 border border-rose-800 text-rose-400 rounded-2xl">
              <HeartPulse className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-stone-100 flex items-center gap-2">
                LEGA Emotion & Body Knowledge
                <span className="text-xs bg-rose-900/80 text-rose-300 px-2.5 py-0.5 rounded-full border border-rose-700 font-mono">
                  v1.0
                </span>
              </h2>
              <p className="text-xs text-stone-400 mt-0.5">
                Edukasi ilmiah mengenai hubungan interaktif antara emosi, pikiran, gaya hidup, dan tubuh
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <VoiceGuideButton
              text="Selamat datang di modul Koneksi Pikiran & Tubuh LEGA. Emosi, pikiran, dan tubuh saling berbicara setiap detik. Memahami respon biologis tubuh terhadap stres dan emosi membantu kita menyayangi diri dengan lebih bijaksana."
              title="Panduan Mind & Body Knowledge"
              subtitle="Edukasi Ilmiah Psikosomatis"
              variant="pill"
            />
            {/* Nav Mode Tabs */}
            <div className="flex bg-stone-950 border border-stone-800 rounded-2xl p-1 gap-1 text-xs">
            <button
              onClick={() => setActiveTab('topics')}
              className={`px-3 py-1.5 rounded-xl font-semibold transition flex items-center gap-1.5 ${
                activeTab === 'topics'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>12 Topik Edukasi</span>
            </button>
            <button
              onClick={() => setActiveTab('multifactor')}
              className={`px-3 py-1.5 rounded-xl font-semibold transition flex items-center gap-1.5 ${
                activeTab === 'multifactor'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Prinsip Multtfaktorial</span>
            </button>
            <button
              onClick={() => setActiveTab('ai-consult')}
              className={`px-3 py-1.5 rounded-xl font-semibold transition flex items-center gap-1.5 ${
                activeTab === 'ai-consult'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Tanya AI Edukator</span>
            </button>
          </div>
        </div>
      </div>

        {/* Non-Medical Disclaimer Banner */}
        <div className="p-3.5 bg-amber-950/40 border border-amber-800/60 rounded-2xl text-[11px] text-amber-200 space-y-1.5 leading-relaxed">
          <div className="flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-amber-300">Penegasan Edukatif & Non-Diagnosis:</strong> Modul ini BUKAN alat diagnosis, BUKAN alat skrining penyakit, dan BUKAN pengganti konsultasi tenaga kesehatan. Kesehatan dipengaruhi oleh banyak faktor (emosi, tidur, nutrisi, olahraga, genetik, lingkungan). Emosi adalah salah satu faktor, bukan satu-satunya penyebab penyakit.
            </div>
          </div>
        </div>
      </div>

      {/* Mode 1: 12 Topik Edukasi */}
      {activeTab === 'topics' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
          {/* Topic List Selector */}
          <div className="lg:col-span-5 space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-rose-400" /> Pilih Topik Psikoedukasi Ilmiah:
            </h3>
            <div className="space-y-1.5 max-h-[580px] overflow-y-auto pr-1">
              {TOPICS.map((topic) => {
                const isSelected = selectedTopic.id === topic.id;
                return (
                  <button
                    key={topic.id}
                    onClick={() => setSelectedTopic(topic)}
                    className={`w-full p-3.5 rounded-2xl border text-left transition flex items-center justify-between ${
                      isSelected
                        ? 'bg-rose-950/80 border-rose-500 text-rose-200 ring-1 ring-rose-500 shadow-md'
                        : 'bg-stone-900 border-stone-800 text-stone-300 hover:border-stone-700'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] bg-stone-950 text-rose-300 px-2 py-0.5 rounded border border-stone-800 font-semibold">
                          {topic.category}
                        </span>
                      </div>
                      <h4 className="font-bold text-xs text-stone-100">{topic.name}</h4>
                      <p className="text-[10px] text-stone-400 line-clamp-1">{topic.shortDesc}</p>
                    </div>
                    {isSelected && <span className="text-xs text-rose-400 font-bold ml-2">✓</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Topic Detail View */}
          <div className="lg:col-span-7 bg-stone-900/90 p-6 md:p-8 rounded-3xl border border-stone-800 space-y-6 shadow-xl">
            <div className="space-y-2 border-b border-stone-800 pb-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 bg-rose-950 border border-rose-800 text-rose-300 rounded-full text-xs font-semibold">
                  {selectedTopic.category}
                </span>
                <VoiceGuideButton
                  text={`Topik: ${selectedTopic.name}. ${selectedTopic.shortDesc}. Mekanisme biologis: ${selectedTopic.scientificMechanism}. Rekomendasi gaya hidup: ${selectedTopic.lifestyleTips.join(', ')}.`}
                  title={`Edukasi: ${selectedTopic.name}`}
                  subtitle="Penjelasan Biologis & Gaya Hidup"
                  variant="compact"
                />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-stone-100">
                {selectedTopic.name}
              </h3>
              <p className="text-xs text-stone-300 leading-relaxed">
                {selectedTopic.shortDesc}
              </p>
            </div>

            {/* Reported Symptoms / Sensations */}
            <div className="space-y-2">
              <h4 className="font-bold text-xs text-stone-300 uppercase tracking-wider flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-amber-400" /> Gejala & Sensasi Fisik Relevan:
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedTopic.symptoms.map((sym, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 bg-stone-950 border border-stone-800 text-rose-200 text-xs rounded-lg font-medium"
                  >
                    {sym}
                  </span>
                ))}
              </div>
            </div>

            {/* Scientific Mechanism */}
            <div className="p-4 bg-stone-950 border border-stone-800 rounded-2xl space-y-2">
              <h4 className="font-bold text-xs text-rose-300 flex items-center gap-1.5">
                <Info className="w-4 h-4 text-rose-400" /> Penjelasan Mekanisme Biologis & Saraf:
              </h4>
              <p className="text-xs text-stone-300 leading-relaxed italic">
                "{selectedTopic.scientificMechanism}"
              </p>
            </div>

            {/* Evidence-Based Lifestyle Interventions */}
            <div className="space-y-2">
              <h4 className="font-bold text-xs text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                <Apple className="w-4 h-4 text-emerald-400" /> Intervensi Gaya Hidup Berbasis Bukti:
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {selectedTopic.lifestyleTips.map((tip, idx) => (
                  <li key={idx} className="p-2.5 bg-stone-950 border border-stone-800 rounded-xl text-stone-300 flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Medical Consultation Note */}
            <div className="p-3.5 bg-amber-950/30 border border-amber-800/50 rounded-xl text-[11px] text-amber-200 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong>Catatan Penting Tenaga Kesehatan:</strong> {selectedTopic.medicalAdvice}
              </div>
            </div>

            {/* Quick Connected Module Buttons */}
            <div className="pt-3 border-t border-stone-800 space-y-2">
              <p className="text-xs font-bold text-stone-300">Latihan LEGA Terkait Untuk Topik Ini:</p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => onSelectModule && onSelectModule('body-awareness')}
                  className="px-3 py-1.5 bg-stone-950 hover:bg-stone-800 border border-stone-800 text-rose-300 rounded-xl text-xs font-semibold transition"
                >
                  LEGA Body Awareness
                </button>
                <button
                  onClick={() => onSelectModule && onSelectModule('breathing')}
                  className="px-3 py-1.5 bg-stone-950 hover:bg-stone-800 border border-stone-800 text-emerald-300 rounded-xl text-xs font-semibold transition"
                >
                  LEGA Breathing
                </button>
                <button
                  onClick={() => onSelectModule && onSelectModule('ai-coach')}
                  className="px-3 py-1.5 bg-stone-950 hover:bg-stone-800 border border-stone-800 text-amber-300 rounded-xl text-xs font-semibold transition"
                >
                  LEGA AI Coach
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mode 2: Prinsip Multifaktorial */}
      {activeTab === 'multifactor' && (
        <div className="bg-stone-900/90 border border-stone-800 p-6 md:p-8 rounded-3xl space-y-6 animate-fade-in">
          <div className="space-y-2 max-w-2xl">
            <h3 className="text-lg font-bold text-stone-100 flex items-center gap-2">
              <Layers className="w-5 h-5 text-rose-400" />
              <span>Prinsip Kesehatan Multifaktorial</span>
            </h3>
            <p className="text-xs text-stone-300 leading-relaxed">
              Kesehatan fisik dan batin manusia tidak disebabkan oleh satu faktor tunggal. Penyakit maupun kesehatan merupakan hasil dari interaksi kompleks antara 6 pilar utama:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {MULTIFACTORS.map((factor, idx) => {
              const IconComp = factor.icon;
              return (
                <div key={idx} className="p-5 bg-stone-950 border border-stone-800 rounded-2xl space-y-3">
                  <div className="p-3 bg-stone-900 rounded-xl w-fit border border-stone-800">
                    <IconComp className={`w-6 h-6 ${factor.color}`} />
                  </div>
                  <h4 className="font-bold text-sm text-stone-100">{factor.name}</h4>
                  <p className="text-xs text-stone-400 leading-relaxed">{factor.desc}</p>
                </div>
              );
            })}
          </div>

          <div className="p-4 bg-stone-950 border border-stone-800 rounded-2xl text-xs text-stone-300 space-y-2">
            <h4 className="font-bold text-rose-300 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-rose-400" /> Panduan Pemahaman Berbasis Bukti:
            </h4>
            <p className="leading-relaxed">
              LEGA tidak pernah mengklaim bahwa "semua penyakit disebabkan oleh emosi" atau "jika emosi dilepaskan maka penyakit pasti sembuh". Pengelolaan emosi adalah bagian dari gaya hidup sehat holistik yang mendukung pemulihan tubuh bersama dengan perawatan medis yang tepat.
            </p>
          </div>
        </div>
      )}

      {/* Mode 3: Tanya AI Edukator */}
      {activeTab === 'ai-consult' && (
        <div className="bg-stone-900/90 border border-stone-800 p-6 md:p-8 rounded-3xl space-y-6 animate-fade-in">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-stone-100 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-rose-400" />
              <span>Konsultasi Psikoedukasi Ilmiah Bersama AI</span>
            </h3>
            <p className="text-xs text-stone-400">
              Tanyakan kaitan ilmiah antara topik emosi, gaya hidup, dan gejala fisik yang ingin Anda pelajari:
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="space-y-2">
              <label className="font-semibold text-stone-300">
                Pertanyaan / Topik Yang Ingin Anda Pelajari:
              </label>
              <textarea
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                placeholder="Contoh: Kenapa saat cemas asam lambung atau perut saya terasa mual?"
                rows={3}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-stone-100 outline-none focus:border-rose-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="font-semibold text-stone-300">
                  Sensasi Fisik Yang Terasa (Opsional):
                </label>
                <input
                  type="text"
                  value={reportedSymptoms}
                  onChange={(e) => setReportedSymptoms(e.target.value)}
                  placeholder="Contoh: Pusing, bahu tegang, perut kembung"
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-stone-100 outline-none focus:border-rose-500"
                />
              </div>

              <div className="p-3 bg-stone-950 border border-stone-800 rounded-xl space-y-2 flex flex-col justify-center">
                <label className="flex items-center gap-2 cursor-pointer text-stone-300">
                  <input
                    type="checkbox"
                    checked={hasMedicalCondition}
                    onChange={(e) => setHasMedicalCondition(e.target.checked)}
                    className="accent-rose-500 rounded"
                  />
                  <span>Saya sedang menjalani pengobatan medis dari dokter</span>
                </label>
                {hasMedicalCondition && (
                  <p className="text-[10px] text-amber-300 italic">
                    *AI akan mengingatkan untuk tetap mematuhi petunjuk medis dokter Anda.
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-center pt-2">
              <button
                onClick={handleConsultAi}
                disabled={isProcessing || !userQuery.trim()}
                className="px-8 py-3 bg-rose-600 hover:bg-rose-500 disabled:bg-stone-800 text-white font-bold rounded-2xl text-xs sm:text-sm transition inline-flex items-center gap-2 shadow-xl shadow-rose-950/50"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Menganalisis Bukti Ilmiah...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Dapatkan Psikoedukasi LEGA AI</span>
                  </>
                )}
              </button>
            </div>

            {/* AI Output Card */}
            {aiEducationOutput && (
              <div className="p-6 bg-stone-950 border border-stone-800 rounded-2xl space-y-5 animate-fade-in text-left mt-6">
                <div className="space-y-2 border-b border-stone-800 pb-3">
                  <p className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" /> Ringkasan Edukasi Ilmiah LEGA
                  </p>
                  <p className="text-xs text-stone-200 leading-relaxed">
                    {aiEducationOutput.educationalSummary}
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-rose-400" /> Penjelasan Mekanisme Biologis & Saraf
                  </p>
                  <p className="text-xs text-stone-300 italic leading-relaxed bg-stone-900/90 p-4 rounded-xl border border-stone-800">
                    "{aiEducationOutput.mindBodyMechanism}"
                  </p>
                </div>

                {aiEducationOutput.lifestyleInterventions && (
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                      <Apple className="w-3.5 h-3.5 text-emerald-400" /> Rekomendasi Gaya Hidup Berbasis Bukti:
                    </p>
                    <ul className="space-y-1.5 text-xs text-stone-300">
                      {aiEducationOutput.lifestyleInterventions.map((item: string, idx: number) => (
                        <li key={idx} className="p-2 bg-stone-900 rounded-lg border border-stone-800 flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {aiEducationOutput.medicalConsultationAdvice && (
                  <div className="p-3 bg-amber-950/40 border border-amber-800/60 rounded-xl text-xs text-amber-200">
                    <strong>Peringatan Kesehatan:</strong> {aiEducationOutput.medicalConsultationAdvice}
                  </div>
                )}

                {/* Connected Next Modules */}
                <div className="pt-3 border-t border-stone-800 space-y-3">
                  <p className="text-xs font-bold text-stone-300 flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-rose-400" /> Rekomendasi Modul LEGA Terhubung:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                    {aiEducationOutput.recommendedNextModules && Array.isArray(aiEducationOutput.recommendedNextModules) ? (
                      aiEducationOutput.recommendedNextModules.map((mod: any, idx: number) => (
                        <div key={idx} className="p-3 bg-stone-900 border border-stone-800 rounded-xl space-y-1 text-left">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-rose-300">{mod.moduleName}</span>
                            <button
                              onClick={() => onSelectModule && onSelectModule(mod.targetModuleKey || 'body-awareness')}
                              className="px-2 py-0.5 bg-rose-600 hover:bg-rose-500 text-white text-[10px] rounded font-semibold transition"
                            >
                              Buka
                            </button>
                          </div>
                          <p className="text-[10px] text-stone-400 line-clamp-2">{mod.reason}</p>
                        </div>
                      ))
                    ) : (
                      <>
                        <button
                          onClick={() => onSelectModule && onSelectModule('body-awareness')}
                          className="p-3 bg-stone-900 border border-stone-800 rounded-xl text-left hover:border-rose-700 transition"
                        >
                          <p className="font-bold text-xs text-rose-300">LEGA Body Awareness</p>
                          <p className="text-[10px] text-stone-400 mt-0.5">Pengamatan somatis tanpa vonis</p>
                        </button>
                        <button
                          onClick={() => onSelectModule && onSelectModule('breathing')}
                          className="p-3 bg-stone-900 border border-stone-800 rounded-xl text-left hover:border-rose-700 transition"
                        >
                          <p className="font-bold text-xs text-rose-300">LEGA Breathing</p>
                          <p className="text-[10px] text-stone-400 mt-0.5">Latihan pernapasan jangkar</p>
                        </button>
                        <button
                          onClick={() => onSelectModule && onSelectModule('ai-coach')}
                          className="p-3 bg-stone-900 border border-stone-800 rounded-xl text-left hover:border-rose-700 transition"
                        >
                          <p className="font-bold text-xs text-rose-300">LEGA AI Coach</p>
                          <p className="text-[10px] text-stone-400 mt-0.5">Diskusi mendalam bersama AI</p>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
