
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Mic, Square, Play, Trash2, Download, Shield } from 'lucide-react';

interface Recording {
  id: string;
  name: string;
  duration: number;
  date: Date;
  size: number;
  transcript?: string;
}

interface SessionRecorderProps {
  userProfile?: any;
  onRecordingComplete?: (recording: Recording) => void;
}

const SessionRecorder: React.FC<SessionRecorderProps> = ({ userProfile, onRecordingComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [currentPlayback, setCurrentPlayback] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    // Load recordings from localStorage
    const saved = localStorage.getItem('therapyRecordings');
    if (saved) {
      setRecordings(JSON.parse(saved));
    }
  }, []);

  const startRecording = async () => {
    if (!userProfile?.recordSessions) {
      alert('Please enable session recording in your profile settings.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const chunks: BlobPart[] = [];
      
      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        const recording: Recording = {
          id: crypto.randomUUID(),
          name: `Session ${new Date().toLocaleString()}`,
          duration: recordingTime,
          date: new Date(),
          size: blob.size,
          transcript: 'Transcript processing...' // Placeholder
        };
        
        const newRecordings = [...recordings, recording];
        setRecordings(newRecordings);
        localStorage.setItem('therapyRecordings', JSON.stringify(newRecordings));
        
        if (onRecordingComplete) {
          onRecordingComplete(recording);
        }
        
        // Clean up
        stream.getTracks().forEach(track => track.stop());
      };
      
      setIsRecording(true);
      setRecordingTime(0);
      mediaRecorder.start();
      
      // Start timer
      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  };

  const deleteRecording = (id: string) => {
    const newRecordings = recordings.filter(r => r.id !== id);
    setRecordings(newRecordings);
    localStorage.setItem('therapyRecordings', JSON.stringify(newRecordings));
  };

  const deleteAllRecordings = () => {
    setRecordings([]);
    localStorage.removeItem('therapyRecordings');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatFileSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white/80 backdrop-blur-sm border-blue-200 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl text-blue-800 flex items-center gap-2">
            <Mic className="w-5 h-5" />
            Session Recorder
          </CardTitle>
          <CardDescription>
            Record and playback your therapy sessions (with your consent)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!userProfile?.recordSessions && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-amber-800">
                <Shield className="w-4 h-4" />
                <span className="font-medium">Recording Disabled</span>
              </div>
              <p className="text-sm text-amber-700 mt-1">
                Enable session recording in your profile settings to use this feature.
              </p>
            </div>
          )}
          
          <div className="flex justify-center">
            {!isRecording ? (
              <Button 
                onClick={startRecording}
                disabled={!userProfile?.recordSessions}
                size="lg"
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                <Mic className="w-5 h-5 mr-2" />
                Start Recording
              </Button>
            ) : (
              <div className="text-center space-y-3">
                <div className="text-2xl font-mono text-red-600">
                  {formatTime(recordingTime)}
                </div>
                <Button 
                  onClick={stopRecording}
                  size="lg"
                  variant="destructive"
                >
                  <Square className="w-5 h-5 mr-2" />
                  Stop Recording
                </Button>
              </div>
            )}
          </div>
          
          {recordings.length > 0 && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-blue-800">Recorded Sessions</h3>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm" className="text-red-600">
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete All
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete All Recordings</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete all recorded sessions. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={deleteAllRecordings} className="bg-red-600">
                        Delete All
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
              
              <div className="grid gap-3">
                {recordings.map((recording) => (
                  <Card key={recording.id} className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium">{recording.name}</h4>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="outline">{formatTime(recording.duration)}</Badge>
                          <Badge variant="outline">{formatFileSize(recording.size)}</Badge>
                          <Badge variant="outline">{recording.date.toLocaleDateString()}</Badge>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        {userProfile?.allowPlayback && (
                          <Button size="sm" variant="outline">
                            <Play className="w-4 h-4" />
                          </Button>
                        )}
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="outline" className="text-red-600">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Recording</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{recording.name}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => deleteRecording(recording.id)}
                                className="bg-red-600"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SessionRecorder;
