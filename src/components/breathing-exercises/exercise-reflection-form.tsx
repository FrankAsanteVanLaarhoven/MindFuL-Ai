
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { gsap } from 'gsap';
import { useToast } from '@/hooks/use-toast';

interface ExerciseReflectionFormProps {
  onReflectionSubmitted?: () => void;
}

const ExerciseReflectionForm: React.FC<ExerciseReflectionFormProps> = ({
  onReflectionSubmitted
}) => {
  const [calmness, setCalmness] = useState<number | null>(null);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const cardRef = useRef<HTMLDivElement>(null);
  const starsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Animate card entrance
    if (cardRef.current) {
      gsap.fromTo(cardRef.current, 
        { opacity: 0, y: 30, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "back.out(1.7)" }
      );
    }
  }, []);

  const handleStarClick = (rating: number) => {
    setCalmness(rating);
    
    // Animate star selection
    starsRef.current.forEach((star, index) => {
      if (star) {
        gsap.to(star, {
          scale: index < rating ? 1.2 : 1,
          duration: 0.2,
          ease: "back.out(1.7)"
        });
      }
    });
  };

  const handleSubmit = async () => {
    if (calmness === null) {
      toast({
        title: "Please rate your calmness",
        description: "Select a rating from 1-5 stars",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    // Save reflection to localStorage
    const reflection = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      calmness,
      notes: notes.trim(),
      technique: 'box' // This would be passed as prop in real implementation
    };

    try {
      const existingReflections = JSON.parse(localStorage.getItem('exerciseReflections') || '[]');
      existingReflections.push(reflection);
      localStorage.setItem('exerciseReflections', JSON.stringify(existingReflections));

      // Success animation
      if (cardRef.current) {
        gsap.to(cardRef.current, {
          scale: 1.05,
          duration: 0.2,
          yoyo: true,
          repeat: 1,
          ease: "power2.inOut"
        });
      }

      toast({
        title: "Reflection saved!",
        description: "Your breathing session has been logged successfully.",
      });

      // Reset form
      setCalmness(null);
      setNotes('');
      onReflectionSubmitted?.();

    } catch (error) {
      toast({
        title: "Error saving reflection",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card ref={cardRef} className="w-full max-w-md mx-auto bg-white/80 backdrop-blur-sm border-teal-200 shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-xl text-teal-800 flex items-center justify-center gap-2">
          <span className="text-2xl">🧘‍♀️</span>
          Session Reflection
        </CardTitle>
        <CardDescription>
          How calm do you feel after this breathing session?
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Calmness Rating */}
        <div className="text-center">
          <p className="text-sm font-medium text-gray-700 mb-3">
            Rate your calmness: 1 (Less Calm) to 5 (More Calm)
          </p>
          <div className="flex justify-center space-x-2">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                ref={el => { starsRef.current[rating - 1] = el; }}
                onClick={() => handleStarClick(rating)}
                className={`text-3xl transition-all duration-200 hover:scale-110 ${
                  calmness && rating <= calmness 
                    ? 'text-yellow-400 drop-shadow-lg' 
                    : 'text-gray-300'
                }`}
              >
                ⭐
              </button>
            ))}
          </div>
        </div>

        {/* Optional Notes */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Any notes? (Optional)
          </label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g., Felt bit distracted, or feeling very relaxed..."
            className="resize-none border-teal-200 focus:border-teal-400 focus:ring-teal-400"
            rows={3}
          />
        </div>

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full bg-teal-500 hover:bg-teal-600 text-white font-medium py-3 rounded-full transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100"
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Saving...
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <span>📝</span>
              Log Reflection
            </div>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ExerciseReflectionForm;
