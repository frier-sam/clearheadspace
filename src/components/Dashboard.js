import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  CalendarIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
  HeartIcon,
  SparklesIcon,
  PlusIcon,
  BellIcon,
  Cog6ToothIcon,
  ArrowRightIcon,
  VideoCameraIcon,
  PhoneIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import { useBookings } from '../hooks/useBookings';
import { useTherapists } from '../hooks/useTherapists';
import LoadingSpinner from './LoadingSpinner';
import { formatDate, formatTime, getInitials, getAvatarColor } from '../utils/helpers';

const Dashboard = () => {
  const { currentUser, userProfile, signout } = useAuth();
  const { bookings, loading: bookingsLoading, getUpcomingBookings } = useBookings();
  const { therapists, loading: therapistsLoading, getRecommendedTherapists } = useTherapists();
  const navigate = useNavigate();
  
  const [greeting, setGreeting] = useState('');
  const [showQuickActions, setShowQuickActions] = useState(false);

  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) setGreeting('Good morning');
      else if (hour < 17) setGreeting('Good afternoon');
      else setGreeting('Good evening');
    };
    
    updateGreeting();
    const interval = setInterval(updateGreeting, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, []);

  const upcomingBookings = getUpcomingBookings().slice(0, 3);
  const recommendedTherapists = getRecommendedTherapists(userProfile?.preferredTherapyType).slice(0, 4);

  const quickActions = [
    {
      title: 'Book a Session',
      description: 'Schedule with a therapist or buddy',
      icon: CalendarIcon,
      color: 'from-blue-400 to-blue-600',
      action: () => navigate('/therapists')
    },
    {
      title: 'Emergency Support',
      description: 'Get immediate help',
      icon: PhoneIcon,
      color: 'from-red-400 to-red-600',
      action: () => window.open('tel:988', '_self') // National Suicide Prevention Lifeline
    },
    {
      title: 'View Profile',
      description: 'Update your information',
      icon: UserGroupIcon,
      color: 'from-green-400 to-green-600',
      action: () => navigate('/profile')
    },
    {
      title: 'Booking History',
      description: 'See past sessions',
      icon: ClockIcon,
      color: 'from-purple-400 to-purple-600',
      action: () => navigate('/bookings')
    }
  ];

  const handleSignOut = async () => {
    try {
      await signout();
      navigate('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  if (bookingsLoading || therapistsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" message="Loading your dashboard..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 relative">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-white/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
                <HeartIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <span className="text-lg sm:text-xl font-bold font-display bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                ClearHeadSpace
              </span>
            </div>

            {/* Navigation - Hidden on mobile, shown on desktop */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                to="/dashboard"
                className="text-primary-600 font-medium border-b-2 border-primary-600 pb-1"
              >
                Dashboard
              </Link>
              <Link
                to="/therapists"
                className="text-gray-600 hover:text-primary-600 transition-colors"
              >
                Find Support
              </Link>
              <Link
                to="/bookings"
                className="text-gray-600 hover:text-primary-600 transition-colors"
              >
                My Sessions
              </Link>
            </nav>

            {/* User Menu - Responsive */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Notifications - Hidden on small screens */}
              <button className="hidden sm:block p-2 text-gray-400 hover:text-gray-600 transition-colors relative">
                <BellIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>

              {/* Profile - Responsive */}
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white font-semibold text-xs sm:text-sm ${getAvatarColor(userProfile?.displayName || currentUser?.displayName || 'User')}`}>
                  {userProfile?.photoURL || currentUser?.photoURL ? (
                    <img
                      src={userProfile?.photoURL || currentUser?.photoURL}
                      alt="Profile"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    getInitials(userProfile?.displayName || currentUser?.displayName || 'User')
                  )}
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-800 truncate max-w-24 sm:max-w-none">
                    {userProfile?.displayName || currentUser?.displayName || 'User'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {userProfile?.role || 'Member'}
                  </p>
                </div>
              </div>

              {/* Settings */}
              <button
                onClick={() => navigate('/profile')}
                className="p-1.5 sm:p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Cog6ToothIcon className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500 rounded-3xl p-8 text-white relative overflow-hidden">
            <div className="relative z-10">
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-3xl lg:text-4xl font-bold font-display mb-4"
              >
                {greeting}, {userProfile?.firstName || currentUser?.displayName?.split(' ')[0] || 'there'}! 👋
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-lg opacity-90 mb-6"
              >
                Welcome to your safe space. How are you feeling today?
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-wrap gap-4"
              >
                <button
                  onClick={() => navigate('/therapists')}
                  className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-full font-medium hover:bg-white/30 transition-colors inline-flex items-center"
                >
                  <PlusIcon className="w-5 h-5 mr-2" />
                  Book a Session
                </button>
                <button
                  onClick={() => setShowQuickActions(!showQuickActions)}
                  className="border-2 border-white/30 text-white px-6 py-3 rounded-full font-medium hover:bg-white/10 transition-colors inline-flex items-center"
                >
                  <SparklesIcon className="w-5 h-5 mr-2" />
                  Quick Actions
                </button>
              </motion.div>
            </div>
            
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
          </div>
        </motion.section>

        {/* Quick Actions */}
        {showQuickActions && (
          <motion.section
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-12"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickActions.map((action, index) => (
                <motion.button
                  key={action.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  onClick={action.action}
                  className="card group hover:shadow-xl transition-all duration-300 text-left"
                >
                  <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">{action.title}</h3>
                  <p className="text-sm text-gray-600">{action.description}</p>
                </motion.button>
              ))}
            </div>
          </motion.section>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Upcoming Sessions */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="card">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                    <CalendarIcon className="w-6 h-6 mr-2 text-primary-600" />
                    Upcoming Sessions
                  </h2>
                  <Link
                    to="/bookings"
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium inline-flex items-center"
                  >
                    View All
                    <ArrowRightIcon className="w-4 h-4 ml-1" />
                  </Link>
                </div>

                {upcomingBookings.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingBookings.map((booking) => (
                      <motion.div
                        key={booking.id}
                        whileHover={{ scale: 1.02 }}
                        className="p-4 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl border border-primary-100"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                              {getInitials(booking.therapistName)}
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-800">{booking.therapistName}</h3>
                              <p className="text-sm text-gray-600">
                                {formatDate(booking.date, 'EEEE, MMM d')} at {formatTime(booking.time)}
                              </p>
                              <p className="text-xs text-gray-500 capitalize">{booking.type} session</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors">
                              <VideoCameraIcon className="w-5 h-5" />
                            </button>
                            <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors">
                              <ChatBubbleLeftRightIcon className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <CalendarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-600 mb-2">No upcoming sessions</h3>
                    <p className="text-gray-500 mb-4">Ready to schedule your next session?</p>
                    <button
                      onClick={() => navigate('/therapists')}
                      className="btn btn-primary"
                    >
                      Book a Session
                    </button>
                  </div>
                )}
              </div>
            </motion.section>

            {/* Recommended Therapists */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="card">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                    <SparklesIcon className="w-6 h-6 mr-2 text-secondary-600" />
                    Recommended for You
                  </h2>
                  <Link
                    to="/therapists"
                    className="text-secondary-600 hover:text-secondary-700 text-sm font-medium inline-flex items-center"
                  >
                    View All
                    <ArrowRightIcon className="w-4 h-4 ml-1" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {recommendedTherapists.map((therapist) => (
                    <motion.div
                      key={therapist.id}
                      whileHover={{ scale: 1.02 }}
                      className="p-4 bg-white rounded-xl border border-gray-200 hover:border-secondary-300 transition-colors cursor-pointer"
                      onClick={() => navigate(`/book/${therapist.id}`)}
                    >
                      <div className="flex items-center space-x-3 mb-4">
                        <img
                          src={therapist.image}
                          alt={therapist.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-800">{therapist.name}</h3>
                          <p className="text-sm text-gray-600">{therapist.title}</p>
                        </div>
                        <div className="flex items-center">
                          <StarIcon className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-medium text-gray-600 ml-1">{therapist.rating}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {therapist.specialties.slice(0, 2).map((specialty) => (
                          <span
                            key={specialty}
                            className="px-2 py-1 bg-secondary-100 text-secondary-700 text-xs rounded-full"
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>
                      <button className="w-full btn btn-secondary text-sm py-2">
                        Book Session
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Mental Health Tip */}
            <motion.section
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="card bg-gradient-to-br from-accent-50 to-accent-100 border-accent-200">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-accent-400 to-accent-600 rounded-full flex items-center justify-center">
                    <HeartIcon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 ml-3">Daily Wellness Tip</h3>
                </div>
                <p className="text-gray-700 leading-relaxed mb-4">
                  "Remember to take deep breaths throughout your day. Even 3 minutes of mindful breathing can help reduce stress and improve your mood."
                </p>
                <button className="text-accent-600 hover:text-accent-700 text-sm font-medium">
                  Learn more mindfulness techniques →
                </button>
              </div>
            </motion.section>

            {/* Quick Stats */}
            <motion.section
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Progress</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Sessions completed</span>
                    <span className="font-semibold text-primary-600">{bookings.filter(b => b.status === 'completed').length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Hours of support</span>
                    <span className="font-semibold text-secondary-600">{bookings.filter(b => b.status === 'completed').length * 1}h</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Days since joining</span>
                    <span className="font-semibold text-accent-600">
                      {userProfile?.createdAt ? Math.floor((new Date() - new Date(userProfile.createdAt.seconds * 1000)) / (1000 * 60 * 60 * 24)) : 1}
                    </span>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Emergency Resources */}
            <motion.section
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div className="card bg-red-50 border-red-200">
                <h3 className="text-lg font-semibold text-red-800 mb-3">Need Immediate Help?</h3>
                <div className="space-y-3">
                  <a
                    href="tel:988"
                    className="flex items-center p-3 bg-red-100 rounded-lg hover:bg-red-200 transition-colors"
                  >
                    <PhoneIcon className="w-5 h-5 text-red-600 mr-3" />
                    <div>
                      <p className="font-medium text-red-800">Crisis Lifeline</p>
                      <p className="text-sm text-red-600">Call 988</p>
                    </div>
                  </a>
                  <a
                    href="sms:741741"
                    className="flex items-center p-3 bg-red-100 rounded-lg hover:bg-red-200 transition-colors"
                  >
                    <ChatBubbleLeftRightIcon className="w-5 h-5 text-red-600 mr-3" />
                    <div>
                      <p className="font-medium text-red-800">Crisis Text Line</p>
                      <p className="text-sm text-red-600">Text HOME to 741741</p>
                    </div>
                  </a>
                </div>
              </div>
            </motion.section>
          </div>
        </div>
      </main>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-white/20 px-4 py-2">
        <div className="flex items-center justify-around">
          <Link to="/dashboard" className="flex flex-col items-center py-2 text-primary-600">
            <HeartIcon className="w-6 h-6" />
            <span className="text-xs mt-1 font-medium">Home</span>
          </Link>
          <Link to="/therapists" className="flex flex-col items-center py-2 text-gray-400">
            <UserGroupIcon className="w-6 h-6" />
            <span className="text-xs mt-1">Find Support</span>
          </Link>
          <Link to="/bookings" className="flex flex-col items-center py-2 text-gray-400">
            <CalendarIcon className="w-6 h-6" />
            <span className="text-xs mt-1">Sessions</span>
          </Link>
          <Link to="/profile" className="flex flex-col items-center py-2 text-gray-400">
            <Cog6ToothIcon className="w-6 h-6" />
            <span className="text-xs mt-1">Profile</span>
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default Dashboard;
