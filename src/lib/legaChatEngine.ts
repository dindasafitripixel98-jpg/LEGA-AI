// LEGA AI Coach Dynamic Response Engine
// Strictly implements the 10 Mandatory Rules for Personalized, Emotion-First Contextual Dialogue
// SHAQILA DIGITAL 99

import { ModuleType } from '../types';

export interface LegaChatResponse {
  replyText: string;
  identifiedEmotion: string | null;
  reflectiveQuestions: string[];
  suggestedExercise: {
    type: 'breathing' | 'grounding' | 'journal' | 'none';
    title: string;
    description: string;
  };
  suggestedModuleKey?: ModuleType;
  suggestedModuleName?: string;
  summaryInsight: string;
}

interface EmotionRuleConfig {
  key: string;
  displayName: string;
  targetModuleKey: ModuleType;
  moduleName: string;
  exerciseType: 'breathing' | 'grounding' | 'journal';
  exerciseTitle: string;
  exerciseDesc: string;
  singleWordFollowUp: string;
  detailedResponseGenerator: (userName: string, contextDetail: string) => string;
  primaryReflectiveQuestion: string;
  secondaryOpenQuestion: string;
  summaryInsight: string;
}

const EMOTION_CONFIGS: Record<string, EmotionRuleConfig> = {
  kecewa: {
    key: 'kecewa',
    displayName: 'kecewa',
    targetModuleKey: 'emotional-release',
    moduleName: 'LEGA Release — Melepaskan Kekecewaan',
    exerciseType: 'journal',
    exerciseTitle: 'LEGA Release: Mengurai Harapan & Kekecewaan',
    exerciseDesc: 'Tuliskan apa yang Anda harapkan dan apa yang sebenarnya terjadi, lalu ambil satu napas pembebasan perlahan.',
    singleWordFollowUp: 'Mari kita beri ruang sejenak bagi rasa kecewa ini tanpa perlu menghakiminya. Bagaimana sensasi di tubuh Anda saat perasaan ini hadir, dan apa yang membuat rasa kecewa ini muncul?',
    detailedResponseGenerator: (userName: string, contextDetail: string) =>
      `Terima kasih sudah menceritakannya, ${userName}. Saya memahami bahwa saat ini Anda sedang merasa kecewa${contextDetail ? ` mengenai hal tersebut` : ''}. Kekecewaan adalah perasaan yang wajar saat kenyataan tidak berjalan sejalan dengan harapan yang Anda simpan. Mari kita tarik napas perlahan dan sadari sensasi di area dada dan bahu saat ini. Izinkan rasa kecewa ini hadir apa adanya sejenak tanpa terburu-buru melawannya.`,
    primaryReflectiveQuestion: 'Harapan apa yang paling berharga bagi Anda yang terasa belum terpenuhi dalam situasi ini?',
    secondaryOpenQuestion: 'Apakah selain rasa kecewa, ada perasaan lain yang juga Anda rasakan saat ini?',
    summaryInsight: 'Kekecewaan menunjukkan adanya hal yang sangat Anda pedulikan; menerima kenyataan adalah awal untuk memulihkan kedamaian batin.',
  },

  marah: {
    key: 'marah',
    displayName: 'marah',
    targetModuleKey: 'anger',
    moduleName: 'LEGA Anger — Mengenali & Mengelola Kemarahan',
    exerciseType: 'breathing',
    exerciseTitle: 'LEGA Release: Hembusan Napas Pereda Tekanan (Sigh of Relief)',
    exerciseDesc: 'Tarik napas dalam lewat hidung, lalu hembuskan panjang lewat mulut sambil melemaskan rahang dan bahu.',
    singleWordFollowUp: 'Mari kita beri jeda sejenak untuk mengamati rasa marah ini. Sadari di bagian tubuh mana panas atau ketegangan terasa paling kuat saat ini, dan apa pemicu utama yang membuat Anda merasa marah?',
    detailedResponseGenerator: (userName: string, contextDetail: string) =>
      `Terima kasih sudah menceritakannya, ${userName}. Saya memahami bahwa saat ini Anda sedang merasa marah${contextDetail ? ` terhadap situasi tersebut` : ''}. Rasa marah adalah sinyal alami ketika ada batasan diri, keadilan, atau nilai penting yang terasa dilanggar. Kita tidak perlu menekan rasa marah ini. Mari kita ambil jeda sejenak, lemaskan rahang, dan rasakan pijakan kaki Anda di lantai dengan mantap.`,
    primaryReflectiveQuestion: 'Batasan diri atau nilai penting apa yang terasa terusik dalam peristiwa ini?',
    secondaryOpenQuestion: 'Apakah selain rasa marah, ada perasaan lain yang juga Anda rasakan saat ini?',
    summaryInsight: 'Kemarahan membawa pesan tentang hal yang berharga bagi Anda; memberi jeda membantu Anda merespons dengan bijak.',
  },

  cemas: {
    key: 'cemas',
    displayName: 'cemas',
    targetModuleKey: 'anxiety',
    moduleName: 'LEGA Anxiety — Regulasi Kecemasan & Menemukan Jangkar',
    exerciseType: 'breathing',
    exerciseTitle: 'LEGA Breathing: Pernapasan Penenang Saraf (4-2-6)',
    exerciseDesc: 'Tarik napas 4 detik, tahan santai 2 detik, hembuskan perlahan 6 detik untuk menstabilkan sistem saraf.',
    singleWordFollowUp: 'Anda berada di ruang yang aman saat ini. Sadari bagaimana ritme napas dan detak jantung Anda sekarang, dan hal apa yang paling memicu kekhawatiran tersebut?',
    detailedResponseGenerator: (userName: string, contextDetail: string) =>
      `Terima kasih sudah menceritakannya, ${userName}. Saya memahami bahwa saat ini Anda sedang merasa cemas${contextDetail ? ` menghadapi hal tersebut` : ''}. Kecemasan adalah cara tubuh dan pikiran bersiap menghadapi ketidakpastian. Anda aman saat ini. Mari kembali ke saat ini bersama hembusan napas yang mengalir lembut, melepaskan ketegangan di leher dan pundak.`,
    primaryReflectiveQuestion: 'Dari hal-hal yang sedang Anda cemaskan, bagian mana yang saat ini benar-benar berada dalam kendali langsung Anda?',
    secondaryOpenQuestion: 'Apakah selain rasa cemas, ada perasaan lain yang juga Anda rasakan saat ini?',
    summaryInsight: 'Kecemasan sering melihat masa depan yang belum terjadi; menjangkarkan diri pada napas saat ini memulihkan kendali diri.',
  },

  sedih: {
    key: 'sedih',
    displayName: 'sedih',
    targetModuleKey: 'sadness',
    moduleName: 'LEGA Sadness — Merawat Kesedihan dengan Kelembutan',
    exerciseType: 'grounding',
    exerciseTitle: 'LEGA Presence: Sentuhan Welas Asih pada Diri',
    exerciseDesc: 'Letakkan satu tangan di dada, rasakan kehangatan telapak tangan, dan berikan izin pada diri untuk beristirahat.',
    singleWordFollowUp: 'Tidak apa-apa untuk merasa sedih dan tidak perlu buru-buru menghilangkannya. Sadari bagaimana sensasi di dada atau kelopak mata Anda saat ini, dan apa yang sedang terasa paling berat di hati Anda?',
    detailedResponseGenerator: (userName: string, contextDetail: string) =>
      `Terima kasih sudah menceritakannya, ${userName}. Saya memahami bahwa saat ini Anda sedang merasa sedih. Kesedihan adalah bukti bahwa Anda memiliki hati yang tulus dan menghargai sesuatu yang bermakna. Anda tidak harus selalu kuat setiap saat. Izinkan diri Anda untuk beristirahat dan menerima rasa sedih ini dengan penuh kelembutan.`,
    primaryReflectiveQuestion: 'Apa satu hal yang paling dibutuhkan oleh batin dan tubuh Anda saat ini untuk merasa lebih nyaman?',
    secondaryOpenQuestion: 'Apakah selain rasa sedih, ada perasaan lain yang juga Anda rasakan saat ini?',
    summaryInsight: 'Memberi ruang bagi kesedihan tanpa penghakiman adalah bentuk belas kasih terdalam pada diri sendiri.',
  },

  takut: {
    key: 'takut',
    displayName: 'takut',
    targetModuleKey: 'fear',
    moduleName: 'LEGA Fear — Menghadapi Ketakutan dengan Aman',
    exerciseType: 'breathing',
    exerciseTitle: 'LEGA Breathing: Grounding Jangkar Aman',
    exerciseDesc: 'Rasakan sentuhan kedua telapak kaki di lantai dan tarik napas perlahan sambil menyadari bahwa Anda berada di tempat yang aman.',
    singleWordFollowUp: 'Rasa takut adalah respon alami saat kita merasa terancam atau tidak pasti. Apa yang saat ini paling membuat Anda merasa takut atau khawatir?',
    detailedResponseGenerator: (userName: string, contextDetail: string) =>
      `Terima kasih sudah menceritakannya, ${userName}. Saya memahami bahwa saat ini Anda sedang merasa takut${contextDetail ? ` terhadap situasi tersebut` : ''}. Rasa takut hadir untuk melindungi kita, namun terkadang ia membesar melebihi kenyataannya. Anda tidak sendirian di sini. Mari kita amati bersama rasa takut ini dari titik pijak yang tenang dan aman.`,
    primaryReflectiveQuestion: 'Dukungan atau hal apa yang bisa membantu Anda merasa sedikit lebih aman dan tenang saat ini?',
    secondaryOpenQuestion: 'Apakah selain rasa takut, ada perasaan lain yang juga Anda rasakan saat ini?',
    summaryInsight: 'Keberanian hadir bukan saat rasa takut hilang, melainkan saat kita mampu melangkah perlahan bersama kesadaran napas.',
  },

  stres: {
    key: 'stres',
    displayName: 'stres',
    targetModuleKey: 'stress',
    moduleName: 'LEGA Stress — Meredakan Tekanan & Beban',
    exerciseType: 'breathing',
    exerciseTitle: 'LEGA Breathing: Jeda Relaksasi 3 Menit',
    exerciseDesc: 'Tarik napas seimbang 4 detik, lalu hembuskan 4 detik secara teratur untuk menurunkan kadar ketegangan tubuh.',
    singleWordFollowUp: 'Beban dan tekanan memang bisa membuat pikiran dan tubuh terasa sangat kencang. Apa sumber tekanan utama yang sedang paling membebani Anda saat ini?',
    detailedResponseGenerator: (userName: string, contextDetail: string) =>
      `Terima kasih sudah menceritakannya, ${userName}. Saya memahami bahwa saat ini Anda sedang merasa stres karena banyaknya tuntutan yang dihadapi. Tubuh dan pikiran Anda telah bekerja sangat keras. Sekarang, izinkan diri Anda untuk meletakkan sejenak beban tersebut selama beberapa menit ke depan untuk memulihkan ruang batin.`,
    primaryReflectiveQuestion: 'Dari seluruh beban yang ada, apa 1 hal kecil yang bisa Anda beri jeda atau selesaikan terlebih dahulu?',
    secondaryOpenQuestion: 'Apakah selain rasa stres, ada perasaan lain yang juga Anda rasakan saat ini?',
    summaryInsight: 'Istirahat bukan bentuk kegagalan, melainkan cara bijak merawat energi agar dapat melangkah lebih jernih.',
  },

  lelah: {
    key: 'lelah',
    displayName: 'lelah mental / lelah fisik',
    targetModuleKey: 'body-awareness',
    moduleName: 'LEGA Body Awareness — Pemulihan Energi & Relaksasi Tubuh',
    exerciseType: 'grounding',
    exerciseTitle: 'LEGA Body Awareness: Pelepasan Ketegangan Menyeluruh',
    exerciseDesc: 'Tutup mata sejenak, pindai sensasi di kepala, leher, dan bahu, lalu biarkan gravitasi menopang tubuh Anda sepenuhnya.',
    singleWordFollowUp: 'Mengakui rasa lelah adalah langkah awal yang sangat berharga. Bentuk kelelahan seperti apa yang paling Anda rasakan saat ini, apakah fisik, emosional, atau pikiran?',
    detailedResponseGenerator: (userName: string, contextDetail: string) =>
      `Terima kasih sudah menceritakannya, ${userName}. Saya memahami bahwa saat ini Anda sedang merasa lelah. Tubuh dan batin Anda sedang mengirimkan pesan jujur bahwa kapasitas energi Anda perlu dipulihkan. Anda berhak untuk beristirahat tanpa rasa bersalah.`,
    primaryReflectiveQuestion: 'Bentuk jeda atau istirahat sederhana apa yang paling dibutuhkan tubuh Anda hari ini?',
    secondaryOpenQuestion: 'Apakah selain rasa lelah, ada perasaan lain yang juga Anda rasakan saat ini?',
    summaryInsight: 'Menghormati batas kapasitas tubuh adalah bentuk kasih sayang dan perlindungan terbaik bagi diri sendiri.',
  },

  overthinking: {
    key: 'overthinking',
    displayName: 'overthinking',
    targetModuleKey: 'overthinking',
    moduleName: 'LEGA Overthinking — Memilah Fakta & Menjernihkan Pikiran',
    exerciseType: 'grounding',
    exerciseTitle: 'LEGA Observer: Menjeda Arus Pikiran',
    exerciseDesc: 'Amati pikiran yang berputar sebagai suara latar tanpa perlu masuk ke dalam ceritanya, kembali rasakan napas masuk dan keluar.',
    singleWordFollowUp: 'Pikiran yang berputar terus-menerus memang sangat menguras tenaga. Pikiran atau skenario apa yang sedang paling sering berulang di kepala Anda saat ini?',
    detailedResponseGenerator: (userName: string, contextDetail: string) =>
      `Terima kasih sudah menceritakannya, ${userName}. Saya memahami bahwa saat ini Anda sedang mengalami overthinking. Otak kita sering kali mencoba mencari kepastian dengan memikirkan semua kemungkinan. Ingatlah bahwa tidak semua yang dipikirkan adalah fakta nyata. Mari kita kembali ke saat ini dan memijak kenyataan dengan tenang.`,
    primaryReflectiveQuestion: 'Manakah dari pikiran tersebut yang merupakan fakta nyata saat ini, dan mana yang sekadar kekhawatiran masa depan?',
    secondaryOpenQuestion: 'Apakah selain overthinking, ada perasaan emosional lain yang menyertainya saat ini?',
    summaryInsight: 'Pikiran adalah peristiwa mental yang datang dan pergi; Anda adalah ruang hening dan jernih di baliknya.',
  },

  bersalah: {
    key: 'bersalah',
    displayName: 'bersalah (guilt)',
    targetModuleKey: 'guilt',
    moduleName: 'LEGA Guilt — Memahami Tanggung Jawab & Memaafkan Diri',
    exerciseType: 'journal',
    exerciseTitle: 'LEGA Forgiveness: Refleksi Penerimaan Diri',
    exerciseDesc: 'Akui ketidaksempurnaan manusiawi, pisahkan antara kesalahan tindakan dan keberhargaan diri Anda seutuhnya.',
    singleWordFollowUp: 'Rasa bersalah sering kali membawa beban berat di dada. Apa yang membuat Anda merasa bersalah saat ini, dan apa yang sebenarnya Anda harapkan dari diri Anda?',
    detailedResponseGenerator: (userName: string, contextDetail: string) =>
      `Terima kasih sudah menceritakannya, ${userName}. Saya memahami bahwa saat ini Anda sedang merasa bersalah. Rasa bersalah menunjukkan bahwa Anda memiliki nilai moral dan kepedulian yang tinggi. Namun, menyiksa diri tidak akan memperbaiki keadaan. Mari kita pisahkan antara hal yang bisa diperbaiki dengan penerimaan bahwa setiap manusia bisa berproses dari kekhilafan.`,
    primaryReflectiveQuestion: 'Langkah perbaikan kecil apa yang berada dalam kendali Anda, atau apakah ini saatnya memperlakukan diri dengan belas kasih?',
    secondaryOpenQuestion: 'Apakah selain rasa bersalah, ada perasaan lain yang juga Anda rasakan saat ini?',
    summaryInsight: 'Rasa bersalah mengingatkan kita pada nilai hidup; memaafkan diri memberi kita kesempatan untuk tumbuh lebih baik.',
  },

  malu: {
    key: 'malu',
    displayName: 'malu (shame)',
    targetModuleKey: 'shame',
    moduleName: 'LEGA Shame — Memulihkan Rasa Berharga Diri',
    exerciseType: 'grounding',
    exerciseTitle: 'LEGA Presence: Mengakui Keberhargaan Diri Sejati',
    exerciseDesc: 'Sadari bahwa kesalahan atau penilaian luar tidak menentukan nilai sejati diri Anda sebagai manusia.',
    singleWordFollowUp: 'Rasa malu bisa membuat kita ingin bersembunyi atau menarik diri. Anda berada di tempat yang aman tanpa penghakiman. Apa yang memicu rasa malu tersebut?',
    detailedResponseGenerator: (userName: string, contextDetail: string) =>
      `Terima kasih sudah menceritakannya, ${userName}. Saya memahami bahwa saat ini Anda sedang merasa malu. Rasa malu sering membuat kita merasa kurang berharga atau takut dinilai orang lain. Sadarilah bahwa satu peristiwa atau pandangan orang lain tidak mendefinisikan jati diri Anda seutuhnya. Anda berharga apa adanya.`,
    primaryReflectiveQuestion: 'Bagaimana Anda bisa bersikap seperti sahabat terbaik yang penuh pengertian kepada diri Anda sendiri saat ini?',
    secondaryOpenQuestion: 'Apakah selain rasa malu, ada perasaan lain yang juga Anda rasakan saat ini?',
    summaryInsight: 'Rasa malu melemah saat diungkapkan di ruang yang aman dan dibalut dengan penerimaan diri tanpa syarat.',
  },
};

// Precise emotion detector that checks exact words, single word triggers, and natural statements
function detectUserEmotion(rawText: string): { matchedKey: string | null; isSingleWord: boolean } {
  const text = (rawText || '').trim().toLowerCase();
  if (!text) return { matchedKey: null, isSingleWord: false };

  // Remove trailing punctuation
  const cleanSingle = text.replace(/^[!?,.\s]+|[!?,.\s]+$/g, '');

  // 1. Single Word Check
  if (cleanSingle === 'kecewa' || cleanSingle === 'kecewaa' || cleanSingle === 'patah hati') {
    return { matchedKey: 'kecewa', isSingleWord: true };
  }
  if (cleanSingle === 'marah' || cleanSingle === 'kesal' || cleanSingle === 'jengkel' || cleanSingle === 'geram') {
    return { matchedKey: 'marah', isSingleWord: true };
  }
  if (cleanSingle === 'cemas' || cleanSingle === 'anxiety' || cleanSingle === 'gelisah' || cleanSingle === 'khawatir' || cleanSingle === 'was-was' || cleanSingle === 'panik') {
    return { matchedKey: 'cemas', isSingleWord: true };
  }
  if (cleanSingle === 'sedih' || cleanSingle === 'sedihh' || cleanSingle === 'menangis' || cleanSingle === 'nangis') {
    return { matchedKey: 'sedih', isSingleWord: true };
  }
  if (cleanSingle === 'takut' || cleanSingle === 'takutt' || cleanSingle === 'ngeri' || cleanSingle === 'gugup') {
    return { matchedKey: 'takut', isSingleWord: true };
  }
  if (cleanSingle === 'stres' || cleanSingle === 'stress' || cleanSingle === 'tertekan' || cleanSingle === 'penat') {
    return { matchedKey: 'stres', isSingleWord: true };
  }
  if (cleanSingle === 'lelah' || cleanSingle === 'capek' || cleanSingle === 'capekk' || cleanSingle === 'burnout' || cleanSingle === 'lemas') {
    return { matchedKey: 'lelah', isSingleWord: true };
  }
  if (cleanSingle === 'overthinking' || cleanSingle === 'mikir terus' || cleanSingle === 'pikiran berputar') {
    return { matchedKey: 'overthinking', isSingleWord: true };
  }
  if (cleanSingle === 'bersalah' || cleanSingle === 'merasa bersalah' || cleanSingle === 'guilt') {
    return { matchedKey: 'bersalah', isSingleWord: true };
  }
  if (cleanSingle === 'malu' || cleanSingle === 'shame' || cleanSingle === 'minder') {
    return { matchedKey: 'malu', isSingleWord: true };
  }

  // 2. Multi-word phrase matching with priority order (e.g. "kecewa" checked strictly before "sedih")
  // Rule 2 & 6: NEVER replace kecewa with sedih!
  if (/\b(kecewa|kekecewaan|patah hati|dikecewakan)\b/i.test(text)) {
    return { matchedKey: 'kecewa', isSingleWord: false };
  }
  if (/\b(marah|kesal|jengkel|geram|emosi|dendam|benci)\b/i.test(text)) {
    return { matchedKey: 'marah', isSingleWord: false };
  }
  if (/\b(cemas|kecemasan|panik|khawatir|gelisah|was-was|anxiety|resah)\b/i.test(text)) {
    return { matchedKey: 'cemas', isSingleWord: false };
  }
  if (/\b(sedih|kesedihan|menangis|nangis|pilu|terpuruk|berduka)\b/i.test(text)) {
    return { matchedKey: 'sedih', isSingleWord: false };
  }
  if (/\b(takut|ketakutan|ngeri|gugup|fobia|terancam)\b/i.test(text)) {
    return { matchedKey: 'takut', isSingleWord: false };
  }
  if (/\b(bersalah|rasa bersalah|guilt|menyesal|penyesalan)\b/i.test(text)) {
    return { matchedKey: 'bersalah', isSingleWord: false };
  }
  if (/\b(malu|rasa malu|shame|minder|insecure)\b/i.test(text)) {
    return { matchedKey: 'malu', isSingleWord: false };
  }
  if (/\b(overthinking|mikir terus|pikiran berulang|pikiran berputar|sulit tidur memikirkan)\b/i.test(text)) {
    return { matchedKey: 'overthinking', isSingleWord: false };
  }
  if (/\b(stres|stress|tertekan|tekanan|beban berat|pusing tugas)\b/i.test(text)) {
    return { matchedKey: 'stres', isSingleWord: false };
  }
  if (/\b(lelah|capek|burnout|lemas|kehabisan energi|letih|penat mental)\b/i.test(text)) {
    return { matchedKey: 'lelah', isSingleWord: false };
  }

  return { matchedKey: null, isSingleWord: false };
}

export function generateLegaContextualChat(messages: any[], userProfile: any): LegaChatResponse {
  const userName = userProfile?.name || 'Teman LEGA';
  const userMessages = messages ? messages.filter((m: any) => m.sender === 'user') : [];
  const lastUserMsg = userMessages.length > 0 ? (userMessages[userMessages.length - 1]?.text || '').trim() : '';
  const lowerMsg = lastUserMsg.toLowerCase();

  // Handle Official Identity Questions
  if (
    lowerMsg.includes('ini aplikasi apa') ||
    lowerMsg.includes('aplikasi apa ini') ||
    lowerMsg.includes('tentang aplikasi ini') ||
    lowerMsg === 'apa ini' ||
    lowerMsg === 'aplikasi apa'
  ) {
    return {
      replyText:
        'Ini adalah LEGA SHAQILA DIGITAL 99, sebuah platform kesadaran diri yang membantu Anda mengenali emosi, mengamati pengalaman, melakukan refleksi, dan belajar mengenal diri dengan lebih sadar.',
      identifiedEmotion: null,
      reflectiveQuestions: [
        'Apa yang membawa Anda ke ruang refleksi ini hari ini?',
        'Bagian diri mana yang paling ingin Anda kenali lebih dalam?',
      ],
      suggestedExercise: {
        type: 'grounding',
        title: 'LEGA Presence: Mengenal Diri Saat Ini',
        description: 'Ambil jeda sejenak, rasakan napas masuk dan keluar dengan perlahan.',
      },
      suggestedModuleKey: 'self-discovery',
      suggestedModuleName: 'LEGA Self Discovery — Mengenal Diri',
      summaryInsight: 'Mengenal diri berakar dari kerelaan untuk mengamati pengalaman tanpa penghakiman.',
    };
  }

  if (
    lowerMsg.includes('singkatan apa') ||
    lowerMsg.includes('kepanjangan lega') ||
    lowerMsg.includes('apa kepanjangan') ||
    lowerMsg.includes('arti lega') ||
    lowerMsg.includes('makna nama lega') ||
    lowerMsg === 'singkatan lega' ||
    lowerMsg === 'kepanjangan'
  ) {
    return {
      replyText:
        'LEGA adalah singkatan dari:\n\n• **L** — Lepaskan\n• **E** — Eksplorasi\n• **G** — Gali\n• **A** — Amati\n\nFilosofi ini mengajak Anda melepaskan ketegangan, mengeksplorasi emosi, menggali pemahaman batin, dan mengamati pengalaman secara sadar.',
      identifiedEmotion: null,
      reflectiveQuestions: [
        'Dari keempat pilar (Lepaskan, Eksplorasi, Gali, Amati), pilar mana yang paling Anda butuhkan saat ini?',
        'Apa yang sedang Anda rasakan sekarang?',
      ],
      suggestedExercise: {
        type: 'breathing',
        title: 'LEGA Presence: Sadari Napas Hadir Saat Ini',
        description: 'Rasakan napas mengalir lembut sebagai jangkar kehadiran diri.',
      },
      suggestedModuleKey: 'mindfulness',
      suggestedModuleName: 'LEGA Presence — Hadir Saat Ini',
      summaryInsight: 'Lepaskan • Eksplorasi • Gali • Amati adalah kompas perjalanan kesadaran diri.',
    };
  }

  if (
    lowerMsg.includes('siapa yang membuat') ||
    lowerMsg.includes('siapa pembuat') ||
    lowerMsg.includes('siapa developer') ||
    lowerMsg.includes('dibuat oleh') ||
    lowerMsg.includes('pencipta lega') ||
    lowerMsg.includes('shaqila digital')
  ) {
    return {
      replyText: 'LEGA SHAQILA DIGITAL 99 dikembangkan oleh SHAQILA DIGITAL 99.',
      identifiedEmotion: null,
      reflectiveQuestions: [
        'Apakah ada hal atau emosi tertentu yang ingin Anda ceritakan atau refleksikan hari ini?',
        'Apa yang sedang Anda rasakan saat ini?',
      ],
      suggestedExercise: {
        type: 'grounding',
        title: 'LEGA Presence: Hadir Saat Ini',
        description: 'Kembali rasakan tubuh dan napas Anda dengan nyaman.',
      },
      suggestedModuleKey: 'dashboard',
      suggestedModuleName: 'LEGA Dashboard Utama',
      summaryInsight: 'LEGA hadir untuk mendampingi perjalanan kesadaran diri Anda setiap hari.',
    };
  }

  const { matchedKey, isSingleWord } = detectUserEmotion(lastUserMsg);

  if (matchedKey && EMOTION_CONFIGS[matchedKey]) {
    const config = EMOTION_CONFIGS[matchedKey];

    let replyText = '';
    if (isSingleWord) {
      // Rule 10: Single word input handling with exact first sentence acknowledgment
      replyText = `Terima kasih sudah menceritakannya, ${userName}. Saya memahami bahwa saat ini Anda sedang merasa ${config.displayName}.\n\n${config.singleWordFollowUp}`;
    } else {
      // Rule 1 & 5: Exact first sentence acknowledgment + gentle step-by-step presence & body awareness
      replyText = `${config.detailedResponseGenerator(userName, '')}\n\nMari kita amati bersama sensasi fisik dan napas Anda saat ini tanpa menghakimi. ${config.primaryReflectiveQuestion}`;
    }

    return {
      replyText,
      identifiedEmotion: config.displayName,
      reflectiveQuestions: [config.primaryReflectiveQuestion, config.secondaryOpenQuestion],
      suggestedExercise: {
        type: config.exerciseType,
        title: config.exerciseTitle,
        description: config.exerciseDesc,
      },
      suggestedModuleKey: config.targetModuleKey,
      suggestedModuleName: config.moduleName,
      summaryInsight: config.summaryInsight,
    };
  }

  // Fallback for general neutral or descriptive input
  const replyText = `Terima kasih telah menceritakan apa yang sedang Anda alami saat ini, ${userName}. Saya mendengarkan Anda dengan penuh perhatian dan tanpa penghakiman. Mari kita luangkan jeda sejenak untuk menyadari napas dan apa yang paling dirasakan tubuh Anda pada detik ini.\n\nApa emosi atau perasaan utama yang paling terasa di dalam diri Anda saat ini?`;

  return {
    replyText,
    identifiedEmotion: null,
    reflectiveQuestions: [
      'Apa emosi atau perasaan utama yang paling Anda rasakan saat ini?',
      'Bagaimana sensasi napas dan kenyamanan tubuh Anda saat menceritakan hal ini?',
    ],
    suggestedExercise: {
      type: 'breathing',
      title: 'LEGA Presence: Sadari Napas Hadir Saat Ini',
      description: 'Rasakan hembusan napas yang mengalir lembut masuk dan keluar dari hidung.',
    },
    suggestedModuleKey: 'mindfulness',
    suggestedModuleName: 'LEGA Presence — Hadir Saat Ini',
    summaryInsight: 'Menyadari dan menamai apa yang sedang dirasakan adalah langkah awal menuju kelegaan batin.',
  };
}
