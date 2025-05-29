
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { useForm } from 'react-hook-form';
import { AvatarCharacter } from './AvatarSelector';

interface CustomAvatarCreatorProps {
  onCreateAvatar: (avatar: AvatarCharacter) => void;
  onCancel: () => void;
}

const CustomAvatarCreator: React.FC<CustomAvatarCreatorProps> = ({ onCreateAvatar, onCancel }) => {
  const form = useForm({
    defaultValues: {
      name: '',
      description: '',
      personality: '',
      type: 'friend' as const,
      gender: 'non-binary' as const,
      age: 'middle' as const,
      ethnicity: 'mixed' as const,
      skinTone: '#C19A6B',
      emoji: '🧑',
      voiceId: 'SAz9YHcvj6GT2YYXdXww'
    }
  });

  const availableVoices = [
    { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Sarah (Female)' },
    { id: 'onwK4e9ZLuTAKqWW03F9', name: 'Daniel (Male)' },
    { id: 'SAz9YHcvj6GT2YYXdXww', name: 'River (Neutral)' },
    { id: 'XrExE9yKIg1WjnnlVkGX', name: 'Matilda (Elderly Female)' },
    { id: 'JBFqnCBsd6RMkjVDRZzb', name: 'George (Elderly Male)' },
    { id: 'cgSgspJ2msm6clMCkdW9', name: 'Jessica (Young Female)' },
    { id: 'cjVigY5qzO86Huf0OWal', name: 'Eric (Young Male)' }
  ];

  const skinToneOptions = {
    african: '#8B4513',
    asian: '#F4C2A1',
    indian: '#D2B48C',
    chinese: '#F4C2A1',
    european: '#FDBCB4',
    mexican: '#D2B48C',
    jamaican: '#8B4513',
    moroccan: '#D2B48C',
    spanish: '#FDBCB4',
    italian: '#FDBCB4',
    ethiopian: '#8B4513',
    mixed: '#C19A6B'
  };

  const emojiOptions = {
    therapist: { male: '👨‍⚕️', female: '👩‍⚕️', 'non-binary': '🧑‍⚕️' },
    grandma: { female: '👵' },
    grandpa: { male: '👴' },
    aunt: { female: '👩‍🦱' },
    uncle: { male: '👨‍🦲' },
    sibling: { male: '🧑‍🎓', female: '🧑‍🎓', 'non-binary': '🧑‍🎓' },
    teacher: { male: '👨‍🏫', female: '👩‍🏫', 'non-binary': '🧑‍🏫' },
    friend: { male: '🧑‍🤝‍🧑', female: '🧑‍🤝‍🧑', 'non-binary': '🧑‍🤝‍🧑' }
  };

  const colorGradients = {
    therapist: 'from-blue-500 to-blue-600',
    grandma: 'from-pink-500 to-rose-500',
    grandpa: 'from-amber-500 to-orange-500',
    aunt: 'from-purple-500 to-violet-500',
    uncle: 'from-green-500 to-emerald-500',
    sibling: 'from-teal-500 to-cyan-500',
    teacher: 'from-indigo-500 to-blue-500',
    friend: 'from-yellow-500 to-orange-500'
  };

  const onSubmit = (data: any) => {
    const customAvatar: AvatarCharacter = {
      id: `custom-${Date.now()}`,
      name: data.name,
      type: data.type,
      gender: data.gender,
      age: data.age,
      ethnicity: data.ethnicity,
      skinTone: data.skinTone,
      description: data.description,
      personality: data.personality,
      voiceId: data.voiceId,
      emoji: data.emoji,
      color: colorGradients[data.type]
    };

    onCreateAvatar(customAvatar);
  };

  const watchedValues = form.watch();

  // Update emoji and skin tone when type, gender, or ethnicity changes
  React.useEffect(() => {
    const newEmoji = emojiOptions[watchedValues.type]?.[watchedValues.gender] || '🧑';
    const newSkinTone = skinToneOptions[watchedValues.ethnicity as keyof typeof skinToneOptions] || '#C19A6B';
    
    form.setValue('emoji', newEmoji);
    form.setValue('skinTone', newSkinTone);
  }, [watchedValues.type, watchedValues.gender, watchedValues.ethnicity, form]);

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-purple-200">
      <CardHeader>
        <CardTitle className="text-lg text-purple-800 flex items-center gap-2">
          <span className="text-xl">✨</span>
          Create Your Custom Character
        </CardTitle>
        <CardDescription>
          Design a personalized therapy companion that feels right for you
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Character Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Alex, Taylor, Morgan..." {...field} />
                    </FormControl>
                    <FormDescription>Choose a name that feels comfortable to you</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Character Role</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select character type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="therapist">Professional Therapist</SelectItem>
                        <SelectItem value="grandma">Grandmother Figure</SelectItem>
                        <SelectItem value="grandpa">Grandfather Figure</SelectItem>
                        <SelectItem value="aunt">Aunt Figure</SelectItem>
                        <SelectItem value="uncle">Uncle Figure</SelectItem>
                        <SelectItem value="sibling">Sibling/Peer</SelectItem>
                        <SelectItem value="teacher">Teacher/Mentor</SelectItem>
                        <SelectItem value="friend">Friend</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="non-binary">Non-binary</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age Group</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="young">Young Adult</SelectItem>
                        <SelectItem value="middle">Middle-aged</SelectItem>
                        <SelectItem value="senior">Senior</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ethnicity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cultural Background</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="african">African</SelectItem>
                        <SelectItem value="asian">Asian</SelectItem>
                        <SelectItem value="indian">Indian</SelectItem>
                        <SelectItem value="chinese">Chinese</SelectItem>
                        <SelectItem value="european">European</SelectItem>
                        <SelectItem value="mexican">Mexican</SelectItem>
                        <SelectItem value="jamaican">Jamaican</SelectItem>
                        <SelectItem value="moroccan">Moroccan</SelectItem>
                        <SelectItem value="spanish">Spanish</SelectItem>
                        <SelectItem value="italian">Italian</SelectItem>
                        <SelectItem value="ethiopian">Ethiopian</SelectItem>
                        <SelectItem value="mixed">Mixed Race</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="voiceId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Voice</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableVoices.map((voice) => (
                          <SelectItem key={voice.id} value={voice.id}>
                            {voice.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Character Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe your character's background, what makes them special..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>A brief description of your character's background</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="personality"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Personality Traits</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., Warm, empathetic, wise, encouraging..."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Key personality traits that define your character</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Preview */}
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <h4 className="text-sm font-medium mb-2">Preview:</h4>
              <div className="flex items-center gap-3">
                <div className="text-2xl">{watchedValues.emoji}</div>
                <div>
                  <div className="font-semibold">{watchedValues.name || 'Character Name'}</div>
                  <div className="text-sm text-gray-600">{watchedValues.description || 'Character description...'}</div>
                  <div className="flex gap-1 mt-1">
                    <Badge variant="secondary" className="text-xs">{watchedValues.ethnicity}</Badge>
                    <Badge variant="secondary" className="text-xs">{watchedValues.age}</Badge>
                    <Badge variant="secondary" className="text-xs">{watchedValues.gender}</Badge>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1" disabled={!watchedValues.name.trim()}>
                Create Character
              </Button>
              <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CustomAvatarCreator;
