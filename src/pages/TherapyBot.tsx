
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { gsap } from 'gsap';
import { useNavigate } from 'react-router-dom';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

const TherapyBot = () => {
  const [therapyType, setTherapyType] = useState<'CBT' | 'DBT' | 'general'>('CBT');
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (chatContainerRef.current) {
      gsap.fromTo(chatContainerRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
      );
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const startSession = () => {
    setSessionStarted(true);
    const welcomeMessage: Message = {
      id: crypto.randomUUID(),
      type: 'bot',
      content: getWelcomeMessage(),
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
    
    toast({
      title: "Therapy session started",
      description: `${therapyType} therapy bot is ready to help you.`
    });
  };

  const getWelcomeMessage = () => {
    switch (therapyType) {
      case 'CBT':
        return "Hello! I'm your Cognitive Behavioral Therapy assistant. CBT focuses on identifying and changing negative thought patterns that affect your emotions and behaviors. I'm here to help you explore your thoughts and develop healthier thinking patterns. What would you like to talk about today?";
      case 'DBT':
        return "Welcome! I'm your Dialectical Behavior Therapy companion. DBT emphasizes mindfulness, distress tolerance, emotion regulation, and interpersonal effectiveness. I'm here to help you develop skills to manage difficult emotions and improve relationships. What's on your mind?";
      default:
        return "Hi there! I'm your personal therapy assistant. I'm here to provide a safe, supportive space for you to explore your thoughts and feelings. While I can't replace professional therapy, I can offer evidence-based techniques and a listening ear. How are you feeling today?";
    }
  };

  const sendMessage = async () => {
    if (!currentMessage.trim()) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      type: 'user',
      content: currentMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsTyping(true);

    // Simulate bot response
    setTimeout(async () => {
      const botResponse = await generateBotResponse(currentMessage, therapyType);
      const botMessage: Message = {
        id: crypto.randomUUID(),
        type: 'bot',
        content: botResponse,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const generateBotResponse = async (userInput: string, type: string): Promise<string> => {
    // Simulated AI responses based on therapy type
    const responses = {
      CBT: [
        "I hear that you're experiencing some challenging thoughts. Let's explore this together. Can you tell me more about what specific thoughts are going through your mind when you feel this way?",
        "That sounds difficult. In CBT, we often look at the connection between thoughts, feelings, and behaviors. When you have these thoughts, how do they make you feel, and what do you typically do in response?",
        "It's important to recognize that thoughts aren't always facts. What evidence do you have for and against this thought? Sometimes examining the evidence can help us see situations more clearly."
      ],
      DBT: [
        "Thank you for sharing that with me. It takes courage to open up about difficult experiences. Let's practice some mindfulness - can you describe what you're noticing in your body right now?",
        "I can hear the pain in what you're sharing. DBT teaches us that we can hold two seemingly opposite things at once - we can validate your feelings while also working on strategies to cope. How might you use distress tolerance skills in this situation?",
        "Your emotions are valid and understandable given what you're experiencing. Let's think about some emotion regulation techniques. What activities have helped you feel grounded in the past?"
      ],
      general: [
        "Thank you for trusting me with this. It sounds like you're going through a lot right now. How long have you been feeling this way?",
        "I appreciate you sharing that with me. Sometimes just putting our thoughts into words can be helpful. What would you say is the most challenging part of what you're experiencing?",
        "It takes strength to reach out when you're struggling. What kind of support feels most helpful to you right now?"
      ]
    };

    const typeResponses = responses[type as keyof typeof responses] || responses.general;
    return typeResponses[Math.floor(Math.random() * typeResponses.length)];
  };

  const therapyTypes = {
    CBT: {
      name: 'Cognitive Behavioral Therapy (CBT)',
      description: 'Focuses on identifying and changing negative thought patterns and behaviors.'
    },
    DBT: {
      name: 'Dialectical Behavior Therapy (DBT)',
      description: 'Emphasizes mindfulness, emotional regulation, and interpersonal skills.'
    },
    general: {
      name: 'General Support',
      description: 'Supportive conversation with evidence-based therapeutic techniques.'
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center py-6">
          <Button 
            onClick={() => navigate('/')}
            variant="outline"
            className="mb-4"
          >
            ← Back to Dashboard
          </Button>
          <h1 className="text-4xl font-bold text-purple-800 mb-4 flex items-center justify-center gap-3">
            <span className="text-5xl">🤖</span>
            AI Therapy Assistant
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Personalized therapeutic support using evidence-based approaches
          </p>
        </div>

        {!sessionStarted ? (
          /* Session Setup */
          <div ref={chatContainerRef}>
            <Card className="bg-white/80 backdrop-blur-sm border-purple-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-purple-800 flex items-center gap-2">
                  <span className="text-2xl">⚙️</span>
                  Session Configuration
                </CardTitle>
                <CardDescription>
                  Choose your preferred therapeutic approach
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Therapy Type:
                  </label>
                  <Select value={therapyType} onValueChange={(value: any) => setTherapyType(value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select therapy approach" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(therapyTypes).map(([key, type]) => (
                        <SelectItem key={key} value={key}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <p className="text-sm text-purple-800">
                    <strong>{therapyTypes[therapyType].name}:</strong> {therapyTypes[therapyType].description}
                  </p>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <span className="text-amber-600 text-lg">⚠️</span>
                    <div>
                      <p className="text-sm text-amber-800 font-medium">Important Disclaimer</p>
                      <p className="text-xs text-amber-700 mt-1">
                        This AI assistant is for support and educational purposes only. It does not replace professional mental health care. If you're experiencing a crisis, please contact emergency services or a mental health professional immediately.
                      </p>
                    </div>
                  </div>
                </div>
                
                <Button
                  onClick={startSession}
                  className="w-full bg-purple-500 hover:bg-purple-600 text-white font-medium py-3 rounded-full transition-all duration-200 transform hover:scale-105"
                >
                  Start Therapy Session
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* Chat Interface */
          <div ref={chatContainerRef} className="space-y-4">
            <Card className="bg-white/80 backdrop-blur-sm border-purple-200 shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg text-purple-800 flex items-center gap-2">
                    <span className="text-xl">💬</span>
                    {therapyTypes[therapyType].name} Session
                  </CardTitle>
                  <Button 
                    onClick={() => setSessionStarted(false)}
                    variant="outline"
                    size="sm"
                  >
                    New Session
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-96 overflow-y-auto border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50/50">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`mb-4 flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.type === 'user'
                            ? 'bg-purple-500 text-white'
                            : 'bg-white border border-gray-200 text-gray-800'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          message.type === 'user' ? 'text-purple-100' : 'text-gray-500'
                        }`}>
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex justify-start mb-4">
                      <div className="bg-white border border-gray-200 rounded-lg px-4 py-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
                
                <div className="flex gap-2">
                  <Textarea
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    placeholder="Share your thoughts and feelings..."
                    className="flex-1 resize-none border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                    rows={2}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                  />
                  <Button
                    onClick={sendMessage}
                    disabled={!currentMessage.trim() || isTyping}
                    className="bg-purple-500 hover:bg-purple-600 text-white px-6"
                  >
                    Send
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default TherapyBot;
