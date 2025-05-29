
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Users, MessageCircle, Calendar, Trophy, Heart, Plus } from 'lucide-react';

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

  const supportGroups = [
    {
      title: "Anxiety Support Circle",
      time: "Today 7:00 PM EST",
      facilitator: "Dr. Sarah Chen",
      participants: 12,
      maxParticipants: 15
    },
    {
      title: "Depression Peer Support",
      time: "Tomorrow 6:00 PM EST",
      facilitator: "Community Led",
      participants: 8,
      maxParticipants: 12
    },
    {
      title: "ADHD Strategies Group",
      time: "Wed 8:00 PM EST",
      facilitator: "Dr. Marcus Johnson",
      participants: 10,
      maxParticipants: 10
    }
  ];

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
                Support Groups
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

        {/* Support Groups Tab */}
        {activeTab === 'groups' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-800">Virtual Support Groups</h2>
              <Button className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Schedule Session
              </Button>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {supportGroups.map((group, index) => (
                <Card key={index} className="bg-white/80 backdrop-blur-sm border-green-200 hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{group.title}</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {group.time}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Facilitator:</span>
                          <span className="font-medium">{group.facilitator}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Participants:</span>
                          <span className="font-medium">{group.participants}/{group.maxParticipants}</span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${(group.participants / group.maxParticipants) * 100}%` }}
                        ></div>
                      </div>
                      <Button 
                        className="w-full" 
                        disabled={group.participants >= group.maxParticipants}
                      >
                        {group.participants >= group.maxParticipants ? 'Group Full' : 'Join Group'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Community;
