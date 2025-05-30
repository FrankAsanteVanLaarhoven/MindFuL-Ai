
export const simulateTranslation = (text: string, from: string, to: string): string => {
  const translations: Record<string, Record<string, string>> = {
    'en': {
      'es': 'Hola, ¿cómo estás? Me siento bien hoy.',
      'fr': 'Bonjour, comment allez-vous? Je me sens bien aujourd\'hui.',
      'de': 'Hallo, wie geht es dir? Ich fühle mich heute gut.',
      'ja': 'こんにちは、元気ですか？今日は気分がいいです。',
      'zh': '你好，你好吗？我今天感觉很好。',
      'ar': 'مرحبا، كيف حالك؟ أشعر بحالة جيدة اليوم.',
      'hi': 'नमस्ते, आप कैसे हैं? मैं आज अच्छा महसूस कर रहा हूँ।',
      'ur': 'ہیلو، آپ کیسے ہیں؟ میں آج اچھا محسوس کر رہا ہوں۔',
      'nl': 'Hallo, hoe gaat het? Ik voel me goed vandaag.',
      'pt': 'Olá, como você está? Estou me sentindo bem hoje.',
      'it': 'Ciao, come stai? Mi sento bene oggi.',
      'el': 'Γεια σας, πώς είστε; Νιώθω καλά σήμερα.',
    },
    'es': {
      'en': 'Hello, how are you? I feel good today.',
      'fr': 'Bonjour, comment allez-vous? Je me sens bien aujourd\'hui.',
    },
  };

  if (translations[from] && translations[from][to]) {
    return translations[from][to];
  }

  // Fallback simulation
  const wellnessTerms: Record<string, string> = {
    'anxiety': 'ansiedad',
    'stress': 'estrés',
    'mindfulness': 'atención plena',
    'meditation': 'meditación',
    'wellness': 'bienestar',
    'mental health': 'salud mental',
    'breathing': 'respiración',
    'support': 'apoyo',
  };

  let result = text;
  Object.entries(wellnessTerms).forEach(([eng, spa]) => {
    result = result.replace(new RegExp(eng, 'gi'), spa);
  });

  return result || `[Translated from ${from} to ${to}] ${text}`;
};

export const detectLanguage = (text: string): string => {
  if (/[а-яё]/i.test(text)) return 'ru';
  if (/[あ-ん]|[ア-ン]|[一-龯]/.test(text)) return 'ja';
  if (/[가-힣]/.test(text)) return 'ko';
  if (/[一-龯]/.test(text)) return 'zh';
  if (/[αβγδεζηθικλμνξοπρστυφχψω]/i.test(text)) return 'el';
  if (/[àáâãäå]|[èéêë]|[ìíîï]|[òóôõö]|[ùúûü]|[ýÿ]|[ñ]|[ç]/i.test(text)) {
    if (/[ñ]/.test(text)) return 'es';
    if (/[ç]/.test(text)) return 'fr';
    return 'fr';
  }
  if (/[äöüß]/i.test(text)) return 'de';
  if (/[àèìòù]/i.test(text)) return 'it';
  if (/[ãõ]/i.test(text)) return 'pt';
  if (/[देवनागरी]/i.test(text)) return 'hi';
  if (/[اردو]/i.test(text)) return 'ur';
  if (/[العربية]/i.test(text)) return 'ar';
  return 'en';
};
