
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CrisisSupport from '@/components/CrisisSupport';
import ProgressAnalytics from '@/components/ProgressAnalytics';
import GoalSetting from '@/components/GoalSetting';
import PodcastIntegration from '@/components/PodcastIntegration';
import RealTimeMoodChart from '@/components/dashboard/real-time-mood-chart';
import { BarChart3, Target, AlertTriangle, TrendingUp, Podcast } from 'lucide-react';

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
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:grid-cols-5">
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
            <TabsTrigger value="crisis" className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              <span className="hidden sm:inline">Crisis Support</span>
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

          <TabsContent value="crisis" className="space-y-6">
            <CrisisSupport />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default WellnessDashboard;
