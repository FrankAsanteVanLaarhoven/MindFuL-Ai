
export interface AdvancedSentimentResult {
  sentiment: 'positive' | 'negative' | 'neutral';
  emotion: string;
  confidence: number;
  aspects: { [key: string]: string };
  prosody: {
    pitch: number;
    tone: string;
    tempo: string;
    intensity: number;
  };
  multilingual?: {
    detectedLanguage: string;
    translatedText?: string;
  };
  speakers?: { [key: string]: AdvancedSentimentResult };
}

export class SentimentAnalysisService {
  private static instance: SentimentAnalysisService;
  private apiEndpoints: { [key: string]: string } = {
    openai: 'https://api.openai.com/v1/chat/completions',
    google: 'https://language.googleapis.com/v1/documents:analyzeSentiment',
    vatis: 'https://api.vatis.tech/v1/sentiment',
    azure: 'https://api.cognitive.microsoft.com/text/analytics/v3.1/sentiment'
  };

  static getInstance(): SentimentAnalysisService {
    if (!SentimentAnalysisService.instance) {
      SentimentAnalysisService.instance = new SentimentAnalysisService();
    }
    return SentimentAnalysisService.instance;
  }

  async analyzeWithOpenAI(text: string, apiKey: string): Promise<AdvancedSentimentResult> {
    try {
      const response = await fetch(this.apiEndpoints.openai, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: `You are an expert sentiment analyst. Analyze the following text and return a JSON response with:
              - sentiment: "positive", "negative", or "neutral"
              - emotion: specific emotion detected
              - confidence: 0-1 confidence score
              - aspects: object with aspect-based sentiment analysis
              Format: {"sentiment": "", "emotion": "", "confidence": 0.0, "aspects": {}}`
            },
            {
              role: 'user',
              content: text
            }
          ],
          temperature: 0.3,
          max_tokens: 500
        })
      });

      const data = await response.json();
      return JSON.parse(data.choices[0].message.content);
    } catch (error) {
      console.error('OpenAI sentiment analysis error:', error);
      throw error;
    }
  }

  async analyzeWithGoogle(text: string, apiKey: string): Promise<AdvancedSentimentResult> {
    try {
      const response = await fetch(`${this.apiEndpoints.google}?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          document: {
            type: 'PLAIN_TEXT',
            content: text
          },
          encodingType: 'UTF8'
        })
      });

      const data = await response.json();
      
      // Convert Google's response to our format
      const sentiment = data.documentSentiment.score > 0.1 ? 'positive' : 
                       data.documentSentiment.score < -0.1 ? 'negative' : 'neutral';
      
      return {
        sentiment,
        emotion: this.mapSentimentToEmotion(sentiment, data.documentSentiment.magnitude),
        confidence: Math.abs(data.documentSentiment.score),
        aspects: {},
        prosody: {
          pitch: 0,
          tone: 'neutral',
          tempo: 'moderate',
          intensity: data.documentSentiment.magnitude
        }
      };
    } catch (error) {
      console.error('Google sentiment analysis error:', error);
      throw error;
    }
  }

  async analyzeWithVatis(text: string, apiKey: string): Promise<AdvancedSentimentResult> {
    try {
      const response = await fetch(this.apiEndpoints.vatis, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          features: ['sentiment', 'emotion', 'aspects']
        })
      });

      const data = await response.json();
      
      return {
        sentiment: data.sentiment.label.toLowerCase(),
        emotion: data.emotion.dominant,
        confidence: data.sentiment.confidence,
        aspects: data.aspects || {},
        prosody: {
          pitch: 0,
          tone: 'neutral',
          tempo: 'moderate',
          intensity: 0.5
        }
      };
    } catch (error) {
      console.error('Vatis sentiment analysis error:', error);
      throw error;
    }
  }

  async analyzeWithAzure(text: string, apiKey: string, endpoint: string): Promise<AdvancedSentimentResult> {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Ocp-Apim-Subscription-Key': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          documents: [
            {
              id: '1',
              language: 'en',
              text: text
            }
          ]
        })
      });

      const data = await response.json();
      const doc = data.documents[0];
      
      return {
        sentiment: doc.sentiment,
        emotion: this.mapSentimentToEmotion(doc.sentiment, doc.confidenceScores[doc.sentiment]),
        confidence: doc.confidenceScores[doc.sentiment],
        aspects: {},
        prosody: {
          pitch: 0,
          tone: 'neutral',
          tempo: 'moderate',
          intensity: 0.5
        }
      };
    } catch (error) {
      console.error('Azure sentiment analysis error:', error);
      throw error;
    }
  }

  private mapSentimentToEmotion(sentiment: string, intensity: number): string {
    if (sentiment === 'positive') {
      return intensity > 0.8 ? 'joy' : intensity > 0.5 ? 'happiness' : 'contentment';
    } else if (sentiment === 'negative') {
      return intensity > 0.8 ? 'anger' : intensity > 0.5 ? 'sadness' : 'disappointment';
    }
    return 'neutral';
  }

  // Fallback local analysis for demo/offline use
  async analyzeLocal(text: string): Promise<AdvancedSentimentResult> {
    // This is a simplified version for demo purposes
    const positiveWords = ['happy', 'great', 'amazing', 'wonderful', 'excited', 'love', 'fantastic', 'brilliant'];
    const negativeWords = ['sad', 'angry', 'terrible', 'awful', 'hate', 'frustrated', 'worried', 'stressed'];
    
    const lowerText = text.toLowerCase();
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
    
    return {
      sentiment,
      emotion: this.mapSentimentToEmotion(sentiment, confidence),
      confidence,
      aspects: {},
      prosody: {
        pitch: 0,
        tone: 'neutral',
        tempo: 'moderate',
        intensity: 0.5
      }
    };
  }
}

export const sentimentService = SentimentAnalysisService.getInstance();
