
interface PerplexityMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface PerplexityResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export class PerplexityService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateTherapyResponse(
    userInput: string,
    therapyType: 'CBT' | 'DBT' | 'general',
    context?: string
  ): Promise<string> {
    const systemPrompt = this.getSystemPrompt(therapyType);
    
    const messages: PerplexityMessage[] = [
      {
        role: 'system',
        content: systemPrompt
      },
      {
        role: 'user',
        content: context 
          ? `Context: ${context}\n\nUser input: ${userInput}`
          : userInput
      }
    ];

    try {
      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-sonar-small-128k-online',
          messages,
          temperature: 0.7,
          top_p: 0.9,
          max_tokens: 500,
          return_images: false,
          return_related_questions: false,
          frequency_penalty: 1,
          presence_penalty: 0
        }),
      });

      if (!response.ok) {
        throw new Error(`Perplexity API error: ${response.statusText}`);
      }

      const data: PerplexityResponse = await response.json();
      return data.choices[0]?.message?.content || 'I apologize, but I could not generate a response at this time.';
    } catch (error) {
      console.error('Perplexity API error:', error);
      throw error;
    }
  }

  async generateContextualThoughts(
    userInput: string,
    therapyType: 'CBT' | 'DBT' | 'general'
  ): Promise<string[]> {
    const prompt = `Based on this user input: "${userInput}", generate 3 helpful ${therapyType} therapeutic thoughts or interventions. Format as a simple list, one thought per line, without numbering.`;
    
    try {
      const response = await this.generateTherapyResponse(prompt, therapyType);
      return response.split('\n').filter(line => line.trim()).slice(0, 3);
    } catch (error) {
      console.error('Error generating contextual thoughts:', error);
      return [];
    }
  }

  private getSystemPrompt(therapyType: 'CBT' | 'DBT' | 'general'): string {
    switch (therapyType) {
      case 'CBT':
        return `You are a compassionate CBT (Cognitive Behavioral Therapy) assistant. Focus on:
        - Identifying negative thought patterns and cognitive distortions
        - Challenging unhelpful thoughts with evidence-based questions
        - Suggesting behavioral experiments and coping strategies
        - Helping users understand the connection between thoughts, feelings, and behaviors
        - Providing practical, actionable CBT techniques
        Keep responses empathetic, professional, and focused on CBT principles.`;
        
      case 'DBT':
        return `You are a supportive DBT (Dialectical Behavior Therapy) assistant. Focus on:
        - Mindfulness and present-moment awareness
        - Distress tolerance skills and crisis survival strategies
        - Emotion regulation techniques
        - Interpersonal effectiveness skills
        - Radical acceptance and dialectical thinking
        - Practical DBT skills and exercises
        Keep responses validating, balanced, and focused on DBT skills.`;
        
      default:
        return `You are a warm, empathetic therapy assistant. Provide:
        - Supportive, non-judgmental responses
        - Evidence-based therapeutic insights
        - Practical coping strategies
        - Emotional validation and support
        - Gentle guidance and encouragement
        Keep responses professional, compassionate, and helpful.`;
    }
  }
}

export const createPerplexityService = (apiKey: string) => {
  return new PerplexityService(apiKey);
};
