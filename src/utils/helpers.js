import { format, parseISO, isValid, addHours, subHours } from 'date-fns';

// Format date utilities
export const formatDate = (date, formatString = 'MMM d, yyyy') => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return isValid(dateObj) ? format(dateObj, formatString) : '';
};

export const formatTime = (time, format12Hour = true) => {
  if (!time) return '';
  try {
    const timeObj = new Date(`2000-01-01T${time}`);
    return format(timeObj, format12Hour ? 'h:mm a' : 'HH:mm');
  } catch {
    return time;
  }
};

export const formatDateTime = (date, time) => {
  const dateFormatted = formatDate(date, 'EEEE, MMMM d, yyyy');
  const timeFormatted = formatTime(time);
  return `${dateFormatted} at ${timeFormatted}`;
};

// Validation utilities
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone) => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

export const validateName = (name) => {
  return name && name.trim().length >= 2;
};

export const validatePassword = (password) => {
  return password && password.length >= 6;
};

// Formatting utilities
export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

export const formatPhoneNumber = (phone) => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
};

// Generate random utilities
export const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

export const generateMeetingId = () => {
  return Math.random().toString(36).substr(2, 12).toUpperCase();
};

// Time utilities
export const getTimeZone = () => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

export const convertToUserTimezone = (date, time, fromTimezone, toTimezone) => {
  try {
    const dateTime = new Date(`${date}T${time}`);
    // This is a simplified version - in production, use a library like date-fns-tz
    return dateTime;
  } catch {
    return null;
  }
};

// Array utilities
export const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const groupBy = (array, key) => {
  return array.reduce((groups, item) => {
    const group = item[key];
    groups[group] = groups[group] || [];
    groups[group].push(item);
    return groups;
  }, {});
};

// String utilities
export const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const truncate = (str, length = 100) => {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
};

export const slugify = (str) => {
  return str
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
};

// Storage utilities (for development/testing - not for production artifacts)
export const getFromStorage = (key, defaultValue = null) => {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const item = window.localStorage?.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
};

export const setToStorage = (key, value) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage?.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage errors
  }
};

// Color utilities
export const getAvatarColor = (name) => {
  const colors = [
    'bg-gradient-to-br from-pink-400 to-pink-600',
    'bg-gradient-to-br from-purple-400 to-purple-600',
    'bg-gradient-to-br from-blue-400 to-blue-600',
    'bg-gradient-to-br from-green-400 to-green-600',
    'bg-gradient-to-br from-yellow-400 to-yellow-600',
    'bg-gradient-to-br from-indigo-400 to-indigo-600',
    'bg-gradient-to-br from-red-400 to-red-600',
    'bg-gradient-to-br from-teal-400 to-teal-600',
  ];
  
  const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[index % colors.length];
};

export const getInitials = (name) => {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// URL utilities
export const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Debounce utility
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle utility
export const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Device detection utilities
export const isMobile = () => {
  return typeof window !== 'undefined' && window.innerWidth < 768;
};

export const isTablet = () => {
  return typeof window !== 'undefined' && window.innerWidth >= 768 && window.innerWidth < 1024;
};

export const isDesktop = () => {
  return typeof window !== 'undefined' && window.innerWidth >= 1024;
};

// Animation utilities
export const getRandomFloat = (min, max) => {
  return Math.random() * (max - min) + min;
};

export const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Error handling utilities
export const handleApiError = (error) => {
  console.error('API Error:', error);
  
  if (error.code === 'auth/user-not-found') {
    return 'No account found with this email address.';
  }
  
  if (error.code === 'auth/wrong-password') {
    return 'Incorrect password. Please try again.';
  }
  
  if (error.code === 'auth/email-already-in-use') {
    return 'An account with this email address already exists.';
  }
  
  if (error.code === 'auth/weak-password') {
    return 'Password should be at least 6 characters long.';
  }
  
  if (error.code === 'auth/invalid-email') {
    return 'Please enter a valid email address.';
  }
  
  return error.message || 'An unexpected error occurred. Please try again.';
};

export default {
  formatDate,
  formatTime,
  formatDateTime,
  validateEmail,
  validatePhone,
  validateName,
  validatePassword,
  formatCurrency,
  formatPhoneNumber,
  generateId,
  generateMeetingId,
  getTimeZone,
  convertToUserTimezone,
  shuffleArray,
  groupBy,
  capitalize,
  truncate,
  slugify,
  getFromStorage,
  setToStorage,
  getAvatarColor,
  getInitials,
  isValidUrl,
  debounce,
  throttle,
  isMobile,
  isTablet,
  isDesktop,
  getRandomFloat,
  getRandomInt,
  handleApiError
};
