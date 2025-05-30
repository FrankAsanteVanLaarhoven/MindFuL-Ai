
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Settings, User, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUserProfile } from '@/hooks/useUserProfile';

const PersonalizationDropdown = () => {
  const { t } = useTranslation();
  const { userProfile } = useUserProfile();

  // Check if user profile is configured by checking if they have completed onboarding
  const isConfigured = userProfile?.onboardingCompleted || false;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 transition-all duration-300"
        >
          <User className="w-4 h-4 mr-2" />
          {t('personalization.title', 'Personalization')}
          <ChevronDown className="w-4 h-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 bg-white/95 backdrop-blur-md border border-white/20">
        {!isConfigured ? (
          <DropdownMenuItem asChild>
            <Link to="/personalized-dashboard" className="flex items-center">
              <Settings className="w-4 h-4 mr-2" />
              {t('personalization.setup', 'Set Up My Profile')}
            </Link>
          </DropdownMenuItem>
        ) : (
          <>
            <DropdownMenuItem asChild>
              <Link to="/personalized-dashboard" className="flex items-center">
                <User className="w-4 h-4 mr-2" />
                {t('personalization.update', 'Update My Groups')}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/wellness-dashboard" className="flex items-center">
                <Sparkles className="w-4 h-4 mr-2" />
                {t('personalization.dashboard', 'View Wellness Dashboard')}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/personalized-dashboard" className="flex items-center">
                <Settings className="w-4 h-4 mr-2" />
                {t('personalization.content', 'My Personalized Content')}
              </Link>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default PersonalizationDropdown;
