import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { 
  EyeIcon, 
  EyeSlashIcon, 
  HeartIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../LoadingSpinner';
import { validateEmail, validatePhone, formatPhoneNumber } from '../../utils/helpers';

const SignUp = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signup, signinWithGoogle } = useAuth();
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    trigger,
    watch
  } = useForm();

  const totalSteps = 3;

  const therapyTypes = [
    'Individual Therapy',
    'Couples Therapy',
    'Family Therapy',
    'Group Therapy',
    'Peer Support',
    'Life Coaching',
    'Crisis Support'
  ];

  const goals = [
    'Anxiety Management',
    'Depression Support',
    'Relationship Issues',
    'Stress Management',
    'Self-Esteem Building',
    'Grief Counseling',
    'Addiction Recovery',
    'Life Transitions',
    'Academic/Work Stress',
    'General Wellness'
  ];

  const nextStep = async () => {
    let fieldsToValidate = [];
    
    if (currentStep === 1) {
      fieldsToValidate = ['firstName', 'lastName', 'email', 'password', 'confirmPassword'];
    } else if (currentStep === 2) {
      fieldsToValidate = ['phone', 'dateOfBirth', 'emergencyContact'];
    }
    
    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      
      const userData = {
        firstName: data.firstName,
        lastName: data.lastName,
        displayName: `${data.firstName} ${data.lastName}`,
        phone: data.phone,
        dateOfBirth: data.dateOfBirth,
        emergencyContact: data.emergencyContact,
        preferredTherapyType: data.preferredTherapyType || [],
        goals: data.goals,
        previousTherapyExperience: data.previousTherapyExperience === 'yes',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      };

      await signup(data.email, data.password, userData);
      navigate('/dashboard');
    } catch (error) {
      console.error('Sign up error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      setLoading(true);
      await signinWithGoogle();
      navigate('/dashboard');
    } catch (error) {
      console.error('Google sign up error:', error);
    } finally {
      setLoading(false);
    }
  };

  const password = watch('password');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-400 via-secondary-400 to-accent-400 px-4 py-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        {/* Back button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-6"
        >
          <Link
            to="/"
            className="inline-flex items-center text-white/80 hover:text-white transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Back to Home
          </Link>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-semibold transition-colors ${
                  step <= currentStep
                    ? 'bg-white text-primary-600'
                    : 'bg-white/20 text-white/60'
                }`}
              >
                {step < currentStep ? (
                  <CheckCircleIcon className="w-6 h-6 text-green-500" />
                ) : (
                  step
                )}
              </div>
            ))}
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <motion.div
              className="bg-white rounded-full h-2"
              initial={{ width: '0%' }}
              animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className="flex justify-between text-white/80 text-sm mt-2">
            <span>Account</span>
            <span>Personal</span>
            <span>Preferences</span>
          </div>
        </motion.div>

        {/* Sign Up Card */}
        <div className="card bg-white/95 backdrop-blur-lg border border-white/20 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex items-center justify-center space-x-2 mb-4"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
                <HeartIcon className="w-7 h-7 text-white" />
              </div>
              <span className="text-2xl font-bold font-display bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                ClearHeadSpace
              </span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-2xl font-bold text-gray-800 mb-2"
            >
              Welcome! Let's get started 🌟
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="text-gray-600"
            >
              {currentStep === 1 && "Create your account to begin your wellness journey"}
              {currentStep === 2 && "Tell us a bit about yourself"}
              {currentStep === 3 && "Customize your experience"}
            </motion.p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <AnimatePresence mode="wait">
              {/* Step 1: Account Creation */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {/* Google Sign Up */}
                  <motion.button
                    type="button"
                    onClick={handleGoogleSignUp}
                    disabled={loading}
                    className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-xl bg-white hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    {loading ? 'Creating account...' : 'Continue with Google'}
                  </motion.button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">Or create with email</span>
                    </div>
                  </div>

                  {/* Name Fields */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        className={`input-field ${errors.firstName ? 'border-red-500' : ''}`}
                        placeholder="John"
                        {...register('firstName', {
                          required: 'First name is required',
                          minLength: { value: 2, message: 'Name must be at least 2 characters' }
                        })}
                      />
                      {errors.firstName && (
                        <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        className={`input-field ${errors.lastName ? 'border-red-500' : ''}`}
                        placeholder="Doe"
                        {...register('lastName', {
                          required: 'Last name is required',
                          minLength: { value: 2, message: 'Name must be at least 2 characters' }
                        })}
                      />
                      {errors.lastName && (
                        <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      className={`input-field ${errors.email ? 'border-red-500' : ''}`}
                      placeholder="john@example.com"
                      {...register('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: 'Please enter a valid email address'
                        }
                      })}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                    )}
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className={`input-field pr-12 ${errors.password ? 'border-red-500' : ''}`}
                        placeholder="Create a strong password"
                        {...register('password', {
                          required: 'Password is required',
                          minLength: {
                            value: 6,
                            message: 'Password must be at least 6 characters'
                          }
                        })}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? (
                          <EyeSlashIcon className="w-5 h-5" />
                        ) : (
                          <EyeIcon className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      className={`input-field ${errors.confirmPassword ? 'border-red-500' : ''}`}
                      placeholder="Confirm your password"
                      {...register('confirmPassword', {
                        required: 'Please confirm your password',
                        validate: value => value === password || 'Passwords do not match'
                      })}
                    />
                    {errors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Step 2: Personal Information */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      className={`input-field ${errors.phone ? 'border-red-500' : ''}`}
                      placeholder="(555) 123-4567"
                      {...register('phone', {
                        required: 'Phone number is required',
                        pattern: {
                          value: /^[\+]?[1-9][\d]{0,15}$/,
                          message: 'Please enter a valid phone number'
                        }
                      })}
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                    )}
                  </div>

                  {/* Date of Birth */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      className={`input-field ${errors.dateOfBirth ? 'border-red-500' : ''}`}
                      {...register('dateOfBirth', {
                        required: 'Date of birth is required'
                      })}
                    />
                    {errors.dateOfBirth && (
                      <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth.message}</p>
                    )}
                  </div>

                  {/* Emergency Contact */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Emergency Contact (Name & Phone)
                    </label>
                    <input
                      type="text"
                      className={`input-field ${errors.emergencyContact ? 'border-red-500' : ''}`}
                      placeholder="Jane Doe - (555) 987-6543"
                      {...register('emergencyContact', {
                        required: 'Emergency contact is required'
                      })}
                    />
                    {errors.emergencyContact && (
                      <p className="mt-1 text-sm text-red-600">{errors.emergencyContact.message}</p>
                    )}
                  </div>

                  {/* Previous Therapy Experience */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Have you had therapy or counseling before?
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="yes"
                          className="mr-3 text-primary-600"
                          {...register('previousTherapyExperience')}
                        />
                        Yes, I have previous experience
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="no"
                          className="mr-3 text-primary-600"
                          {...register('previousTherapyExperience')}
                        />
                        No, this is my first time
                      </label>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Preferences */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {/* Preferred Therapy Types */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      What type of support are you looking for? (Select all that apply)
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {therapyTypes.map((type) => (
                        <label key={type} className="flex items-center">
                          <input
                            type="checkbox"
                            value={type}
                            className="mr-3 text-primary-600 rounded"
                            {...register('preferredTherapyType')}
                          />
                          <span className="text-sm">{type}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Goals */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      What are your main goals? (Optional)
                    </label>
                    <textarea
                      className="input-field h-24 resize-none"
                      placeholder="Tell us what you hope to achieve through therapy or support..."
                      {...register('goals')}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-8">
              {currentStep > 1 ? (
                <motion.button
                  type="button"
                  onClick={prevStep}
                  className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
                  whileHover={{ x: -5 }}
                >
                  <ArrowLeftIcon className="w-5 h-5 mr-2" />
                  Previous
                </motion.button>
              ) : (
                <div></div>
              )}

              {currentStep < totalSteps ? (
                <motion.button
                  type="button"
                  onClick={nextStep}
                  className="btn btn-primary flex items-center"
                  whileHover={{ x: 5 }}
                >
                  Next
                  <ArrowRightIcon className="w-5 h-5 ml-2" />
                </motion.button>
              ) : (
                <motion.button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary flex items-center disabled:opacity-50"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {loading ? (
                    <>
                      <LoadingSpinner size="small" color="white" />
                      <span className="ml-2">Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircleIcon className="w-5 h-5 mr-2" />
                      Create Account
                    </>
                  )}
                </motion.button>
              )}
            </div>
          </form>

          {/* Sign In Link */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="mt-8 text-center"
          >
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link
                to="/signin"
                className="text-primary-600 hover:text-primary-700 font-semibold transition-colors"
              >
                Sign in here
              </Link>
            </p>
          </motion.div>
        </div>

        {/* Privacy Note */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-6 text-center text-sm text-white/80"
        >
          By creating an account, you agree to our Terms of Service and Privacy Policy. 
          Your information is secure and will never be shared without your consent.
        </motion.p>
      </motion.div>
    </div>
  );
};

export default SignUp;
