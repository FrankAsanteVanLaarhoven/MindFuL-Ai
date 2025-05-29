
interface AIProvider {
  name: string;
  apiKey: string;
  endpoint: string;
}

interface AIResponse {
  analysis: {
    mood: string;
    confidence: number;
    emotions: {
      happiness: number;
      sadness: number;
      anxiety: number;
      anger: number;
    };
    suggestions: string[];
  };
}

export class AIService {
  private providers: Map<string, AIProvider> = new Map();

  addProvider(name: string, apiKey: string, endpoint: string) {
    this.providers.set(name, { name, apiKey, endpoint });
  }

  async analyzeMood(textInput: string, imageData?: string): Promise<AIResponse> {
    // Try OpenAI first if available
    const openaiKey = localStorage.getItem('openaiApiKey');
    if (openaiKey) {
      try {
        return await this.analyzeWithOpenAI(textInput, openaiKey, imageData);
      } catch (error) {
        console.error('OpenAI analysis failed:', error);
      }
    }

    // Fallback to mock analysis
    return this.generateMockAnalysis(textInput);
  }

  private async analyzeWithOpenAI(textInput: string, apiKey: string, imageData?: string): Promise<AIResponse> {
    const messages: any[] = [
      {
        role: 'system',
        content: 'You are a mood analysis AI. Analyze the user input and respond with a JSON object containing mood, confidence (0-1), emotions (happiness, sadness, anxiety, anger as 0-1 values), and suggestions array.'
      },
      {
        role: 'user',
        content: textInput
      }
    ];

    if (imageData) {
      messages.push({
        role: 'user',
        content: [
          { type: 'text', text: 'Please also analyze this facial expression image.' },
          { type: 'image_url', image_url: { url: imageData } }
        ]
      });
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages,
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    
    try {
      const parsed = JSON.parse(content);
      return {
        analysis: {
          mood: parsed.mood || 'Neutral',
          confidence: parsed.confidence || 0.8,
          emotions: parsed.emotions || { happiness: 0.5, sadness: 0.2, anxiety: 0.2, anger: 0.1 },
          suggestions: parsed.suggestions || ['Take a moment to breathe', 'Practice mindfulness']
        }
      };
    } catch {
      return this.generateMockAnalysis(textInput);
    }
  }

  private generateMockAnalysis(textInput: string): AIResponse {
    const lowerText = textInput.toLowerCase();
    let mood = 'Neutral';
    let emotions = { happiness: 0.5, sadness: 0.2, anxiety: 0.2, anger: 0.1 };
    let suggestions = ['Take a moment to breathe', 'Practice mindfulness'];

    if (lowerText.includes('happy') || lowerText.includes('good') || lowerText.includes('great')) {
      mood = 'Happy';
      emotions = { happiness: 0.8, sadness: 0.1, anxiety: 0.05, anger: 0.05 };
      suggestions = ['Continue doing what makes you happy', 'Share your positivity with others'];
    } else if (lowerText.includes('sad') || lowerText.includes('down') || lowerText.includes('depressed')) {
      mood = 'Sad';
      emotions = { happiness: 0.1, sadness: 0.7, anxiety: 0.15, anger: 0.05 };
      suggestions = ['Reach out to a friend or family member', 'Consider talking to a counselor'];
    } else if (lowerText.includes('anxious') || lowerText.includes('worried') || lowerText.includes('stress')) {
      mood = 'Anxious';
      emotions = { happiness: 0.2, sadness: 0.2, anxiety: 0.5, anger: 0.1 };
      suggestions = ['Try deep breathing exercises', 'Practice progressive muscle relaxation'];
    }

    return {
      analysis: {
        mood,
        confidence: 0.75 + Math.random() * 0.2,
        emotions,
        suggestions
      }
    };
  }
}

export const aiService = new AIService();
