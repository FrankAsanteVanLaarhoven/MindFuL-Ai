
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Target, Plus, Check, Clock, Star, TrendingUp } from 'lucide-react';

interface Goal {
  id: string;
  title: string;
  description: string;
  category: 'mental-health' | 'physical' | 'social' | 'personal';
  targetValue: number;
  currentValue: number;
  unit: string;
  deadline: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  createdAt: string;
}

const GoalSetting = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    category: 'mental-health' as Goal['category'],
    targetValue: 1,
    unit: 'times',
    deadline: '',
    priority: 'medium' as Goal['priority']
  });

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = () => {
    try {
      const stored = localStorage.getItem('wellness-goals');
      if (stored) {
        setGoals(JSON.parse(stored));
      } else {
        // Add some example goals
        const exampleGoals: Goal[] = [
          {
            id: '1',
            title: 'Daily Meditation',
            description: 'Practice mindfulness meditation every day',
            category: 'mental-health',
            targetValue: 30,
            currentValue: 12,
            unit: 'days',
            deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            priority: 'high',
            completed: false,
            createdAt: new Date().toISOString()
          },
          {
            id: '2',
            title: 'Journal Writing',
            description: 'Write in journal 3 times per week',
            category: 'mental-health',
            targetValue: 12,
            currentValue: 8,
            unit: 'entries',
            deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            priority: 'medium',
            completed: false,
            createdAt: new Date().toISOString()
          }
        ];
        setGoals(exampleGoals);
        localStorage.setItem('wellness-goals', JSON.stringify(exampleGoals));
      }
    } catch (error) {
      console.error('Error loading goals:', error);
    }
  };

  const saveGoals = (updatedGoals: Goal[]) => {
    try {
      localStorage.setItem('wellness-goals', JSON.stringify(updatedGoals));
      setGoals(updatedGoals);
    } catch (error) {
      console.error('Error saving goals:', error);
    }
  };

  const addGoal = () => {
    if (!newGoal.title.trim()) return;

    const goal: Goal = {
      id: Date.now().toString(),
      title: newGoal.title,
      description: newGoal.description,
      category: newGoal.category,
      targetValue: newGoal.targetValue,
      currentValue: 0,
      unit: newGoal.unit,
      deadline: newGoal.deadline,
      priority: newGoal.priority,
      completed: false,
      createdAt: new Date().toISOString()
    };

    const updatedGoals = [...goals, goal];
    saveGoals(updatedGoals);
    
    // Reset form
    setNewGoal({
      title: '',
      description: '',
      category: 'mental-health',
      targetValue: 1,
      unit: 'times',
      deadline: '',
      priority: 'medium'
    });
    setShowAddForm(false);
  };

  const updateProgress = (goalId: string, increment: number = 1) => {
    const updatedGoals = goals.map(goal => {
      if (goal.id === goalId) {
        const newValue = Math.min(goal.currentValue + increment, goal.targetValue);
        return {
          ...goal,
          currentValue: newValue,
          completed: newValue >= goal.targetValue
        };
      }
      return goal;
    });
    saveGoals(updatedGoals);
  };

  const deleteGoal = (goalId: string) => {
    const updatedGoals = goals.filter(goal => goal.id !== goalId);
    saveGoals(updatedGoals);
  };

  const getCategoryColor = (category: Goal['category']) => {
    switch (category) {
      case 'mental-health': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'physical': return 'bg-green-100 text-green-800 border-green-200';
      case 'social': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'personal': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: Goal['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDaysUntilDeadline = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const completedGoals = goals.filter(goal => goal.completed).length;
  const totalGoals = goals.length;

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-blue-200 shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl text-blue-800 flex items-center gap-2">
          <Target className="w-5 h-5" />
          Wellness Goals
        </CardTitle>
        <CardDescription>
          Set and track your personal wellness objectives
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress Summary */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-blue-800">Overall Progress</h3>
            <span className="text-blue-600 text-sm font-medium">
              {completedGoals}/{totalGoals} completed
            </span>
          </div>
          <Progress value={totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0} className="h-3" />
        </div>

        {/* Add Goal Button */}
        <Button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-blue-500 hover:bg-blue-600 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Goal
        </Button>

        {/* Add Goal Form */}
        {showAddForm && (
          <div className="border border-gray-200 rounded-lg p-4 space-y-4">
            <h3 className="font-semibold text-gray-800">Create New Goal</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Daily exercise"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={newGoal.category}
                  onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value as Goal['category'] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="mental-health">Mental Health</option>
                  <option value="physical">Physical</option>
                  <option value="social">Social</option>
                  <option value="personal">Personal</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Target</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={newGoal.targetValue}
                    onChange={(e) => setNewGoal({ ...newGoal, targetValue: parseInt(e.target.value) || 1 })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="1"
                  />
                  <input
                    type="text"
                    value={newGoal.unit}
                    onChange={(e) => setNewGoal({ ...newGoal, unit: e.target.value })}
                    className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="times"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select
                  value={newGoal.priority}
                  onChange={(e) => setNewGoal({ ...newGoal, priority: e.target.value as Goal['priority'] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
                <input
                  type="date"
                  value={newGoal.deadline}
                  onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newGoal.description}
                  onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Describe your goal..."
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button onClick={addGoal} className="bg-green-500 hover:bg-green-600 text-white">
                Create Goal
              </Button>
              <Button 
                onClick={() => setShowAddForm(false)}
                variant="outline"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Goals List */}
        <div className="space-y-4">
          {goals.map((goal) => {
            const progress = (goal.currentValue / goal.targetValue) * 100;
            const daysLeft = getDaysUntilDeadline(goal.deadline);
            
            return (
              <div key={goal.id} className={`border rounded-lg p-4 ${goal.completed ? 'bg-green-50 border-green-200' : 'border-gray-200'}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`font-semibold ${goal.completed ? 'text-green-800 line-through' : 'text-gray-800'}`}>
                        {goal.title}
                      </h3>
                      {goal.completed && <Check className="w-4 h-4 text-green-600" />}
                    </div>
                    {goal.description && (
                      <p className="text-gray-600 text-sm mb-2">{goal.description}</p>
                    )}
                    <div className="flex flex-wrap gap-2">
                      <Badge className={getCategoryColor(goal.category)}>
                        {goal.category.replace('-', ' ')}
                      </Badge>
                      <Badge className={getPriorityColor(goal.priority)}>
                        {goal.priority} priority
                      </Badge>
                      {goal.deadline && (
                        <Badge className={`${daysLeft < 7 ? 'bg-red-100 text-red-800 border-red-200' : 'bg-gray-100 text-gray-800 border-gray-200'}`}>
                          <Clock className="w-3 h-3 mr-1" />
                          {daysLeft > 0 ? `${daysLeft} days left` : 'Overdue'}
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      {goal.currentValue} / {goal.targetValue} {goal.unit}
                    </p>
                    <p className="text-xs text-gray-500">{progress.toFixed(0)}% complete</p>
                  </div>
                </div>
                
                <Progress value={progress} className="h-2 mb-3" />
                
                <div className="flex justify-between">
                  <div className="flex gap-2">
                    {!goal.completed && (
                      <Button
                        size="sm"
                        onClick={() => updateProgress(goal.id)}
                        className="bg-blue-500 hover:bg-blue-600 text-white"
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Progress
                      </Button>
                    )}
                  </div>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => deleteGoal(goal.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {goals.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Target className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No goals set yet. Create your first wellness goal!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GoalSetting;
