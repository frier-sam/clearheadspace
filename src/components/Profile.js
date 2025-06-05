import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { 
  UserCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
  MapPinIcon,
  BellIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  HeartIcon,
  Cog6ToothIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PencilIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from './LoadingSpinner';
import { getInitials, getAvatarColor, validateEmail, validatePhone, formatPhoneNumber } from '../utils/helpers';
import toast from 'react-hot-toast';

const Profile = () => {
  const { currentUser, userProfile, updateProfile, signout } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm();

  useEffect(() => {
    if (userProfile) {
      reset({
        firstName: userProfile.firstName || '',
        lastName: userProfile.lastName || '',
        email: userProfile.email || currentUser?.email || '',
        phone: userProfile.phone || '',
        dateOfBirth: userProfile.dateOfBirth || '',
        emergencyContact: userProfile.emergencyContact || '',
        timezone: userProfile.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
        goals: userProfile.goals || '',
        preferredTherapyType: userProfile.preferredTherapyType || []
      });
    }
  }, [userProfile, currentUser, reset]);

  const tabs = [
    { id: 'personal', name: 'Personal Info', icon: UserCircleIcon },
    { id: 'preferences', name: 'Preferences', icon: HeartIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
    { id: 'security', name: 'Security', icon: ShieldCheckIcon },
    { id: 'billing', name: 'Billing', icon: CreditCardIcon }
  ];

  const therapyTypes = [
    'Individual Therapy',
    'Couples Therapy',
    'Family Therapy',
    'Group Therapy',
    'Peer Support',
    'Life Coaching',
    'Crisis Support'
  ];

  const timezones = [
    'America/New_York',
    'America/Chicago',
    'America/Denver',
    'America/Los_Angeles',
    'America/Anchorage',
    'Pacific/Honolulu'
  ].map(tz => ({
    value: tz,
    label: tz.replace('America/', '').replace('_', ' ').replace('Pacific/', '')
  }));

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      
      // Format phone number
      if (data.phone) {
        data.phone = formatPhoneNumber(data.phone);
      }

      await updateProfile(data);
      setIsEditing(false);
    } catch (error) {
      console.error('Profile update error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    if (window.confirm('Are you sure you want to sign out?')) {
      try {
        await signout();
        navigate('/');
      } catch (error) {
        console.error('Sign out error:', error);
      }
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      if (window.confirm('This will permanently delete all your data, bookings, and session history. Are you absolutely sure?')) {
        toast.error('Account deletion is currently not available. Please contact support.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-white/20 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ArrowLeftIcon className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Profile Settings</h1>
                <p className="text-sm text-gray-600">Manage your account and preferences</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {activeTab === 'personal' && (
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className={`btn ${isEditing ? 'btn-outline' : 'btn-primary'} flex items-center`}
                >
                  {isEditing ? (
                    <>
                      <CheckCircleIcon className="w-5 h-5 mr-2" />
                      Cancel
                    </>
                  ) : (
                    <>
                      <PencilIcon className="w-5 h-5 mr-2" />
                      Edit Profile
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="card sticky top-24"
            >
              {/* Profile Summary */}
              <div className="text-center mb-6 pb-6 border-b border-gray-100">
                <div className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-white font-bold text-xl ${getAvatarColor(userProfile?.displayName || currentUser?.displayName || 'User')}`}>
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
                <h3 className="text-lg font-semibold text-gray-800">
                  {userProfile?.displayName || currentUser?.displayName || 'User'}
                </h3>
                <p className="text-sm text-gray-600">
                  {userProfile?.email || currentUser?.email}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Member since {userProfile?.createdAt ? 
                    new Date(userProfile.createdAt.seconds * 1000).getFullYear() : 
                    new Date().getFullYear()
                  }
                </p>
              </div>

              {/* Navigation */}
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-4 py-3 text-left rounded-xl transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary-100 text-primary-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <tab.icon className="w-5 h-5 mr-3" />
                    {tab.name}
                  </button>
                ))}
              </nav>

              {/* Sign Out */}
              <div className="pt-6 mt-6 border-t border-gray-100">
                <button
                  onClick={handleSignOut}
                  className="w-full text-left text-red-600 hover:text-red-700 text-sm font-medium"
                >
                  Sign Out
                </button>
              </div>
            </motion.div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Personal Information */}
              {activeTab === 'personal' && (
                <div className="card">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Personal Information</h2>
                  
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Name */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          First Name
                        </label>
                        <input
                          type="text"
                          disabled={!isEditing}
                          className={`input-field ${!isEditing ? 'bg-gray-50' : ''} ${errors.firstName ? 'border-red-500' : ''}`}
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
                          disabled={!isEditing}
                          className={`input-field ${!isEditing ? 'bg-gray-50' : ''} ${errors.lastName ? 'border-red-500' : ''}`}
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
                        disabled={true} // Email typically shouldn't be editable
                        className="input-field bg-gray-50"
                        {...register('email')}
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Contact support to change your email address
                      </p>
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        disabled={!isEditing}
                        className={`input-field ${!isEditing ? 'bg-gray-50' : ''} ${errors.phone ? 'border-red-500' : ''}`}
                        {...register('phone', {
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
                        disabled={!isEditing}
                        className={`input-field ${!isEditing ? 'bg-gray-50' : ''}`}
                        {...register('dateOfBirth')}
                      />
                    </div>

                    {/* Emergency Contact */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Emergency Contact
                      </label>
                      <input
                        type="text"
                        disabled={!isEditing}
                        className={`input-field ${!isEditing ? 'bg-gray-50' : ''}`}
                        placeholder="Name and phone number"
                        {...register('emergencyContact')}
                      />
                    </div>

                    {/* Timezone */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Timezone
                      </label>
                      <select
                        disabled={!isEditing}
                        className={`input-field ${!isEditing ? 'bg-gray-50' : ''}`}
                        {...register('timezone')}
                      >
                        {timezones.map((tz) => (
                          <option key={tz.value} value={tz.value}>
                            {tz.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {isEditing && (
                      <div className="flex space-x-4">
                        <button
                          type="submit"
                          disabled={loading}
                          className="btn btn-primary disabled:opacity-50"
                        >
                          {loading ? (
                            <div className="flex items-center">
                              <LoadingSpinner size="small" color="white" />
                              <span className="ml-2">Saving...</span>
                            </div>
                          ) : (
                            'Save Changes'
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsEditing(false)}
                          className="btn btn-outline"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </form>
                </div>
              )}

              {/* Preferences */}
              {activeTab === 'preferences' && (
                <div className="space-y-8">
                  <div className="card">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Therapy Preferences</h2>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Preferred Therapy Types
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          {therapyTypes.map((type) => (
                            <label key={type} className="flex items-center">
                              <input
                                type="checkbox"
                                value={type}
                                defaultChecked={userProfile?.preferredTherapyType?.includes(type)}
                                className="mr-3 text-primary-600 rounded"
                              />
                              <span className="text-sm">{type}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Your Goals
                        </label>
                        <textarea
                          rows={4}
                          className="input-field resize-none"
                          placeholder="What do you hope to achieve through therapy?"
                          defaultValue={userProfile?.goals || ''}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="card">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Communication Preferences</h2>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div>
                          <h3 className="font-medium text-gray-800">Session Reminders</h3>
                          <p className="text-sm text-gray-600">Get notified before your sessions</p>
                        </div>
                        <input type="checkbox" defaultChecked className="text-primary-600" />
                      </div>
                      
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div>
                          <h3 className="font-medium text-gray-800">Wellness Tips</h3>
                          <p className="text-sm text-gray-600">Receive daily mental health tips</p>
                        </div>
                        <input type="checkbox" defaultChecked className="text-primary-600" />
                      </div>
                      
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div>
                          <h3 className="font-medium text-gray-800">Progress Updates</h3>
                          <p className="text-sm text-gray-600">Weekly summaries of your progress</p>
                        </div>
                        <input type="checkbox" className="text-primary-600" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications */}
              {activeTab === 'notifications' && (
                <div className="card">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Notification Settings</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Email Notifications</h3>
                      <div className="space-y-4">
                        {[
                          { name: 'Session confirmations', desc: 'When you book a new session' },
                          { name: 'Session reminders', desc: '24 hours and 1 hour before sessions' },
                          { name: 'Cancellation notices', desc: 'When sessions are cancelled' },
                          { name: 'New messages', desc: 'From your therapist or support team' },
                          { name: 'Progress reports', desc: 'Weekly and monthly summaries' }
                        ].map((item) => (
                          <div key={item.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                            <div>
                              <h4 className="font-medium text-gray-800">{item.name}</h4>
                              <p className="text-sm text-gray-600">{item.desc}</p>
                            </div>
                            <input type="checkbox" defaultChecked className="text-primary-600" />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Push Notifications</h3>
                      <div className="space-y-4">
                        {[
                          { name: 'Session reminders', desc: 'Push notifications for upcoming sessions' },
                          { name: 'Emergency alerts', desc: 'Important safety information' },
                          { name: 'Daily check-ins', desc: 'Mood tracking reminders' }
                        ].map((item) => (
                          <div key={item.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                            <div>
                              <h4 className="font-medium text-gray-800">{item.name}</h4>
                              <p className="text-sm text-gray-600">{item.desc}</p>
                            </div>
                            <input type="checkbox" defaultChecked className="text-primary-600" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Security */}
              {activeTab === 'security' && (
                <div className="space-y-8">
                  <div className="card">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Security Settings</h2>
                    
                    <div className="space-y-6">
                      <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                        <div className="flex items-center">
                          <CheckCircleIcon className="w-6 h-6 text-green-600 mr-3" />
                          <div>
                            <h3 className="font-medium text-green-800">Account Secure</h3>
                            <p className="text-sm text-green-700">Your account is protected with strong security measures</p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Password</h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Current Password
                            </label>
                            <div className="relative">
                              <input
                                type={showPassword ? 'text' : 'password'}
                                className="input-field pr-12"
                                placeholder="Enter current password"
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                              >
                                {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                              </button>
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              New Password
                            </label>
                            <input
                              type="password"
                              className="input-field"
                              placeholder="Enter new password"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Confirm New Password
                            </label>
                            <input
                              type="password"
                              className="input-field"
                              placeholder="Confirm new password"
                            />
                          </div>
                          <button className="btn btn-primary">
                            Update Password
                          </button>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Two-Factor Authentication</h3>
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-blue-800">Enable 2FA</h4>
                              <p className="text-sm text-blue-700">Add an extra layer of security to your account</p>
                            </div>
                            <button className="btn btn-outline">
                              Enable
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="card">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Privacy Settings</h2>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div>
                          <h3 className="font-medium text-gray-800">Share progress with emergency contact</h3>
                          <p className="text-sm text-gray-600">Allow emergency contact to receive updates</p>
                        </div>
                        <input type="checkbox" className="text-primary-600" />
                      </div>
                      
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div>
                          <h3 className="font-medium text-gray-800">Anonymous feedback</h3>
                          <p className="text-sm text-gray-600">Help improve our services with anonymous data</p>
                        </div>
                        <input type="checkbox" defaultChecked className="text-primary-600" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Billing */}
              {activeTab === 'billing' && (
                <div className="space-y-8">
                  <div className="card">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Billing Information</h2>
                    
                    <div className="space-y-6">
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                        <div className="flex items-center">
                          <CreditCardIcon className="w-6 h-6 text-blue-600 mr-3" />
                          <div>
                            <h3 className="font-medium text-blue-800">Payment Method</h3>
                            <p className="text-sm text-blue-700">**** **** **** 4242 (Visa)</p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Transactions</h3>
                        <div className="space-y-3">
                          {[
                            { date: '2024-01-15', amount: '$120.00', therapist: 'Dr. Sarah Johnson', status: 'Completed' },
                            { date: '2024-01-08', amount: '$60.00', therapist: 'Emma Rodriguez', status: 'Completed' },
                            { date: '2024-01-01', amount: '$110.00', therapist: 'Michael Chen', status: 'Completed' }
                          ].map((transaction, index) => (
                            <div key={index} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl">
                              <div>
                                <h4 className="font-medium text-gray-800">{transaction.therapist}</h4>
                                <p className="text-sm text-gray-600">{transaction.date}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold text-gray-800">{transaction.amount}</p>
                                <p className="text-sm text-green-600">{transaction.status}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="card">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Subscription</h2>
                    
                    <div className="p-6 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl border border-primary-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-primary-800">Pay-Per-Session</h3>
                          <p className="text-primary-700">You're currently on our flexible payment plan</p>
                        </div>
                        <button className="btn btn-primary">
                          View Plans
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Danger Zone */}
            {activeTab === 'security' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="card border-red-200 bg-red-50 mt-8"
              >
                <h2 className="text-2xl font-bold text-red-800 mb-6 flex items-center">
                  <ExclamationTriangleIcon className="w-7 h-7 mr-3" />
                  Danger Zone
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white border border-red-200 rounded-xl">
                    <div>
                      <h3 className="font-medium text-red-800">Delete Account</h3>
                      <p className="text-sm text-red-600">Permanently delete your account and all data</p>
                    </div>
                    <button
                      onClick={handleDeleteAccount}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                    >
                      Delete Account
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
