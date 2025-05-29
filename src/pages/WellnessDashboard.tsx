
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CrisisSupport from '@/components/CrisisSupport';
import ProgressAnalytics from '@/components/ProgressAnalytics';
import GoalSetting from '@/components/GoalSetting';
import PodcastIntegration from '@/components/PodcastIntegration';
import IoTIntegration from '@/components/IoTIntegration';
import RealTimeMoodChart from '@/components/dashboard/real-time-mood-chart';
import Localization from '@/components/Localization';
import Weather from '@/components/Weather';
import WorldClock from '@/components/WorldClock';
import InstantTranslation from '@/components/InstantTranslation';
import { BarChart3, Target, AlertTriangle, TrendingUp, Podcast, Smartphone, Globe, CloudSun, Clock, Translate } from 'lucide-react';

const WellnessDashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Wellness Dashboard</h1>
          <p className="text-gray-600">
            Comprehensive tools for tracking and improving your mental wellness journey
          </p>
        </div>

        <Tabs defaultValue="analytics" className="space-y-6">
          <TabsList className="grid w-full grid-cols-10 lg:w-auto lg:grid-cols-10">
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="goals" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              <span className="hidden sm:inline">Goals</span>
            </TabsTrigger>
            <TabsTrigger value="mood-tracking" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline">Mood</span>
            </TabsTrigger>
            <TabsTrigger value="podcasts" className="flex items-center gap-2">
              <Podcast className="w-4 h-4" />
              <span className="hidden sm:inline">Podcasts</span>
            </TabsTrigger>
            <TabsTrigger value="iot" className="flex items-center gap-2">
              <Smartphone className="w-4 h-4" />
              <span className="hidden sm:inline">IoT</span>
            </TabsTrigger>
            <TabsTrigger value="crisis" className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              <span className="hidden sm:inline">Crisis</span>
            </TabsTrigger>
            <TabsTrigger value="localization" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              <span className="hidden sm:inline">Language</span>
            </TabsTrigger>
            <TabsTrigger value="weather" className="flex items-center gap-2">
              <CloudSun className="w-4 h-4" />
              <span className="hidden sm:inline">Weather</span>
            </TabsTrigger>
            <TabsTrigger value="worldclock" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span className="hidden sm:inline">Clock</span>
            </TabsTrigger>
            <TabsTrigger value="translation" className="flex items-center gap-2">
              <Translate className="w-4 h-4" />
              <span className="hidden sm:inline">Translate</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" className="space-y-6">
            <ProgressAnalytics />
          </TabsContent>

          <TabsContent value="goals" className="space-y-6">
            <GoalSetting />
          </TabsContent>

          <TabsContent value="mood-tracking" className="space-y-6">
            <RealTimeMoodChart />
          </TabsContent>

          <TabsContent value="podcasts" className="space-y-6">
            <PodcastIntegration />
          </TabsContent>

          <TabsContent value="iot" className="space-y-6">
            <IoTIntegration />
          </TabsContent>

          <TabsContent value="crisis" className="space-y-6">
            <CrisisSupport />
          </TabsContent>

          <TabsContent value="localization" className="space-y-6">
            <Localization />
          </TabsContent>

          <TabsContent value="weather" className="space-y-6">
            <Weather />
          </TabsContent>

          <TabsContent value="worldclock" className="space-y-6">
            <WorldClock />
          </TabsContent>

          <TabsContent value="translation" className="space-y-6">
            <InstantTranslation />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default WellnessDashboard;
