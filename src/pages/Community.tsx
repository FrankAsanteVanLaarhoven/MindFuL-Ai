import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Users, MessageCircle, Calendar, Trophy, Heart, Plus, ExternalLink, Clock, UserCheck, Sparkles, Podcast } from 'lucide-react';
import { EngagementSection } from '@/components/community/EngagementSection';
import PodcastIntegration from '@/components/PodcastIntegration';

const Community = () => {
  const [activeTab, setActiveTab] = useState('forums');

  const forumTopics = [
    {
      title: "Daily Check-ins & Support",
      description: "Share how you're feeling today and support others",
      posts: 234,
      members: 1205,
      category: "Support",
      lastActive: "2 min ago"
    },
    {
      title: "CBT Techniques & Tips",
      description: "Discuss cognitive behavioral therapy strategies",
      posts: 156,
      members: 890,
      category: "CBT",
      lastActive: "15 min ago"
    },
    {
      title: "DBT Skills Practice",
      description: "Share DBT exercises and experiences",
      posts: 98,
      members: 567,
      category: "DBT",
      lastActive: "1 hour ago"
    },
    {
      title: "Cultural Perspectives on Mental Health",
      description: "Diverse viewpoints and cultural approaches to wellness",
      posts: 134,
      members: 723,
      category: "Culture",
      lastActive: "3 hours ago"
    }
  ];

  const challenges = [
    {
      title: "30-Day Mindfulness Challenge",
      description: "Practice mindfulness daily for 30 days",
      participants: 1240,
      daysLeft: 12,
      type: "Mindfulness"
    },
    {
      title: "DBT Skills Streak",
      description: "Use one DBT skill every day this week",
      participants: 856,
      daysLeft: 3,
      type: "DBT"
    },
    {
      title: "Gratitude Journal Week",
      description: "Write 3 things you're grateful for daily",
      participants: 2103,
      daysLeft: 5,
      type: "Gratitude"
    }
  ];

  const realSupportGroups = [
    {
      title: "Anxiety Support Circle",
      description: "Anonymous, text-based peer support available 24/7",
      platforms: [
        { name: "Supportiv", url: "https://www.supportiv.com/anxiety-support-group", type: "24/7 Chat" },
        { name: "Mental Health America", url: "https://www.mhanational.org/find-support-groups", type: "Group Directory" },
        { name: "7 Cups", url: "https://www.7cups.com/home/anxiety/", type: "Moderated Chat" }
      ],
      category: "Anxiety",
      facilitatorType: "Trained moderators",
      availability: "24/7"
    },
    {
      title: "Depression Peer Support",
      description: "Free, peer-led online groups for depression support",
      platforms: [
        { name: "DBSA", url: "https://www.dbsalliance.org/support/chapters-and-support-groups/online-support-groups/", type: "Peer-Led Groups" },
        { name: "Mental Health America", url: "https://www.mhanational.org/find-support-groups", type: "Group Directory" },
        { name: "7 Cups", url: "https://www.7cups.com/home/depression/", type: "Community Chat" }
      ],
      category: "Depression",
      facilitatorType: "Peer-led with moderators",
      availability: "Scheduled sessions"
    },
    {
      title: "ADHD Strategies Group",
      description: "Expert-facilitated groups focusing on ADHD management strategies",
      platforms: [
        { name: "ADDA", url: "https://add.org/peer-support-groups/", type: "Weekly Zoom Groups" },
        { name: "CHADD", url: "https://chadd.org/for-adults/adhd-adult-support-groups/", type: "Support Directory" },
        { name: "Inflow", url: "https://www.getinflow.io/events", type: "App-Based Events" }
      ],
      category: "ADHD",
      facilitatorType: "Clinician-led & peer support",
      availability: "Weekly sessions"
    }
  ];

  const handlePlatformClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-teal-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-purple-800 mb-4">
            Community Hub
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Connect with others on similar journeys. Share experiences, learn together, and grow in a supportive environment.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-2 shadow-md">
            <div className="flex gap-2">
              <Button
                variant={activeTab === 'forums' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('forums')}
                className="flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                Forums
              </Button>
              <Button
                variant={activeTab === 'challenges' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('challenges')}
                className="flex items-center gap-2"
              >
                <Trophy className="w-4 h-4" />
                Challenges
              </Button>
              <Button
                variant={activeTab === 'groups' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('groups')}
                className="flex items-center gap-2"
              >
                <Users className="w-4 h-4" />
                Live Support Groups
              </Button>
              <Button
                variant={activeTab === 'podcasts' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('podcasts')}
                className="flex items-center gap-2"
              >
                <Podcast className="w-4 h-4" />
                Podcasts
              </Button>
              <Button
                variant={activeTab === 'engagement' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('engagement')}
                className="flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Engagement
              </Button>
            </div>
          </div>
        </div>

        {/* Forums Tab */}
        {activeTab === 'forums' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-800">Community Forums</h2>
              <Button className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                New Topic
              </Button>
            </div>
            
            <div className="grid gap-4">
              {forumTopics.map((topic, index) => (
                <Card key={index} className="bg-white/80 backdrop-blur-sm border-purple-200 hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold text-gray-800">{topic.title}</h3>
                          <Badge variant="outline">{topic.category}</Badge>
                        </div>
                        <p className="text-gray-600 mb-3">{topic.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <MessageCircle className="w-4 h-4" />
                            {topic.posts} posts
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {topic.members} members
                          </span>
                          <span>Last active: {topic.lastActive}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Heart className="w-5 h-5 text-red-400" />
                        <span className="text-sm text-gray-500">42</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Challenges Tab */}
        {activeTab === 'challenges' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-800">Group Challenges</h2>
              <Button className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Create Challenge
              </Button>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {challenges.map((challenge, index) => (
                <Card key={index} className="bg-white/80 backdrop-blur-sm border-yellow-200 hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <Badge variant="outline">{challenge.type}</Badge>
                      <span className="text-sm text-gray-500">{challenge.daysLeft} days left</span>
                    </div>
                    <CardTitle className="text-lg">{challenge.title}</CardTitle>
                    <CardDescription>{challenge.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Participants</span>
                        <span className="font-semibold">{challenge.participants.toLocaleString()}</span>
                      </div>
                      <Button className="w-full">Join Challenge</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Live Support Groups Tab */}
        {activeTab === 'groups' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-semibold text-gray-800">Live Support Groups</h2>
                <p className="text-gray-600 mt-1">Join reputable, professional support groups from trusted platforms</p>
              </div>
              <Button className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Browse All Groups
              </Button>
            </div>
            
            <div className="grid gap-6">
              {realSupportGroups.map((group, index) => (
                <Card key={index} className="bg-white/80 backdrop-blur-sm border-green-200 hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle className="text-xl">{group.title}</CardTitle>
                          <Badge variant="outline">{group.category}</Badge>
                        </div>
                        <CardDescription className="text-base">{group.description}</CardDescription>
                      </div>
                      <div className="text-right text-sm text-gray-500">
                        <div className="flex items-center gap-1 mb-1">
                          <Clock className="w-4 h-4" />
                          {group.availability}
                        </div>
                        <div className="flex items-center gap-1">
                          <UserCheck className="w-4 h-4" />
                          {group.facilitatorType}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-3">Available Platforms:</h4>
                        <div className="grid md:grid-cols-3 gap-3">
                          {group.platforms.map((platform, platformIndex) => (
                            <div key={platformIndex} className="border border-gray-200 rounded-lg p-3 hover:border-green-300 transition-colors">
                              <div className="flex justify-between items-start mb-2">
                                <h5 className="font-medium text-gray-800">{platform.name}</h5>
                                <Badge variant="secondary" className="text-xs">{platform.type}</Badge>
                              </div>
                              <Button
                                size="sm"
                                className="w-full mt-2"
                                onClick={() => handlePlatformClick(platform.url)}
                              >
                                <ExternalLink className="w-3 h-3 mr-1" />
                                Join Group
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="bg-green-50 p-3 rounded-lg">
                        <p className="text-sm text-green-800">
                          <strong>Note:</strong> These are external platforms. Most require free registration. 
                          Always verify facilitator credentials and group guidelines before participating.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Access Summary */}
            <Card className="bg-gradient-to-r from-blue-50 to-teal-50 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  Quick Access Summary
                </CardTitle>
                <CardDescription>Direct links to major support platforms</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-800">24/7 Support</h4>
                    <div className="space-y-1">
                      <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => handlePlatformClick('https://www.supportiv.com/anxiety-support-group')}>
                        <ExternalLink className="w-3 h-3 mr-2" />
                        Supportiv (Anxiety)
                      </Button>
                      <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => handlePlatformClick('https://www.7cups.com/home/anxiety/')}>
                        <ExternalLink className="w-3 h-3 mr-2" />
                        7 Cups (Multiple)
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-800">Professional Groups</h4>
                    <div className="space-y-1">
                      <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => handlePlatformClick('https://add.org/peer-support-groups/')}>
                        <ExternalLink className="w-3 h-3 mr-2" />
                        ADDA (ADHD)
                      </Button>
                      <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => handlePlatformClick('https://www.dbsalliance.org/support/chapters-and-support-groups/online-support-groups/')}>
                        <ExternalLink className="w-3 h-3 mr-2" />
                        DBSA (Depression)
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-800">General Directory</h4>
                    <div className="space-y-1">
                      <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => handlePlatformClick('https://www.mhanational.org/find-support-groups')}>
                        <ExternalLink className="w-3 h-3 mr-2" />
                        Mental Health America
                      </Button>
                      <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => handlePlatformClick('https://chadd.org/for-adults/adhd-adult-support-groups/')}>
                        <ExternalLink className="w-3 h-3 mr-2" />
                        CHADD (ADHD)
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* New Podcasts Tab */}
        {activeTab === 'podcasts' && <PodcastIntegration />}

        {/* Engagement Tab */}
        {activeTab === 'engagement' && <EngagementSection />}
      </div>
    </div>
  );
};

export default Community;
