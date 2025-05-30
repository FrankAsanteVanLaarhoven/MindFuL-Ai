
import { useState, useEffect } from 'react';
import { UserProfile } from '../types/UserSegmentation';

export const useUserProfile = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading user profile from storage/API
    const loadUserProfile = () => {
      const savedProfile = localStorage.getItem('wellness-user-profile');
      if (savedProfile) {
        setUserProfile(JSON.parse(savedProfile));
      }
      setLoading(false);
    };

    const timer = setTimeout(loadUserProfile, 1000);
    return () => clearTimeout(timer);
  }, []);

  const saveUserProfile = (profile: UserProfile) => {
    setUserProfile(profile);
    localStorage.setItem('wellness-user-profile', JSON.stringify(profile));
  };

  const updateUserGroups = (selectedGroups: string[], primaryGroup: string) => {
    if (userProfile) {
      const updatedProfile = {
        ...userProfile,
        selectedGroups,
        primaryGroup,
        onboardingCompleted: true
      };
      saveUserProfile(updatedProfile);
    }
  };

  return {
    userProfile,
    loading,
    saveUserProfile,
    updateUserGroups
  };
};
