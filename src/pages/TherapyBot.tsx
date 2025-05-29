"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { gsap } from 'gsap';
import { useNavigate } from 'react-router-dom';
import { Mic, MicOff, Volume2, VolumeX, MessageSquare, Settings2 } from 'lucide-react';
import { useVoiceInteraction } from '@/hooks/useVoiceInteraction';
import VoiceSettings from '@/components/VoiceSettings';
import VoiceToneIndicator from '@/components/VoiceToneIndicator';
import AvatarSelector, { AvatarCharacter } from '@/components/AvatarSelector';
import TherapyAvatar3D from '@/components/TherapyAvatar3D';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  voiceTone?: string;
}

const TherapyBot = () => {
  const [therapyType, setTherapyType] = useState<'CBT' | 'DBT' | 'general'>('CBT');
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [inputMode, setInputMode] = useState<'text' | 'voice'>('text');
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<AvatarCharacter | null>(null);
  const [avatarEmotion, setAvatarEmotion] = useState<'neutral' | 'happy' | 'concerned' | 'encouraging' | 'thoughtful'>('neutral');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const {
    isListening,
    isSpeaking,
    transcript,
    voiceTone,
    voiceSettings,
    availableVoices,
    hasAudioPermission,
    startListening,
    stopListening,
    speak,
    speakWithAccent, // Use the new accent-aware speak function
    stopSpeaking,
    clearTranscript,
    setVoiceSettings,
    initAudioContext,
    setTranscript
  } = useVoiceInteraction();

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
    
    // Speak welcome message if voice output is enabled
    if (voiceSettings.enabled && voiceSettings.voiceOutput) {
      speak(welcomeMessage.content);
    }
    
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

  // Updated setTranscript to use current message when voice input is active
  useEffect(() => {
    if (inputMode === 'voice' && transcript) {
      setCurrentMessage(transcript);
    }
  }, [transcript, inputMode]);

  // Avatar emotion based on conversation context
  const updateAvatarEmotion = (messageContent: string, isUserMessage: boolean) => {
    if (isUserMessage) {
      // React to user's message tone
      const lowerContent = messageContent.toLowerCase();
      if (lowerContent.includes('sad') || lowerContent.includes('depressed') || lowerContent.includes('down')) {
        setAvatarEmotion('concerned');
      } else if (lowerContent.includes('happy') || lowerContent.includes('good') || lowerContent.includes('better')) {
        setAvatarEmotion('happy');
      } else if (lowerContent.includes('anxious') || lowerContent.includes('worried') || lowerContent.includes('stressed')) {
        setAvatarEmotion('concerned');
      } else {
        setAvatarEmotion('thoughtful');
      }
    } else {
      // Bot's response emotion
      setAvatarEmotion('encouraging');
      setTimeout(() => setAvatarEmotion('neutral'), 3000);
    }
  };

  const sendMessage = async () => {
    if (!currentMessage.trim()) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      type: 'user',
      content: currentMessage,
      timestamp: new Date(),
      voiceTone: inputMode === 'voice' ? voiceTone.tone : undefined
    };

    setMessages(prev => [...prev, userMessage]);
    updateAvatarEmotion(currentMessage, true);
    setCurrentMessage('');
    clearTranscript();
    setIsTyping(true);

    // Stop listening when sending message
    if (isListening) {
      stopListening();
    }

    // Simulate bot response
    setTimeout(async () => {
      const botResponse = await generateBotResponse(currentMessage, therapyType, voiceTone.tone, selectedAvatar);
      const botMessage: Message = {
        id: crypto.randomUUID(),
        type: 'bot',
        content: botResponse,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      updateAvatarEmotion(botResponse, false);
      setIsTyping(false);

      // Use accent-aware speech if voice output is enabled
      if (voiceSettings.enabled && voiceSettings.voiceOutput && selectedAvatar) {
        speakWithAccent(botResponse, selectedAvatar.ethnicity, selectedAvatar.personality);
      }
    }, 1500);
  };

  const generateBotResponse = async (userInput: string, type: string, tone?: string, avatar?: AvatarCharacter | null): Promise<string> => {
    // Avatar-specific response styling
    const avatarPersonality = avatar ? avatar.personality.toLowerCase() : '';
    
    // Enhanced responses that consider voice tone
    const toneAwareResponses = {
      CBT: {
        calm: [
          "I can hear the calm in your voice, which is wonderful. Let's explore what's helping you maintain this peaceful state and how we can build on it.",
          "Your calm tone suggests you're in a good headspace right now. This is an excellent opportunity to examine your thoughts more clearly."
        ],
        stressed: [
          "I notice some tension in your voice. That's completely understandable. Let's work together to identify what thoughts might be contributing to this stress.",
          "Your voice reflects the stress you're experiencing. Remember, stress often comes from our thought patterns. What specific thoughts are going through your mind right now?"
        ],
        excited: [
          "I can hear the energy in your voice! That's great. Let's channel this positive energy into exploring what thoughts and behaviors are contributing to this feeling.",
          "Your excitement comes through clearly. This positive emotional state can help us examine your thought patterns from a different perspective."
        ],
        sad: [
          "I can hear the sadness in your voice, and I want you to know that's okay. These feelings are valid. Let's gently explore what thoughts might be connected to this sadness.",
          "The pain in your voice is palpable. Remember that you're not alone in this. Let's look at what thoughts are contributing to these difficult feelings."
        ]
      },
      DBT: {
        calm: [
          "Your calm voice shows you're practicing good emotional regulation. Let's use this mindful state to explore your current experience.",
          "I can hear the groundedness in your voice. This is a perfect time to practice mindfulness and observe your thoughts without judgment."
        ],
        stressed: [
          "I hear the distress in your voice. Let's practice some distress tolerance skills together. Can you try the 5-4-3-2-1 grounding technique with me?",
          "Your voice shows you're struggling right now. That's okay. Let's focus on getting through this moment using some coping skills."
        ],
        excited: [
          "Your excitement is wonderful to hear! Let's practice mindfulness to fully experience this positive emotion while staying present.",
          "I can hear the joy in your voice. This is a great opportunity to practice savoring positive emotions mindfully."
        ],
        sad: [
          "The sadness in your voice tells me you're hurting. Let's practice radical acceptance and self-compassion together.",
          "I hear your pain. Remember, all emotions are temporary. Let's work on sitting with this feeling while practicing self-kindness."
        ]
      }
    };

    // Get tone-aware response if available
    if (tone && toneAwareResponses[type as keyof typeof toneAwareResponses]) {
      const toneResponses = toneAwareResponses[type as keyof typeof toneAwareResponses][tone as keyof typeof toneAwareResponses.CBT];
      if (toneResponses && toneResponses.length > 0) {
        return toneResponses[Math.floor(Math.random() * toneResponses.length)];
      }
    }

    // ... keep existing code (fallback to original responses)
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
    let response = '';

    // Get base response from existing logic
    if (tone && toneAwareResponses[type as keyof typeof toneAwareResponses]) {
      const toneResponses = toneAwareResponses[type as keyof typeof toneAwareResponses][tone as keyof typeof toneAwareResponses.CBT];
      if (toneResponses && toneResponses.length > 0) {
        response = toneResponses[Math.floor(Math.random() * toneResponses.length)];
      }
    }

    if (!response) {
      response = typeResponses[Math.floor(Math.random() * typeResponses.length)];
    }

    // Modify response based on avatar personality
    if (avatar) {
      if (avatarPersonality.includes('nurturing') || avatar.type === 'grandma') {
        response = `Oh dear, ${response.toLowerCase()} Remember, I'm here for you, just like family.`;
      } else if (avatarPersonality.includes('wise') || avatar.type === 'grandpa') {
        response = `You know, in my experience, ${response.toLowerCase()} Life has taught me that these feelings pass.`;
      } else if (avatar.type === 'sibling' || avatar.type === 'friend') {
        response = `Hey, ${response.toLowerCase().replace('i hear', 'i totally get')} We're in this together.`;
      } else if (avatar.type === 'teacher') {
        response = `Let's think about this step by step. ${response} This is a learning process, and that's okay.`;
      } else if (avatarPersonality.includes('professional')) {
        response = `${response} Based on evidence-based approaches, we can work through this systematically.`;
      }
    }

    // Enhanced response with accent-specific language patterns
    if (avatar && avatar.ethnicity) {
      const ethnicity = avatar.ethnicity;
      
      // Add accent-specific language patterns
      if (ethnicity === 'jamaican') {
        response = response.replace(/\byou\b/g, 'yuh');
        response = response.replace(/\bokay\b/g, 'irie');
        response = response.replace(/\bfeeling\b/g, 'vibes');
      } else if (ethnicity === 'african') {
        response = response.replace(/\bchild\b/g, 'my child');
        response = response.replace(/\bunderstand\b/g, 'I hear you');
      } else if (ethnicity === 'indian') {
        response = response.replace(/\byes\b/g, 'yes indeed');
        response = response.replace(/\bgood\b/g, 'very good');
      } else if (ethnicity === 'mexican') {
        if (Math.random() > 0.8) {
          response = response.replace(/\bgood\b/g, 'muy bueno');
          response = response.replace(/\byes\b/g, 'sí, claro');
        }
      } else if (ethnicity === 'italian') {
        if (Math.random() > 0.8) {
          response = response.replace(/\bgood\b/g, 'molto bene');
          response = response.replace(/\bbeautiful\b/g, 'bellissimo');
        }
      }
    }

    return response;
  };

  const toggleVoiceInput = () => {
    if (inputMode === 'voice' && isListening) {
      stopListening();
    } else if (inputMode === 'voice' && !isListening) {
      startListening();
    }
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
      <div className="max-w-6xl mx-auto space-y-6">
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
          <div ref={chatContainerRef} className="space-y-6">
            {/* Avatar Selection */}
            <AvatarSelector
              selectedAvatar={selectedAvatar}
              onAvatarSelect={setSelectedAvatar}
            />

            {/* Session Configuration */}
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
                  disabled={!selectedAvatar}
                  className="w-full bg-purple-500 hover:bg-purple-600 text-white font-medium py-3 rounded-full transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {selectedAvatar ? 'Start Therapy Session' : 'Please Select an Avatar First'}
                </Button>
              </CardContent>
            </Card>

            {/* Voice Settings */}
            <VoiceSettings
              voiceSettings={voiceSettings}
              setVoiceSettings={setVoiceSettings}
              availableVoices={availableVoices}
              hasAudioPermission={hasAudioPermission}
              initAudioContext={initAudioContext}
              isListening={isListening}
              isSpeaking={isSpeaking}
            />
          </div>
        ) : (
          /* Chat Interface */
          <div ref={chatContainerRef} className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Avatar Display */}
              <div className="lg:col-span-1">
                {selectedAvatar && (
                  <Card className="bg-white/80 backdrop-blur-sm border-purple-200 shadow-lg">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-purple-800 text-center">
                        Your Therapy Companion
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <TherapyAvatar3D
                        avatar={selectedAvatar}
                        isActive={sessionStarted}
                        isSpeaking={isSpeaking}
                        emotion={avatarEmotion}
                      />
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Main Chat */}
              <div className="lg:col-span-2">
                <Card className="bg-white/80 backdrop-blur-sm border-purple-200 shadow-lg">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg text-purple-800 flex items-center gap-2">
                        <span className="text-xl">💬</span>
                        {therapyTypes[therapyType].name} Session
                      </CardTitle>
                      <div className="flex gap-2">
                        <Button 
                          onClick={() => setShowVoiceSettings(!showVoiceSettings)}
                          variant="outline"
                          size="sm"
                        >
                          <Settings2 className="w-4 h-4" />
                        </Button>
                        <Button 
                          onClick={() => setSessionStarted(false)}
                          variant="outline"
                          size="sm"
                        >
                          New Session
                        </Button>
                      </div>
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
                            <div className="flex justify-between items-center mt-1">
                              <p className={`text-xs ${
                                message.type === 'user' ? 'text-purple-100' : 'text-gray-500'
                              }`}>
                                {message.timestamp.toLocaleTimeString()}
                              </p>
                              {message.voiceTone && (
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  message.type === 'user' ? 'bg-purple-400 text-purple-100' : 'bg-gray-100 text-gray-600'
                                }`}>
                                  Tone: {message.voiceTone}
                                </span>
                              )}
                            </div>
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
                    
                    {/* Input Mode Selector */}
                    {voiceSettings.enabled && (
                      <div className="flex gap-2 mb-4">
                        <Button
                          onClick={() => setInputMode('text')}
                          variant={inputMode === 'text' ? 'default' : 'outline'}
                          size="sm"
                          className="flex items-center gap-2"
                        >
                          <MessageSquare className="w-4 h-4" />
                          Text
                        </Button>
                        <Button
                          onClick={() => setInputMode('voice')}
                          variant={inputMode === 'voice' ? 'default' : 'outline'}
                          size="sm"
                          className="flex items-center gap-2"
                          disabled={!voiceSettings.voiceInput || hasAudioPermission !== true}
                        >
                          {isListening ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                          Voice
                        </Button>
                      </div>
                    )}
                    
                    <div className="flex gap-2">
                      <Textarea
                        value={currentMessage}
                        onChange={(e) => setCurrentMessage(e.target.value)}
                        placeholder={inputMode === 'voice' ? "Speak your message..." : "Share your thoughts and feelings..."}
                        className="flex-1 resize-none border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                        rows={2}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            sendMessage();
                          }
                        }}
                        disabled={inputMode === 'voice'}
                      />
                      <div className="flex flex-col gap-2">
                        {inputMode === 'voice' && voiceSettings.enabled && (
                          <Button
                            onClick={toggleVoiceInput}
                            variant={isListening ? 'destructive' : 'outline'}
                            className="px-4"
                            disabled={!voiceSettings.voiceInput || hasAudioPermission !== true}
                          >
                            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                          </Button>
                        )}
                        
                        {isSpeaking && (
                          <Button
                            onClick={stopSpeaking}
                            variant="outline"
                            className="px-4"
                          >
                            <VolumeX className="w-4 h-4" />
                          </Button>
                        )}
                        
                        <Button
                          onClick={sendMessage}
                          disabled={!currentMessage.trim() || isTyping || (inputMode === 'voice' && isListening)}
                          className="bg-purple-500 hover:bg-purple-600 text-white px-6"
                        >
                          Send
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Side Panel */}
              <div className="lg:col-span-1 space-y-4">
                {/* Voice Tone Indicator */}
                <VoiceToneIndicator voiceTone={voiceTone} isListening={isListening} />
                
                {/* Voice Settings Panel */}
                {showVoiceSettings && (
                  <VoiceSettings
                    voiceSettings={voiceSettings}
                    setVoiceSettings={setVoiceSettings}
                    availableVoices={availableVoices}
                    hasAudioPermission={hasAudioPermission}
                    initAudioContext={initAudioContext}
                    isListening={isListening}
                    isSpeaking={isSpeaking}
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TherapyBot;
