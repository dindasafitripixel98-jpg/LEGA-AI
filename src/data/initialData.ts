import { Article, AudioTrack, MindBodySensation, SelfDiscoveryItem, EmotionLog, JournalEntry } from '../types';

export const INITIAL_EMOTION_LOGS: EmotionLog[] = [
  {
    id: 'log-1',
    timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
    emotion: 'cemas',
    intensity: 7,
    physicalSensations: ['Dada terasa sesak', 'Bahu tegang'],
    triggers: ['Pekerjaan menumpuk', 'Tenggat waktu dekat'],
    notes: 'Terlalu banyak pikiran tentang hasil besok.',
    aiAnalysis: {
      summary: 'Kecemasan timbul dari antisipasi masa depan yang belum terjadi.',
      underlyingNeed: 'Kebutuhan akan kepastian dan rasa aman.',
      reflectiveQuestion: 'Apa satu hal kecil yang berada dalam kendalimu saat ini?',
      suggestedExercise: 'Latihan Pernapasan Kotak 4-4-4-4'
    }
  },
  {
    id: 'log-2',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    emotion: 'lelah',
    intensity: 6,
    physicalSensations: ['Mata berat', 'Kepala pusing'],
    triggers: ['Kurang tidur', 'Kurang istirahat mental'],
    notes: 'Terlalu lama menatap layar komputer.',
    aiAnalysis: {
      summary: 'Kelelahan fisik dan mental yang menumpuk.',
      underlyingNeed: 'Kebutuhan untuk jeda dan pemulihan energi.',
      reflectiveQuestion: 'Bagaimana kamu bisa memberikan ruang istirahat tanpa rasa bersalah?',
      suggestedExercise: 'Pemeriksaan Sensasi Tubuh (Body Scan)'
    }
  },
  {
    id: 'log-3',
    timestamp: new Date().toISOString(),
    emotion: 'tenang',
    intensity: 8,
    physicalSensations: ['Napas perlahan', 'Otot rileks'],
    triggers: ['Berjalan pagi', 'Mendengarkan musik tenang'],
    notes: 'Merasa lebih terhubung dengan diri sendiri hari ini.',
    aiAnalysis: {
      summary: 'Kondisi kesadaran penuh yang stabil.',
      underlyingNeed: 'Kebutuhan akan kedamaian batin terpenuhi.',
      reflectiveQuestion: 'Apa yang membantu momen tenang ini hadir?',
      suggestedExercise: 'Jurnal Rasa Bersyukur'
    }
  }
];

export const INITIAL_JOURNALS: JournalEntry[] = [
  {
    id: 'journal-1',
    title: 'Mencoba Menerima Ketidakpastian',
    date: new Date(Date.now() - 86400000 * 3).toISOString().split('T')[0],
    content: 'Hari ini aku merasa cukup tertekan dengan tanggapan orang lain. Aku ingin semua berjalan sempurna, tapi rasanya tidak mungkin. Aku belajar bahwa tidak apa-apa jika tidak semua hal bisa kukendalikan.',
    mood: 'cemas',
    tags: ['Ekspektasi', 'Penerimaan', 'Kerja'],
    aiFeedback: {
      reflection: 'Kamu sedang mengenali pola perfeksionisme dan dampaknya pada emosimu.',
      keyInsight: 'Kedamaian sering muncul bukan saat kita mengendalikan segalanya, melainkan saat kita berhenti mencoba mengendalikan yang tak terkendali.',
      gentleSuggestion: 'Ajak dirimu melihat hal-hal baik yang sudah selesai hari ini, sekecil apa pun.'
    }
  },
  {
    id: 'journal-2',
    title: 'Momen Jeda di Tengah Kesibukan',
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    content: 'Aku mengambil waktu 10 menit siang tadi untuk menarik napas dalam-dalam di dekat jendela. Rasanya sederhana, tapi mengembalikan kesadaran bahwa aku ada di sini saat ini.',
    mood: 'tenang',
    tags: ['Mindfulness', 'Napas', 'Jeda'],
    aiFeedback: {
      reflection: 'Langkah kecil yang luar biasa dalam membangun kebiasaan hadir secara utuh.',
      keyInsight: 'Kesadaran diri tidak memerlukan waktu berjam-jam; beberapa helaan napas yang sadar sudah cukup mengubah kualitas harimu.',
      gentleSuggestion: 'Pertahankan ritual jeda singkat ini di waktu yang sama esok hari.'
    }
  }
];

export const INITIAL_ARTICLES: Article[] = [
  {
    id: 'art-1',
    title: 'Memahami Bahasa Emosi: Mengapa Tidak Ada Emosi Jahat',
    category: 'Regulasi Emosi',
    readTime: '4 menit',
    summary: 'Emosi seperti marah, cemas, dan sedih sering dianggap negatif. Padahal, setiap emosi adalah utusan yang membawa pesan penting tentang kebutuhan diri kita.',
    author: 'Tim Psikologi LEGA',
    tags: ['Dasar Emosi', 'Kesadaran Diri', 'Kesehatan Mental'],
    content: `
      Banyak dari kita tumbuh dengan anggapan bahwa emosi tertentu seperti marah, takut, atau sedih harus segera dihilangkan atau disembunyikan. Namun, dalam pendekatan *Self Awareness*, emosi dipandang sebagai sinyal navigasi alami manusia.

      **1. Marah adalah Penjaga Batas Diri**
      Rasa marah sering kali muncul ketika batas pribadi kita dilanggar atau ada ketidakadilan yang dirasakan. Rasa marah memberitahu kita: *"Ada sesuatu yang penting bagimu yang terancam."*

      **2. Cemas adalah Alarm Perlindungan**
      Kecemasan adalah cara otak bersiap menghadapi kemungkinan bahaya atau ketidakpastian. Alarm ini ingin memastikan kita aman, meskipun terkadang sensitivitasnya terlalu tinggi.

      **3. Sedih adalah Proses Penyembuhan**
      Kesedihan membantu kita memproses kehilangan, kekecewaan, atau perubahan. Ia mengajak kita melambat dan menerima kenyataan baru.

      **Langkah Praktis LEGA:**
      Saat emosi datang, alih-alih bertanya *"Bagaimana cara menghilangkan rasa ini?"*, cobalah bertanya: *"Pesan apa yang sedang dicoba disampaikan oleh emosiku saat ini?"*
    `
  },
  {
    id: 'art-2',
    title: 'Teknik Grounding 5-4-3-2-1 untuk Meredakan Pikiran Berpacu',
    category: 'Latihan Kesadaran',
    readTime: '3 menit',
    summary: 'Ketika pikiran melayang ke kecemasan masa depan atau penyesalan masa lalu, teknik sensorik sederhana ini membawa Anda kembali ke momen saat ini.',
    author: 'Shaqila Digital 99 & LEGA AI',
    tags: ['Grounding', 'Kecemasan', 'Hadir Saat Ini'],
    content: `
      Teknik Grounding 5-4-3-2-1 memanfaatkan lima indra tubuh untuk mengalihkan fokus otak dari narasi pikiran ke realitas fisik di sekitar Anda.

      **Caranya Sangat Mudah:**
      - **5 Hal yang Dilihat:** Amati 5 benda di sekitar Anda. Perhatikan warna, bentuk, atau teksturnya.
      - **4 Hal yang Disentuh:** Rasakan 4 tekstur fisik, seperti pijakan kaki di lantai, pakaian yang Anda kenakan, atau permukaan meja.
      - **3 Suara yang Didengar:** Dengarkan 3 suara berbeda (detak jam, angin, dengung AC, atau kicau burung).
      - **2 Bau yang Dihirup:** Rasakan 2 aroma di sekitar Anda (aroma kopi, wangi pakaian, atau udara segar).
      - **1 Rasa yang Dirasakan:** Rasakan 1 sensasi di lidah (sisa rasa minuman atau kondisi mulut Anda).

      Lakukan tanpa tergesa-gesa. Tarik napas lembut di antara setiap pengamatan.
    `
  },
  {
    id: 'art-3',
    title: 'Mengenali Hubungan Pikiran, Emosi, dan Sensasi Tubuh',
    category: 'Psikoedukasi',
    readTime: '5 menit',
    summary: 'Tubuh kita selalu berbicara lebih cepat daripada pikiran kita. Pelajari bagaimana reaksi somatic/fisik merupakan cermin dari emosi yang belum terproses.',
    author: 'Tim Psikologi LEGA',
    tags: ['Koneksi Pikiran-Tubuh', 'Somatis', 'Kesehatan Holistik'],
    content: `
      Pernahkah Anda merasakan dada sesak saat cemas, atau leher tegang setelah seharian menahan kejengkolan? Ini dikenal sebagai *mind-body connection*.

      **Bagaimana Tubuh Merespons:**
      - **Sistem Saraf Otonom:** Saat kita mempersepsikan ancaman (baik nyata maupun pikiran), tubuh mengaktifkan mode *fight-or-flight*, meningkatkan detak jantung dan ketegangan otot.
      - **Penumpukan Ketegangan:** Jika emosi dipendam dan tidak diekspresikan secara sehat, ketegangan tersebut mengendap di otot-otot tertentu.

      **Mengembalikan Kesadaran Tubuh:**
      Melalui latihan pelepasan ketegangan fisik (somatic release), kita membantu sistem saraf kembali ke kondisi *rest and digest* (rileks dan aman).
    `
  }
];

export const INITIAL_AUDIO_TRACKS: AudioTrack[] = [
  {
    id: 'aud-1',
    title: 'Napas Penghening Senja',
    category: 'guided',
    duration: '5 Menit',
    description: 'Panduan audio lembut untuk meredakan ketegangan setelah beraktivitas seharian.',
    isAiGenerated: true,
    metadata: {
      atmosphereTheme: 'Pelepasan Ketegangan Senja & Hening Malam',
      natureSoundType: 'aliran-sungai',
      natureSoundLabel: 'Aliran Sungai Alami',
      ambientMusicType: 'piano-lembut',
      ambientMusicLabel: 'Piano Lembut Akustik (432Hz)',
      narrationVolume: 90,
      natureVolume: 25,
      musicVolume: 20,
      fadeInSeconds: 4.5,
      fadeOutSeconds: 6.0,
      loopRecommendation: 'Seamless Organic Crossfade Loop (30 Detik)',
      voiceWarmthDescription: 'Suara Bahasa Indonesia hangat, lembut, artikulasi tenang, dan ritme perlahan.'
    }
  },
  {
    id: 'aud-2',
    title: 'Gelombang Laut & Kedamaian Batin',
    category: 'nature',
    duration: '10 Menit',
    description: 'Suara alami deburan ombak pantai yang menenangkan gelombang otak.',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/16/audio_db6591201e.mp3',
    metadata: {
      atmosphereTheme: 'Relaksasi Pesisir Pantai & Penyelarasan Napas',
      natureSoundType: 'ombak-pantai',
      natureSoundLabel: 'Ombak Pantai',
      ambientMusicType: 'pad-sinematik',
      ambientMusicLabel: 'Pad Sinematik Mengalun (432Hz)',
      narrationVolume: 90,
      natureVolume: 28,
      musicVolume: 18,
      fadeInSeconds: 5.0,
      fadeOutSeconds: 6.5,
      loopRecommendation: 'Tidal Wave Dynamic Loop (20 Detik)',
      voiceWarmthDescription: 'Suara Bahasa Indonesia hangat, lembut, artikulasi tenang, dan ritme perlahan.'
    }
  },
  {
    id: 'aud-3',
    title: 'Gemericik Hujan Hutan Hujan',
    category: 'nature',
    duration: '15 Menit',
    description: 'Gemericik air hujan di dedaunan rindang untuk fokus dan penerimaan.',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2021/09/06/audio_34d1a1b15a.mp3',
    metadata: {
      atmosphereTheme: 'Hujan Pembasuh Kelelahan & Kenyamanan Batin',
      natureSoundType: 'hujan-lembut',
      natureSoundLabel: 'Hujan Lembut',
      ambientMusicType: 'piano-lembut',
      ambientMusicLabel: 'Piano Lembut Akustik (432Hz)',
      narrationVolume: 90,
      natureVolume: 26,
      musicVolume: 18,
      fadeInSeconds: 4.0,
      fadeOutSeconds: 6.0,
      loopRecommendation: 'Continuous White/Pink Rain Loop (30 Detik)',
      voiceWarmthDescription: 'Suara Bahasa Indonesia hangat, lembut, artikulasi tenang, dan ritme perlahan.'
    }
  },
  {
    id: 'aud-4',
    title: 'Refleksi Pelepasan Beban Batin',
    category: 'tts',
    duration: '3 Menit',
    description: 'Sintesis narasi AI LEGA untuk membimbing Anda melepaskan ekspektasi berlebih.',
    isAiGenerated: true,
    metadata: {
      atmosphereTheme: 'Keberanian Melepaskan & Kasih Sayang Diri',
      natureSoundType: 'angin-pepohonan',
      natureSoundLabel: 'Angin di Pepohonan',
      ambientMusicType: 'string-halus',
      ambientMusicLabel: 'String Halus Meditatif (528Hz)',
      narrationVolume: 90,
      natureVolume: 24,
      musicVolume: 20,
      fadeInSeconds: 4.5,
      fadeOutSeconds: 5.5,
      loopRecommendation: 'Atmospheric Breeze Cycle (30 Detik)',
      voiceWarmthDescription: 'Suara Bahasa Indonesia hangat, lembut, artikulasi tenang, dan ritme perlahan.'
    }
  }
];

export const MIND_BODY_SENSATIONS: MindBodySensation[] = [
  {
    part: 'Dada & Jantung',
    label: 'Dada Sesak / Jantung Berdebar',
    commonEmotions: ['cemas', 'takut', 'sedih'],
    description: 'Sering menandakan kecemasan, rasa berduka, atau rasa takut akan ketidakpastian. Dada terasa sempit karena napas menjadi dangkal.',
    somaticExercise: 'Letakkan kedua telapak tangan di atas dada. Tarik napas perlahan hitungan 4, hembuskan hitungan 6 sambil rasakan kehangatan telapak tangan.'
  },
  {
    part: 'Bahu & Leher',
    label: 'Bahu Tegang & Leher Kaku',
    commonEmotions: ['marah', 'lelah', 'kecewa'],
    description: 'Merupakan tempat penumpukan tanggung jawab berlebih, beban emosional yang dipendam, atau respon terhadap tekanan jangka panjang.',
    somaticExercise: 'Angkat kedua bahu mendekati telinga saat tarik napas, lalu jatuhkan bahu secara mendadak saat hembuskan napas. Ulangi 3 kali.'
  },
  {
    part: 'Perut & Pencernaan',
    label: 'Perut Melilit / Mual / Kembung',
    commonEmotions: ['cemas', 'takut', 'bingung'],
    description: 'Sering disebut "second brain". Ketakutan dan kecemasan sering kali mengganggu ritme pencernaan.',
    somaticExercise: 'Usap perut searah jarum jam secara lembut, lalu praktikkan napas perut (diafragma) agar otak menerima sinyal bahwa tubuh aman.'
  },
  {
    part: 'Kepala & Dahi',
    label: 'Kepala Pusing / Dahi Mengkerut',
    commonEmotions: ['lelah', 'bingung', 'kecewa'],
    description: 'Terjadi akibat *overthinking* (pikiran berlebih), terlalu banyak memproses informasi, atau konflik keputusan.',
    somaticExercise: 'Pijat lembut dahi dari tengah ke arah pelipis dengan gerakan melingkar kecil. Tutup mata selama 1 menit.'
  },
  {
    part: 'Rahang & Gigi',
    label: 'Rahang Terkatup Rapat',
    commonEmotions: ['marah', 'kecewa'],
    description: 'Menandakan rasa marah atau kekecewaan yang ditahan agar tidak meledak ke luar.',
    somaticExercise: 'Buka mulut sedikit, gerakkan rahang bawah ke kiri dan kanan dengan perlahan. Biarkan lidah rileks di dasar mulut.'
  }
];

export const SELF_DISCOVERY_QUESTIONS: SelfDiscoveryItem[] = [
  {
    id: 'sd-1',
    category: 'pola-pikir',
    title: 'Kencenderungan Pikiran Saat Tertekan',
    question: 'Ketika mengalami kegagalan atau kesulitan, narasi pertama apa yang biasanya muncul di dalam pikiranmu?',
    reflectionNote: 'Mengenali dialog internal membantu kita memisahkan fakta dari asumsi emosional.'
  },
  {
    id: 'sd-2',
    category: 'pemicu',
    title: 'Mengenali Pemicu Utama (Triggers)',
    question: 'Situasi atau kata-kata seperti apa dari orang lain yang paling cepat membuat emosimu memuncak?',
    reflectionNote: 'Pemicu emosi sering kali menunjuk pada luka lama atau nilai penting yang dirasa terancam.'
  },
  {
    id: 'sd-3',
    category: 'nilai-hidup',
    title: 'Kompas Nilai Inti',
    question: 'Sebutkan 3 nilai hidup yang paling penting bagimu (misal: Kejujuran, Kebebasan, Kedamaian, Keluarga, Pertumbuhan)?',
    reflectionNote: 'Ketika tindakan kita selaras dengan nilai inti, kita merasakan keutuhan batin.'
  },
  {
    id: 'sd-4',
    category: 'kebutuhan',
    title: 'Bentuk Istirahat yang Dibutuhkan',
    question: 'Apakah kamu lebih butuh istirahat fisik (tidur), istirahat emosional (bercerita), atau istirahat mental (jeda dari layar)?',
    reflectionNote: 'Memahami jenis kelelahan membantu kita memilih bentuk pemulihan yang tepat.'
  }
];
