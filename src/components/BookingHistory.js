import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CalendarIcon,
  ClockIcon,
  VideoCameraIcon,
  PhoneIcon,
  ChatBubbleLeftRightIcon,
  StarIcon,
  XMarkIcon,
  ArrowPathIcon,
  TrashIcon,
  EyeIcon,
  ArrowLeftIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import { useBookings } from '../hooks/useBookings';
import { useTherapists } from '../hooks/useTherapists';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from './LoadingSpinner';
import { formatDate, formatTime, formatCurrency, getInitials, getAvatarColor } from '../utils/helpers';
import { format, isPast, isFuture, isToday, isTomorrow, differenceInHours } from 'date-fns';
import toast from 'react-hot-toast';

const BookingHistory = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { 
    bookings, 
    loading, 
    getUpcomingBookings, 
    getPastBookings,
    cancelBooking,
    rescheduleBooking,
    updateBooking
  } = useBookings();
  const { getTherapistById } = useTherapists();
  
  const [activeTab, setActiveTab] = useState('upcoming');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const tabs = [
    { id: 'upcoming', name: 'Upcoming', count: getUpcomingBookings().length },
    { id: 'past', name: 'Past Sessions', count: getPastBookings().length },
    { id: 'all', name: 'All Bookings', count: bookings.length }
  ];

  const statusOptions = [
    { id: 'all', name: 'All Status' },
    { id: 'confirmed', name: 'Confirmed' },
    { id: 'completed', name: 'Completed' },
    { id: 'cancelled', name: 'Cancelled' },
    { id: 'rescheduled', name: 'Rescheduled' }
  ];

  const getFilteredBookings = () => {
    let filtered = [];
    
    switch (activeTab) {
      case 'upcoming':
        filtered = getUpcomingBookings();
        break;
      case 'past':
        filtered = getPastBookings();
        break;
      default:
        filtered = bookings;
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(booking =>
        booking.therapistName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.notes?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(booking => booking.status === statusFilter);
    }

    // Sort by date
    return filtered.sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}`);
      const dateB = new Date(`${b.date}T${b.time}`);
      return activeTab === 'upcoming' ? dateA - dateB : dateB - dateA;
    });
  };

  const getSessionIcon = (sessionType) => {
    switch (sessionType) {
      case 'video':
        return VideoCameraIcon;
      case 'audio':
        return PhoneIcon;
      case 'chat':
        return ChatBubbleLeftRightIcon;
      default:
        return VideoCameraIcon;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'rescheduled':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return CheckCircleIcon;
      case 'completed':
        return CheckCircleIcon;
      case 'cancelled':
        return XMarkIcon;
      case 'rescheduled':
        return ArrowPathIcon;
      default:
        return InformationCircleIcon;
    }
  };

  const canCancelBooking = (booking) => {
    const bookingDateTime = new Date(`${booking.date}T${booking.time}`);
    const hoursUntilBooking = differenceInHours(bookingDateTime, new Date());
    return hoursUntilBooking >= 24 && booking.status === 'confirmed';
  };

  const canRescheduleBooking = (booking) => {
    const bookingDateTime = new Date(`${booking.date}T${booking.time}`);
    const hoursUntilBooking = differenceInHours(bookingDateTime, new Date());
    return hoursUntilBooking >= 4 && booking.status === 'confirmed';
  };

  const canJoinSession = (booking) => {
    const bookingDateTime = new Date(`${booking.date}T${booking.time}`);
    const now = new Date();
    const minutesUntilBooking = (bookingDateTime - now) / (1000 * 60);
    return minutesUntilBooking <= 15 && minutesUntilBooking >= -60 && booking.status === 'confirmed';
  };

  const handleCancelBooking = async () => {
    if (!selectedBooking) return;
    
    try {
      setIsProcessing(true);
      await cancelBooking(selectedBooking.id, cancelReason);
      setShowCancelModal(false);
      setSelectedBooking(null);
      setCancelReason('');
    } catch (error) {
      console.error('Cancel booking error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleJoinSession = (booking) => {
    if (booking.meetingLink) {
      window.open(booking.meetingLink, '_blank');
    } else {
      navigate(`/call/${booking.id}`);
    }
  };

  const filteredBookings = getFilteredBookings();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" message="Loading your sessions..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-white/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ArrowLeftIcon className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-800">My Sessions</h1>
                <p className="text-sm text-gray-600">Manage your appointments and history</p>
              </div>
            </div>
            
            <button
              onClick={() => navigate('/therapists')}
              className="btn btn-primary"
            >
              Book New Session
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="card mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search sessions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <FunnelIcon className="w-5 h-5 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                >
                  {statusOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex space-x-1 bg-gray-100 rounded-xl p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {tab.name}
                <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                  activeTab === tab.id
                    ? 'bg-primary-100 text-primary-600'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Bookings List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {filteredBookings.length > 0 ? (
            <div className="space-y-4">
              {filteredBookings.map((booking, index) => {
                const therapist = getTherapistById(booking.therapistId);
                const SessionIcon = getSessionIcon(booking.sessionType);
                const StatusIcon = getStatusIcon(booking.status);
                const bookingDateTime = new Date(`${booking.date}T${booking.time}`);
                
                return (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="card hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                      {/* Therapist Info */}
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="flex-shrink-0">
                          {therapist?.image ? (
                            <img
                              src={therapist.image}
                              alt={booking.therapistName}
                              className="w-16 h-16 rounded-full object-cover"
                            />
                          ) : (
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold ${getAvatarColor(booking.therapistName)}`}>
                              {getInitials(booking.therapistName)}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-800 truncate">
                            {booking.therapistName}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">
                            {therapist?.title || `${booking.type === 'therapist' ? 'Licensed Therapist' : 'Support Buddy'}`}
                          </p>
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center">
                              <CalendarIcon className="w-4 h-4 mr-1" />
                              <span>
                                {isToday(bookingDateTime) ? 'Today' :
                                 isTomorrow(bookingDateTime) ? 'Tomorrow' :
                                 formatDate(booking.date, 'MMM d, yyyy')}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <ClockIcon className="w-4 h-4 mr-1" />
                              <span>{formatTime(booking.time)}</span>
                            </div>
                            <div className="flex items-center">
                              <SessionIcon className="w-4 h-4 mr-1" />
                              <span className="capitalize">{booking.sessionType}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Session Details */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        {/* Status */}
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                          <span className="text-sm font-semibold text-gray-800">
                            {formatCurrency(booking.amount)}
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-2">
                          {canJoinSession(booking) && (
                            <button
                              onClick={() => handleJoinSession(booking)}
                              className="btn btn-primary text-sm px-4 py-2"
                            >
                              Join Session
                            </button>
                          )}
                          
                          {canRescheduleBooking(booking) && (
                            <button
                              onClick={() => {
                                setSelectedBooking(booking);
                                setShowRescheduleModal(true);
                              }}
                              className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                              title="Reschedule"
                            >
                              <ArrowPathIcon className="w-5 h-5" />
                            </button>
                          )}
                          
                          {canCancelBooking(booking) && (
                            <button
                              onClick={() => {
                                setSelectedBooking(booking);
                                setShowCancelModal(true);
                              }}
                              className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                              title="Cancel"
                            >
                              <XMarkIcon className="w-5 h-5" />
                            </button>
                          )}
                          
                          <button
                            onClick={() => setSelectedBooking(booking)}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <EyeIcon className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Additional Info for Past Sessions */}
                    {booking.status === 'completed' && activeTab === 'past' && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center">
                              <ClockIcon className="w-4 h-4 text-gray-400 mr-1" />
                              <span className="text-sm text-gray-600">{booking.duration} minutes</span>
                            </div>
                            {booking.rating && (
                              <div className="flex items-center">
                                <StarIcon className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                                <span className="text-sm text-gray-600">{booking.rating}/5</span>
                              </div>
                            )}
                          </div>
                          
                          {!booking.rating && (
                            <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                              Leave Review
                            </button>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Cancellation Info */}
                    {booking.status === 'cancelled' && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex items-start space-x-2 text-sm text-gray-600">
                          <ExclamationCircleIcon className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <p>Cancelled on {formatDate(booking.cancelledAt, 'MMM d, yyyy')}</p>
                            {booking.cancellationReason && (
                              <p className="text-gray-500">Reason: {booking.cancellationReason}</p>
                            )}
                            {booking.refundEligible && (
                              <p className="text-green-600">Refund processed</p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-16"
            >
              <CalendarIcon className="w-24 h-24 text-gray-300 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-gray-600 mb-4">
                {activeTab === 'upcoming' ? 'No upcoming sessions' :
                 activeTab === 'past' ? 'No past sessions' :
                 'No sessions found'}
              </h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                {activeTab === 'upcoming' 
                  ? "Ready to schedule your next session? Connect with a therapist or buddy today."
                  : searchTerm || statusFilter !== 'all'
                  ? "Try adjusting your search or filter criteria."
                  : "Your session history will appear here once you've completed some sessions."
                }
              </p>
              <button
                onClick={() => navigate('/therapists')}
                className="btn btn-primary"
              >
                Book a Session
              </button>
            </motion.div>
          )}
        </motion.div>

        {/* Cancel Modal */}
        <AnimatePresence>
          {showCancelModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl p-6 max-w-md w-full"
              >
                <h3 className="text-xl font-bold text-gray-800 mb-4">Cancel Session</h3>
                <p className="text-gray-600 mb-4">
                  Are you sure you want to cancel your session with {selectedBooking?.therapistName}?
                </p>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason for cancellation (optional)
                  </label>
                  <textarea
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 resize-none"
                    placeholder="Let us know why you're cancelling..."
                  />
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                  <p className="text-sm text-yellow-800">
                    {canCancelBooking(selectedBooking) 
                      ? "Free cancellation - you'll receive a full refund."
                      : "Cancelling within 24 hours may incur a fee."
                    }
                  </p>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      setShowCancelModal(false);
                      setSelectedBooking(null);
                      setCancelReason('');
                    }}
                    className="flex-1 btn btn-outline"
                  >
                    Keep Session
                  </button>
                  <button
                    onClick={handleCancelBooking}
                    disabled={isProcessing}
                    className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    {isProcessing ? 'Cancelling...' : 'Cancel Session'}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Booking Details Modal */}
        <AnimatePresence>
          {selectedBooking && !showCancelModal && !showRescheduleModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-96 overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-800">Session Details</h3>
                  <button
                    onClick={() => setSelectedBooking(null)}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Therapist:</span>
                    <span className="font-medium">{selectedBooking.therapistName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium">{formatDate(selectedBooking.date, 'EEEE, MMM d, yyyy')}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Time:</span>
                    <span className="font-medium">{formatTime(selectedBooking.time)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium">{selectedBooking.duration} minutes</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Session Type:</span>
                    <span className="font-medium capitalize">{selectedBooking.sessionType}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-medium">{formatCurrency(selectedBooking.amount)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedBooking.status)}`}>
                      {selectedBooking.status.charAt(0).toUpperCase() + selectedBooking.status.slice(1)}
                    </span>
                  </div>
                  
                  {selectedBooking.notes && (
                    <div>
                      <span className="text-gray-600 block mb-2">Notes:</span>
                      <p className="text-sm bg-gray-50 p-3 rounded-lg">{selectedBooking.notes}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BookingHistory;
