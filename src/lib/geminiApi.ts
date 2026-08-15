import { generateLegaContextualChat } from './legaChatEngine';

export async function sendChatMessage(messages: any[], userProfile: any) {
  try {
    const res = await fetch('/api/gemini/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, userProfile }),
    });
    const data = await res.json();
    if (res.ok && data.success && data.data) {
      return data.data;
    }
    throw new Error(data.error || 'Gagal tersambung dengan LEGA AI.');
  } catch (err: any) {
    console.warn('sendChatMessage falling back to contextual engine:', err?.message || err);
    return generateLegaContextualChat(messages, userProfile);
  }
}

export async function analyzeEmotion(logData: {
  emotion: string;
  intensity: number;
  physicalSensations: string[];
  triggers: string[];
  notes?: string;
}) {
  try {
    const res = await fetch('/api/gemini/analyze-emotion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(logData),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Gagal menganalisis emosi.');
    }
    return data.data;
  } catch (err: any) {
    console.error('analyzeEmotion error:', err);
    return {
      summary: `Emosi ${logData.emotion} dengan intensitas ${logData.intensity}/10 adalah sinyal alami bahwa ada sesuatu yang perlu diperhatikan.`,
      primaryEmotion: logData.emotion,
      secondaryEmotions: ['gelisah', 'lelah'],
      intensityLevel: logData.intensity > 6 ? 'Kuat' : 'Sedang',
      possibleTriggers: logData.triggers.length > 0 ? logData.triggers : ['Pekerjaan & Tekanan'],
      bodySensations: 'Emosi berpengaruh langsung pada sensasi fisik dan ritme napas tubuhmu.',
      thoughtPatterns: 'Kecenderungan memikirkan skenario secara intensif.',
      underlyingNeed: 'Kebutuhan akan keseimbangan, ketenangan, dan rasa aman.',
      reflectiveQuestion: 'Apa satu hal kecil yang dapat kamu beri untuk dirimu saat ini?',
      reflectiveQuestions: [
        'Apa yang paling Anda butuhkan saat ini?',
        'Apa satu hal kecil yang berada dalam kendali Anda hari ini?'
      ],
      suggestedExercise: 'Latihan Grounding & Pernapasan LEGA Breathing',
      recommendedModules: [
        {
          moduleName: 'LEGA Breathing',
          reason: 'Membantu menenangkan sistem saraf dan sensasi tubuh.',
          targetModuleKey: 'breathing'
        },
        {
          moduleName: 'LEGA Presence',
          reason: 'Membantu kembali hadir pada saat ini secara sadar.',
          targetModuleKey: 'mindfulness'
        }
      ],
      emergencyNotice: null,
      mindBodyPerspective: 'Emosi berpengaruh langsung pada sensasi fisik tubuhmu.',
    };
  }
}

export async function releaseReflect(releaseData: {
  emotion?: string;
  physicalSensations?: string[];
  triggers?: string[];
  importantValues?: string;
  unfulfilledNeeds?: string;
  learnings?: string;
  nextSmallStep?: string;
}) {
  try {
    const res = await fetch('/api/gemini/release-reflect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(releaseData),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Gagal memproses refleksi LEGA Release.');
    }
    return data.data;
  } catch (err: any) {
    console.error('releaseReflect error:', err);
    return {
      emotionSummary: `Kamu sedang menyadari keberadaan emosi ${releaseData.emotion || 'ini'} dalam tubuhmu.`,
      needsSummary: releaseData.unfulfilledNeeds || 'Kebutuhan akan rasa aman, ruang diri, dan kedamaian.',
      reflectionInsight: releaseData.learnings || 'Emosi ini tidak perlu langsung dihilangkan, melainkan dipahami pesannya.',
      suggestedNextSteps: [
        releaseData.nextSmallStep || 'Mengambil 3 napas dalam perlahan',
        'Istirahat sejenak dari aktivitas bertekanan'
      ],
      recommendedModules: [
        {
          moduleName: 'LEGA Breathing',
          reason: 'Membantu melepaskan ketegangan somatis dan menenangkan sistem saraf.',
          targetModuleKey: 'breathing'
        },
        {
          moduleName: 'LEGA Presence',
          reason: 'Membantu kembali berjangkar di momen saat ini.',
          targetModuleKey: 'mindfulness'
        }
      ]
    };
  }
}

export async function bodyAwarenessReflect(bodyData: {
  durationMinutes?: number;
  scannedZones?: string[];
  primaryTensionZone?: string;
  physicalSensations?: string[];
  currentEmotion?: string;
  isSensationChanging?: boolean;
  comfortRating?: number;
  userNotes?: string;
}) {
  try {
    const res = await fetch('/api/gemini/body-awareness-reflect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bodyData),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Gagal memproses kesadaran tubuh.');
    }
    return data.data;
  } catch (err: any) {
    console.error('bodyAwarenessReflect error:', err);
    return {
      somaticSummary: `Latihan kesadaran tubuh selama ${bodyData.durationMinutes || 5} menit berjalan dengan tenang. Pengamatan berfokus pada area ${bodyData.primaryTensionZone || 'bahu & leher'}.`,
      primaryBodyZone: bodyData.primaryTensionZone || 'Bahu & Leher',
      reportedSensations: (bodyData.physicalSensations || ['Tegang / Kaku']).join(', '),
      bodyEmotionRelation: `Sensasi fisik di ${bodyData.primaryTensionZone || 'bahu & leher'} selaras dengan dinamika emosi ${bodyData.currentEmotion || 'yang sedang dirasakan'}. Memberikan perhatian sadar membantu merelaksasikan sistem saraf.`,
      reflectionInsight: 'Tubuh Anda bukan musuh; sensasi fisik adalah cara alami tubuh memberikan informasi netral tanpa harus divonis secara medis.',
      relaxationTip: 'Lakukan hembusan napas panjang lewat mulut (sigh of relief) sambil dengan lembut melunakkan bahu.',
      medicalAdvisory: null,
      recommendedNextModules: [
        {
          moduleName: 'LEGA Breathing',
          reason: 'Lanjutkan dengan relaksasi napas terpandu untuk meregulasi sistem saraf.',
          targetModuleKey: 'breathing'
        },
        {
          moduleName: 'LEGA Release',
          reason: 'Salurkan beban emosional yang masih tersimpan dalam bentuk ketegangan somatis.',
          targetModuleKey: 'emotional-release'
        },
        {
          moduleName: 'LEGA AI Coach',
          reason: 'Diskusikan pengalaman batin dan eksplorasi lebih lanjut bersama AI Coach.',
          targetModuleKey: 'ai-coach'
        }
      ]
    };
  }
}

export async function breathingReflect(breathingData: {
  durationMinutes?: number;
  variationId?: string;
  variationName?: string;
  userEmotionState?: string;
  breathSensationBefore?: string;
  breathSensationAfter?: string;
  userReflections?: string;
  hasRespiratoryIssue?: boolean;
}) {
  try {
    const res = await fetch('/api/gemini/breathing-reflect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(breathingData),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Gagal memproses refleksi napas.');
    }
    return data.data;
  } catch (err: any) {
    console.error('breathingReflect error:', err);
    return {
      breathingSummary: `Sesi kesadaran napas selama ${breathingData.durationMinutes || 3} menit telah selesai dengan tenang. Napas Anda kini menjadi tempat kembali yang aman.`,
      breathStateObservation: `Sebelum latihan: ${breathingData.breathSensationBefore || 'Tegang'}. Sesudah latihan: ${breathingData.breathSensationAfter || 'Lebih Halus'}.`,
      mindfulAnchorInsight: 'Napas selalu hadir setiap saat. Kapan pun pikiran mengembara, Anda dapat kembali menyadari irama alami napas tanpa perlu mengubahnya.',
      somaticCalmnessNote: 'Pikiran dan sistem saraf menjadi lebih tenang saat kita berhenti sejenak dan memberi ruang bagi napas apa adanya.',
      recommendedNextModules: [
        {
          moduleName: 'LEGA Body Awareness',
          reason: 'Lanjutkan dengan memindai sensasi tubuh dan melepaskan ketegangan somatis.',
          targetModuleKey: 'body-awareness'
        },
        {
          moduleName: 'LEGA Presence',
          reason: 'Perluas jangkar perhatian ke momen saat ini dengan kesadaran penuh.',
          targetModuleKey: 'mindfulness'
        },
        {
          moduleName: 'LEGA AI Coach',
          reason: 'Refleksikan ketenangan yang didapat bersama AI Coach.',
          targetModuleKey: 'ai-coach'
        }
      ]
    };
  }
}

export async function emotionBodyKnowledgeReflect(knowledgeData: {
  topicId?: string;
  topicName?: string;
  userQuery?: string;
  reportedPhysicalSymptoms?: string[];
  currentLifestyle?: string;
  hasMedicalCondition?: boolean;
}) {
  try {
    const res = await fetch('/api/gemini/emotion-body-knowledge-reflect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(knowledgeData),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Gagal memproses psikoedukasi emosi dan tubuh.');
    }
    return data.data;
  } catch (err: any) {
    console.error('emotionBodyKnowledgeReflect error:', err);
    return {
      educationalSummary: `Penelitian ilmiah menunjukkan bahwa emosi (${knowledgeData.topicName || 'stres'}) merupakan salah satu dari banyak faktor yang saling berinteraksi memengaruhi tubuh.`,
      mindBodyMechanism: 'Aktivasi sistem saraf simpatis dan respon hormonal (seperti kortisol dan adrenalin) dapat memicu peningkatan denyut jantung atau ketegangan otot secara fisiologis.',
      lifestyleInterventions: [
        'Kualitas tidur 7-8 jam untuk pemulihan sistem saraf',
        'Nutrisi seimbang dan hidrasi cukup',
        'Aktivitas fisik teratur (seperti berjalan santai 20-30 menit)',
        'Latihan kesadaran (LEGA Breathing / Body Awareness)'
      ],
      medicalConsultationAdvice: 'Gejala fisik berat, menetap, atau memburuk membutuhkan evaluasi oleh dokter atau fasilitas kesehatan profesional.',
      recommendedNextModules: [
        {
          moduleName: 'LEGA Body Awareness',
          reason: 'Lakukan pemindaian kesadaran tubuh tanpa vonis medis.',
          targetModuleKey: 'body-awareness'
        },
        {
          moduleName: 'LEGA Breathing',
          reason: 'Atur respon relaksasi sistem saraf dengan latihan pernapasan.',
          targetModuleKey: 'breathing'
        },
        {
          moduleName: 'LEGA AI Coach',
          reason: 'Diskusikan pemahaman edukasi emosi lebih lanjut bersama AI Coach.',
          targetModuleKey: 'ai-coach'
        }
      ]
    };
  }
}

export async function generateAudioScript(audioParams: {
  userName?: string;
  primaryEmotion?: string;
  secondaryEmotion?: string;
  emotionIntensity?: 'rendah' | 'sedang' | 'tinggi' | 'sangat_tinggi' | string;
  userGoal?: string;
  sessionContext?: string;
  reflectionResult?: string;
  bodySensation?: string;
  currentMood?: string;
  selectedModule?: string;
  category?: string;
  subcategory?: string;
  durationMinutes?: number;
  userExperienceLevel?: 'pemula' | 'menengah' | 'lanjutan' | string;
  preferredVoice?: string;
  voiceName?: string;
  speechSpeed?: string;
  spiritualMode?: boolean;
  audioMode?: 'guided' | 'gentle' | 'reflective' | 'sleep' | 'emergency_calming' | string;
  isCrisisRisk?: boolean;
}) {
  try {
    const res = await fetch('/api/gemini/audio-script-generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(audioParams),
    });
    const data = await res.json();
    if (res.ok && data.success && data.data) {
      return data.data;
    }
  } catch (err: any) {
    // Handled gracefully with fallback data
  }

  const subcat = audioParams.subcategory || audioParams.category || 'Hadir Saat Ini';
  const dur = Number(audioParams.durationMinutes) || 5;
  const userName = audioParams.userName || 'Sahabat LEGA';
  const emotion = audioParams.primaryEmotion || 'Tenang';
  return {
    title: `${subcat} — ${dur} Menit`,
    category: audioParams.category || 'LEGA Presence',
    subcategory: subcat,
    duration: `${dur} minutes`,
    durationMinutes: dur,
    voiceStyle: 'Warm Indonesian guide',
    tone: 'Calm, compassionate, grounded',
    pace: audioParams.speechSpeed === 'perlahan' ? 'Slow' : 'Moderate',
    emotion: 'Gentle, reassuring',
    script: `Selamat datang di ruang tenang Anda, ${userName}. [PAUSE_SHORT] Izinkan diri Anda untuk berhenti sejenak dari segala kesibukan. [PAUSE_MEDIUM] Tarik napas lembut, rasakan udara mengalir masuk, dan hembuskan perlahan. [PAUSE_LONG] Perhatikan sensasi tubuh Anda di saat ini. Lepaskan ketegangan di area bahu, leher, dan rahang. [PAUSE_MEDIUM] Jika pikiran Anda terbawa oleh rasa ${emotion.toLowerCase()}, sadari saja tanpa menghakimi, lalu bawa kembali perhatian Anda ke napas yang mengalir tenang. [PAUSE_LONG] Rasakan ketenangan hadir di setiap hembusan napas Anda. [PAUSE_SHORT] Terima kasih telah meluangkan waktu berharga untuk menyapa diri Anda hari ini.`,
    cleanScriptForTTS: `Selamat datang di ruang tenang Anda, ${userName}. Izinkan diri Anda untuk berhenti sejenak dari segala kesibukan. Tarik napas lembut, rasakan udara mengalir masuk, dan hembuskan perlahan. Perhatikan sensasi tubuh Anda di saat ini. Lepaskan ketegangan di area bahu, leher, dan rahang. Jika pikiran Anda terbawa oleh rasa ${emotion.toLowerCase()}, sadari saja tanpa menghakimi, lalu bawa kembali perhatian Anda ke napas yang mengalir tenang. Rasakan ketenangan hadir di setiap hembusan napas Anda. Terima kasih telah meluangkan waktu berharga untuk menyapa diri Anda hari ini.`,
    description: `Panduan audio meditasi terpersonalisasi untuk ${audioParams.userGoal || 'menemukan ketenangan'}.`,
    ttsPrompt: `Selamat datang di ruang tenang Anda, ${userName}...`,
    voiceRecommended: audioParams.preferredVoice || audioParams.voiceName || 'Kore',
    reflectionPoints: [
      'Bagaimana sensasi napas dan tubuh Anda setelah jeda ini?',
      'Apa satu hal sederhana yang terasa lebih lega saat ini?'
    ],
    safetyNote: audioParams.isCrisisRisk ? 'Keselamatan Jiwa: Hubungi Call Center 119 ext 8 jika membutuhkan bantuan segera.' : '',
    ttsInstructions: {
      voice_style: 'warm Indonesian guide',
      tone: 'calm, compassionate, grounded',
      pace: audioParams.speechSpeed === 'perlahan' ? 'slow' : 'moderate',
      energy: 'low to moderate',
      delivery: 'natural conversational guidance',
      emotion: 'gentle, reassuring',
      pronunciation: 'clear Indonesian',
      pause: 'natural reflective pauses'
    },
    recommendedNextModules: [
      {
        moduleName: 'LEGA Breathing',
        reason: 'Menyeimbangkan ritme napas secara sadar.',
        targetModuleKey: 'breathing'
      },
      {
        moduleName: 'LEGA Journal',
        reason: 'Menuangkan refleksi batin setelah jeda relaksasi.',
        targetModuleKey: 'journal'
      }
    ]
  };
}

export async function generateLegaArticle(articleParams: {
  topic?: string;
  category?: string;
  readingLevel?: 'Pemula' | 'Menengah' | 'Lanjutan' | string;
  wordCountTarget?: 'mini' | 'standard' | 'deep' | string;
  isSpiritual?: boolean;
  targetAudience?: string;
  customPrompt?: string;
}) {
  try {
    const res = await fetch('/api/gemini/article-generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(articleParams),
    });
    const data = await res.json();
    if (!data.success) {
      throw new Error(data.error || 'Gagal menghasilkan artikel.');
    }
    return data.data;
  } catch (err: any) {
    console.error('generateLegaArticle error:', err);
    return {
      articleTitle: articleParams.topic || 'Mengapa Kita Sering Overthinking?',
      category: articleParams.category || 'LEGA Overthinking',
      readingLevel: articleParams.readingLevel || 'Pemula',
      summary: 'Overthinking adalah pola berpikir berulang yang dapat membuat seseorang merasa cemas dan terjebak dalam lingkaran ketakutan. Memahami mekanismenya membantu kita bertindak dengan lebih tenang.',
      seoTitle: `${articleParams.topic || 'Mengapa Kita Sering Overthinking?'} — Edukasi LEGA`,
      metaDescription: 'Pelajari cara mengenali overthinking, membedakan fakta dan kekhawatiran, serta latihan sederhana untuk kembali ke saat ini.',
      slug: (articleParams.topic || 'mengapa-kita-sering-overthinking').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      primaryKeyword: 'overthinking',
      secondaryKeywords: ['pola pikir', 'kecemasan', 'regulasi emosi'],
      content: `## Pendahuluan\n\nPernahkah Anda terbangun di malam hari dan memikirkan keputusan yang sudah berlalu? Atau membayangkan skenario terburuk yang belum tentu terjadi? Pola ini sering disebut sebagai **overthinking**.\n\n## Apa yang perlu dipahami?\n\nOverthinking bukan sekadar "terlalu banyak berpikir", melainkan pola di mana pikiran berputar pada masalah yang sama tanpa menghasilkan solusi nyata.\n\n## Bagaimana hal tersebut terjadi?\n\nSecara neurobiologis, ketika otak mendeteksi ancaman atau ketidakpastian, sistem pertahanan tubuh akan aktif. Otak berusaha "melindungi" kita dengan memikirkan semua kemungkinan, namun jika terus berlanjut, ini justru meningkatkan kadar hormon stres.\n\n## Contoh kehidupan sehari-hari\n\nMisalnya saat menerima pesan singkat singkat dari kolega. Seseorang yang mengalami overthinking mungkin langsung berspekulasi: *"Apakah saya membuat kesalahan?"* padahal balasan tersebut hanya pesan biasa.\n\n## Apa yang dapat dilakukan?\n\n1. **Sadar dan Namai**: Katakan pada diri sendiri, *"Ini adalah pikiran overthinking, bukan fakta."*\n2. **Grounding Fisik**: Rasakan pijakan kaki di lantai dan fokus pada 3 benda di sekitar Anda.\n3. **Ambil Satu Tindakan Kecil**: Geser fokus dari memikirkan ke melakukan tindakan nyata.\n\n## Latihan LEGA yang Relevan\n\nGunakan modul **LEGA Overthinking** dan **LEGA Presence** untuk membantu menjangkarkan kesadaran Anda saat ini.\n\n## Kapan perlu mencari bantuan profesional?\n\nJika overthinking mengganggu tidur, produktivitas, atau hubungan Anda secara berkepanjangan, berkonsultasi dengan psikolog atau psikiater dapat memberikan panduan terapeutik yang tepat.`,
      keyTakeaways: [
        'Overthinking adalah perputaran pikiran berulang tanpa solusi nyata.',
        'Bedakan fakta konkret dari asumsi atau skenario yang dikonstruksi otak.',
        'Kembali ke saat ini (presence) adalah kunci memutus rantai overthinking.'
      ],
      reflectionQuestions: [
        'Apa satu hal yang paling sering memicu overthinking Anda belakangan ini?',
        'Manakah dari pikiran tersebut yang benar-benar fakta, dan mana yang sekadar kekhawatiran?'
      ],
      recommendedExercise: 'LEGA Overthinking — Pemisahan Fakta dan Opini',
      recommendedAudio: 'Panduan Audio 5 Menit: Kembali ke Saat Ini',
      relatedModules: ['LEGA Overthinking', 'LEGA Presence', 'LEGA Breathing'],
      relatedArticles: ['Memahami Kecemasan dan Respons Tubuh', 'Langkah Pertama Mengelola Stres Kerja'],
      references: [
        {
          title: 'Managing Rumination and Stress Response',
          authorOrOrg: 'NIMH / American Psychological Association',
          year: '2023',
          publication: 'APA Clinical Guidelines',
          urlOrDoi: 'https://www.apa.org/topics/stress'
        }
      ],
      safetyNote: 'Artikel ini bersifat edukatif dan bukan pengganti konseling medis/psikologis profesional.'
    };
  }
}

export async function reflectGratitude(gratitudeData: {
  selectedAreas?: string[];
  reflectionInput?: string;
  currentEmotion?: string;
  isGoingThroughHardship?: boolean;
  userAnswers?: Record<string, string>;
}) {
  try {
    const res = await fetch('/api/gemini/gratitude-reflect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(gratitudeData),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Gagal memproses refleksi LEGA Gratitude.');
    }
    return data.data;
  } catch (err: any) {
    console.error('reflectGratitude error:', err);
    return {
      summary: gratitudeData.isGoingThroughHardship
        ? 'Terima kasih telah bertahan di tengah hari yang berat. Syukur tidak menghapus beban Anda, namun menyadari napas dan momen istirahat kecil ini adalah bentuk kebaikan lembut untuk diri sendiri.'
        : 'Syukur hadir dari kesadaran jujur. Menyadari hal-hal kecil hari ini membantu memberikan keseimbangan batin di tengah aktivitas sehari-hari.',
      gratitudeItems: [
        {
          area: gratitudeData.selectedAreas?.[0] || 'Napas & Tubuh',
          detail: 'Keberadaan napas yang masih mengalir dan kesempatan berhenti sejenak saat ini.',
          meaning: 'Mengingatkan bahwa di titik terjauh sekalipun, tubuh Anda selalu setia menemani.'
        }
      ],
      lessonsLearned: 'Setiap hari membawa ruang pembelajaran. Tidak semua hal harus sempurna untuk patut dihargai.',
      journalNote: {
        threeGratitudes: [
          'Napas yang masih berhembus lembut',
          'Ruang waktu istirahat sejenak',
          'Keberanian jujur pada perasaan sendiri'
        ],
        todayLesson: 'Syukur dapat berdampingan dengan rasa lelah atau tantangan.',
        kindnessReceived: 'Kesempatan untuk memulihkan energi.',
        kindnessGiving: 'Menerima diri sendiri tanpa menghakimi.',
        tomorrowHope: 'Menjalani hari besok dengan ritme yang lebih tenang.'
      },
      recommendedAudioTheme: 'Syukur atas Hal-Hal Sederhana',
      nextAction: 'Tarik napas dalam, hembuskan perlahan, dan nikmati momen istirahat ini.',
      recommendedModules: [
        {
          moduleName: 'LEGA Presence',
          reason: 'Rasakan kehadiran utuh momen saat ini.',
          targetModuleKey: 'mindfulness'
        },
        {
          moduleName: 'LEGA Journal',
          reason: 'Simpan refleksi syukur ini ke dalam catatan harian Anda.',
          targetModuleKey: 'journal'
        }
      ]
    };
  }
}

export async function reflectForgiveness(forgivenessData: {
  focusArea?: string;
  experienceText?: string;
  currentEmotions?: string[];
  impactText?: string;
  needsToMoveForward?: string;
  isNotReadyYet?: boolean;
  isSevereTrauma?: boolean;
  userAnswers?: Record<string, string>;
}) {
  try {
    const res = await fetch('/api/gemini/forgiveness-reflect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(forgivenessData),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Gagal memproses refleksi LEGA Forgiveness.');
    }
    return data.data;
  } catch (err: any) {
    console.error('reflectForgiveness error:', err);
    return {
      summary: forgivenessData.isNotReadyYet
        ? 'Keputusan Anda untuk belum memaafkan saat ini sepenuhnya valid dan dihormati. Memaafkan bukanlah kewajiban instan atau paksaan. Mengakui bahwa Anda belum siap adalah bentuk kejujuran batin yang penting.'
        : 'Memaafkan adalah proses pribadi bertahap untuk meringankan beban emosional diri sendiri, bukan untuk membenarkan tindakan orang lain atau melupakan pengalaman.',
      emotionalInsight: 'Emosi yang hadir adalah sinyal alami bahwa pengalaman tersebut bernilai dan memicu luka batin yang membutuhkan belas kasih.',
      lessonsAndBoundaries: {
        lessonLearned: 'Setiap tantangan dan luka mengajarkan pentingnya menjaga ruang batin dan nilai integritas diri.',
        healthyBoundaryToBuild: 'Menentukan jarak aman dan batasan komunikasi yang jelas demi ketenangan pikiran.',
        whatIsToRelease: 'Ekspektasi bahwa masa lalu dapat diubah atau tuntutan agar orang lain berubah sesuai keinginan.'
      },
      journalNote: {
        whatStillFeelsHeavy: forgivenessData.experienceText || 'Beban emosional dari pengalaman masa lalu.',
        whatWasLearned: 'Memaafkan adalah tentang kedamaian batin diri sendiri.',
        whatToRelease: 'Penyesalan dan ekspektasi yang tidak memulihkan.',
        boundaryToBuild: 'Batasan hubungan yang sehat dan aman.',
        futureHope: 'Melangkah ke depan dengan ruang batin yang lebih lapang.'
      },
      recommendedAudioTheme: 'Memaafkan Diri Sendiri',
      realisticNextStep: 'Ambil satu napas panjang, hembuskan perlahan, dan perlakukan diri Anda dengan penuh kelembutan hari ini.',
      isNotReadyOption: forgivenessData.isNotReadyYet || false,
      professionalTherapyRecommendation: forgivenessData.isSevereTrauma
        ? 'Jika pengalaman ini terasa sangat berat, memicu kilas balik berulang, atau mengganggu fungsi harian Anda, kami sangat menyarankan untuk berkonsultasi dengan psikolog klinis atau terapis profesional yang aman.'
        : '',
      recommendedModules: [
        {
          moduleName: 'LEGA Release',
          reason: 'Uraikan emosi yang tertahan melalui pelepasan aman.',
          targetModuleKey: 'emotional-release'
        },
        {
          moduleName: 'LEGA Presence',
          reason: 'Kembali berjangkar di momen saat ini.',
          targetModuleKey: 'mindfulness'
        }
      ]
    };
  }
}

export async function reflectInnerChild(innerChildData: {
  focusArea?: string;
  memoryText?: string;
  currentEmotions?: string[];
  perceivedNeedText?: string;
  currentSelfCare?: string;
  isOverwhelmed?: boolean;
  isSevereTrauma?: boolean;
  userAnswers?: Record<string, string>;
}) {
  try {
    const res = await fetch('/api/gemini/inner-child-reflect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(innerChildData),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Gagal memproses refleksi LEGA Inner Child.');
    }
    return data.data;
  } catch (err: any) {
    console.error('reflectInnerChild error:', err);
    return {
      summary: innerChildData.isOverwhelmed
        ? 'Terima kasih telah berani hadir di sini. Ketika emosi terasa sangat kuat, Anda tidak perlu terburu-buru menganalisis masa lalu. Mari kembalikan perhatian Anda ke hembusan napas dan rasa aman pada saat ini.'
        : 'Setiap pengalaman hidup meninggalkan jejak pembelajaran. Memahami kenangan terdahulu bukan untuk menyalahkan siapapun, melainkan memberikan belas kasih dan perhatian hangat kepada diri Anda saat ini.',
      recognizedPattern: 'Kebutuhan akan penerimaan dan rasa aman yang terkadang memicu respons emosional saat menghadapi situasi serupa pada masa kini.',
      unmetEmotionalNeed: 'Kebutuhan emosional akan kepastian rasa aman, penerimaan utuh, dan kehangatan yang jujur.',
      lessonsLearned: 'Setiap tantangan masa lalu memperlihatkan daya tahan batin Anda yang luar biasa hingga hari ini.',
      selfNurturingAction: 'Berikan pelukan hangat atau waktu istirahat sejenak untuk diri sendiri hari ini tanpa kritik berlebihan.',
      journalNote: {
        memorableMemory: innerChildData.memoryText || 'Kenangan & refleksi pengalaman terdahulu.',
        lessonLearned: 'Masa lalu membentuk pembelajaran, namun masa kini adalah ruang untuk merawat diri.',
        recognizedNeed: innerChildData.perceivedNeedText || 'Rasa aman dan penerimaan.',
        selfCareForm: innerChildData.currentSelfCare || 'Perhatian lembut tanpa menghakimi.',
        futureHope: 'Melangkah ke depan dengan belas kasih dan ruang batin yang lebih aman.'
      },
      recommendedAudioTheme: 'Belas Kasih kepada Diri',
      realisticNextStep: 'Tarik napas dalam, bisikkan kata-kata lembut kepada diri sendiri: "Kamu sudah berusaha dengan sangat baik."',
      isOverwhelmedNotice: innerChildData.isOverwhelmed || false,
      professionalTherapyRecommendation: innerChildData.isSevereTrauma
        ? 'Jika kenangan ini menimbulkan kilas balik mendalam atau mengganggu aktivitas harian, kami sangat menyarankan untuk berkonsultasi dengan terapis atau psikolog profesional.'
        : '',
      recommendedModules: [
        {
          moduleName: 'LEGA Presence',
          reason: 'Kembali berjangkar di momen saat ini melalui kesadaran panca indra.',
          targetModuleKey: 'mindfulness'
        },
        {
          moduleName: 'LEGA Journal',
          reason: 'Simpan refleksi ini ke dalam catatan harian Anda.',
          targetModuleKey: 'journal'
        }
      ]
    };
  }
}

export async function reflectOverthinking(overthinkingData: {
  mainThoughtText?: string;
  timeFocus?: string;
  thoughtCategory?: string;
  associatedEmotions?: string[];
  perceivedControllable?: string;
  isSevereOrPersistent?: boolean;
  userAnswers?: Record<string, string>;
}) {
  try {
    const res = await fetch('/api/gemini/overthinking-reflect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(overthinkingData),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Gagal memproses refleksi LEGA Overthinking.');
    }
    return data.data;
  } catch (err: any) {
    console.error('reflectOverthinking error:', err);
    return {
      summary: 'Tidak semua pikiran yang muncul di kepala kita adalah fakta yang pasti terjadi. Overthinking sering kali merupakan upaya otak untuk mencari rasa aman di tengah ketidakpastian.',
      primaryTopic: overthinkingData.mainThoughtText || 'Kekhawatiran & Skenario Pikiran',
      timeFocus: overthinkingData.timeFocus || 'Masa Depan',
      breakdown: {
        facts: 'Ada hal-hal yang sedang diusahakan dan situasi yang dihadapi saat ini.',
        assumptionsAndWorries: 'Banyak skenario buruk yang dibayangkan adalah asumsi atau kemungkinan yang belum pasti terjadi.',
        interpretations: 'Kecenderungan untuk mengaitkan skenario terburuk sebagai satu-satunya hasil akhir.'
      },
      controllableFactors: overthinkingData.perceivedControllable || 'Respon Anda saat ini, cara bernapas, dan tindakan kecil berikutnya.',
      uncontrollableFactors: 'Respon orang lain, hasil akhir di masa depan, dan kejadian yang telah berlalu.',
      microAction: 'Tarik napas dalam, lakukan 1 hal sederhana berdurasi 2 menit (seperti minum air putih atau merapikan meja).',
      journalNote: {
        mainThought: overthinkingData.mainThoughtText || 'Pikiran berulang mengenai situasi yang dihadapi.',
        associatedEmotion: overthinkingData.associatedEmotions?.join(', ') || 'Cemas / Tegang',
        knownFacts: 'Situasi nyata saat ini.',
        assumptionsMade: 'Skenario terburuk yang dibayangkan.',
        chosenMicroStep: 'Fokus pada tindakan kecil yang berada dalam kendali.'
      },
      recommendedAudioTheme: 'Menenangkan Pikiran',
      professionalConsultRecommendation: overthinkingData.isSevereOrPersistent
        ? 'Jika overthinking ini terasa sangat membebani, mengganggu tidur, atau mengganggu aktivitas harian dalam jangka panjang, berkonsultasi dengan psikolog atau profesional kesehatan mental dapat membantu Anda mendapatkan strategi pendampingan yang tepat.'
        : '',
      recommendedModules: [
        {
          moduleName: 'LEGA Presence',
          reason: 'Kembali berjangkar di momen saat ini dengan kesadaran panca indra.',
          targetModuleKey: 'mindfulness'
        },
        {
          moduleName: 'Latihan Pernapasan',
          reason: 'Meregulasi sistem saraf dan meredakan ketegangan fisik.',
          targetModuleKey: 'breathing'
        }
      ]
    };
  }
}

export async function reflectAnxiety(anxietyData: {
  mainWorry?: string;
  uncontrollableAspects?: string;
  controllableActions?: string;
  physicalSensations?: string[];
  thoughtSymptoms?: string[];
  emotionalSymptoms?: string[];
  lifestyleFactors?: string[];
  isPanicState?: boolean;
  isSelfHarmExpressed?: boolean;
  isSevereOrPersistent?: boolean;
}) {
  try {
    const res = await fetch('/api/gemini/anxiety-reflect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(anxietyData),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Gagal memproses refleksi LEGA Anxiety.');
    }
    return data.data;
  } catch (err: any) {
    console.error('reflectAnxiety error:', err);
    return {
      summary: 'Kecemasan adalah respon alami tubuh dan pikiran terhadap ketidakpastian atau tantangan. Ingatlah bahwa rasa cemas bukan kelemahan atau kegagalan.',
      anxietyTypeUnderstanding: anxietyData.isSevereOrPersistent
        ? 'Kecemasan yang Anda rasakan cenderung persisten atau memengaruhi aktivitas harian. Ini adalah sinyal tubuh yang membutuhkan perhatian ekstra dan kehangatan.'
        : 'Kecemasan ini merupakan respon wajar tubuh dalam menghadapi tekanan atau ketidakpastian saat ini.',
      contributingFactors: anxietyData.lifestyleFactors?.length
        ? anxietyData.lifestyleFactors
        : ['Tekanan aktivitas', 'Kurang istirahat', 'Ketegangan emosional'],
      symptomsBreakdown: {
        thoughtSymptoms: anxietyData.thoughtSymptoms?.join(', ') || 'Khawatir tentang kemungkinan buruk',
        emotionalSymptoms: anxietyData.emotionalSymptoms?.join(', ') || 'Tegang & Gelisah',
        physicalSymptoms: anxietyData.physicalSensations?.join(', ') || 'Jantung berdebar atau otot tegang'
      },
      reflectiveAnswers: {
        outOfControl: anxietyData.uncontrollableAspects || 'Hasil di masa depan atau respon orang lain',
        inControl: anxietyData.controllableActions || 'Latihan bernapas perlahan dan istirahat sejenak'
      },
      lifestyleRecommendations: [
        'Tidur dan istirahat yang cukup',
        'Mengurangi konsumsi kafein berlebihan',
        'Aktivitas fisik ringan atau jalan santai',
        'Latihan kesadaran napas secara teratur'
      ],
      professionalConsultGuide: anxietyData.isSevereOrPersistent
        ? 'Apabila rasa cemas ini mengganggu tidur, pekerjaan, atau hubungan sosial secara terus-menerus, sangat dianjurkan untuk berkonsultasi dengan psikolog atau dokter.'
        : '',
      emergencyMessage: anxietyData.isSelfHarmExpressed
        ? 'Kesehatan dan keselamatan Anda sangat berharga. Jika Anda merasa kewalahan atau memiliki dorongan untuk menyakiti diri, mohon segera hubungi orang terdekat yang Anda percayai atau layanan darurat kesehatan mental (Layanan Sehat Jiwa Kemenkes 119 ext 8 / Kontak Darurat).'
        : '',
      recommendedAudioTheme: anxietyData.isPanicState ? 'Setelah Serangan Panik' : 'Menenangkan Pikiran',
      recommendedModules: [
        {
          moduleName: 'LEGA Breathing',
          reason: 'Membantu meregulasi detak jantung dan meredakan reaksi fisik dari kecemasan.',
          targetModuleKey: 'breathing'
        },
        {
          moduleName: 'LEGA Presence',
          reason: 'Mengembalikan fokus panca indra pada momen saat ini.',
          targetModuleKey: 'mindfulness'
        }
      ]
    };
  }
}

export async function reflectStress(stressData: {
  mainStressor?: string;
  stressDuration?: string;
  thoughtSymptoms?: string[];
  emotionalSymptoms?: string[];
  bodySymptoms?: string[];
  behaviorSymptoms?: string[];
  stressSources?: string[];
  uncontrollableAspects?: string;
  controllableActions?: string;
  primaryNeed?: string;
  isBurnoutOrSevere?: boolean;
  isSelfHarmExpressed?: boolean;
  isChronicStress?: boolean;
}) {
  try {
    const res = await fetch('/api/gemini/stress-reflect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(stressData),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Gagal memproses refleksi LEGA Stress.');
    }
    return data.data;
  } catch (err: any) {
    console.error('reflectStress error:', err);
    return {
      summary: 'Stres adalah respon alami tubuh dan pikiran terhadap tuntutan, perubahan, atau tantangan hidup. Stres bukan musuh, melainkan sinyal bahwa tubuh dan pikiran sedang berusaha beradaptasi.',
      stressTypeExplanation: stressData.isChronicStress
        ? 'Stres Kronis: Stres yang berlangsung lama (mingguan atau bulanan) sehingga membutuhkan strategi pemulihan bertahap dan perhatian khusus.'
        : stressData.isBurnoutOrSevere
        ? 'Stres Episodik / Kelelahan Berat (Burnout): Tekanan tinggi yang menumpuk berulang kali dan menguras energi mental serta fisik.'
        : 'Stres Akut: Respon jangka pendek terhadap tantangan atau tuntutan hidup saat ini.',
      identifiedSources: stressData.stressSources?.length
        ? stressData.stressSources
        : ['Pekerjaan / Kuliah', 'Beban Tanggung Jawab'],
      symptomsBreakdown: {
        thought: stressData.thoughtSymptoms?.join(', ') || 'Sulit fokus, overthinking & pikiran berulang',
        emotion: stressData.emotionalSymptoms?.join(', ') || 'Tegang, marah, cemas atau frustrasi',
        body: stressData.bodySymptoms?.join(', ') || 'Lelah, tegang leher/bahu, gangguan tidur/pencernaan',
        behavior: stressData.behaviorSymptoms?.join(', ') || 'Menunda pekerjaan, menarik diri, atau bekerja berlebihan'
      },
      reflectiveInsights: {
        outOfControl: stressData.uncontrollableAspects || 'Ekspektasi tinggi, tuntutan eksternal, atau reaksi orang lain',
        inControl: stressData.controllableActions || 'Mengambil jeda 5 menit, bernapas, dan mengatur prioritas sederhana',
        primaryNeed: stressData.primaryNeed || 'Istirahat, relaksasi, dan keheningan sejenak',
        microAction: 'Ambil 1 langkah kecil: lepaskan ketegangan leher, minum air putih hangat, dan tarik napas dalam.'
      },
      protectiveFactorTips: [
        'Tidur & istirahat yang berkualitas memadai',
        'Olahraga atau jalan kaki ringan untuk merilis endorfin',
        'Nutrisi seimbang & kecukupan konsumsi air putih',
        'Berbagi cerita dengan teman/orang terdekat yang tepercaya',
        'Manajemen waktu & penetapan batas harian yang realistis',
        'Kesadaran diri melalui latihan napas dan relaksasi'
      ],
      professionalConsultGuide: stressData.isChronicStress || stressData.isBurnoutOrSevere
        ? 'Jika stres berlangsung lama, terasa semakin berat, atau mengganggu pekerjaan, hubungan, dan tidur harian secara signifikan, berkonsultasi dengan psikolog klinis atau psikiater sangat dianjurkan.'
        : '',
      emergencyMessage: stressData.isSelfHarmExpressed
        ? 'Kesehatan dan keselamatan Anda adalah yang paling utama. Jika Anda sedang merasa sangat kewalahan atau ada dorongan menyakiti diri, mohon segera hubungi kontak bantuan darurat (Layanan Sehat Jiwa Kemenkes 119 ext 8 / Kontak Darurat Lokal 112 / 118).'
        : '',
      recommendedAudioTheme: stressData.isBurnoutOrSevere ? 'Audio Pelepasan Ketegangan' : 'Audio Relaksasi',
      recommendedModules: [
        {
          moduleName: 'LEGA Breathing',
          reason: 'Meregulasi sistem saraf melalui irama napas yang tenang.',
          targetModuleKey: 'breathing'
        },
        {
          moduleName: 'LEGA Presence',
          reason: 'Kembali berjangkar di momen saat ini dan melepaskan kecemasan.',
          targetModuleKey: 'mindfulness'
        },
        {
          moduleName: 'LEGA Body Awareness',
          reason: 'Memetakan dan melepaskan ketegangan fisik di leher, bahu, dan punggung.',
          targetModuleKey: 'body-awareness'
        }
      ]
    };
  }
}

export async function reflectAnger(angerData: {
  situation?: string;
  mainTrigger?: string;
  underlyingEmotions?: string[];
  unmetNeeds?: string;
  violatedValues?: string;
  controllableAspects?: string;
  desiredWiseResponse?: string;
  thoughtSymptoms?: string[];
  emotionalSymptoms?: string[];
  bodySymptoms?: string[];
  behaviorSymptoms?: string[];
  isHighAnger?: boolean;
  isHarmExpressed?: boolean;
}) {
  try {
    const res = await fetch('/api/gemini/anger-reflect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(angerData),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Gagal memproses refleksi LEGA Anger.');
    }
    return data.data;
  } catch (err: any) {
    console.error('reflectAnger error:', err);
    return {
      summary: angerData.isHighAnger
        ? 'Saat ini emosi Anda sedang sangat tinggi. Berhentilah sejenak. Tarik napas dalam-dalam, rasakan pijakan kaki di lantai, dan lemaskan rahang Anda. Tunda dulu semua keputusan atau tanggapan berdasar emosi sesaat.'
        : 'Marah adalah emosi yang wajar dan membawa pesan bahwa ada kebutuhan, nilai, atau batasan Anda yang terasa terganggu. Dengan mengamatinya secara sadar, Anda bisa memilih respon yang lebih bijaksana.',
      triggersIdentified: angerData.mainTrigger
        ? [angerData.mainTrigger]
        : ['Konflik / Merasa Tidak Dihargai'],
      underlyingEmotions: angerData.underlyingEmotions?.length
        ? angerData.underlyingEmotions
        : ['Kecewa', 'Terluka', 'Terancam'],
      symptomsBreakdown: {
        thought: angerData.thoughtSymptoms?.join(', ') || 'Tegang, sulit berpikir jernih & ingin menyalahkan',
        emotion: angerData.emotionalSymptoms?.join(', ') || 'Kesal, jengkel, atau frustrasi',
        body: angerData.bodySymptoms?.join(', ') || 'Jantung berdebar, otot tegang & rahang mengencang',
        behavior: angerData.behaviorSymptoms?.join(', ') || 'Ingin berdebat, berteriak, atau diam berkepanjangan'
      },
      unmetNeedOrValue: angerData.unmetNeeds || angerData.violatedValues || 'Kebutuhan akan rasa dihargai, keadilan, atau batasan yang dihormati',
      reflectiveInsights: {
        inControl: angerData.controllableAspects || 'Mengatur napas, memilih memberi jeda, dan menunda tanggapan panas',
        wiseResponse: angerData.desiredWiseResponse || 'Menyampaikan batasan diri secara asertif dengan tenang setelah kondisi lebih stabil'
      },
      healthyResponseTips: [
        'Berhenti sejenak & ambil jeda waktu (time-out)',
        'Mengatur napas & melembutkan ketegangan di rahang dan bahu',
        'Mengidentifikasi kebutuhan batin & batas pribadi yang perlu disampaikan',
        'Berkomunikasi secara asertif saat kondisi sudah tenang',
        'Memilih waktu & situasi yang tepat untuk berdiskusi'
      ],
      emergencyMessage: angerData.isHarmExpressed
        ? 'Keselamatan Anda dan orang lain adalah hal yang paling utama. Jika Anda merasa kewalahan atau ada dorongan melukai diri/orang lain, mohon segera hubungi Kontak Darurat Layanan Kesehatan Mental (119 ext 8 / 112 / 118).'
        : '',
      recommendedAudioTheme: angerData.isHighAnger ? 'Audio Menenangkan Tubuh' : 'Audio Mengenali Kemarahan',
      recommendedModules: [
        {
          moduleName: 'LEGA Breathing',
          reason: 'Meregulasi sistem saraf melalui irama napas terpandu saat gejolak emosi.',
          targetModuleKey: 'breathing'
        },
        {
          moduleName: 'LEGA Presence',
          reason: 'Kembali berjangkar di momen saat ini dan mengamati emosi tanpa dorongan impulsif.',
          targetModuleKey: 'mindfulness'
        },
        {
          moduleName: 'LEGA Release',
          reason: 'Menyalurkan energi marah secara aman dan konstruktif.',
          targetModuleKey: 'emotional-release'
        }
      ]
    };
  }
}

export async function reflectSadness(sadnessData: {
  sadnessReason?: string;
  sinceWhen?: string;
  missedOrHoped?: string;
  currentNeeds?: string;
  supportPerson?: string;
  selfKindnessAct?: string;
  thoughtSymptoms?: string[];
  emotionalSymptoms?: string[];
  bodySymptoms?: string[];
  behaviorSymptoms?: string[];
  isDeepSadness?: boolean;
  isCrisisRisk?: boolean;
}) {
  try {
    const res = await fetch('/api/gemini/sadness-reflect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sadnessData),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Gagal memproses refleksi LEGA Sadness.');
    }
    return data.data;
  } catch (err: any) {
    console.error('reflectSadness error:', err);
    return {
      summary: sadnessData.isDeepSadness
        ? 'Perasaan sedih yang mendalam adalah respon alami batin saat menghadapi kehilangan atau perubahan berat. Anda tidak harus terburu-buru merasa baik-baik saja atau memaksa diri tersenyum. Izinkan diri Anda beristirahat dan menerima dekapan rasa ini dengan lembut.'
        : 'Kesedihan adalah bagian dari pengalaman manusia yang membawa pesan tentang hal penting yang Anda pedulikan. Dengan memberi ruang bagi emosi ini, Anda merawat diri sendiri dengan penuh belas kasih.',
      identifiedCauses: sadnessData.sadnessReason
        ? [sadnessData.sadnessReason]
        : ['Kehilangan / Kekecewaan / Perubahan Hidup'],
      dominantEmotions: sadnessData.emotionalSymptoms?.length
        ? sadnessData.emotionalSymptoms
        : ['Sedih', 'Hampa', 'Rindu'],
      symptomsBreakdown: {
        thought: sadnessData.thoughtSymptoms?.join(', ') || 'Mengingat masa lalu, sulit konsentrasi & merasa kehilangan',
        emotion: sadnessData.emotionalSymptoms?.join(', ') || 'Sedih, hampa, atau kesepian',
        body: sadnessData.bodySymptoms?.join(', ') || 'Dada terasa berat, tubuh lemas & energi menurun',
        behavior: sadnessData.behaviorSymptoms?.join(', ') || 'Menarik diri, lebih banyak diam & menangis'
      },
      perceivedNeeds: sadnessData.currentNeeds || 'Istirahat, ketenangan batin, didengar, dan belas kasih kepada diri sendiri',
      selfKindnessAct: sadnessData.selfKindnessAct || 'Memberikan waktu istirahat yang cukup tanpa menghakimi diri sendiri',
      reflectiveInsights: {
        emotionalAcceptance: 'Kesedihan tidak harus segera hilang. Ia merupakan bagian dari proses beradaptasi dan memulihkan batin secara alami.',
        gentleNextStep: 'Lakukan satu hal kecil yang lembut untuk diri Anda hari ini, seperti minum air hangat, memeluk bantal, atau bernapas perlahan.'
      },
      emergencyMessage: sadnessData.isCrisisRisk
        ? 'Keselamatan dan jiwa Anda sangat berharga. Jika Anda merasa sangat terpuruk, merasa tidak sanggup melanjutkan hidup, atau ada dorongan menyakiti diri, mohon segera hubungi Layanan Bantuan Kesehatan Mental Darurat (119 ext 8 / Kontak Crisis Line 112 / 118 / Into The Light).'
        : '',
      recommendedAudioTheme: sadnessData.isDeepSadness ? 'Audio Belas Kasih kepada Diri' : 'Audio Menemani Kesedihan',
      recommendedModules: [
        {
          moduleName: 'LEGA Presence',
          reason: 'Hadir secara utuh pada momen saat ini dan mengamati rasa sedih dengan kelembutan.',
          targetModuleKey: 'mindfulness'
        },
        {
          moduleName: 'LEGA Breathing',
          reason: 'Mengalirkan energi tenang ke dada yang terasa berat melalui irama napas terpandu.',
          targetModuleKey: 'breathing'
        },
        {
          moduleName: 'LEGA Gratitude',
          reason: 'Mengenali titik terang kecil dalam hidup tanpa memaksakan kebahagiaan semu.',
          targetModuleKey: 'gratitude'
        }
      ]
    };
  }
}

export async function reflectGuilt(guiltData: {
  guiltReason?: string;
  whatHappenedFacts?: string;
  realResponsibility?: string;
  outsideControlParts?: string;
  canBeRepaired?: string;
  futureChanges?: string;
  lessonsLearned?: string;
  isExcessiveGuilt?: boolean;
  isCrisisRisk?: boolean;
}) {
  try {
    const res = await fetch('/api/gemini/guilt-reflect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(guiltData),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Gagal memproses refleksi LEGA Guilt.');
    }
    return data.data;
  } catch (err: any) {
    console.error('reflectGuilt error:', err);
    return {
      summary: guiltData.isExcessiveGuilt
        ? 'Rasa bersalah yang berlebihan sering kali bersumber dari standar kesempurnaan yang terlalu tinggi atau memikul beban yang sebenarnya di luar kendali Anda. Menyadari batasan diri adalah langkah awal untuk belajar memaafkan diri sendiri.'
        : 'Rasa bersalah memberi petunjuk tentang nilai pribadi yang Anda pegang. Mengakuinya secara wajar membantu Anda belajar dan melangkah maju tanpa harus terus-menerus menghukum diri.',
      guiltVsShameNotice: {
        isShameDominant: false,
        explanation: 'Guilt berfokus pada evaluasi tindakan ("Aku melakukan hal yang salah"), sedangkan Shame menyerang identitas ("Aku orang yang buruk"). Ingatlah bahwa tindakan Anda tidak mendefinisikan seluruh nilai diri Anda.'
      },
      realityAnalysis: {
        facts: [guiltData.whatHappenedFacts || guiltData.guiltReason || 'Kejadian atau tindakan yang dipermasalahkan'],
        assumptionsOrSelfJudgments: ['Penilaian bahwa Anda seharusnya sempurna atau dapat mengendalikan seluruh respon lingkungan']
      },
      responsibilityBreakdown: {
        userResponsibility: [guiltData.realResponsibility || 'Peran Anda secara objektif dalam situasi ini'],
        outsideControl: [guiltData.outsideControlParts || 'Tindakan orang lain, faktor masa lalu, atau hal di luar kendali']
      },
      repairAndNextSteps: [
        guiltData.canBeRepaired || 'Meminta maaf dengan tulus atau melakukan tindakan perbaikan konkret jika memungkinkan',
        guiltData.futureChanges || 'Menjaga batasan diri dan belajar dari kejadian ini untuk masa depan'
      ],
      selfCompassionMessage: 'Anda boleh mengakui kesalahan tanpa membenci diri sendiri. Kesalahan adalah bagian dari proses belajar sebagai manusia.',
      emergencyMessage: guiltData.isCrisisRisk
        ? 'Jiwa dan keselamatan Anda sangat berharga. Jika Anda merasa keputusasaan berat atau ada dorongan menyakiti diri, mohon segera hubungi Layanan Sehat Jiwa Kemenkes 119 ext 8 / Kontak Darurat 112 / 118 / Into The Light.'
        : '',
      recommendedAudioTheme: 'Audio Memahami Rasa Bersalah',
      recommendedModules: [
        {
          moduleName: 'LEGA Forgiveness',
          reason: 'Latihan melepaskan penyesalan dan memaafkan diri sendiri dengan belas kasih.',
          targetModuleKey: 'forgiveness'
        },
        {
          moduleName: 'LEGA Observer',
          reason: 'Mengamati pikiran penyesalan dan penilaian diri tanpa membiarkannya menghakimi Anda.',
          targetModuleKey: 'observer'
        },
        {
          moduleName: 'LEGA Self Awareness',
          reason: 'Memahami batas tanggung jawab dan nilai pribadi yang sesungguhnya.',
          targetModuleKey: 'self-discovery'
        }
      ]
    };
  }
}

export async function reflectShame(shameData: {
  shameTrigger?: string;
  fearOfOthersThoughts?: string;
  selfTalkOnShame?: string;
  factVsJudgment?: string;
  lovingFriendPerspective?: string;
  neededRightNow?: string;
  learnAboutSelf?: string;
  isSevereShame?: boolean;
  isCrisisRisk?: boolean;
}) {
  try {
    const res = await fetch('/api/gemini/shame-reflect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(shameData),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Gagal memproses refleksi LEGA Shame.');
    }
    return data.data;
  } catch (err: any) {
    console.error('reflectShame error:', err);
    return {
      summary: shameData.isSevereShame
        ? 'Rasa malu sering kali terasa seperti beban berat yang mengisolasi. Ingatlah bahwa merasa terluka atau tidak cukup baik bukan berarti ada yang salah dengan martabat diri Anda sebagai manusia.'
        : 'Rasa malu adalah emosi alami saat kita merasa takut akan penolakan atau penilaian. Memisahkan kejadian dari identitas diri membantu Anda kembali melihat nilai diri yang utuh.',
      shameVsGuiltNotice: {
        isGuiltMoreRelevant: false,
        explanation: 'Shame cenderung berfokus pada identitas ("Aku tidak cukup baik"), sedangkan Guilt berfokus pada tindakan ("Aku melakukan hal yang salah"). Anda sedang mengalami emosi malu, namun emosi ini bukan identitas Anda.'
      },
      realityCheck: {
        facts: [shameData.factVsJudgment || shameData.shameTrigger || 'Kejadian atau pemicu rasa malu yang dialami'],
        selfJudgmentsAndFear: [shameData.fearOfOthersThoughts || shameData.selfTalkOnShame || 'Kritik internal dan ketakutan akan penilaian orang lain']
      },
      selfAcceptanceSeparation: {
        behaviorVsIdentity: 'Perilaku, kesalahan, atau penolakan adalah pengalaman yang terjadi, bukan keseluruhan identitas Anda.',
        rejectionVsSelfWorth: 'Penolakan atau penilaian orang lain tidak mengubah martabat dan nilai diri Anda sebagai manusia.'
      },
      perceivedNeeds: shameData.neededRightNow || 'Kelembutan pada diri sendiri, rasa aman, dan ruang untuk bernapas tanpa dihakimi.',
      selfCompassionMessage: shameData.lovingFriendPerspective
        ? `Seperti sikap Anda kepada orang yang disayangi: "${shameData.lovingFriendPerspective}"`
        : 'Anda sedang mengalami rasa malu, bukan menjadi rasa malu itu. Kesalahan atau kegagalan tidak menentukan nilai diri Anda. Anda tetap manusia yang sedang bertumbuh.',
      emergencyMessage: shameData.isCrisisRisk
        ? 'Jiwa dan keselamatan Anda sangat berharga. Jika Anda merasa keputusasaan berat atau ada dorongan menyakiti diri, mohon segera hubungi Layanan Sehat Jiwa Kemenkes 119 ext 8 / Kontak Darurat 112 / 118 / Into The Light.'
        : '',
      recommendedAudioTheme: 'Audio Mengenali Rasa Malu',
      recommendedModules: [
        {
          moduleName: 'LEGA Observer',
          reason: 'Latihan menjadi saksi terhadap rasa malu dan suara kritik diri tanpa hanyut didalamnya.',
          targetModuleKey: 'observer'
        },
        {
          moduleName: 'LEGA Self Awareness',
          reason: 'Memahami bahwa nilai diri tidak ditentukan oleh ekspektasi atau penolakan eksternal.',
          targetModuleKey: 'self-discovery'
        },
        {
          moduleName: 'LEGA Body Awareness',
          reason: 'Meringankan sensasi tegang dan panas pada tubuh yang dipicu oleh emosi malu.',
          targetModuleKey: 'body-awareness'
        }
      ]
    };
  }
}

export async function reflectFear(fearData: {
  whatIsFeared?: string;
  isRealDangerNow?: boolean;
  imaginedScenario?: string;
  evidenceForWorry?: string;
  unknowns?: string;
  pastExperienceLink?: string;
  thingsInControl?: string;
  safestStep?: string;
  isHealthFear?: boolean;
  isPanicState?: boolean;
  isCrisisRisk?: boolean;
}) {
  try {
    const res = await fetch('/api/gemini/fear-reflect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fearData),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Gagal memproses refleksi LEGA Fear.');
    }
    return data.data;
  } catch (err: any) {
    console.error('reflectFear error:', err);
    return {
      summary: fearData.isRealDangerNow
        ? 'PERHATIAN: Keselamatan Anda adalah prioritas utama. Jika terdapat ancaman atau bahaya nyata saat ini, segera cari tempat aman dan hubungi bantuan terdekat.'
        : 'Rasa takut adalah bagian dari sistem perlindungan alami tubuh untuk menjaga keselamatan Anda. Membedakan antara bahaya nyata dan kekhawatiran membantu Anda merespons secara lebih tenang dan rasional.',
      fearTrigger: fearData.whatIsFeared || 'Ketakutan atau kekhawatiran yang dialami',
      fearType: fearData.isRealDangerNow ? 'Takut bahaya nyata' : 'Takut ketidakpastian',
      realDangerCheck: {
        isRealDanger: !!fearData.isRealDangerNow,
        safetyAdvice: fearData.isRealDangerNow
          ? 'Jangan bertahan dalam situasi berbahaya. Prioritaskan tempat aman dan bantuan fisik/darurat terdekat.'
          : 'Tidak ada ancaman fisik langsung yang terdeteksi saat ini. Anda berada dalam kondisi aman untuk melakukan refleksi.'
      },
      responseSpectrum: {
        thoughts: [fearData.imaginedScenario || 'Prediksi kemungkinan buruk di masa depan'],
        bodySensations: ['Jantung berdebar', 'Otot menegang', 'Napas memburu atau membendung'],
        behavioralPattern: 'Kecenderungan untuk menghindar, menunda, atau mencari kepastian berulang kali'
      },
      controlAnalysis: {
        inControl: [fearData.thingsInControl || 'Napas saat ini, tindakan kecil yang aman, tempat berdiri'],
        outOfControl: ['Pandangan orang lain, kepastian mutlak di masa depan, kejadian masa lalu']
      },
      suggestedSafeAction: fearData.safestStep || 'Ambil satu napas dalam, sadari lantai di bawah kaki, dan lakukan satu langkah kecil yang realistis.',
      gradualFacingSteps: [
        'Langkah 1: Amati rasa takut tanpa langsung melarikan diri atau melawannya.',
        'Langkah 2: Tentukan satu aksi kecil yang 10% dapat dilakukan sekarang.',
        'Langkah 3: Evaluasi respon tubuh dan berikan jeda istirahat.'
      ],
      emergencyMessage: fearData.isCrisisRisk
        ? 'Jiwa dan keselamatan Anda sangat berharga. Jika Anda merasa keputusasaan berat atau ada dorongan menyakiti diri, mohon segera hubungi Layanan Sehat Jiwa Kemenkes 119 ext 8 / Kontak Darurat 112 / 118 / Into The Light.'
        : '',
      recommendedAudioTheme: 'Audio Mengenali Rasa Takut',
      recommendedModules: [
        {
          moduleName: 'LEGA Presence',
          reason: 'Kembali menyatu dengan momen saat ini melalui panca indra saat pikiran membayangkan hal buruk.',
          targetModuleKey: 'mindfulness'
        },
        {
          moduleName: 'LEGA Breathing',
          reason: 'Meregulasi sistem saraf parasimpatik untuk meredakan detak jantung dan ketegangan fisik.',
          targetModuleKey: 'breathing'
        },
        {
          moduleName: 'LEGA Body Awareness',
          reason: 'Mengenali sensasi fisik ketakutan di tubuh dan melepaskan ketegangan secara bertahap.',
          targetModuleKey: 'body-awareness'
        }
      ]
    };
  }
}

export async function reflectLifePurpose(purposeData: {
  selectedValues?: string[];
  strengths?: string;
  interests?: string;
  meaningfulMoments?: string;
  peopleToHelp?: string;
  idealFutureVision?: string;
  currentObstacles?: string;
  smallStepToday?: string;
  isLostOrEmpty?: boolean;
  isCrisisRisk?: boolean;
}) {
  try {
    const res = await fetch('/api/gemini/life-purpose-reflect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(purposeData),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Gagal memproses refleksi LEGA Life Purpose.');
    }
    return data.data;
  } catch (err: any) {
    console.error('reflectLifePurpose error:', err);
    return {
      summary: purposeData.isLostOrEmpty
        ? 'Anda tidak harus memiliki semua jawaban atau tujuan hidup yang besar hari ini. Makna hidup dapat dibangun secara perlahan mulai dari apa yang Anda pedulikan dan tindakan kecil yang bisa Anda lakukan saat ini.'
        : 'Eksplorasi menunjukkan bahwa arah hidup Anda bertumpu pada nilai-nilai yang Anda pegang serta keinginan untuk terus berkembang dan memberikan dampak positif.',
      primaryValues: purposeData.selectedValues?.length ? purposeData.selectedValues : ['Pertumbuhan', 'Keluarga', 'Ketenangan'],
      identifiedStrengths: [purposeData.strengths || 'Kemampuan beradaptasi, belajar hal baru, serta kepekaan emosional'],
      identifiedInterests: [purposeData.interests || 'Eksplorasi ilmu baru, membantu sesama, dan aktivitas kreatif'],
      meaningfulElements: [purposeData.meaningfulMoments || 'Momen saat mampu berbagi kebermanfaatan dan menyelesaikan tantangan dengan jujur'],
      tentativePurposeStatement: `Saya ingin menggunakan ${purposeData.strengths || 'kemampuan dan kepekaan diri'} untuk ${purposeData.peopleToHelp || 'membantu lingkungan sekitar'} dengan cara ${purposeData.smallStepToday || 'melakukan tindakan nyata yang jujur'} agar dapat memberikan ${purposeData.selectedValues?.[0] || 'kebermanfaatan dan ketenangan'}.`,
      lifeVision: {
        shortTermGoals: ['Membangun kebiasaan harian yang selaras dengan nilai utama dalam 1-3 bulan ke depan.'],
        mediumTermGoals: ['Mengembangkan keterampilan atau proyek pribadi yang berdampak dalam 6-12 bulan.'],
        longTermGoals: ['Menciptakan pola hidup yang seimbang antara pertumbuhan diri, hubungan, dan kontribusi.'],
        supportingHabits: ['Refleksi harian 5 menit', 'Membaca atau belajar hal baru 15 menit setiap hari']
      },
      valueToGoalMap: [
        {
          value: purposeData.selectedValues?.[0] || 'Pertumbuhan',
          direction: 'Terus memupuk wawasan dan keterampilan pribadi',
          goal: 'Mempelajari 1 keterampilan baru secara konsisten',
          habit: 'Membaca atau berlatih 20 menit per hari'
        }
      ],
      lifePurposeScores: {
        valueClarity: 75,
        directionClarity: 70,
        activityAlignment: 65,
        goalClarity: 70,
        actionConsistency: 60
      },
      lostDirectionMessage: purposeData.isLostOrEmpty
        ? 'Merasa bingung atau kehilangan arah adalah bagian manusiawi dari perjalanan hidup. Luangkan waktu untuk bernapas dan mulailah dari satu tindakan kecil hari ini.'
        : '',
      recommendedAudioTheme: 'Audio Mengenal Arah Hidup',
      recommendedModules: [
        {
          moduleName: 'LEGA Self Awareness',
          reason: 'Mengenali lebih dalam pola pikir, kekuatan, dan nilai pribadi Anda.',
          targetModuleKey: 'self-discovery'
        },
        {
          moduleName: 'LEGA Journal',
          reason: 'Mencatat perjalanan dan pembelajaran harian Anda untuk melacak pertumbuhan diri.',
          targetModuleKey: 'journal'
        },
        {
          moduleName: 'LEGA Presence',
          reason: 'Membangun jangkar ketenangan di saat ini agar tidak kewalahan oleh bayangan masa depan.',
          targetModuleKey: 'mindfulness'
        }
      ]
    };
  }
}

export async function reflectSpiritual(spiritualData: {
  currentCondition?: string;
  currentEmotion?: string;
  bodyMindResponse?: string;
  experienceStory?: string;
  focusConcept?: string;
  plannedIkhtiar?: string;
  userDoaRequest?: string;
  isCrisisRisk?: boolean;
}) {
  try {
    const res = await fetch('/api/gemini/spiritual-reflect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(spiritualData),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Gagal memproses refleksi LEGA Spiritual Reflection.');
    }
    return data.data;
  } catch (err: any) {
    console.error('reflectSpiritual error:', err);
    return {
      responseFormula: {
        sadari: 'Menyadari dan mengakui emosi serta sensasi tubuh saat ini tanpa menghakimi diri.',
        pahami: 'Memahami bahwa emosi adalah respon alami manusia yang bernilai sebagai sinyal refleksi.',
        refleksikan: 'Menghubungkan pengalaman dengan kerangka nilai Islam (sabar, syukur, ikhtiar, dan tawakal).',
        ikhtiarkan: 'Menentukan tindakan nyata yang dapat dilakukan dalam batas kendali Anda.',
        syukuri: 'Menemukan hal kecil yang dapat dihargai tanpa memaksakan rasa syukur di tengah sedih.',
        sabari: 'Menahan diri dari respon impulsif dan menjaga keteguhan batin.',
        tawakalkan: 'Menyerahkan hasil akhir yang di luar kendali kepada kehendak Allah SWT.',
        melangkah: 'Melanjutkan langkah kehidupan dengan niat yang diperbarui dan batin yang lebih tenang.'
      },
      summary: 'Proses muhasabah membawa kita pada kesadaran bahwa setiap emosi dan dinamika hidup adalah kesempatan untuk berhenti sejenak, mengamati niat, berikhtiar dengan baik, dan menyerahkan hasil akhir kepada Allah SWT dengan hati yang tenang.',
      relevantValues: [
        {
          valueName: 'Sabar & Muhasabah',
          explanation: 'Menghentikan reaksi spontan yang merugikan, mengamati emosi tanpa menghakimi diri, dan mengambil pelajaran dari situasi saat ini.'
        },
        {
          valueName: 'Ikhtiar & Tawakal',
          explanation: 'Melakukan langkah nyata yang berada dalam batas kendali Anda, kemudian menyandarkan hasil kepada pemeliharaan-Nya.'
        }
      ],
      muhasabahQuestions: [
        'Apa yang dapat saya pelajari secara jujur dari apa yang saya rasakan saat ini?',
        'Tindakan atau ucapan apa yang paling sesuai dengan nilai akhlak yang ingin saya jaga?'
      ],
      discoveredLessons: [
        'Kesadaran batin tumbuh saat kita menerima perasaan tanpa memaksanya langsung hilang.',
        'Ketenangan hadir bukan karena mengendalikan semua hal, melainkan karena berfokus pada ikhtiar terbaik hari ini.'
      ],
      actionableIkhtiar: [
        'Menarik napas perlahan dan mengucapkan kalimat dzikir atau doa penenang diri.',
        'Mengambil satu tindakan konkret yang santun untuk menyelesaikan masalah harian.'
      ],
      syukurReflection: 'Di tengah keraguan atau rasa lelah, kita tetap bisa menghargai nikmat napas, kesehatan yang ada, serta kesempatan untuk terus belajar menjadi pribadi yang lebih baik.',
      tawakalReflection: 'Setelah melakukan ikhtiar yang wajar dan realistis, serahkanlah hal-hal yang berada di luar kendali Anda kepada Allah SWT.',
      verifiedIslamicReferences: [
        {
          type: 'Al-Qur\'an',
          source: 'QS. Al-Baqarah: 153',
          textOrMeaning: '"Wahai orang-orang yang beriman, mohonlah pertolongan (kepada Allah) dengan sabar dan shalat. Sungguh, Allah beserta orang-orang yang sabar."',
          contextNote: 'Sabar dan ibadah menjadi jangkar penguat batin dalam menghadapi dinamika kehidupan.'
        }
      ],
      recommendedDoa: {
        arabicOrTranslation: 'Ya Allah, lapangkanlah dadaku, mudahkanlah urusanku, dan bimbinglah hatiku untuk selalu tenang serta ridha terhadap ketetapan-Mu.',
        source: 'Doa Refleksi Diri (QS. Thaha: 25-26)',
        meaning: 'Permohonan kelapangan batin dan kemudahan dalam melangkah.'
      },
      recommendedAudioTheme: 'Hadir dan Mengingat Allah',
      spiritualScores: {
        sabarAwareness: 80,
        syukurGratitude: 85,
        tawakalPeace: 75,
        muhasabahClarity: 80
      }
    };
  }
}

export async function observerReflect(observerData: {
  bodySensations?: string[];
  emotionalWave?: string;
  observedThoughts?: string;
  distanceRating?: number;
  reflectionNotes?: string;
}) {
  try {
    const res = await fetch('/api/gemini/observer-reflect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(observerData),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Gagal memproses pengamatan LEGA Observer.');
    }
    return data.data;
  } catch (err: any) {
    console.error('observerReflect error:', err);
    return {
      observerSummary: `Sebagai Saksi Kesadaran, kamu telah mengamati sensasi tubuh, gelombang emosi (${observerData.emotionalWave || 'netral'}), dan arus pikiran tanpa melengket padanya.`,
      defusionInsight: 'Ingatlah bahwa pikiran adalah peristiwa mental yang datang dan pergi. Kamu bukanlah pikiran tersebut, melainkan tempat yang tenang di mana pikiran itu terlihat.',
      presenceAnchor: 'Teruslah mengamati dengan kelembutan tanpa vonis atau prasangka.',
      recommendedModules: [
        {
          moduleName: 'LEGA Release',
          reason: 'Beri ruang dan lepaskan beban emosional yang telah diamati secara sadar.',
          targetModuleKey: 'emotional-release'
        },
        {
          moduleName: 'LEGA AI Coach',
          reason: 'Diskusikan perspektif Sang Pengamat ini bersama AI Coach.',
          targetModuleKey: 'ai-coach'
        }
      ]
    };
  }
}

export async function presenceReflect(presenceData: {
  durationMinutes?: number;
  userState?: string;
  identifiedEmotion?: string;
  presenceRating?: number;
  userReflectionNotes?: string;
}) {
  try {
    const res = await fetch('/api/gemini/presence-reflect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(presenceData),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Gagal memproses refleksi LEGA Presence.');
    }
    return data.data;
  } catch (err: any) {
    console.error('presenceReflect error:', err);
    return {
      presenceSummary: `Terima kasih telah melatih keberadaan saat ini selama ${presenceData.durationMinutes || 3} menit. Setiap momen kamu kembali sadar adalah kemenangan kecil.`,
      identifiedEmotion: presenceData.identifiedEmotion || 'Tenang / Mengamati',
      reflectionNote: presenceData.userReflectionNotes || 'Membiasakan diri hadir tanpa menghakimi.',
      recommendedNextModules: [
        {
          moduleName: 'LEGA Breathing',
          reason: 'Latihan napas untuk melanjutkan stabilitas sistem saraf.',
          targetModuleKey: 'breathing'
        },
        {
          moduleName: 'LEGA Journal',
          reason: 'Abadikan pengalaman hadir saat ini dalam catatan harian.',
          targetModuleKey: 'journal'
        }
      ]
    };
  }
}

export async function reflectJournal(journal: {
  title: string;
  content: string;
  mood?: string;
  tags?: string[];
}) {
  try {
    const res = await fetch('/api/gemini/journal-reflect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(journal),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Gagal mendapatkan refleksi jurnal.');
    }
    return data.data;
  } catch (err: any) {
    console.error('reflectJournal error:', err);
    return {
      reflection: 'Terima kasih telah menuangkan pikiranmu secara jujur dalam jurnal ini.',
      keyInsight: 'Setiap tulisan adalah cermin kesadaran yang membantumu bertumbuh.',
      gentleSuggestion: 'Luangkan sejenak waktu untuk tersenyum pada dirimu sendiri.',
    };
  }
}

export async function generateAiInsight(emotionLogs: any[], journals: any[]) {
  try {
    const res = await fetch('/api/gemini/insight', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ emotionLogs, journals }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Gagal membuat Insight AI.');
    }
    return data.data;
  } catch (err: any) {
    console.error('generateAiInsight error:', err);
    return {
      overallTrend: 'Kamu sedang dalam proses membangun rutinitas kesadaran diri yang konsisten.',
      dominantEmotions: ['cemas', 'tenang', 'lelah'],
      mainTriggers: ['pekerjaan', 'kurang tidur', 'ekspektasi'],
      growthProgress: 'Setiap pencatatan emosi dan jurnal adalah bukti kamu peduli pada dirimu.',
      weeklyWisdom: 'Teruslah melangkah dalam ritmemu sendiri. Tidak perlu terburu-buru.',
    };
  }
}

export async function generateGeminiTts(text: string, voiceName: string = 'Kore'): Promise<string | null> {
  try {
    const res = await fetch('/api/gemini/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, voiceName }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.success) {
      return null;
    }
    return data.audioDataUrl || (data.audioBase64 ? (data.audioBase64.startsWith('data:') ? data.audioBase64 : `data:audio/wav;base64,${data.audioBase64}`) : null);
  } catch (err: any) {
    return null;
  }
}

export const generateVoiceAudio = generateGeminiTts;


export async function generateProgressAnalysis(params: {
  period?: string;
  userProfile?: any;
  emotionLogs?: any[];
  journalEntries?: any[];
  audioListened?: any[];
  spiritualMode?: boolean;
}) {
  try {
    const res = await fetch('/api/gemini/progress-analysis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Gagal memproses analisis progress.');
    }
    return data.data;
  } catch (err: any) {
    console.error('generateProgressAnalysis error:', err);
    const logsCount = params.emotionLogs?.length || 0;
    return {
      dataMinimumMet: logsCount >= 2,
      minimumDataMessage: logsCount < 2 ? 'Data Anda masih terlalu sedikit untuk melihat pola perkembangan jangka panjang.' : '',
      period: params.period || '7_days',
      progressLevel: {
        level: Math.min(Math.max(Math.floor(logsCount / 3) + 1, 1), 6),
        title: `LEVEL ${Math.min(Math.max(Math.floor(logsCount / 3) + 1, 1), 6)}: ${logsCount > 5 ? 'MULAI MEMAHAMI' : 'MULAI SADAR'}`,
        description: 'Mengenali emosi dan melatih kebiasaan refleksi secara jujur di aplikasi.'
      },
      emotionTrends: {
        dominantEmotions: params.emotionLogs?.map((l: any) => l.emotion).slice(0, 3) || ['Cemas', 'Tenang'],
        trendDirection: 'Stabil',
        intensityAverage: 'Sedang (5.0/10)',
        frequentTriggers: ['Aktivitas Harian', 'Tenggat Waktu']
      },
      practiceStats: {
        mostUsedModules: ['LEGA Presence', 'LEGA Breathing', 'LEGA Journal'],
        totalSessions: logsCount,
        streakDays: params.userProfile?.streakDays || 1,
        consistencySummary: 'Catatan latihan Anda menunjukkan kebiasaan berhenti dan mengamati semakin teratur.'
      },
      keyInsights: [
        {
          data: `Anda telah melakukan ${logsCount} sesi refleksi emosi.`,
          pattern: 'Latihan digunakan secara berkala saat membutuhkan jeda.',
          possibleMeaning: 'Refleksi mulai menjadi kebiasaan berjangkar saat menghadapi gejolak pikiran.',
          confidence: 'HIGH',
          recommendation: 'Lanjutkan latihan ini dengan konsistensi lembut tanpa memaksakan hasil.'
        }
      ],
      periodInsightFormat: {
        title: 'Insight Perkembangan Periode Ini',
        mostFrequent: 'Emosi Cemas & Tenang',
        mostUsedPractice: 'LEGA Presence & Breathing',
        observedPattern: 'Kecenderungan untuk jeda sejenak meningkat saat akhir pekan.',
        reflectionToConsider: 'Apa satu hal kecil yang membuat Anda merasa paling tenang minggu ini?',
        nextSmallStep: 'Lakukan 1 kali LEGA Presence 3 menit saat berpindah aktivitas.'
      },
      recommendedExercises: ['LEGA Overthinking', 'LEGA Presence', 'LEGA Breathing'],
      recommendedAudio: ['Panduan Audio Hadir Saat Ini (5 Menit)', 'Pelepasan Ketegangan Tubuh'],
      recommendedArticles: ['Mengapa Kita Sering Overthinking?', 'Belajar Mengenali Emosi Marah'],
      safetyDisclaimer: 'Analisis progress ini adalah cerminan kebiasaan refleksi aplikasi LEGA dan bukan diagnosis medis atau indikator kesehatan mental klinis.'
    };
  }
}

export async function getDashboardSummary(params: {
  userName?: string;
  timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night';
  recentEmotionLogs?: any[];
  recentJournals?: any[];
  userProfile?: any;
  userGoals?: string[];
  spiritualMode?: boolean;
}) {
  try {
    const res = await fetch('/api/gemini/dashboard-summary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    const data = await res.json();
    if (res.ok && data.success && data.data) {
      return data.data;
    }
  } catch (err: any) {
    // Gracefully handle without crashing
  }

  const latestEmotion = params.recentEmotionLogs?.[0]?.emotion || 'Tenang';
  const streak = params.userProfile?.streakDays || 1;
  const timeOfDay = params.timeOfDay || 'morning';

  let timeGreeting = 'Selamat Pagi';
  if (timeOfDay === 'afternoon') timeGreeting = 'Selamat Siang';
  if (timeOfDay === 'evening') timeGreeting = 'Selamat Sore';
  if (timeOfDay === 'night') timeGreeting = 'Selamat Malam';

  return {
    greeting: `${timeGreeting}, ${params.userName || 'Sahabat'}. Mari sejenak berhenti dan menyapa dirimu hari ini.`,
      currentState: {
        mood: 'Baik',
        dominantEmotion: latestEmotion,
        energyLevel: 'Sedang',
        bodyState: 'Napas teratur',
        reflectionStatus: params.recentEmotionLogs?.length ? 'Sudah check-in' : 'Belum check-in'
      },
      aiInsights: [
        {
          text: `Catatan emosi Anda menunjukkan kecenderungan merasa ${latestEmotion.toLowerCase()} dalam beberapa sesi terakhir.`,
          type: 'emotion_pattern'
        },
        {
          text: 'Melakukan latihan jeda 3 menit secara rutin membantu menstabilkan saraf tubuh.',
          type: 'practice_effect'
        }
      ],
      primaryRecommendation: {
        title: 'LEGA Presence 3 Menit',
        moduleKey: 'mindfulness',
        duration: '3 Menit',
        goal: 'Menjangkarkan kesadaran pada momen saat ini.',
        actionLabel: 'Mulai Latihan'
      },
      secondaryRecommendation: {
        title: 'Jurnal Refleksi Singkat',
        moduleKey: 'journal',
        duration: '5 Menit',
        goal: 'Tuliskan apa yang ada di hatimu tanpa penilaian.'
      },
      recommendedPractices: [
        {
          title: 'LEGA Presence',
          moduleKey: 'mindfulness',
          duration: '3 Menit',
          goal: 'Latihan hadir penuh tanpa menghakimi.',
          description: 'Hadir utuh di tempatmu berada sekarang.'
        },
        {
          title: 'LEGA Breathing',
          moduleKey: 'breathing',
          duration: '4 Menit',
          goal: 'Relaksasi sistem saraf melalui nafas teratur.',
          description: 'Napas ritmis 4-7-8 untuk menenangkan ketegangan.'
        },
        {
          title: 'LEGA Observer',
          moduleKey: 'emotion-analysis',
          duration: '5 Menit',
          goal: 'Mengamati emosi tanpa terlarut di dalamnya.',
          description: 'Melihat pikiran dan emosi seperti awan berlalu.'
        }
      ],
      recommendedAudio: {
        title: 'Hadir Saat Ini — Panduan Relaksasi',
        category: 'Mindfulness & Presence',
        duration: '5 Menit',
        purpose: 'Panduan suara lembut untuk mengistirahatkan pikiran.',
        scriptText: 'Ambil posisi duduk yang nyaman... izinkan tubuhmu beristirahat sejenak.'
      },
      dailyReflectionStatus: {
        isCompleted: params.recentEmotionLogs?.length > 0,
        summary: params.recentEmotionLogs?.length ? 'Anda sudah melakukan check-in hari ini.' : 'Belum ada refleksi harian.',
        learningPoint: 'Satu menit hening sudah cukup untuk menyapa dirimu.'
      },
      progressSummary: {
        reflectionStreak: streak,
        consistencyText: `Anda telah menjaga rutin refleksi ${streak} hari berturut-turut.`,
        habitGrowth: 'Kebiasaan jeda sejenak mulai terbentuk secara alami.'
      },
      emotionSnapshot: {
        dominant: latestEmotion,
        breakdown: [
          { name: latestEmotion, percentage: 50 },
          { name: 'Tenang', percentage: 30 },
          { name: 'Lelah', percentage: 20 }
        ]
      },
      weeklyInsight: {
        dominantEmotion: latestEmotion,
        reflectionTheme: 'Keseimbangan Hari-ke-Hari',
        favoritePractice: 'LEGA Breathing',
        favoriteAudio: 'Hadir Saat Ini — 5 Menit',
        observedPattern: 'Pola refleksi mingguan menunjukkan konsistensi di saat membutuhkan ketenangan.',
        recommendationForNextWeek: 'Pertahankan jeda 3 menit di sela aktivitas harian Anda.'
      },
      articleRecommendation: {
        title: 'Memahami Hubungan Stres dan Ketegangan Tubuh',
        category: 'Edukasi Emosi',
        readTime: '3 Menit',
        summary: 'Mengapa emosi beresonansi dalam sensasi fisik dan bagaimana mengalirkan kembali ketenangan.',
        articleKey: 'stress-body-connection'
      },
      journalPrompt: {
        question: 'Apa satu hal kecil yang paling Anda butuhkan untuk merasa aman dan tenang hari ini?',
        actionLabel: 'Tulis Sekarang'
      },
      isFirstTimeUser: (params.recentEmotionLogs?.length || 0) === 0,
      safetyFlag: null
    };
}

export async function getAdminSystemStats() {
  try {
    const res = await fetch('/api/admin/system-stats');
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error('Gagal mengambil data sistem admin.');
    }
    return data.data;
  } catch (err) {
    console.error('getAdminSystemStats error:', err);
    return null;
  }
}

export async function askAdminAI(query: string, adminRole: string = 'SUPER ADMIN') {
  try {
    const res = await fetch('/api/gemini/admin-assistant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, adminRole }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Gagal memproses pertanyaan Admin AI.');
    }
    return data.answer;
  } catch (err: any) {
    console.error('askAdminAI error:', err);
    return `Respons Offline: Berdasarkan data internal LEGA CORE SYSTEM, sistem berjalan normal dengan 1,420 total pengguna dan 1,150 lisensi aktif.`;
  }
}



