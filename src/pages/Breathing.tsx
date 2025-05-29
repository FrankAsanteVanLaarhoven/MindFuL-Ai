
"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import BreathingPacer from '@/components/breathing-exercises/breathing-pacer';
import ExerciseReflectionForm from '@/components/breathing-exercises/exercise-reflection-form';

const Breathing = () => {
  const [selectedTechnique, setSelectedTechnique] = useState<'box' | '4-7-8' | 'triangle'>('box');
  const [showReflection, setShowReflection] = useState(false);

  const techniques = {
    box: {
      name: 'Box Breathing (4-4-4-4)',
      description: 'Equal timing for inhale, hold, exhale, and hold phases. Great for reducing stress and improving focus.'
    },
    '4-7-8': {
      name: '4-7-8 Breathing',
      description: 'Inhale for 4, hold for 7, exhale for 8. Promotes relaxation and can help with sleep.'
    },
    triangle: {
      name: 'Triangle Breathing (4-4)',
      description: 'Simple inhale and exhale pattern. Perfect for beginners or quick stress relief.'
    }
  };

  const handleSessionComplete = () => {
    setShowReflection(true);
  };

  const handleReflectionSubmitted = () => {
    setShowReflection(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-mint-50 p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center py-8">
          <h1 className="text-4xl font-bold text-teal-800 mb-4 flex items-center justify-center gap-3">
            <span className="text-5xl">🫁</span>
            Guided Breathing Exercises
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Select a technique and follow the visual pacer to guide your breath and promote calmness.
          </p>
        </div>

        {/* Exercise Configuration */}
        <Card className="bg-white/80 backdrop-blur-sm border-teal-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-teal-800 flex items-center gap-2">
              <span className="text-2xl">⚙️</span>
              Exercise Configuration
            </CardTitle>
            <CardDescription>
              Choose your preferred breathing technique.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
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
              
              <div className="p-4 bg-teal-50 rounded-lg border border-teal-200">
                <p className="text-sm text-teal-800">
                  <strong>{techniques[selectedTechnique].name}:</strong> {techniques[selectedTechnique].description}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Breathing Pacer */}
        <Card className="bg-white/80 backdrop-blur-sm border-teal-200 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-teal-800">
              {techniques[selectedTechnique].name} Pacer
            </CardTitle>
            <CardDescription>
              Follow the guide. Inhale as the circle expands, hold your breath, exhale as it contracts, and hold again, according to the selected pattern.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BreathingPacer 
              technique={selectedTechnique}
              onSessionComplete={handleSessionComplete}
            />
          </CardContent>
        </Card>

        {/* Session Reflection */}
        {showReflection && (
          <div className="flex justify-center">
            <ExerciseReflectionForm onReflectionSubmitted={handleReflectionSubmitted} />
          </div>
        )}

        {/* Understanding Section */}
        <Card className="bg-white/80 backdrop-blur-sm border-teal-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-teal-800 flex items-center gap-2">
              <span className="text-2xl">💡</span>
              Understanding {techniques[selectedTechnique].name}
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-teal max-w-none">
            {selectedTechnique === 'box' && (
              <div className="space-y-4">
                <p className="text-gray-700">
                  Box breathing, also known as square breathing, is a powerful yet simple relaxation technique that can help reset your breathing patterns, reduce stress, and improve focus. It's often used by individuals in high-stress professions to maintain calm and concentration.
                </p>
                <div className="bg-teal-50 p-4 rounded-lg border border-teal-200">
                  <h4 className="font-semibold text-teal-800 mb-2">The technique involves four easy steps of equal duration:</h4>
                  <ol className="list-decimal list-inside space-y-1 text-teal-700">
                    <li><strong>Inhale (4s):</strong> Slowly and deeply through your nose for a count of four, feeling your abdomen expand.</li>
                    <li><strong>Hold (4s):</strong> Gently hold your breath for a count of four. Avoid tensing up.</li>
                    <li><strong>Exhale (4s):</strong> Slowly and completely through your mouth (or nose) for a count of four.</li>
                    <li><strong>Hold (4s):</strong> Hold your breath with your lungs empty for a count of four before repeating the cycle.</li>
                  </ol>
                </div>
                <p className="text-gray-600 text-sm">
                  Focus on the visual pacer and the sensation of your breath. Even a few rounds can make a difference.
                </p>
              </div>
            )}
            
            {selectedTechnique === '4-7-8' && (
              <div className="space-y-4">
                <p className="text-gray-700">
                  The 4-7-8 breathing technique is a simple yet powerful method for promoting relaxation and can be especially helpful for falling asleep. It was popularized by Dr. Andrew Weil.
                </p>
                <div className="bg-teal-50 p-4 rounded-lg border border-teal-200">
                  <h4 className="font-semibold text-teal-800 mb-2">The technique involves these phases:</h4>
                  <ol className="list-decimal list-inside space-y-1 text-teal-700">
                    <li><strong>Inhale (4s):</strong> Breathe in through your nose for 4 counts.</li>
                    <li><strong>Hold (7s):</strong> Hold your breath for 7 counts.</li>
                    <li><strong>Exhale (8s):</strong> Exhale completely through your mouth for 8 counts.</li>
                  </ol>
                </div>
                <p className="text-gray-600 text-sm">
                  The longer exhale helps activate your parasympathetic nervous system, promoting relaxation.
                </p>
              </div>
            )}
            
            {selectedTechnique === 'triangle' && (
              <div className="space-y-4">
                <p className="text-gray-700">
                  Triangle breathing is a simplified breathing technique perfect for beginners or when you need quick stress relief. It focuses on equal inhale and exhale phases.
                </p>
                <div className="bg-teal-50 p-4 rounded-lg border border-teal-200">
                  <h4 className="font-semibold text-teal-800 mb-2">The technique involves:</h4>
                  <ol className="list-decimal list-inside space-y-1 text-teal-700">
                    <li><strong>Inhale (4s):</strong> Breathe in slowly through your nose.</li>
                    <li><strong>Exhale (4s):</strong> Breathe out slowly through your mouth or nose.</li>
                  </ol>
                </div>
                <p className="text-gray-600 text-sm">
                  Simple and effective for establishing mindful breathing patterns without complexity.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Breathing;
