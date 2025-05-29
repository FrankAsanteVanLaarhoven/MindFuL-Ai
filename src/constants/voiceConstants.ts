
// Enhanced voice mappings with accent preferences
export const accentVoiceMapping = {
  african: {
    preferred: ['George', 'Daniel', 'Brian'],
    fallback: ['onwK4e9ZLuTAKqWW03F9', 'JBFqnCBsd6RMkjVDRZzb'],
    speechRate: 0.85,
    speechPitch: 1.1,
    volume: 0.9
  },
  asian: {
    preferred: ['Sarah', 'Jessica', 'Lily'],
    fallback: ['EXAVITQu4vr4xnSDxMaL', 'cgSgspJ2msm6clMCkdW9'],
    speechRate: 0.9,
    speechPitch: 1.2,
    volume: 0.8
  },
  indian: {
    preferred: ['Aria', 'Sarah', 'Daniel'],
    fallback: ['9BWtsMINqrJLrRacOk9x', 'EXAVITQu4vr4xnSDxMaL'],
    speechRate: 0.85,
    speechPitch: 1.0,
    volume: 0.85
  },
  chinese: {
    preferred: ['Jessica', 'Eric', 'Alice'],
    fallback: ['cgSgspJ2msm6clMCkdW9', 'cjVigY5qzO86Huf0OWal'],
    speechRate: 0.9,
    speechPitch: 1.15,
    volume: 0.8
  },
  european: {
    preferred: ['Charlotte', 'Will', 'Laura'],
    fallback: ['XB0fDUnXU5powFXDhCwa', 'bIHbv24MWmeRgasZH58o'],
    speechRate: 1.0,
    speechPitch: 1.0,
    volume: 0.85
  },
  mexican: {
    preferred: ['Laura', 'Charlie', 'Daniel'],
    fallback: ['FGY2WhTYpPnrIDTdsKH5', 'IKne3meq5aSn9XLyUdCD'],
    speechRate: 0.85,
    speechPitch: 0.95,
    volume: 0.9
  },
  jamaican: {
    preferred: ['River', 'George', 'Brian'],
    fallback: ['SAz9YHcvj6GT2YYXdXww', 'JBFqnCBsd6RMkjVDRZzb'],
    speechRate: 0.8,
    speechPitch: 1.1,
    volume: 0.95
  },
  moroccan: {
    preferred: ['Aria', 'Daniel', 'Sarah'],
    fallback: ['9BWtsMINqrJLrRacOk9x', 'onwK4e9ZLuTAKqWW03F9'],
    speechRate: 0.85,
    speechPitch: 1.05,
    volume: 0.85
  },
  spanish: {
    preferred: ['Laura', 'Charlie', 'Aria'],
    fallback: ['FGY2WhTYpPnrIDTdsKH5', 'IKne3meq5aSn9XLyUdCD'],
    speechRate: 0.9,
    speechPitch: 0.9,
    volume: 0.9
  },
  italian: {
    preferred: ['Charlotte', 'Will', 'Laura'],
    fallback: ['XB0fDUnXU5powFXDhCwa', 'bIHbv24MWmeRgasZH58o'],
    speechRate: 1.05,
    speechPitch: 1.1,
    volume: 0.9
  },
  ethiopian: {
    preferred: ['George', 'Aria', 'Daniel'],
    fallback: ['JBFqnCBsd6RMkjVDRZzb', '9BWtsMINqrJLrRacOk9x'],
    speechRate: 0.85,
    speechPitch: 1.0,
    volume: 0.85
  },
  mixed: {
    preferred: ['River', 'Alex', 'Taylor'],
    fallback: ['SAz9YHcvj6GT2YYXdXww', 'EXAVITQu4vr4xnSDxMaL'],
    speechRate: 1.0,
    speechPitch: 1.0,
    volume: 0.85
  }
};

// Cultural vocal reactions and background sounds
export const culturalVocalReactions = {
  african: {
    agreement: ['mmm-hmm', 'yes indeed', 'that\'s right', 'I hear you'],
    understanding: ['mmm', 'ah yes', 'I see', 'oh my'],
    empathy: ['oh dear', 'bless your heart', 'my child', 'I feel you'],
    thinking: ['hmm', 'let me see', 'well now', 'you know'],
    calm: ['breathe now', 'take your time', 'it\'s alright', 'easy does it']
  },
  jamaican: {
    agreement: ['seen', 'ya mon', 'fi real', 'true dat'],
    understanding: ['mmm-hmm', 'irie', 'ya get me', 'seen seen'],
    empathy: ['easy nuh', 'mi feel ya', 'no worry bout dat', 'big up yaself'],
    thinking: ['ya see', 'let mi tell ya', 'check dis', 'listen nuh'],
    calm: ['take it easy', 'one love', 'everything irie', 'calm yaself']
  },
  indian: {
    agreement: ['haan haan', 'absolutely', 'very good', 'exactly'],
    understanding: ['acha', 'I see', 'very nice', 'hmm'],
    empathy: ['arre yaar', 'don\'t worry', 'it\'s okay na', 'take care'],
    thinking: ['actually', 'you know what', 'let me think', 'hmm'],
    calm: ['relax karo', 'take deep breath', 'no tension', 'all is well']
  },
  mexican: {
    agreement: ['sí sí', 'claro que sí', 'por supuesto', 'exacto'],
    understanding: ['órale', 'ya veo', 'entiendo', 'ah sí'],
    empathy: ['ay no', 'pobrecito', 'no te preocupes', 'mi amor'],
    thinking: ['a ver', 'pues', 'este', 'bueno'],
    calm: ['tranquilo', 'respira hondo', 'todo está bien', 'con calma']
  },
  italian: {
    agreement: ['sì sì', 'esatto', 'perfetto', 'bravo'],
    understanding: ['capisco', 'ah sì', 'ecco', 'vero'],
    empathy: ['mamma mia', 'poverino', 'non ti preoccupare', 'coraggio'],
    thinking: ['allora', 'vediamo', 'dunque', 'bene'],
    calm: ['calma', 'respira', 'tutto bene', 'piano piano']
  },
  chinese: {
    agreement: ['duì duì', 'hǎo de', 'shì de', 'exactly'],
    understanding: ['ò', 'míng bái le', 'I see', 'ah'],
    empathy: ['ài ya', 'don\'t worry', 'méi guān xì', 'it\'s okay'],
    thinking: ['nà ge', 'let me think', 'hmm', 'well'],
    calm: ['fàng sōng', 'take it easy', 'slow down', 'breathe']
  },
  european: {
    agreement: ['yes yes', 'absolutely', 'quite right', 'indeed'],
    understanding: ['I see', 'ah yes', 'right', 'mm-hmm'],
    empathy: ['oh dear', 'I\'m sorry', 'that\'s difficult', 'I understand'],
    thinking: ['well', 'let me think', 'hmm', 'you know'],
    calm: ['take a breath', 'steady on', 'gently now', 'there there']
  },
  moroccan: {
    agreement: ['na\'am', 'aywa', 'très bien', 'exactement'],
    understanding: ['wakha', 'ah oui', 'I see', 'bien sûr'],
    empathy: ['allah ya\'tik', 'pas grave', 'courage', 'inch\'allah'],
    thinking: ['alors', 'bon', 'yak', 'hmm'],
    calm: ['hanya', 'doucement', 'take time', 'sabr']
  },
  spanish: {
    agreement: ['sí claro', 'por supuesto', 'desde luego', 'efectivamente'],
    understanding: ['ya veo', 'entiendo', 'comprendo', 'ah sí'],
    empathy: ['ay dios', 'lo siento', 'pobrecito', 'qué pena'],
    thinking: ['a ver', 'bueno', 'pues', 'este'],
    calm: ['tranquilo', 'respira', 'con calma', 'despacio']
  },
  ethiopian: {
    agreement: ['awo', 'betam', 'gobez', 'exactly'],
    understanding: ['ahhh', 'I see', 'getaye', 'mm-hmm'],
    empathy: ['yene konjo', 'don\'t worry', 'it\'s okay', 'egziyabher'],
    thinking: ['hmm', 'let me see', 'eshi', 'well'],
    calm: ['tenkish', 'slowly', 'take time', 'breathe well']
  }
};

// Background ambient sounds and vocal textures
export const ambientVocalSounds = {
  breathing: ['*soft inhale*', '*gentle exhale*', '*deep breath*'],
  comfort: ['*warm hum*', '*soft sigh*', '*gentle mmm*'],
  thinking: ['*thoughtful pause*', '*considers*', '*reflects*'],
  empathy: ['*understanding nod*', '*compassionate sound*', '*caring tone*']
};

// Enhanced voice mappings with accent preferences
export const accentModifications = {
  african: {
    emphasis: ['very', 'really', 'indeed'],
    phrases: ['my child', 'you know', 'let me tell you'],
    intonation: 'rising'
  },
  jamaican: {
    emphasis: ['ya know', 'seen', 'bredrin'],
    phrases: ['big up yourself', 'easy nuh', 'every ting cool'],
    intonation: 'rhythmic'
  },
  indian: {
    emphasis: ['actually', 'definitely', 'absolutely'],
    phrases: ['isn\'t it', 'no problem', 'very good'],
    intonation: 'melodic'
  },
  mexican: {
    emphasis: ['¡Órale!', 'muy bien', 'claro que sí'],
    phrases: ['mi amor', 'no te preocupes', 'está bien'],
    intonation: 'warm'
  },
  italian: {
    emphasis: ['Madonna mia', 'bene bene', 'perfetto'],
    phrases: ['caro mio', 'non ti preoccupare', 'va tutto bene'],
    intonation: 'expressive'
  }
};
