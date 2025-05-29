
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { 
  CheckSquare, 
  Plus, 
  Clock, 
  Calendar as CalendarIcon, 
  Music, 
  Bell,
  Play,
  Trash2
} from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

interface TodoItem {
  id: string;
  title: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  reminder?: Date;
  category: 'wellness' | 'medical' | 'personal' | 'work';
  musicTheme?: string;
}

const musicThemes = {
  wellness: { name: 'Calming Waves', icon: '🌊', color: 'bg-blue-100' },
  medical: { name: 'Healing Harmonies', icon: '🎵', color: 'bg-green-100' },
  personal: { name: 'Gentle Focus', icon: '🌸', color: 'bg-pink-100' },
  work: { name: 'Productive Beats', icon: '⚡', color: 'bg-yellow-100' }
};

const TodoList = () => {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedCategory, setSelectedCategory] = useState<'wellness' | 'medical' | 'personal' | 'work'>('personal');
  const [selectedPriority, setSelectedPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [showCalendar, setShowCalendar] = useState(false);
  const { toast } = useToast();

  // Check for due reminders
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      todos.forEach(todo => {
        if (todo.reminder && !todo.completed && todo.reminder <= now) {
          toast({
            title: "📝 Reminder",
            description: `${todo.title} is due now!`,
            duration: 8000,
          });
          
          // Play category music theme notification
          const theme = musicThemes[todo.category];
          console.log(`Playing ${theme.name} for ${todo.category} reminder`);
        }
      });
    };

    const interval = setInterval(checkReminders, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [todos, toast]);

  const addTodo = () => {
    if (!newTodo.trim()) return;

    const todo: TodoItem = {
      id: Date.now().toString(),
      title: newTodo,
      completed: false,
      priority: selectedPriority,
      category: selectedCategory,
      dueDate: selectedDate,
      reminder: selectedDate ? new Date(selectedDate.getTime() - 30 * 60000) : undefined, // 30 min before
      musicTheme: musicThemes[selectedCategory].name
    };

    setTodos(prev => [...prev, todo]);
    setNewTodo('');
    setSelectedDate(undefined);
    
    toast({
      title: "✅ Task Added",
      description: `"${newTodo}" added with ${musicThemes[selectedCategory].name} theme`,
      duration: 3000,
    });
  };

  const toggleTodo = (id: string) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id 
        ? { ...todo, completed: !todo.completed }
        : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  const playMusicTheme = (category: string) => {
    const theme = musicThemes[category as keyof typeof musicThemes];
    toast({
      title: `🎵 Playing ${theme.name}`,
      description: `Enjoy your ${category} music theme`,
      duration: 3000,
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const upcomingTodos = todos.filter(todo => !todo.completed && todo.dueDate && todo.dueDate > new Date());
  const overdueTodos = todos.filter(todo => !todo.completed && todo.dueDate && todo.dueDate < new Date());
  const completedTodos = todos.filter(todo => todo.completed);

  return (
    <div className="space-y-6">
      <Card className="bg-white/80 backdrop-blur-sm border-blue-200 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <CheckSquare className="w-5 h-5" />
            Smart To-Do List
          </CardTitle>
          <CardDescription>
            Organized tasks with gentle reminders and personalized music themes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add New Todo */}
          <div className="space-y-3">
            <div className="flex gap-2">
              <Input
                placeholder="Add a new task..."
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTodo()}
                className="flex-1"
              />
              <Button onClick={addTodo} className="bg-blue-500 hover:bg-blue-600">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="flex gap-2 flex-wrap">
              <Select value={selectedCategory} onValueChange={(value: any) => setSelectedCategory(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="wellness">🧘 Wellness</SelectItem>
                  <SelectItem value="medical">💊 Medical</SelectItem>
                  <SelectItem value="personal">🏠 Personal</SelectItem>
                  <SelectItem value="work">💼 Work</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedPriority} onValueChange={(value: any) => setSelectedPriority(value)}>
                <SelectTrigger className="w-28">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>

              <Popover open={showCalendar} onOpenChange={setShowCalendar}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <CalendarIcon className="w-4 h-4" />
                    {selectedDate ? format(selectedDate, 'MMM dd') : 'Due date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => {
                      setSelectedDate(date);
                      setShowCalendar(false);
                    }}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Music Themes */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Music className="w-4 h-4" />
              Music Themes for Focus
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {Object.entries(musicThemes).map(([category, theme]) => (
                <Button
                  key={category}
                  variant="outline"
                  size="sm"
                  onClick={() => playMusicTheme(category)}
                  className={`${theme.color} border-none text-xs`}
                >
                  <Play className="w-3 h-3 mr-1" />
                  {theme.icon} {theme.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Overdue Tasks */}
          {overdueTodos.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold text-red-600 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Overdue ({overdueTodos.length})
              </h3>
              {overdueTodos.map(todo => (
                <div key={todo.id} className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                  <Checkbox
                    checked={todo.completed}
                    onCheckedChange={() => toggleTodo(todo.id)}
                  />
                  <div className="flex-1">
                    <p className="font-medium text-red-800">{todo.title}</p>
                    <div className="flex gap-2 mt-1">
                      <Badge className={getPriorityColor(todo.priority)} variant="secondary">
                        {todo.priority}
                      </Badge>
                      <Badge variant="outline">{todo.category}</Badge>
                      {todo.dueDate && (
                        <Badge variant="outline" className="text-red-600">
                          Due: {format(todo.dueDate, 'MMM dd')}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => playMusicTheme(todo.category)}
                    className="text-purple-600"
                  >
                    <Music className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteTodo(todo.id)}
                    className="text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Upcoming Tasks */}
          {upcomingTodos.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold text-blue-600 flex items-center gap-2">
                <Bell className="w-4 h-4" />
                Upcoming ({upcomingTodos.length})
              </h3>
              {upcomingTodos.map(todo => (
                <div key={todo.id} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <Checkbox
                    checked={todo.completed}
                    onCheckedChange={() => toggleTodo(todo.id)}
                  />
                  <div className="flex-1">
                    <p className="font-medium text-blue-800">{todo.title}</p>
                    <div className="flex gap-2 mt-1">
                      <Badge className={getPriorityColor(todo.priority)} variant="secondary">
                        {todo.priority}
                      </Badge>
                      <Badge variant="outline">{todo.category}</Badge>
                      {todo.dueDate && (
                        <Badge variant="outline" className="text-blue-600">
                          Due: {format(todo.dueDate, 'MMM dd')}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => playMusicTheme(todo.category)}
                    className="text-purple-600"
                  >
                    <Music className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteTodo(todo.id)}
                    className="text-gray-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Completed Tasks */}
          {completedTodos.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold text-green-600 flex items-center gap-2">
                <CheckSquare className="w-4 h-4" />
                Completed ({completedTodos.length})
              </h3>
              {completedTodos.slice(0, 3).map(todo => (
                <div key={todo.id} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200 opacity-75">
                  <Checkbox
                    checked={todo.completed}
                    onCheckedChange={() => toggleTodo(todo.id)}
                  />
                  <div className="flex-1">
                    <p className="font-medium text-green-800 line-through">{todo.title}</p>
                    <div className="flex gap-2 mt-1">
                      <Badge className={getPriorityColor(todo.priority)} variant="secondary">
                        {todo.priority}
                      </Badge>
                      <Badge variant="outline">{todo.category}</Badge>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteTodo(todo.id)}
                    className="text-gray-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              {completedTodos.length > 3 && (
                <p className="text-sm text-gray-500 text-center">
                  + {completedTodos.length - 3} more completed tasks
                </p>
              )}
            </div>
          )}

          {todos.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <CheckSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No tasks yet. Add your first task above!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TodoList;
