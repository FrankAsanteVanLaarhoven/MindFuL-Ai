"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { gsap } from 'gsap';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mic, MicOff, Volume2, Settings, Hand } from 'lucide-react';
import { useVoiceInteraction } from '@/hooks/useVoiceInteraction';
import VoiceSettings from '@/components/VoiceSettings';
import JournalAudioPlayer from '@/components/JournalAudioPlayer';

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood: string;
  timestamp: Date;
  aiInsight?: string;
}

const Journal = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [currentEntry, setCurrentEntry] = useState({ title: '', content: '', mood: '' });
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [isGeneratingInsight, setIsGeneratingInsight] = useState(false);
  const [showNewEntry, setShowNewEntry] = useState(false);
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);
  const [showAudioPlayer, setShowAudioPlayer] = useState(false);
  const [isVoiceInputActive, setIsVoiceInputActive] = useState(false);
  const [voiceInputMode, setVoiceInputMode] = useState<'toggle' | 'hold'>('toggle');
  const [isHolding, setIsHolding] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const containerRef = useRef<HTMLDivElement>(null);
  const holdTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const {
    isListening,
    isSpeaking,
    transcript,
    voiceSettings,
    hasAudioPermission,
    availableVoices,
    startListening,
    stopListening,
    speak,
    clearTranscript,
    updateVoiceSettings,
    setVoiceSettings,
    initAudioContext,
    setTranscript
  } = useVoiceInteraction();

  useEffect(() => {
    // Load entries from localStorage
    const savedEntries = localStorage.getItem('journalEntries');
    if (savedEntries) {
      const parsed = JSON.parse(savedEntries).map((entry: any) => ({
        ...entry,
        timestamp: new Date(entry.timestamp)
      }));
      setEntries(parsed);
    }

    // Animate container entrance
    if (containerRef.current) {
      gsap.fromTo(containerRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
      );
    }
  }, []);

  // Handle voice input for content
  useEffect(() => {
    if (transcript && isVoiceInputActive && showNewEntry) {
      setCurrentEntry(prev => ({ 
        ...prev, 
        content: prev.content + (prev.content ? ' ' : '') + transcript 
      }));
      clearTranscript();
    }
  }, [transcript, isVoiceInputActive, showNewEntry, clearTranscript]);

  // Handle hold mode - stop listening when not holding
  useEffect(() => {
    if (voiceInputMode === 'hold' && isListening && !isHolding) {
      stopListening();
      setIsVoiceInputActive(false);
    }
  }, [isHolding, voiceInputMode, isListening, stopListening]);

  const handleVoiceInputToggle = () => {
    if (!voiceSettings.enabled || !voiceSettings.voiceInput) {
      toast({
        title: "Voice input disabled",
        description: "Please enable voice features in settings first.",
        variant: "destructive"
      });
      return;
    }

    if (hasAudioPermission !== true) {
      initAudioContext();
      return;
    }

    if (voiceInputMode === 'toggle') {
      // Toggle mode: click to start/stop
      setIsVoiceInputActive(!isVoiceInputActive);
      
      if (!isListening) {
        startListening();
        toast({
          title: "Voice input started",
          description: "Click the microphone again to stop listening..."
        });
      } else {
        stopListening();
        toast({
          title: "Voice input stopped",
          description: "Voice input has been stopped."
        });
      }
    }
  };

  const handleVoiceInputHoldStart = () => {
    if (!voiceSettings.enabled || !voiceSettings.voiceInput) {
      toast({
        title: "Voice input disabled",
        description: "Please enable voice features in settings first.",
        variant: "destructive"
      });
      return;
    }

    if (hasAudioPermission !== true) {
      initAudioContext();
      return;
    }

    if (voiceInputMode === 'hold') {
      setIsHolding(true);
      setIsVoiceInputActive(true);
      
      // Add small delay to prevent accidental triggers
      holdTimeoutRef.current = setTimeout(() => {
        if (!isListening) {
          startListening();
          toast({
            title: "Voice input active",
            description: "Hold the button and speak. Release to stop."
          });
        }
      }, 100);
    }
  };

  const handleVoiceInputHoldEnd = () => {
    if (voiceInputMode === 'hold') {
      setIsHolding(false);
      
      // Clear timeout if user releases quickly
      if (holdTimeoutRef.current) {
        clearTimeout(holdTimeoutRef.current);
        holdTimeoutRef.current = null;
      }
      
      // Small delay to allow final words to be captured
      setTimeout(() => {
        if (isListening) {
          stopListening();
          setIsVoiceInputActive(false);
        }
      }, 500);
    }
  };

  const saveEntry = async () => {
    if (!currentEntry.title.trim() || !currentEntry.content.trim()) {
      toast({
        title: "Please fill in all fields",
        description: "Both title and content are required",
        variant: "destructive"
      });
      return;
    }

    const newEntry: JournalEntry = {
      id: crypto.randomUUID(),
      title: currentEntry.title,
      content: currentEntry.content,
      mood: currentEntry.mood,
      timestamp: new Date()
    };

    // Generate AI insight
    setIsGeneratingInsight(true);
    try {
      const insight = await generateAIInsight(currentEntry.content);
      newEntry.aiInsight = insight;
    } catch (error) {
      console.log('Could not generate AI insight');
    }
    setIsGeneratingInsight(false);

    const updatedEntries = [newEntry, ...entries];
    setEntries(updatedEntries);
    
    // Save to localStorage
    localStorage.setItem('journalEntries', JSON.stringify(updatedEntries));
    
    setCurrentEntry({ title: '', content: '', mood: '' });
    setShowNewEntry(false);
    setIsVoiceInputActive(false);
    stopListening();
    
    toast({
      title: "Entry saved!",
      description: "Your journal entry has been saved with AI insights."
    });

    // Read the insight aloud if voice output is enabled
    if (voiceSettings.voiceOutput && newEntry.aiInsight) {
      setTimeout(() => {
        speak(`Your entry has been saved. Here's an AI insight: ${newEntry.aiInsight}`);
      }, 1000);
    }
  };

  const generateAIInsight = async (content: string): Promise<string> => {
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const insights = [
      "Your writing shows a strong sense of self-awareness. Consider exploring these feelings further through mindfulness practices.",
      "I notice themes of growth and resilience in your words. This suggests you're developing healthy coping mechanisms.",
      "Your reflection demonstrates emotional intelligence. You might benefit from continuing to journal regularly to track your progress.",
      "There's a sense of hope in your writing that's worth celebrating. Small positive steps can lead to significant changes.",
      "Your ability to articulate complex emotions is a strength. Consider sharing your insights with trusted friends or a counselor."
    ];
    
    return insights[Math.floor(Math.random() * insights.length)];
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const moodEmojis: { [key: string]: string } = {
    'happy': '😊',
    'sad': '😢',
    'anxious': '😰',
    'calm': '😌',
    'excited': '🤗',
    'angry': '😠',
    'grateful': '🙏',
    'confused': '😕',
    'hopeful': '🌟',
    'peaceful': '☮️'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 p-4">
      <div ref={containerRef} className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center py-8"
        >
          <div className="flex justify-center gap-4 mb-4">
            <Button 
              onClick={() => navigate('/')}
              variant="outline"
            >
              ← Back to Dashboard
            </Button>
            <Button
              onClick={() => setShowVoiceSettings(!showVoiceSettings)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              Voice Settings
            </Button>
            <Button
              onClick={() => setShowAudioPlayer(!showAudioPlayer)}
              variant={showAudioPlayer ? "default" : "outline"}
              className="flex items-center gap-2"
            >
              <Volume2 className="w-4 h-4" />
              Audio Player
            </Button>
          </div>
          <h1 className="text-4xl font-bold text-orange-800 mb-4 flex items-center justify-center gap-3">
            <span className="text-5xl">📝</span>
            AI-Enhanced Journal
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Write down your thoughts and feelings. Use voice dictation or type manually. Our AI provides gentle reflections to help you gain insights.
          </p>
        </motion.div>

        {/* Voice Settings */}
        {showVoiceSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
          >
            <VoiceSettings
              voiceSettings={voiceSettings}
              setVoiceSettings={setVoiceSettings}
              availableVoices={availableVoices}
              hasAudioPermission={hasAudioPermission}
              initAudioContext={initAudioContext}
              isListening={isListening}
              isSpeaking={isSpeaking}
            />
          </motion.div>
        )}

        {/* Audio Player */}
        {showAudioPlayer && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
          >
            <JournalAudioPlayer
              entries={entries}
              availableVoices={availableVoices}
              voiceSettings={voiceSettings}
            />
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* New Entry / Entry Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-2"
          >
            <Card className="bg-white/80 backdrop-blur-sm border-orange-200 shadow-lg">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl text-orange-800 flex items-center gap-2">
                    <span className="text-2xl">✍️</span>
                    {showNewEntry ? 'New Journal Entry' : 'Your Journal'}
                  </CardTitle>
                  {!showNewEntry && (
                    <Button
                      onClick={() => setShowNewEntry(true)}
                      className="bg-orange-500 hover:bg-orange-600 text-white"
                    >
                      + New Entry
                    </Button>
                  )}
                </div>
                <CardDescription>
                  {showNewEntry 
                    ? 'Express your thoughts through typing or voice dictation and receive AI-powered insights'
                    : 'Your recent journal entries and reflections'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                {showNewEntry ? (
                  <div className="space-y-6">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Entry Title
                      </label>
                      <Input
                        value={currentEntry.title}
                        onChange={(e) => setCurrentEntry(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Give your entry a title..."
                        className="border-orange-200 focus:border-orange-400 focus:ring-orange-400"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Current Mood
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(moodEmojis).map(([mood, emoji]) => (
                          <button
                            key={mood}
                            onClick={() => setCurrentEntry(prev => ({ ...prev, mood }))}
                            className={`px-3 py-2 rounded-full text-sm transition-all duration-200 ${
                              currentEntry.mood === mood
                                ? 'bg-orange-500 text-white'
                                : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                            }`}
                          >
                            {emoji} {mood}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-medium text-gray-700">
                          Your Thoughts
                        </label>
                        <div className="flex items-center gap-2">
                          {voiceSettings.enabled && voiceSettings.voiceInput && (
                            <>
                              {/* Voice Input Mode Toggle */}
                              <div className="flex items-center gap-1 mr-2">
                                <Button
                                  onClick={() => setVoiceInputMode('toggle')}
                                  variant={voiceInputMode === 'toggle' ? "default" : "outline"}
                                  size="sm"
                                  className="px-2 py-1 text-xs"
                                >
                                  Click
                                </Button>
                                <Button
                                  onClick={() => setVoiceInputMode('hold')}
                                  variant={voiceInputMode === 'hold' ? "default" : "outline"}
                                  size="sm"
                                  className="px-2 py-1 text-xs"
                                >
                                  Hold
                                </Button>
                              </div>

                              {/* Toggle Mode Button */}
                              {voiceInputMode === 'toggle' && (
                                <Button
                                  onClick={handleVoiceInputToggle}
                                  variant={isVoiceInputActive ? "default" : "outline"}
                                  size="sm"
                                  className={`transition-all duration-200 ${
                                    isListening 
                                      ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' 
                                      : 'border-orange-300 hover:bg-orange-50'
                                  }`}
                                >
                                  {isListening ? (
                                    <>
                                      <MicOff className="w-4 h-4 mr-1" />
                                      Stop
                                    </>
                                  ) : (
                                    <>
                                      <Mic className="w-4 h-4 mr-1" />
                                      Start
                                    </>
                                  )}
                                </Button>
                              )}

                              {/* Hold Mode Button */}
                              {voiceInputMode === 'hold' && (
                                <Button
                                  onMouseDown={handleVoiceInputHoldStart}
                                  onMouseUp={handleVoiceInputHoldEnd}
                                  onMouseLeave={handleVoiceInputHoldEnd}
                                  onTouchStart={handleVoiceInputHoldStart}
                                  onTouchEnd={handleVoiceInputHoldEnd}
                                  variant="outline"
                                  size="sm"
                                  className={`transition-all duration-200 select-none ${
                                    isHolding && isListening
                                      ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' 
                                      : 'border-orange-300 hover:bg-orange-50'
                                  }`}
                                >
                                  <Hand className="w-4 h-4 mr-1" />
                                  {isHolding && isListening ? 'Release' : 'Hold to Talk'}
                                </Button>
                              )}
                            </>
                          )}
                          {isSpeaking && (
                            <div className="flex items-center text-blue-600 text-sm">
                              <Volume2 className="w-4 h-4 mr-1 animate-pulse" />
                              Speaking...
                            </div>
                          )}
                        </div>
                      </div>
                      <Textarea
                        value={currentEntry.content}
                        onChange={(e) => setCurrentEntry(prev => ({ ...prev, content: e.target.value }))}
                        placeholder="What's on your mind today? Share your thoughts, feelings, experiences, or anything you'd like to reflect on... You can also use voice input!"
                        className="resize-none border-orange-200 focus:border-orange-400 focus:ring-orange-400 min-h-[200px]"
                      />
                      {isVoiceInputActive && (
                        <p className="text-xs text-orange-600 mt-1 flex items-center gap-1">
                          <Mic className="w-3 h-3" />
                          {voiceInputMode === 'hold' 
                            ? 'Hold the button and speak to add to your entry.'
                            : 'Voice input is active. Speak to add to your entry.'
                          }
                        </p>
                      )}
                    </div>
                    
                    <div className="flex gap-3">
                      <Button
                        onClick={saveEntry}
                        disabled={isGeneratingInsight}
                        className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 rounded-full transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100"
                      >
                        {isGeneratingInsight ? (
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Generating Insights...
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-2">
                            <span>💾</span>
                            Save Entry
                          </div>
                        )}
                      </Button>
                      <Button
                        onClick={() => {
                          setShowNewEntry(false);
                          setIsVoiceInputActive(false);
                          setIsHolding(false);
                          stopListening();
                        }}
                        variant="outline"
                        className="px-6"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {entries.length === 0 ? (
                      <div className="text-center py-12 text-gray-500">
                        <div className="text-6xl mb-4">📔</div>
                        <p className="text-lg mb-2">Your journal is empty</p>
                        <p className="text-sm">Start writing to capture your thoughts and get AI insights!</p>
                      </div>
                    ) : (
                      entries.map((entry) => (
                        <motion.div
                          key={entry.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="border border-orange-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 cursor-pointer"
                          onClick={() => setSelectedEntry(entry)}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold text-gray-800">{entry.title}</h3>
                            <div className="flex items-center gap-2">
                              {entry.mood && moodEmojis[entry.mood] && (
                                <span className="text-lg">{moodEmojis[entry.mood]}</span>
                              )}
                              <span className="text-xs text-gray-500">
                                {formatDate(entry.timestamp)}
                              </span>
                            </div>
                          </div>
                          <p className="text-gray-600 text-sm line-clamp-3">
                            {entry.content.substring(0, 150)}...
                          </p>
                          {entry.aiInsight && (
                            <div className="mt-3 p-2 bg-orange-50 rounded border-l-4 border-orange-400">
                              <p className="text-xs text-orange-700">
                                <strong>AI Insight:</strong> {entry.aiInsight.substring(0, 100)}...
                              </p>
                            </div>
                          )}
                        </motion.div>
                      ))
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Entry Details / Statistics */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            {selectedEntry ? (
              <Card className="bg-white/80 backdrop-blur-sm border-orange-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg text-orange-800 flex items-center gap-2">
                    <span className="text-xl">📖</span>
                    Entry Details
                  </CardTitle>
                  <Button
                    onClick={() => setSelectedEntry(null)}
                    variant="outline"
                    size="sm"
                    className="w-fit"
                  >
                    ← Back to List
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">{selectedEntry.title}</h3>
                    <div className="flex items-center gap-2 mb-3">
                      {selectedEntry.mood && moodEmojis[selectedEntry.mood] && (
                        <span className="text-lg">{moodEmojis[selectedEntry.mood]} {selectedEntry.mood}</span>
                      )}
                      <span className="text-xs text-gray-500">
                        {formatDate(selectedEntry.timestamp)}
                      </span>
                    </div>
                    <p className="text-gray-700 text-sm whitespace-pre-wrap">
                      {selectedEntry.content}
                    </p>
                  </div>
                  
                  {selectedEntry.aiInsight && (
                    <div className="p-4 bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg border border-orange-200">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-orange-800 flex items-center gap-2">
                          <span>🤖</span>
                          AI Reflection
                        </h4>
                        {voiceSettings.voiceOutput && (
                          <Button
                            onClick={() => speak(selectedEntry.aiInsight!)}
                            variant="outline"
                            size="sm"
                            disabled={isSpeaking}
                            className="text-xs"
                          >
                            <Volume2 className="w-3 h-3 mr-1" />
                            Read Aloud
                          </Button>
                        )}
                      </div>
                      <p className="text-orange-700 text-sm">
                        {selectedEntry.aiInsight}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-white/80 backdrop-blur-sm border-orange-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg text-orange-800 flex items-center gap-2">
                    <span className="text-xl">📊</span>
                    Journal Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">{entries.length}</div>
                      <div className="text-xs text-gray-600">Total Entries</div>
                    </div>
                    <div className="text-center p-3 bg-amber-50 rounded-lg">
                      <div className="text-2xl font-bold text-amber-600">
                        {entries.reduce((acc, entry) => acc + entry.content.split(' ').length, 0)}
                      </div>
                      <div className="text-xs text-gray-600">Words Written</div>
                    </div>
                  </div>
                  
                  {entries.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Recent Moods</h4>
                      <div className="flex flex-wrap gap-1">
                        {entries.slice(0, 10).map((entry, index) => (
                          entry.mood && moodEmojis[entry.mood] && (
                            <span key={index} className="text-lg" title={entry.mood}>
                              {moodEmojis[entry.mood]}
                            </span>
                          )
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="p-3 bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg border border-orange-200">
                    <h4 className="font-semibold text-orange-800 mb-1">Journaling Tip</h4>
                    <p className="text-xs text-orange-700">
                      Try to write for at least 10 minutes each day. Regular journaling can improve mental clarity and emotional well-being.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Journal;
