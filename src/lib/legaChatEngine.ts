// LEGA AI Coach Dynamic Response Engine
// Implements the 10-step coaching framework from LEGA MASTER PROMPTS 01 & 02

export interface LegaChatResponse {
  replyText: string;
  identifiedEmotion: string | null;
  reflectiveQuestions: string[];
  suggestedExercise: {
    type: 'breathing' | 'grounding' | 'journal' | 'none';
    title: string;
    description: string;
  };
  summaryInsight: string;
}

export function generateLegaContextualChat(messages: any[], userProfile: any): LegaChatResponse {
  const userName = userProfile?.name || 'Sahabat LEGA';
  const lastUserMsg = messages && messages.length > 0
    ? [...messages].reverse().find((m: any) => m.sender === 'user')?.text || ''
    : '';

  const lower = lastUserMsg.toLowerCase();
  const stepCount = Math.min(messages.filter((m: any) => m.sender === 'user').length, 10);

  // 1. Emotion & Theme detection
  let detectedEmotion: string | null = null;
  let category: 'anxiety' | 'sadness' | 'anger' | 'stress' | 'fatigue' | 'overthinking' | 'fear' | 'general' = 'general';

  if (lower.includes('cemas') || lower.includes('panik') || lower.includes('khawatir') || lower.includes('was-was') || lower.includes('gelisah') || lower.includes('sesak')) {
    detectedEmotion = 'cemas';
    category = 'anxiety';
  } else if (lower.includes('sedih') || lower.includes('kecewa') || lower.includes('patah hati') || lower.includes('nangis') || lower.includes('kehilangan') || lower.includes('hampa')) {
    detectedEmotion = 'sedih';
    category = 'sadness';
  } else if (lower.includes('marah') || lower.includes('kesal') || lower.includes('jengkel') || lower.includes('emosi') || lower.includes('benci') || lower.includes('dendam')) {
    detectedEmotion = 'marah';
    category = 'anger';
  } else if (lower.includes('stres') || lower.includes('tertekan') || lower.includes('beban') || lower.includes('pusing') || lower.includes('berat')) {
    detectedEmotion = 'stres';
    category = 'stress';
  } else if (lower.includes('lelah') || lower.includes('capek') || lower.includes('burnout') || lower.includes('lemas') || lower.includes('habis energi')) {
    detectedEmotion = 'lelah mental';
    category = 'fatigue';
  } else if (lower.includes('overthinking') || lower.includes('mikir terus') || lower.includes('pikiran berulang') || lower.includes('bingung') || lower.includes('sulit tidur')) {
    detectedEmotion = 'overthinking';
    category = 'overthinking';
  } else if (lower.includes('takut') || lower.includes('gugup') || lower.includes('ngeri') || lower.includes('trauma')) {
    detectedEmotion = 'takut';
    category = 'fear';
  }

  // 2. Formulate stage-aware dialogue following LEGA 10-step method
  let replyText = '';
  let reflectiveQuestions: string[] = [];
  let suggestedExercise: LegaChatResponse['suggestedExercise'] = {
    type: 'breathing',
    title: 'Napas Hadir Saat Ini (4-2-6)',
    description: 'Tarik napas perlahan 4 detik, tahan santai 2 detik, lalu hembuskan lembut 6 detik.'
  };
  let summaryInsight = 'Mendengarkan pengalaman batin dengan lembut adalah langkah awal menuju kelegaan.';

  switch (category) {
    case 'anxiety':
      replyText = `Saya mendengar dan merasakan bahwa rasa cemas ini terasa cukup intens di dalam diri Anda saat ini, ${userName}. Wajar sekali jika tubuh Anda bereaksi seperti dada berdebar atau napas terasa lebih pendek ketika menghadapi ketidakpastian. Anda berada di tempat yang aman sekarang. Mari kita berikan ruang sejenak bagi rasa cemas ini tanpa perlu melawannya.`;
      reflectiveQuestions = [
        'Sensasi fisik apa yang paling terasa di tubuh Anda saat kecemasan ini muncul?',
        'Dari situasi yang sedang Anda hadapi, hal apa yang saat ini benar-benar berada di bawah kendali Anda?'
      ];
      suggestedExercise = {
        type: 'breathing',
        title: 'LEGA Breathing: Regulasi Sistem Saraf',
        description: 'Tarik napas 4 detik, tahan 2 detik, hembuskan perlahan 6 detik untuk menstabilkan detak jantung.'
      };
      summaryInsight = 'Kecemasan adalah sinyal perlindungan dari tubuh; menjangkarkan napas di saat ini membantu memulihkan rasa aman.';
      break;

    case 'sadness':
      replyText = `Terima kasih sudah mau berbagi apa yang sedang terasa berat di hati Anda, ${userName}. Rasa sedih sering kali hadir saat ada hal yang sangat berharga atau harapan yang belum terwujud. Tidak perlu terburu-buru menghilangkannya atau memaksakan diri tersenyum. Izinkan diri Anda untuk beristirahat dan menerima perasaan ini dengan kelembutan.`;
      reflectiveQuestions = [
        'Apa yang paling Anda butuhkan dari diri Anda sendiri di hari yang terasa berat ini?',
        'Apakah ada hal sederhana yang bisa memberi Anda rasa nyaman atau kehangatan saat ini?'
      ];
      suggestedExercise = {
        type: 'grounding',
        title: 'LEGA Presence: Merangkul Momen Ini',
        description: 'Rasakan sentuhan kedua telapak tangan di dada atau pangkuan, sadari napas mengalir lembut.'
      };
      summaryInsight = 'Memberi ruang bagi kesedihan tanpa penghakiman adalah bentuk belas kasih terdalam pada diri sendiri.';
      break;

    case 'anger':
      replyText = `Saya memahami bahwa situasi ini memicu rasa marah dan kekesalan yang nyata, ${userName}. Marah adalah emosi yang valid dan sering menandakan adanya batasan diri atau nilai penting yang terasa dilanggar. Mari beri jeda sejenak sebelum mengambil respon, agar Anda dapat melihat situasi ini dengan ruang batin yang lebih jernih.`;
      reflectiveQuestions = [
        'Kebutuhan atau nilai penting apa yang terasa tidak dihargai dalam kejadian ini?',
        'Apa respon yang paling bijak dan aman yang bisa Anda pilih saat tubuh mulai lebih rileks?'
      ];
      suggestedExercise = {
        type: 'breathing',
        title: 'LEGA Release: Pelepasan Ketegangan Fisik',
        description: 'Tarik napas dalam melalui hidung, hembuskan panjang melalui mulut sambil melemaskan rahang dan bahu.'
      };
      summaryInsight = 'Marah memberi kita informasi tentang apa yang penting; kejernihan membantu kita menyampaikannya secara sehat.';
      break;

    case 'stress':
      replyText = `Beban tanggung jawab dan tekanan yang menumpuk tentu menguras energi, ${userName}. Wajar jika pikiran terasa penuh dan tubuh terasa kaku. Anda telah berjuang keras hari ini. Sekarang, mari izinkan diri Anda untuk meletakkan sejenak beban pikiran tersebut selama beberapa menit ke depan.`;
      reflectiveQuestions = [
        'Dari seluruh daftar pekerjaan atau urusan, mana 1 hal kecil yang paling mendesak, dan mana yang bisa ditunda?',
        'Kapan terakhir kali Anda memberi waktu jeda murni tanpa memikirkan tugas?'
      ];
      suggestedExercise = {
        type: 'breathing',
        title: 'LEGA Breathing: Jeda 3 Menit',
        description: 'Irama napas seimbang 4 detik tarik napas dan 4 detik hembuskan napas secara ritmis.'
      };
      summaryInsight = 'Istirahat bukan tanda kelemahan, melainkan kebutuhan esensial agar pikiran kembali segar dan terarah.';
      break;

    case 'fatigue':
      replyText = `Tubuh dan batin Anda sedang mengirimkan sinyal nyata bahwa energi Anda sedang berada di titik rendah, ${userName}. Mengakui rasa lelah adalah langkah awal yang sangat berani. Anda tidak harus selalu produktif setiap saat. Mari prioritaskan pemulihan energi Anda hari ini.`;
      reflectiveQuestions = [
        'Bentuk istirahat apa yang paling dirindukan oleh tubuh Anda saat ini?',
        'Apa satu hal yang bisa Anda kurangi atau delegasikan agar pikiran terasa lebih lapang?'
      ];
      suggestedExercise = {
        type: 'grounding',
        title: 'LEGA Body Awareness: Pemindaian Relaksasi',
        description: 'Amati sensasi berat di bahu, leher, dan kelopak mata, lalu izinkan setiap bagian tubuh beristirahat.'
      };
      summaryInsight = 'Menghargai batasan energi tubuh adalah cara terbaik menjaga keberlanjutan hidup jangka panjang.';
      break;

    case 'overthinking':
      replyText = `Pikiran berputar yang memikirkan berbagai skenario memang sangat melelahkan, ${userName}. Otak kita sering kali mencoba mencari kepastian di tengah ketidakpastian. Ingatlah bahwa tidak semua hal yang dibayangkan oleh pikiran adalah kenyataan yang pasti terjadi. Mari kembali ke apa yang nyata di hadapan kita saat ini.`;
      reflectiveQuestions = [
        'Manakah dari kekhawatiran ini yang merupakan fakta nyata saat ini, dan mana yang sekadar asumsi pikiran?',
        'Apa satu langkah kecil berdurasi 2 menit yang bisa Anda lakukan sekarang daripada terus memikirkannya?'
      ];
      suggestedExercise = {
        type: 'grounding',
        title: 'LEGA Observer: Posisi Saksi Pengamat',
        description: 'Amati pikiran sebagai awan yang melintas di langit kesadaran tanpa harus masuk ke dalam ceritanya.'
      };
      summaryInsight = 'Pikiran hanyalah peristiwa mental; Anda adalah ruang hening tempat pikiran itu datang dan pergi.';
      break;

    case 'fear':
      replyText = `Rasa takut atau kekhawatiran akan masa depan adalah respon alami saat kita berhadapan dengan hal yang belum kita kenal, ${userName}. Anda tidak sendirian dalam menghadapi perasaan ini. Mari kita uraikan bersama perlahan-lahan dari titik yang paling aman.`;
      reflectiveQuestions = [
        'Apa skenario yang paling Anda khawatirkan, dan apa sumber daya/dukungan yang Anda miliki untuk menghadapinya?',
        'Bagaimana Anda bisa bersikap lebih ramah dan menguatkan diri sendiri di tengah ketidakpastian ini?'
      ];
      suggestedExercise = {
        type: 'breathing',
        title: 'LEGA Breathing: Menemukan Jangkar Aman',
        description: 'Tarik napas perlahan sambil merasakan telapak kaki menapak kuat di lantai.'
      };
      summaryInsight = 'Keberanian bukan ketiadaan rasa takut, melainkan kemampuan untuk terus melangkah bersama kesadaran napas.';
      break;

    default:
      replyText = `Terima kasih sudah meluangkan waktu berharga untuk menyapa diri sendiri hari ini, ${userName}. Saya mendengarkan apa yang sedang Anda alami. Bersama LEGA AI, kita berada di ruang refleksi yang tenang untuk mengenali pola pikir dan emosi Anda langkah demi langkah.`;
      reflectiveQuestions = [
        'Bagaimana ritme napas dan kenyamanan tubuh Anda pada detik ini?',
        'Apa hal utama yang ingin Anda temukan atau refleksikan dalam sesi kita kali ini?'
      ];
      suggestedExercise = {
        type: 'breathing',
        title: 'Napas Kesadaran Penuh',
        description: 'Perhatikan udara sejuk yang masuk melalui hidung dan udara hangat yang keluar perlahan.'
      };
      summaryInsight = 'Momen saat ini adalah satu-satunya ruang di mana kita memiliki kendali penuh.';
      break;
  }

  // Add step-specific progression context
  if (stepCount >= 4 && stepCount < 7) {
    replyText += `\n\nMenyadari hal ini membantu kita melihat pola batin yang sedang bekerja.`;
  } else if (stepCount >= 7) {
    replyText += `\n\nMelalui refleksi ini, Anda telah menunjukkan komitmen yang indah untuk merawat kesehatan mental diri Anda.`;
  }

  return {
    replyText,
    identifiedEmotion: detectedEmotion,
    reflectiveQuestions,
    suggestedExercise,
    summaryInsight,
  };
}
