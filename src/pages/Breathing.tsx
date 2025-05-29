"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import BreathingPacer from '@/components/breathing-exercises/breathing-pacer';
import BreathingSphere3D from '@/components/breathing-exercises/breathing-sphere-3d';
import RealTimeBreathingSphere from '@/components/breathing-exercises/real-time-breathing-sphere';
import ExerciseReflectionForm from '@/components/breathing-exercises/exercise-reflection-form';

const Breathing = () => {
  const [selectedTechnique, setSelectedTechnique] = useState<'box' | '4-7-8' | 'triangle'>('box');
  const [showReflection, setShowReflection] = useState(false);
  const [view3D, setView3D] = useState(true);
  const [realTimeMode, setRealTimeMode] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<'inhale' | 'hold1' | 'exhale' | 'hold2'>('inhale');
  
  const navigate = useNavigate();

  const techniques = {
    box: {
      name: 'Box Breathing (4-4-4-4)',
      description: 'Equal timing for inhale, hold, exhale, and hold phases. Great for reducing stress and improving focus.',
      benefits: ['Reduces anxiety', 'Improves concentration', 'Lowers heart rate', 'Enhances emotional regulation']
    },
    '4-7-8': {
      name: '4-7-8 Breathing',
      description: 'Inhale for 4, hold for 7, exhale for 8. Promotes relaxation and can help with sleep.',
      benefits: ['Promotes sleep', 'Reduces stress hormones', 'Calms nervous system', 'Improves focus']
    },
    triangle: {
      name: 'Triangle Breathing (4-4)',
      description: 'Simple inhale and exhale pattern. Perfect for beginners or quick stress relief.',
      benefits: ['Easy to learn', 'Quick stress relief', 'Accessible anywhere', 'Builds mindfulness']
    }
  };

  const handleSessionComplete = () => {
    setShowReflection(true);
    setIsActive(false);
  };

  const handleReflectionSubmitted = () => {
    setShowReflection(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-mint-50 p-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center py-8"
        >
          <Button 
            onClick={() => navigate('/')}
            variant="outline"
            className="mb-4"
          >
            ← Back to Dashboard
          </Button>
          <h1 className="text-4xl font-bold text-teal-800 mb-4 flex items-center justify-center gap-3">
            <span className="text-5xl">🫁</span>
            Advanced Breathing Exercises
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Immersive 3D breathing experiences with real-time biometric insights and personalized guidance.
          </p>
        </motion.div>

        {/* View Toggle */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex justify-center mb-6"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-full p-1 border border-teal-200">
            <div className="flex">
              <Button
                onClick={() => {
                  setView3D(true);
                  setRealTimeMode(false);
                }}
                variant={view3D && !realTimeMode ? "default" : "ghost"}
                className={`rounded-full px-6 ${
                  view3D && !realTimeMode ? 'bg-teal-500 text-white' : 'text-teal-600'
                }`}
              >
                3D Guided
              </Button>
              <Button
                onClick={() => {
                  setView3D(true);
                  setRealTimeMode(true);
                }}
                variant={realTimeMode ? "default" : "ghost"}
                className={`rounded-full px-6 ${
                  realTimeMode ? 'bg-purple-500 text-white' : 'text-purple-600'
                }`}
              >
                🎤 Live Breath
              </Button>
              <Button
                onClick={() => {
                  setView3D(false);
                  setRealTimeMode(false);
                }}
                variant={!view3D ? "default" : "ghost"}
                className={`rounded-full px-6 ${
                  !view3D ? 'bg-teal-500 text-white' : 'text-teal-600'
                }`}
              >
                Classic View
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Exercise Configuration - Only show for non-real-time modes */}
        {!realTimeMode && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="bg-white/80 backdrop-blur-sm border-teal-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-teal-800 flex items-center gap-2">
                  <span className="text-2xl">⚙️</span>
                  Exercise Configuration
                </CardTitle>
                <CardDescription>
                  Choose your preferred breathing technique and immersion level.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Breathing Technique:
                    </label>
                    <Select value={selectedTechnique} onValueChange={(value: any) => setSelectedTechnique(value)}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a breathing technique" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(techniques).map(([key, technique]) => (
                          <SelectItem key={key} value={key}>
                            {technique.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Key Benefits:
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {techniques[selectedTechnique].benefits.map((benefit, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-teal-100 text-teal-700 text-xs rounded-full"
                        >
                          {benefit}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 p-4 bg-teal-50 rounded-lg border border-teal-200">
                  <p className="text-sm text-teal-800">
                    <strong>{techniques[selectedTechnique].name}:</strong> {techniques[selectedTechnique].description}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Breathing Experience */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <Card className="bg-white/80 backdrop-blur-sm border-teal-200 shadow-lg overflow-hidden">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-teal-800">
                {realTimeMode 
                  ? "Real-Time Breath Detection Experience"
                  : `${techniques[selectedTechnique].name} Experience`
                }
              </CardTitle>
              <CardDescription>
                {realTimeMode 
                  ? "Your device will listen to your actual breathing and sync the 3D sphere in real-time. Watch as it expands and contracts like a balloon with your breath!"
                  : view3D 
                    ? "Immerse yourself in our 3D breathing environment. Watch the sphere expand and contract with your breath."
                    : "Follow the classic breathing guide. Focus on the rhythm and let your breath sync naturally."
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {realTimeMode ? (
                <RealTimeBreathingSphere
                  technique={selectedTechnique}
                  onSessionComplete={handleSessionComplete}
                />
              ) : view3D ? (
                <BreathingSphere3D
                  technique={selectedTechnique}
                  isActive={isActive}
                  currentPhase={currentPhase}
                  onSessionComplete={handleSessionComplete}
                />
              ) : (
                <BreathingPacer 
                  technique={selectedTechnique}
                  onSessionComplete={handleSessionComplete}
                />
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Session Reflection */}
        {showReflection && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex justify-center"
          >
            <ExerciseReflectionForm onReflectionSubmitted={handleReflectionSubmitted} />
          </motion.div>
        )}

        {/* Understanding Section - Only show for non-real-time modes */}
        {!realTimeMode && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="bg-white/80 backdrop-blur-sm border-teal-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-teal-800 flex items-center gap-2">
                  <span className="text-2xl">🧬</span>
                  The Science Behind {techniques[selectedTechnique].name}
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-teal max-w-none">
                {selectedTechnique === 'box' && (
                  <div className="space-y-4">
                    <p className="text-gray-700">
                      Box breathing activates the parasympathetic nervous system, which is responsible for the body's "rest and digest" response. This technique has been shown to reduce cortisol levels and activate the vagus nerve, leading to improved heart rate variability and enhanced emotional regulation.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gradient-to-br from-teal-50 to-blue-50 p-4 rounded-lg border border-teal-200">
                        <h4 className="font-semibold text-teal-800 mb-2">Physiological Effects:</h4>
                        <ul className="list-disc list-inside space-y-1 text-teal-700 text-sm">
                          <li>Lowers blood pressure</li>
                          <li>Reduces stress hormones</li>
                          <li>Improves oxygen saturation</li>
                          <li>Enhances focus and clarity</li>
                        </ul>
                      </div>
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                        <h4 className="font-semibold text-blue-800 mb-2">Mental Benefits:</h4>
                        <ul className="list-disc list-inside space-y-1 text-blue-700 text-sm">
                          <li>Increased mindfulness</li>
                          <li>Better emotional control</li>
                          <li>Enhanced decision-making</li>
                          <li>Improved sleep quality</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
                
                {selectedTechnique === '4-7-8' && (
                  <div className="space-y-4">
                    <p className="text-gray-700">
                      The 4-7-8 breathing technique, developed by Dr. Andrew Weil, is based on pranayama, an ancient Indian practice. The extended exhalation phase helps to expel more carbon dioxide, which can have a natural tranquilizing effect on the nervous system.
                    </p>
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
                      <h4 className="font-semibold text-purple-800 mb-2">Research Findings:</h4>
                      <ul className="list-disc list-inside space-y-1 text-purple-700 text-sm">
                        <li>Reduces anxiety within 60 seconds</li>
                        <li>Activates the relaxation response</li>
                        <li>Improves sleep onset time</li>
                        <li>Enhances GABA neurotransmitter activity</li>
                      </ul>
                    </div>
                  </div>
                )}
                
                {selectedTechnique === 'triangle' && (
                  <div className="space-y-4">
                    <p className="text-gray-700">
                      Triangle breathing is the foundation of mindful breathing practices. Its simplicity makes it accessible while still providing significant benefits for stress reduction and emotional regulation.
                    </p>
                    <div className="bg-gradient-to-br from-green-50 to-teal-50 p-4 rounded-lg border border-green-200">
                      <h4 className="font-semibold text-green-800 mb-2">Perfect for:</h4>
                      <ul className="list-disc list-inside space-y-1 text-green-700 text-sm">
                        <li>Beginners to breathing exercises</li>
                        <li>Quick stress relief sessions</li>
                        <li>Building mindfulness habits</li>
                        <li>Workplace wellness breaks</li>
                      </ul>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Breathing;
