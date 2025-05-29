
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Mic, MicOff, Volume2, Brain, Users, Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';

interface SentimentResult {
  sentiment: 'positive' | 'negative' | 'neutral';
  emotion: string;
  confidence: number;
  aspects?: { [key: string]: string };
  prosody?: {
    pitch: number;
    tone: string;
    tempo: string;
    intensity: number;
  };
}

interface VoiceSentimentAnalysisProps {
  onSentimentDetected?: (result: SentimentResult) => void;
  enableMultiSpeaker?: boolean;
  enableAspectBased?: boolean;
  language?: string;
}

const VoiceSentimentAnalysis: React.FC<VoiceSentimentAnalysisProps> = ({
  onSentimentDetected,
  enableMultiSpeaker = false,
  enableAspectBased = true,
  language = 'en-US'
}) => {
  const [transcript, setTranscript] = useState('');
  const [sentiment, setSentiment] = useState<SentimentResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [speakers, setSpeakers] = useState<{ [key: string]: SentimentResult }>({});
  const [currentSpeaker, setCurrentSpeaker] = useState('Speaker 1');
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  const { toast } = useToast();
  const { isListening, startListening, stopListening } = useSpeechRecognition(true);

  // Initialize audio context for prosodic analysis
  useEffect(() => {
    const initAudioContext = async () => {
      try {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      } catch (error) {
        console.error('Failed to initialize audio context:', error);
      }
    };
    initAudioContext();
  }, []);

  // Analyze prosodic features (pitch, tone, tempo)
  const analyzeProsody = useCallback((audioData: Float32Array): SentimentResult['prosody'] => {
    // Calculate pitch (fundamental frequency)
    const pitch = calculatePitch(audioData);
    
    // Analyze intensity/volume
    const intensity = calculateIntensity(audioData);
    
    // Determine tone and tempo based on audio characteristics
    const tone = pitch > 200 ? 'high' : pitch > 120 ? 'medium' : 'low';
    const tempo = intensity > 0.7 ? 'fast' : intensity > 0.3 ? 'moderate' : 'slow';
    
    return { pitch, tone, tempo, intensity };
  }, []);

  // Simple pitch calculation using autocorrelation
  const calculatePitch = (audioData: Float32Array): number => {
    const sampleRate = audioContextRef.current?.sampleRate || 44100;
    const minPitch = 50;
    const maxPitch = 400;
    
    let bestCorrelation = 0;
    let bestPitch = 0;
    
    for (let pitch = minPitch; pitch <= maxPitch; pitch++) {
      const period = Math.round(sampleRate / pitch);
      if (period >= audioData.length / 2) continue;
      
      let correlation = 0;
      for (let i = 0; i < audioData.length - period; i++) {
        correlation += audioData[i] * audioData[i + period];
      }
      
      if (correlation > bestCorrelation) {
        bestCorrelation = correlation;
        bestPitch = pitch;
      }
    }
    
    return bestPitch;
  };

  // Calculate audio intensity
  const calculateIntensity = (audioData: Float32Array): number => {
    let sum = 0;
    for (let i = 0; i < audioData.length; i++) {
      sum += Math.abs(audioData[i]);
    }
    return sum / audioData.length;
  };

  // Advanced sentiment analysis with aspect-based analysis
  const analyzeSentiment = useCallback(async (text: string, prosody?: SentimentResult['prosody']): Promise<SentimentResult> => {
    setIsAnalyzing(true);
    
    try {
      // Simulate advanced sentiment analysis (replace with actual API calls)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Basic sentiment detection
      const positiveWords = ['happy', 'great', 'amazing', 'wonderful', 'excited', 'love', 'fantastic', 'brilliant'];
      const negativeWords = ['sad', 'angry', 'terrible', 'awful', 'hate', 'frustrated', 'worried', 'stressed'];
      const emotionWords = {
        joy: ['happy', 'excited', 'thrilled', 'delighted'],
        anger: ['angry', 'furious', 'mad', 'frustrated'],
        sadness: ['sad', 'depressed', 'down', 'upset'],
        fear: ['scared', 'afraid', 'worried', 'anxious'],
        surprise: ['surprised', 'shocked', 'amazed', 'astonished'],
        disgust: ['disgusted', 'revolted', 'sick', 'awful']
      };
      
      const lowerText = text.toLowerCase();
      
      // Calculate sentiment
      const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length;
      const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length;
      
      let sentiment: 'positive' | 'negative' | 'neutral';
      let confidence: number;
      
      if (positiveCount > negativeCount) {
        sentiment = 'positive';
        confidence = Math.min(0.6 + (positiveCount * 0.1), 0.95);
      } else if (negativeCount > positiveCount) {
        sentiment = 'negative';
        confidence = Math.min(0.6 + (negativeCount * 0.1), 0.95);
      } else {
        sentiment = 'neutral';
        confidence = 0.7;
      }
      
      // Detect dominant emotion
      let dominantEmotion = 'neutral';
      let maxEmotionScore = 0;
      
      Object.entries(emotionWords).forEach(([emotion, words]) => {
        const score = words.filter(word => lowerText.includes(word)).length;
        if (score > maxEmotionScore) {
          maxEmotionScore = score;
          dominantEmotion = emotion;
        }
      });
      
      // Aspect-based sentiment analysis
      let aspects: { [key: string]: string } = {};
      if (enableAspectBased) {
        const aspectKeywords = {
          work: ['work', 'job', 'career', 'office', 'boss', 'colleague'],
          health: ['health', 'doctor', 'medicine', 'exercise', 'diet', 'wellness'],
          relationships: ['friend', 'family', 'partner', 'relationship', 'love', 'social'],
          finance: ['money', 'financial', 'budget', 'expensive', 'cheap', 'cost']
        };
        
        Object.entries(aspectKeywords).forEach(([aspect, keywords]) => {
          if (keywords.some(keyword => lowerText.includes(keyword))) {
            aspects[aspect] = sentiment;
          }
        });
      }
      
      // Adjust confidence based on prosodic features
      if (prosody) {
        if (prosody.intensity > 0.8 && sentiment === 'positive') {
          confidence = Math.min(confidence + 0.1, 0.98);
        } else if (prosody.pitch < 100 && sentiment === 'negative') {
          confidence = Math.min(confidence + 0.1, 0.98);
        }
      }
      
      return {
        sentiment,
        emotion: dominantEmotion,
        confidence,
        aspects: Object.keys(aspects).length > 0 ? aspects : undefined,
        prosody
      };
      
    } catch (error) {
      console.error('Sentiment analysis error:', error);
      return {
        sentiment: 'neutral',
        emotion: 'neutral',
        confidence: 0.5
      };
    } finally {
      setIsAnalyzing(false);
    }
  }, [enableAspectBased]);

  // Handle voice input with real-time analysis
  const handleVoiceInput = useCallback(async () => {
    if (isListening) {
      stopListening();
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      return;
    }

    try {
      // Start audio capture for prosodic analysis
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      if (audioContextRef.current) {
        const source = audioContextRef.current.createMediaStreamSource(stream);
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 2048;
        source.connect(analyserRef.current);
      }
      
      // Start speech recognition
      startListening(
        async (transcript: string, isFinal: boolean) => {
          setTranscript(transcript);
          
          if (isFinal && transcript.length > 10) {
            // Analyze prosodic features
            let prosody: SentimentResult['prosody'] | undefined;
            if (analyserRef.current) {
              const dataArray = new Float32Array(analyserRef.current.frequencyBinCount);
              analyserRef.current.getFloatFrequencyData(dataArray);
              prosody = analyzeProsody(dataArray);
            }
            
            // Perform sentiment analysis
            const result = await analyzeSentiment(transcript, prosody);
            setSentiment(result);
            
            // Handle multi-speaker scenarios
            if (enableMultiSpeaker) {
              setSpeakers(prev => ({
                ...prev,
                [currentSpeaker]: result
              }));
            }
            
            // Callback to parent component
            if (onSentimentDetected) {
              onSentimentDetected(result);
            }
            
            // Provide audio feedback
            toast({
              title: `Sentiment: ${result.sentiment}`,
              description: `Emotion: ${result.emotion} (${Math.round(result.confidence * 100)}% confident)`
            });
          }
        },
        (error: string) => {
          toast({
            title: "Voice Recognition Error",
            description: error,
            variant: "destructive"
          });
        }
      );
      
    } catch (error) {
      toast({
        title: "Microphone Error",
        description: "Unable to access microphone. Please check permissions.",
        variant: "destructive"
      });
    }
  }, [isListening, startListening, stopListening, analyzeSentiment, onSentimentDetected, enableMultiSpeaker, currentSpeaker, toast]);

  const getEmotionEmoji = (emotion: string) => {
    const emojis: { [key: string]: string } = {
      joy: '😃',
      happiness: '😊',
      anger: '😠',
      sadness: '😢',
      fear: '😰',
      surprise: '😲',
      disgust: '🤢',
      neutral: '😐'
    };
    return emojis[emotion] || '😐';
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-100 text-green-800 border-green-300';
      case 'negative': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-purple-200 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-purple-800">
          <Brain className="w-5 h-5" />
          Real-Time Voice Sentiment Analysis
          {isListening && (
            <Badge className="bg-red-100 text-red-800 animate-pulse">
              <Mic className="w-3 h-3 mr-1" />
              Listening
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Control Button */}
        <Button
          onClick={handleVoiceInput}
          variant={isListening ? "destructive" : "default"}
          className="w-full"
          aria-pressed={isListening}
          aria-label={isListening ? "Stop voice analysis" : "Start voice analysis"}
        >
          {isListening ? (
            <>
              <MicOff className="w-4 h-4 mr-2" />
              Stop Analysis
            </>
          ) : (
            <>
              <Mic className="w-4 h-4 mr-2" />
              Start Voice Analysis
            </>
          )}
        </Button>

        {/* Real-time Transcript */}
        {transcript && (
          <div className="p-3 bg-gray-50 rounded-lg border">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Live Transcript:</h4>
            <p className="text-sm text-gray-800" aria-live="polite">
              {transcript}
            </p>
          </div>
        )}

        {/* Sentiment Results */}
        {sentiment && (
          <div className="space-y-3">
            <div className={`p-4 rounded-lg border-2 ${getSentimentColor(sentiment.sentiment)}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl" role="img" aria-label={sentiment.emotion}>
                    {getEmotionEmoji(sentiment.emotion)}
                  </span>
                  <div>
                    <h4 className="font-semibold capitalize">{sentiment.sentiment}</h4>
                    <p className="text-sm opacity-80">Emotion: {sentiment.emotion}</p>
                  </div>
                </div>
                <Badge variant="outline">
                  {Math.round(sentiment.confidence * 100)}% confident
                </Badge>
              </div>
              
              <Progress value={sentiment.confidence * 100} className="h-2" />
            </div>

            {/* Aspect-Based Analysis */}
            {sentiment.aspects && Object.keys(sentiment.aspects).length > 0 && (
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="text-sm font-medium text-blue-800 mb-2 flex items-center gap-1">
                  <Globe className="w-3 h-3" />
                  Aspect-Based Analysis
                </h4>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(sentiment.aspects).map(([aspect, aspectSentiment]) => (
                    <Badge
                      key={aspect}
                      className={getSentimentColor(aspectSentiment)}
                    >
                      {aspect}: {aspectSentiment}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Prosodic Features */}
            {sentiment.prosody && (
              <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                <h4 className="text-sm font-medium text-purple-800 mb-2 flex items-center gap-1">
                  <Volume2 className="w-3 h-3" />
                  Voice Characteristics
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>Pitch: {Math.round(sentiment.prosody.pitch)}Hz</div>
                  <div>Tone: {sentiment.prosody.tone}</div>
                  <div>Tempo: {sentiment.prosody.tempo}</div>
                  <div>Intensity: {Math.round(sentiment.prosody.intensity * 100)}%</div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Multi-Speaker Results */}
        {enableMultiSpeaker && Object.keys(speakers).length > 0 && (
          <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-200">
            <h4 className="text-sm font-medium text-indigo-800 mb-2 flex items-center gap-1">
              <Users className="w-3 h-3" />
              Speaker Analysis
            </h4>
            <div className="space-y-2">
              {Object.entries(speakers).map(([speaker, result]) => (
                <div key={speaker} className="flex items-center justify-between text-xs">
                  <span>{speaker}:</span>
                  <div className="flex items-center gap-1">
                    <span>{getEmotionEmoji(result.emotion)}</span>
                    <span className="capitalize">{result.sentiment}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Analysis Status */}
        {isAnalyzing && (
          <div className="flex items-center justify-center p-4 text-sm text-gray-600">
            <div className="animate-spin w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full mr-2"></div>
            Analyzing speech sentiment...
          </div>
        )}

        {/* Feature Indicators */}
        <div className="flex flex-wrap gap-2 text-xs">
          {enableAspectBased && (
            <Badge variant="outline" className="text-blue-600">
              Aspect-Based Analysis
            </Badge>
          )}
          {enableMultiSpeaker && (
            <Badge variant="outline" className="text-indigo-600">
              Multi-Speaker Detection
            </Badge>
          )}
          <Badge variant="outline" className="text-purple-600">
            Prosodic Analysis
          </Badge>
          <Badge variant="outline" className="text-green-600">
            Real-Time Processing
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default VoiceSentimentAnalysis;
