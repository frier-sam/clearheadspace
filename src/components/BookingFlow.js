import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Calendar from 'react-calendar';
import { 
  ArrowLeftIcon,
  CheckCircleIcon,
  ClockIcon,
  CalendarIcon,
  VideoCameraIcon,
  PhoneIcon,
  ChatBubbleLeftRightIcon,
  StarIcon,
  HeartIcon,
  CreditCardIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { useTherapists } from '../hooks/useTherapists';
import { useBookings } from '../hooks/useBookings';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from './LoadingSpinner';
import { formatCurrency, formatDate, formatTime } from '../utils/helpers';
import { format, addDays, isToday, isTomorrow, isPast, isWeekend } from 'date-fns';
import toast from 'react-hot-toast';

const BookingFlow = () => {
  const { therapistId } = useParams();
  const navigate = useNavigate();
  const { currentUser, userProfile } = useAuth();
  const { getTherapistById, getAvailableSlots, isTherapistAvailable } = useTherapists();
  const { createBooking, loading: bookingLoading } = useBookings();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [sessionType, setSessionType] = useState('video');
  const [duration, setDuration] = useState(60);
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);

  const therapist = getTherapistById(therapistId);
  const totalSteps = 4;

  useEffect(() => {
    if (!therapist) {
      navigate('/therapists');
    }
  }, [therapist, navigate]);

  if (!therapist) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" message="Loading therapist details..." />
      </div>
    );
  }

  const sessionTypes = [
    {
      id: 'video',
      name: 'Video Call',
      icon: VideoCameraIcon,
      description: 'Face-to-face conversation via video',
      popular: true
    },
    {
      id: 'audio',
      name: 'Voice Call',
      icon: PhoneIcon,
      description: 'Audio-only conversation'
    },
    {
      id: 'chat',
      name: 'Text Chat',
      icon: ChatBubbleLeftRightIcon,
      description: 'Written conversation'
    }
  ];

  const durationOptions = [
    { value: 30, label: '30 minutes', price: therapist.hourlyRate * 0.5 },
    { value: 60, label: '1 hour', price: therapist.hourlyRate, popular: true },
    { value: 90, label: '1.5 hours', price: therapist.hourlyRate * 1.5 }
  ];

  const availableSlots = selectedDate 
    ? getAvailableSlots(therapistId, format(selectedDate, 'yyyy-MM-dd'))
    : [];

  const totalCost = durationOptions.find(d => d.value === duration)?.price || therapist.hourlyRate;

  const tileDisabled = ({ date, view }) => {
    if (view !== 'month') return false;
    
    // Disable past dates
    if (isPast(date) && !isToday(date)) return true;
    
    // Check if therapist has any availability on this date
    const dateString = format(date, 'yyyy-MM-dd');
    const slots = getAvailableSlots(therapistId, dateString);
    return slots.length === 0;
  };

  const tileClassName = ({ date, view }) => {
    if (view !== 'month') return '';
    
    let classes = [];
    
    if (isToday(date)) {
      classes.push('today-tile');
    }
    
    if (selectedDate && format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')) {
      classes.push('selected-tile');
    }
    
    // Check availability
    const dateString = format(date, 'yyyy-MM-dd');
    const slots = getAvailableSlots(therapistId, dateString);
    if (slots.length > 0) {
      classes.push('available-tile');
    }
    
    return classes.join(' ');
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedTime(null); // Reset selected time when date changes
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const canProceedToNext = () => {
    switch (currentStep) {
      case 1:
        return selectedDate && selectedTime;
      case 2:
        return sessionType && duration;
      case 3:
        return true; // Notes are optional
      case 4:
        return paymentMethod;
      default:
        return false;
    }
  };

  const handleBooking = async () => {
    try {
      setIsProcessing(true);
      
      const bookingData = {
        therapistId: therapist.id,
        therapistName: therapist.name,
        therapistEmail: therapist.email || `${therapist.name.toLowerCase().replace(' ', '.')}@clearheadspace.com`,
        userName: userProfile?.displayName || currentUser?.displayName,
        date: format(selectedDate, 'yyyy-MM-dd'),
        time: selectedTime,
        duration: duration,
        type: therapist.type,
        sessionType: sessionType,
        notes: notes,
        amount: totalCost,
        paymentMethod: paymentMethod,
        paymentStatus: 'completed', // In real app, this would be handled by payment processor
        timezone: userProfile?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone
      };

      await createBooking(bookingData);
      
      // Show success and redirect
      setTimeout(() => {
        navigate('/bookings');
      }, 2000);
      
    } catch (error) {
      console.error('Booking error:', error);
      toast.error('Failed to book session. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-white/20 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/therapists')}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ArrowLeftIcon className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Book Session</h1>
                <p className="text-sm text-gray-600">with {therapist.name}</p>
              </div>
            </div>
            
            {/* Progress */}
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    step <= currentStep
                      ? 'bg-primary-500'
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {/* Step 1: Date & Time Selection */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="card"
                >
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                    <CalendarIcon className="w-7 h-7 mr-3 text-primary-600" />
                    Choose Date & Time
                  </h2>

                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Calendar */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Select Date</h3>
                      <div className="calendar-container">
                        <Calendar
                          onChange={handleDateChange}
                          value={selectedDate}
                          minDate={new Date()}
                          maxDate={addDays(new Date(), 60)}
                          tileDisabled={tileDisabled}
                          tileClassName={tileClassName}
                          className="custom-calendar"
                        />
                      </div>
                      
                      <div className="mt-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
                            <span>Available</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-gray-300 rounded-full mr-2"></div>
                            <span>Unavailable</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Time Slots */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        Available Times
                        {selectedDate && (
                          <span className="text-sm font-normal text-gray-600 ml-2">
                            for {format(selectedDate, 'EEEE, MMM d')}
                          </span>
                        )}
                      </h3>
                      
                      {selectedDate ? (
                        <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                          {availableSlots.map((time) => (
                            <button
                              key={time}
                              onClick={() => handleTimeSelect(time)}
                              className={`p-3 rounded-xl border text-center transition-all ${
                                selectedTime === time
                                  ? 'bg-primary-500 text-white border-primary-500 shadow-lg'
                                  : 'bg-white border-gray-200 hover:border-primary-300 hover:bg-primary-50'
                              }`}
                            >
                              {formatTime(time)}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <ClockIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
                          <p>Select a date to see available times</p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Session Type & Duration */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-8"
                >
                  {/* Session Type */}
                  <div className="card">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Session Format</h2>
                    <div className="grid gap-4">
                      {sessionTypes.map((type) => (
                        <button
                          key={type.id}
                          onClick={() => setSessionType(type.id)}
                          className={`p-6 rounded-xl border text-left transition-all relative ${
                            sessionType === type.id
                              ? 'bg-primary-50 border-primary-500 shadow-lg'
                              : 'bg-white border-gray-200 hover:border-primary-300'
                          }`}
                        >
                          <div className="flex items-center space-x-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                              sessionType === type.id
                                ? 'bg-primary-500 text-white'
                                : 'bg-gray-100 text-gray-600'
                            }`}>
                              <type.icon className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-800 flex items-center">
                                {type.name}
                                {type.popular && (
                                  <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                                    Popular
                                  </span>
                                )}
                              </h3>
                              <p className="text-gray-600 text-sm">{type.description}</p>
                            </div>
                            {sessionType === type.id && (
                              <CheckCircleIcon className="w-6 h-6 text-primary-500" />
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Duration */}
                  <div className="card">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Session Duration</h2>
                    <div className="grid gap-4">
                      {durationOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => setDuration(option.value)}
                          className={`p-6 rounded-xl border text-left transition-all relative ${
                            duration === option.value
                              ? 'bg-secondary-50 border-secondary-500 shadow-lg'
                              : 'bg-white border-gray-200 hover:border-secondary-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-semibold text-gray-800 flex items-center">
                                {option.label}
                                {option.popular && (
                                  <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                                    Most Common
                                  </span>
                                )}
                              </h3>
                              <p className="text-gray-600 text-sm">
                                Perfect for {option.value === 30 ? 'quick check-ins' : option.value === 60 ? 'comprehensive sessions' : 'deep-dive conversations'}
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-secondary-600">
                                {formatCurrency(option.price)}
                              </div>
                              {duration === option.value && (
                                <CheckCircleIcon className="w-6 h-6 text-secondary-500 mt-2" />
                              )}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Additional Notes */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="card"
                >
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Additional Information</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        What would you like to discuss? (Optional)
                      </label>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={6}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all resize-none"
                        placeholder="Share what's on your mind, any specific topics you'd like to cover, or questions you have. This helps your therapist prepare for your session and provide the best support possible."
                      />
                      <p className="text-sm text-gray-500 mt-2">
                        This information is confidential and will only be shared with your selected therapist.
                      </p>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                      <div className="flex items-start space-x-3">
                        <ShieldCheckIcon className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <h3 className="font-semibold text-blue-800 mb-1">Your Privacy Matters</h3>
                          <p className="text-blue-700 text-sm">
                            All conversations and information shared are strictly confidential and protected by HIPAA regulations. 
                            Your therapist will review your notes before the session to provide personalized support.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Payment & Confirmation */}
              {currentStep === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-8"
                >
                  {/* Payment Method */}
                  <div className="card">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                      <CreditCardIcon className="w-7 h-7 mr-3 text-green-600" />
                      Payment Method
                    </h2>
                    
                    <div className="space-y-4">
                      <button
                        onClick={() => setPaymentMethod('card')}
                        className={`w-full p-4 rounded-xl border text-left transition-all ${
                          paymentMethod === 'card'
                            ? 'bg-green-50 border-green-500'
                            : 'bg-white border-gray-200 hover:border-green-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <CreditCardIcon className="w-6 h-6 text-green-600" />
                            <div>
                              <h3 className="font-semibold text-gray-800">Credit/Debit Card</h3>
                              <p className="text-sm text-gray-600">Secure payment via Stripe</p>
                            </div>
                          </div>
                          {paymentMethod === 'card' && (
                            <CheckCircleIcon className="w-6 h-6 text-green-500" />
                          )}
                        </div>
                      </button>

                      <button
                        onClick={() => setPaymentMethod('insurance')}
                        className={`w-full p-4 rounded-xl border text-left transition-all ${
                          paymentMethod === 'insurance'
                            ? 'bg-green-50 border-green-500'
                            : 'bg-white border-gray-200 hover:border-green-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <ShieldCheckIcon className="w-6 h-6 text-green-600" />
                            <div>
                              <h3 className="font-semibold text-gray-800">Insurance</h3>
                              <p className="text-sm text-gray-600">Use your health insurance coverage</p>
                            </div>
                          </div>
                          {paymentMethod === 'insurance' && (
                            <CheckCircleIcon className="w-6 h-6 text-green-500" />
                          )}
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Confirmation */}
                  <div className="card">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Confirm Your Booking</h2>
                    
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
                      <div className="flex items-start space-x-3">
                        <ExclamationTriangleIcon className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <h3 className="font-semibold text-yellow-800 mb-1">Cancellation Policy</h3>
                          <p className="text-yellow-700 text-sm">
                            Sessions can be cancelled or rescheduled up to 24 hours in advance for a full refund. 
                            Cancellations within 24 hours are subject to a 50% fee.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between py-2">
                        <span className="text-gray-600">Session Duration:</span>
                        <span className="font-medium">{duration} minutes</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-gray-600">Session Type:</span>
                        <span className="font-medium capitalize">{sessionType} call</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-gray-600">Date & Time:</span>
                        <span className="font-medium">
                          {selectedDate && selectedTime && formatDate(selectedDate, 'MMM d, yyyy')} at {formatTime(selectedTime)}
                        </span>
                      </div>
                      <div className="border-t pt-4">
                        <div className="flex justify-between items-center text-lg font-semibold">
                          <span>Total Cost:</span>
                          <span className="text-green-600">{formatCurrency(totalCost)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-8">
              {currentStep > 1 ? (
                <button
                  onClick={prevStep}
                  className="btn btn-outline flex items-center"
                >
                  <ArrowLeftIcon className="w-5 h-5 mr-2" />
                  Previous
                </button>
              ) : (
                <div></div>
              )}

              {currentStep < totalSteps ? (
                <button
                  onClick={nextStep}
                  disabled={!canProceedToNext()}
                  className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue
                </button>
              ) : (
                <button
                  onClick={handleBooking}
                  disabled={!canProceedToNext() || isProcessing}
                  className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isProcessing ? (
                    <>
                      <LoadingSpinner size="small" color="white" />
                      <span className="ml-2">Booking...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircleIcon className="w-5 h-5 mr-2" />
                      Confirm Booking
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Sidebar - Therapist Info */}
          <div className="lg:col-span-1">
            <div className="card sticky top-24">
              {/* Therapist Profile */}
              <div className="text-center mb-6">
                <img
                  src={therapist.image}
                  alt={therapist.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-semibold text-gray-800 mb-1">{therapist.name}</h3>
                <p className="text-gray-600 mb-2">{therapist.title}</p>
                <div className="flex items-center justify-center space-x-4 text-sm">
                  <div className="flex items-center">
                    <StarIcon className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                    <span className="font-medium">{therapist.rating}</span>
                  </div>
                  <span className="text-gray-300">•</span>
                  <span className="capitalize text-gray-600">{therapist.type}</span>
                </div>
              </div>

              {/* Selected Details */}
              {(selectedDate || selectedTime || sessionType) && (
                <div className="border-t pt-6">
                  <h4 className="font-semibold text-gray-800 mb-4">Your Selection</h4>
                  <div className="space-y-3 text-sm">
                    {selectedDate && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Date:</span>
                        <span className="font-medium">{formatDate(selectedDate, 'MMM d, yyyy')}</span>
                      </div>
                    )}
                    {selectedTime && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Time:</span>
                        <span className="font-medium">{formatTime(selectedTime)}</span>
                      </div>
                    )}
                    {sessionType && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Format:</span>
                        <span className="font-medium capitalize">{sessionType}</span>
                      </div>
                    )}
                    {duration && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Duration:</span>
                        <span className="font-medium">{duration} min</span>
                      </div>
                    )}
                    {duration && (
                      <div className="flex items-center justify-between text-lg font-semibold pt-2 border-t">
                        <span>Total:</span>
                        <span className="text-primary-600">{formatCurrency(totalCost)}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Specialties */}
              <div className="border-t pt-6 mt-6">
                <h4 className="font-semibold text-gray-800 mb-3">Specialties</h4>
                <div className="flex flex-wrap gap-2">
                  {therapist.specialties.map((specialty) => (
                    <span
                      key={specialty}
                      className="px-3 py-1 bg-primary-100 text-primary-700 text-sm rounded-full"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>

              {/* Contact Support */}
              <div className="border-t pt-6 mt-6">
                <h4 className="font-semibold text-gray-800 mb-3">Need Help?</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Questions about booking or our services? We're here to help.
                </p>
                <button className="w-full btn btn-outline text-sm">
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Calendar Styles */}
      <style jsx>{`
        .custom-calendar {
          width: 100%;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 1rem;
          font-family: inherit;
        }
        
        .custom-calendar .react-calendar__navigation {
          display: flex;
          height: 44px;
          margin-bottom: 1em;
        }
        
        .custom-calendar .react-calendar__navigation button {
          min-width: 44px;
          background: none;
          border: none;
          font-size: 16px;
          font-weight: 500;
          color: #374151;
        }
        
        .custom-calendar .react-calendar__navigation button:hover {
          background-color: #f3f4f6;
          border-radius: 0.5rem;
        }
        
        .custom-calendar .react-calendar__tile {
          max-width: 100%;
          padding: 0.75rem 0.5rem;
          background: none;
          border: none;
          color: #374151;
          font-size: 14px;
          border-radius: 0.5rem;
        }
        
        .custom-calendar .react-calendar__tile:hover {
          background-color: #f3f4f6;
        }
        
        .custom-calendar .react-calendar__tile--active {
          background: #3b82f6 !important;
          color: white;
        }
        
        .custom-calendar .react-calendar__tile:disabled {
          background-color: #f9fafb;
          color: #d1d5db;
        }
        
        .available-tile {
          position: relative;
        }
        
        .available-tile::after {
          content: '';
          position: absolute;
          bottom: 4px;
          left: 50%;
          transform: translateX(-50%);
          width: 6px;
          height: 6px;
          background-color: #10b981;
          border-radius: 50%;
        }
        
        .today-tile {
          font-weight: 600;
          color: #3b82f6;
        }
      `}</style>
    </div>
  );
};

export default BookingFlow;
