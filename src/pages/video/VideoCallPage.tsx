import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Video, VideoOff, Mic, MicOff, Phone, PhoneOff, 
  Monitor, MonitorOff, Users, Settings, Maximize2, Minimize2 
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { useAuth } from '../../context/AuthContext';
import { findUserById } from '../../data/users';

export const VideoCallPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  
  const [isCallActive, setIsCallActive] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [participants, setParticipants] = useState([
    { id: '1', name: currentUser?.name || 'You', avatarUrl: currentUser?.avatarUrl, isVideoEnabled: true, isAudioEnabled: true },
    ...(userId ? [{ id: userId, name: findUserById(userId)?.name || 'Participant', avatarUrl: findUserById(userId)?.avatarUrl, isVideoEnabled: true, isAudioEnabled: true }] : [])
  ]);
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const screenShareVideoRef = useRef<HTMLVideoElement>(null);
  const callTimerRef = useRef<NodeJS.Timeout | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);

  // Get user media (camera and microphone)
  const getUserMedia = async (video: boolean, audio: boolean) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: video ? { width: { ideal: 1280 }, height: { ideal: 720 } } : false,
        audio: audio
      });
      return stream;
    } catch (error) {
      console.error('Error accessing media devices:', error);
      throw error;
    }
  };

  // Initialize media stream when call starts
  useEffect(() => {
    if (isCallActive && localVideoRef.current) {
      const initializeMedia = async () => {
        try {
          const stream = await getUserMedia(isVideoEnabled, isAudioEnabled);
          localStreamRef.current = stream;
          
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
        } catch (error) {
          console.error('Failed to initialize media:', error);
          // Fallback: try with audio only if video fails
          try {
            const audioStream = await getUserMedia(false, isAudioEnabled);
            localStreamRef.current = audioStream;
            if (localVideoRef.current) {
              localVideoRef.current.srcObject = audioStream;
            }
            setIsVideoEnabled(false);
          } catch (audioError) {
            console.error('Failed to initialize audio:', audioError);
          }
        }
      };

      initializeMedia();

      // Cleanup on unmount or when call ends
      return () => {
        if (localStreamRef.current) {
          localStreamRef.current.getTracks().forEach(track => track.stop());
          localStreamRef.current = null;
        }
        if (screenStreamRef.current) {
          screenStreamRef.current.getTracks().forEach(track => track.stop());
          screenStreamRef.current = null;
        }
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = null;
        }
        if (screenShareVideoRef.current) {
          screenShareVideoRef.current.srcObject = null;
        }
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = null;
        }
      };
    }
  }, [isCallActive]);

  // Sync video/audio state with media tracks
  useEffect(() => {
    if (localStreamRef.current && isCallActive) {
      const videoTracks = localStreamRef.current.getVideoTracks();
      const audioTracks = localStreamRef.current.getAudioTracks();
      
      videoTracks.forEach(track => {
        track.enabled = isVideoEnabled && !isScreenSharing;
      });
      
      audioTracks.forEach(track => {
        track.enabled = isAudioEnabled;
      });
    }
  }, [isVideoEnabled, isAudioEnabled, isCallActive, isScreenSharing]);

  // Call duration timer
  useEffect(() => {
    if (isCallActive) {
      callTimerRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current);
      }
      setCallDuration(0);
    }

    return () => {
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current);
      }
    };
  }, [isCallActive]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartCall = async () => {
    try {
      setIsCallActive(true);
      setIsVideoEnabled(true);
      setIsAudioEnabled(true);
    } catch (error) {
      console.error('Failed to start call:', error);
      alert('Failed to access camera/microphone. Please check your permissions.');
    }
  };

  const handleEndCall = () => {
    // Stop all tracks
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
    }
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach(track => track.stop());
      screenStreamRef.current = null;
    }
    
    setIsCallActive(false);
    setIsScreenSharing(false);
    setIsVideoEnabled(false);
    setIsAudioEnabled(false);
    
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }
    
    navigate('/messages');
  };

  const toggleVideo = async () => {
    const newVideoState = !isVideoEnabled;
    
    if (localStreamRef.current) {
      const videoTracks = localStreamRef.current.getVideoTracks();
      videoTracks.forEach(track => {
        track.enabled = newVideoState;
      });
    } else if (isCallActive && newVideoState) {
      // If stream doesn't exist but we want to enable video, get new stream
      try {
        const stream = await getUserMedia(true, isAudioEnabled);
        localStreamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Failed to enable video:', error);
        return;
      }
    }
    
    setIsVideoEnabled(newVideoState);
    // Update current user's video status
    setParticipants(prev => prev.map(p => 
      p.id === currentUser?.id ? { ...p, isVideoEnabled: newVideoState } : p
    ));
  };

  const toggleAudio = async () => {
    const newAudioState = !isAudioEnabled;
    
    if (localStreamRef.current) {
      const audioTracks = localStreamRef.current.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = newAudioState;
      });
    } else if (isCallActive && newAudioState) {
      // If stream doesn't exist but we want to enable audio, get new stream
      try {
        const stream = await getUserMedia(isVideoEnabled, true);
        localStreamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Failed to enable audio:', error);
        return;
      }
    }
    
    setIsAudioEnabled(newAudioState);
    // Update current user's audio status
    setParticipants(prev => prev.map(p => 
      p.id === currentUser?.id ? { ...p, isAudioEnabled: newAudioState } : p
    ));
  };

  const toggleScreenShare = async () => {
    if (!isScreenSharing) {
      // Start screen sharing
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: { cursor: 'always' } as MediaTrackConstraints,
          audio: true
        });
        
        screenStreamRef.current = screenStream;
        
        // Display screen share in the remote video area
        if (screenShareVideoRef.current) {
          screenShareVideoRef.current.srcObject = screenStream;
        }
        
        // Handle when user stops sharing from browser UI
        screenStream.getVideoTracks()[0].onended = () => {
          toggleScreenShare();
        };
        
        setIsScreenSharing(true);
      } catch (error) {
        console.error('Failed to start screen sharing:', error);
        if (error instanceof Error && error.name !== 'NotAllowedError') {
          alert('Failed to start screen sharing. Please check your permissions.');
        }
      }
    } else {
      // Stop screen sharing
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach(track => track.stop());
        screenStreamRef.current = null;
      }
      
      if (screenShareVideoRef.current) {
        screenShareVideoRef.current.srcObject = null;
      }
      
      setIsScreenSharing(false);
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    if (!isFullscreen) {
      document.documentElement.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  const otherParticipant = participants.find(p => p.id !== currentUser?.id);

  return (
    <div className={`h-[calc(100vh-4rem)] ${isFullscreen ? 'fixed inset-0 z-50 bg-black' : ''} animate-fade-in`}>
      {!isCallActive ? (
        // Pre-call screen
        <div className="h-full flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50">
          <Card className="w-full max-w-2xl mx-4">
            <div className="p-8 text-center">
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-primary-100 rounded-full mb-4">
                  <Video size={48} className="text-primary-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Start Video Call</h1>
                <p className="text-gray-600">
                  {otherParticipant 
                    ? `Ready to call ${otherParticipant.name}?`
                    : 'Ready to start a video call?'}
                </p>
              </div>

              {otherParticipant && (
                <div className="mb-8 flex items-center justify-center">
                  <Avatar
                    src={otherParticipant.avatarUrl}
                    alt={otherParticipant.name}
                    size="lg"
                    className="mr-4"
                  />
                  <div className="text-left">
                    <h2 className="text-xl font-semibold text-gray-900">{otherParticipant.name}</h2>
                    <p className="text-gray-500">Online</p>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={handleStartCall}
                  size="lg"
                  leftIcon={<Video size={20} />}
                  className="min-w-[200px]"
                >
                  Start Video Call
                </Button>
                <Button
                  onClick={() => navigate('/messages')}
                  variant="outline"
                  size="lg"
                  className="min-w-[200px]"
                >
                  Cancel
                </Button>
              </div>

              <div className="mt-8 pt-8 border-t border-gray-200">
                <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Video size={16} />
                    <span>Video</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mic size={16} />
                    <span>Audio</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Monitor size={16} />
                    <span>Screen Share</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      ) : (
        // Active call screen
        <div className="h-full flex flex-col bg-gray-900 relative">
          {/* Call header */}
          <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-center">
            <div className="flex items-center gap-3 bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2">
              {otherParticipant && (
                <>
                  <Avatar
                    src={otherParticipant.avatarUrl}
                    alt={otherParticipant.name}
                    size="sm"
                  />
                  <div>
                    <h3 className="text-white font-medium">{otherParticipant.name}</h3>
                    <p className="text-xs text-gray-300">{formatDuration(callDuration)}</p>
                  </div>
                </>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleFullscreen}
                className="text-white hover:bg-white/20"
              >
                {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
              >
                <Settings size={18} />
              </Button>
            </div>
          </div>

          {/* Video grid */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
            {/* Remote video / Screen Share */}
            <div className="relative bg-gray-800 rounded-lg overflow-hidden">
              {isScreenSharing && (
                <div className="absolute top-4 left-4 z-10">
                  <Badge variant="accent" className="bg-black/50 text-white">
                    <Monitor size={14} className="mr-1" />
                    Screen Sharing
                  </Badge>
                </div>
              )}
              {isScreenSharing ? (
                <video
                  ref={screenShareVideoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-contain"
                />
              ) : (
                <>
                  <video
                    ref={remoteVideoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                    style={{ display: otherParticipant?.isVideoEnabled ? 'block' : 'none' }}
                  />
                  {!otherParticipant?.isVideoEnabled && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                      <Avatar
                        src={otherParticipant?.avatarUrl}
                        alt={otherParticipant?.name || 'Participant'}
                        size="xl"
                      />
                    </div>
                  )}
                  {!otherParticipant?.isAudioEnabled && (
                    <div className="absolute top-4 left-4">
                      <Badge variant="error" className="bg-black/50 text-white">
                        <MicOff size={14} className="mr-1" />
                        Muted
                      </Badge>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Local video */}
            <div className="relative bg-gray-800 rounded-lg overflow-hidden order-first lg:order-last">
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
                style={{ display: isVideoEnabled && !isScreenSharing ? 'block' : 'none' }}
              />
              {!isVideoEnabled && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                  <Avatar
                    src={currentUser?.avatarUrl}
                    alt={currentUser?.name || 'You'}
                    size="xl"
                  />
                </div>
              )}
              {!isAudioEnabled && (
                <div className="absolute top-4 left-4">
                  <Badge variant="error" className="bg-black/50 text-white">
                    <MicOff size={14} className="mr-1" />
                    Muted
                  </Badge>
                </div>
              )}
              <div className="absolute bottom-4 left-4">
                <Badge variant="gray" className="bg-black/50 text-white">
                  You
                </Badge>
              </div>
            </div>
          </div>

          {/* Call controls */}
          <div className="bg-black/50 backdrop-blur-sm border-t border-gray-700 p-6">
            <div className="flex items-center justify-center gap-4 max-w-4xl mx-auto">
              <Button
                onClick={toggleAudio}
                variant={isAudioEnabled ? 'secondary' : 'error'}
                size="lg"
                className="rounded-full w-14 h-14 p-0"
                aria-label={isAudioEnabled ? 'Mute microphone' : 'Unmute microphone'}
              >
                {isAudioEnabled ? <Mic size={24} /> : <MicOff size={24} />}
              </Button>

              <Button
                onClick={toggleVideo}
                variant={isVideoEnabled ? 'secondary' : 'error'}
                size="lg"
                className="rounded-full w-14 h-14 p-0"
                aria-label={isVideoEnabled ? 'Turn off video' : 'Turn on video'}
              >
                {isVideoEnabled ? <Video size={24} /> : <VideoOff size={24} />}
              </Button>

              <Button
                onClick={toggleScreenShare}
                variant={isScreenSharing ? 'accent' : 'secondary'}
                size="lg"
                className="rounded-full w-14 h-14 p-0"
                aria-label={isScreenSharing ? 'Stop sharing' : 'Share screen'}
              >
                {isScreenSharing ? <MonitorOff size={24} /> : <Monitor size={24} />}
              </Button>

              <Button
                onClick={handleEndCall}
                variant="error"
                size="lg"
                className="rounded-full w-14 h-14 p-0"
                aria-label="End call"
              >
                <PhoneOff size={24} />
              </Button>
            </div>

            <div className="mt-4 text-center">
              <p className="text-sm text-gray-400">
                {formatDuration(callDuration)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
