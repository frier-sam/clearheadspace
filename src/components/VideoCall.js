import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  VideoCameraIcon,
  VideoCameraSlashIcon,
  MicrophoneIcon,
  XMarkIcon,
  PhoneXMarkIcon,
  ChatBubbleLeftRightIcon,
  Cog6ToothIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  UserCircleIcon,
  ClockIcon,
  HeartIcon
} from '@heroicons/react/24/outline';
import { useBookings } from '../hooks/useBookings';
import { useTherapists } from '../hooks/useTherapists';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from './LoadingSpinner';
import { formatTime, getInitials, getAvatarColor } from '../utils/helpers';
import toast from 'react-hot-toast';

const VideoCall = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { currentUser, userProfile } = useAuth();
  const { bookings, updateBooking } = useBookings();
  const { getTherapistById } = useTherapists();
  
  const [booking, setBooking] = useState(null);
  const [therapist, setTherapist] = useState(null);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isSpeakerEnabled, setIsSpeakerEnabled] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [callStatus, setCallStatus] = useState('connecting'); // connecting, connected, ended
  
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const localStreamRef = useRef(null);

  useEffect(() => {
    // Find the booking
    const foundBooking = bookings.find(b => b.id === bookingId);
    if (foundBooking) {
      setBooking(foundBooking);
      const therapistData = getTherapistById(foundBooking.therapistId);
      setTherapist(therapistData);
      setSessionStartTime(new Date());
    } else {
      navigate('/bookings');
    }
  }, [bookingId, bookings, getTherapistById, navigate]);

  useEffect(() => {
    // Initialize media devices
    initializeMedia();
    
    // Simulate connection process
    const connectionTimeout = setTimeout(() => {
      setCallStatus('connected');
      toast.success('Connected to session! 🎉');
    }, 3000);

    return () => {
      clearTimeout(connectionTimeout);
      cleanupMedia();
    };
  }, []);

  useEffect(() => {
    // Timer for session duration
    let interval;
    if (sessionStartTime && callStatus === 'connected') {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((new Date() - sessionStartTime) / 1000));
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [sessionStartTime, callStatus]);

  const initializeMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      
      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing media devices:', error);
      toast.error('Unable to access camera/microphone');
      setIsVideoEnabled(false);
      setIsAudioEnabled(false);
    }
  };

  const cleanupMedia = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !isVideoEnabled;
        setIsVideoEnabled(!isVideoEnabled);
      }
    }
  };

  const toggleAudio = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !isAudioEnabled;
        setIsAudioEnabled(!isAudioEnabled);
      }
    }
  };

  const toggleSpeaker = () => {
    setIsSpeakerEnabled(!isSpeakerEnabled);
    // In a real implementation, this would control speaker output
  };

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: Date.now(),
        text: newMessage,
        sender: 'user',
        timestamp: new Date(),
        senderName: userProfile?.displayName || currentUser?.displayName || 'You'
      };
      setChatMessages(prev => [...prev, message]);
      setNewMessage('');
      
      // Simulate therapist response (in real app, this would be real-time)
      setTimeout(() => {
        const responses = [
          "Thank you for sharing that.",
          "I understand how you're feeling.",
          "Can you tell me more about that?",
          "That's a very important insight.",
          "How does that make you feel?"
        ];
        const response = {
          id: Date.now() + 1,
          text: responses[Math.floor(Math.random() * responses.length)],
          sender: 'therapist',
          timestamp: new Date(),
          senderName: therapist?.name || 'Therapist'
        };
        setChatMessages(prev => [...prev, response]);
      }, 2000);
    }
  };

  const endCall = async () => {
    try {
      setCallStatus('ended');
      cleanupMedia();
      
      // Update booking status
      if (booking) {
        await updateBooking(booking.id, {
          status: 'completed',
          completedAt: new Date().toISOString(),
          sessionDuration: elapsedTime
        });
      }
      
      toast.success('Session completed successfully');
      navigate('/bookings');
    } catch (error) {
      console.error('Error ending call:', error);
      navigate('/bookings');
    }
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!booking || !therapist) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <LoadingSpinner size="large" color="white" message="Joining session..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary-500 to-secondary-500"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-hero-pattern"></div>
      </div>

      {/* Header */}
      <header className="relative z-20 px-6 py-4 bg-black/20 backdrop-blur-lg border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
                <HeartIcon className="w-6 h-6 text-white" />
              </div>
              <span className="text-lg font-bold">ClearHeadSpace</span>
            </div>
            
            <div className="text-sm">
              <div className="flex items-center space-x-2">
                <span className={`w-2 h-2 rounded-full ${
                  callStatus === 'connected' ? 'bg-green-400' :
                  callStatus === 'connecting' ? 'bg-yellow-400' : 'bg-red-400'
                }`}></span>
                <span className="capitalize">{callStatus}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {callStatus === 'connected' && (
              <div className="flex items-center space-x-2 text-sm">
                <ClockIcon className="w-4 h-4" />
                <span>{formatDuration(elapsedTime)}</span>
              </div>
            )}
            
            <button
              onClick={() => navigate('/bookings')}
              className="p-2 text-white/60 hover:text-white transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Video Area */}
      <div className="relative z-10 h-screen pt-20 pb-24">
        {callStatus === 'connecting' ? (
          // Connecting Screen
          <div className="flex items-center justify-center h-full">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div className="mb-8">
                {therapist.image ? (
                  <img
                    src={therapist.image}
                    alt={therapist.name}
                    className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                  />
                ) : (
                  <div className={`w-32 h-32 rounded-full mx-auto mb-4 flex items-center justify-center text-white font-bold text-2xl ${getAvatarColor(therapist.name)}`}>
                    {getInitials(therapist.name)}
                  </div>
                )}
                <h2 className="text-2xl font-bold mb-2">{therapist.name}</h2>
                <p className="text-white/80">{therapist.title}</p>
              </div>
              
              <div className="space-y-4">
                <LoadingSpinner size="large" color="white" />
                <p className="text-lg">Connecting to {therapist.name}...</p>
                <p className="text-white/60">Please wait while we establish the connection</p>
              </div>
            </motion.div>
          </div>
        ) : (
          // Video Call Interface
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-full px-6">
            {/* Main Video Area */}
            <div className="lg:col-span-3 relative">
              {/* Remote Video (Therapist) */}
              <div className="w-full h-full bg-gray-800 rounded-2xl overflow-hidden relative">
                <video
                  ref={remoteVideoRef}
                  className="w-full h-full object-cover"
                  autoPlay
                  playsInline
                  muted={false}
                />
                
                {/* Placeholder for therapist when no video */}
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-800">
                  {therapist.image ? (
                    <img
                      src={therapist.image}
                      alt={therapist.name}
                      className="w-48 h-48 rounded-full object-cover opacity-80"
                    />
                  ) : (
                    <div className={`w-48 h-48 rounded-full flex items-center justify-center text-white font-bold text-4xl ${getAvatarColor(therapist.name)} opacity-80`}>
                      {getInitials(therapist.name)}
                    </div>
                  )}
                </div>
                
                {/* Therapist Name Overlay */}
                <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-xl">
                  <p className="font-medium">{therapist.name}</p>
                </div>
              </div>

              {/* Local Video (User) - Picture in Picture */}
              <div className="absolute top-4 right-4 w-48 h-36 bg-gray-800 rounded-xl overflow-hidden border-2 border-white/20">
                <video
                  ref={localVideoRef}
                  className={`w-full h-full object-cover ${!isVideoEnabled ? 'hidden' : ''}`}
                  autoPlay
                  playsInline
                  muted
                />
                
                {!isVideoEnabled && (
                  <div className="w-full h-full flex items-center justify-center bg-gray-700">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold ${getAvatarColor(userProfile?.displayName || 'You')}`}>
                      {getInitials(userProfile?.displayName || currentUser?.displayName || 'You')}
                    </div>
                  </div>
                )}
                
                <div className="absolute bottom-2 left-2 text-xs bg-black/50 backdrop-blur-sm px-2 py-1 rounded">
                  You
                </div>
              </div>
            </div>

            {/* Chat Panel */}
            {showChat && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="lg:col-span-1 bg-white/10 backdrop-blur-lg rounded-2xl p-4 flex flex-col"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Session Chat</h3>
                  <button
                    onClick={() => setShowChat(false)}
                    className="p-1 text-white/60 hover:text-white"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>
                
                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto space-y-3 mb-4">
                  {chatMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-xs px-3 py-2 rounded-xl text-sm ${
                        message.sender === 'user'
                          ? 'bg-primary-500 text-white'
                          : 'bg-white/20 text-white'
                      }`}>
                        <p className="font-medium text-xs opacity-75 mb-1">
                          {message.senderName}
                        </p>
                        <p>{message.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Chat Input */}
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-primary-400"
                  />
                  <button
                    onClick={sendMessage}
                    className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                  >
                    Send
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Controls */}
      {callStatus === 'connected' && (
        <div className="absolute bottom-0 left-0 right-0 z-30 bg-black/40 backdrop-blur-lg border-t border-white/10 px-6 py-4">
          <div className="flex items-center justify-center space-x-6">
            {/* Video Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleVideo}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
                isVideoEnabled
                  ? 'bg-white/20 text-white hover:bg-white/30'
                  : 'bg-red-500 text-white hover:bg-red-600'
              }`}
            >
              {isVideoEnabled ? (
                <VideoCameraIcon className="w-6 h-6" />
              ) : (
                <VideoCameraSlashIcon className="w-6 h-6" />
              )}
            </motion.button>

            {/* Audio Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleAudio}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
                isAudioEnabled
                  ? 'bg-white/20 text-white hover:bg-white/30'
                  : 'bg-red-500 text-white hover:bg-red-600'
              }`}
            >
              {isAudioEnabled ? (
                <MicrophoneIcon className="w-6 h-6" />
              ) : (
                <div className="relative">
                  <MicrophoneIcon className="w-6 h-6" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-0.5 bg-white transform rotate-45"></div>
                  </div>
                </div>
              )}
            </motion.button>

            {/* Speaker Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleSpeaker}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
                isSpeakerEnabled
                  ? 'bg-white/20 text-white hover:bg-white/30'
                  : 'bg-gray-500 text-white hover:bg-gray-600'
              }`}
            >
              {isSpeakerEnabled ? (
                <SpeakerWaveIcon className="w-6 h-6" />
              ) : (
                <SpeakerXMarkIcon className="w-6 h-6" />
              )}
            </motion.button>

            {/* Chat Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowChat(!showChat)}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
                showChat
                  ? 'bg-primary-500 text-white'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              <ChatBubbleLeftRightIcon className="w-6 h-6" />
            </motion.button>

            {/* Settings */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-14 h-14 rounded-full bg-white/20 text-white hover:bg-white/30 flex items-center justify-center transition-colors"
            >
              <Cog6ToothIcon className="w-6 h-6" />
            </motion.button>

            {/* End Call */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={endCall}
              className="w-14 h-14 rounded-full bg-red-500 text-white hover:bg-red-600 flex items-center justify-center transition-colors"
            >
              <PhoneXMarkIcon className="w-6 h-6" />
            </motion.button>
          </div>

          {/* Session Info */}
          <div className="text-center mt-4 text-sm text-white/80">
            <p>Session with {therapist.name} • {formatTime(booking.time)} • {formatDuration(elapsedTime)}</p>
          </div>
        </div>
      )}

      {/* Connection Status Overlay */}
      {callStatus === 'connecting' && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-40">
          <div className="text-center">
            <LoadingSpinner size="large" color="white" />
            <p className="text-white mt-4">Establishing secure connection...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoCall;
