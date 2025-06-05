import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  StarIcon,
  ClockIcon,
  MapPinIcon,
  HeartIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  VideoCameraIcon,
  PhoneIcon,
  CalendarIcon,
  ArrowLeftIcon,
  XMarkIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import { useTherapists } from '../hooks/useTherapists';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from './LoadingSpinner';
import { formatCurrency, debounce } from '../utils/helpers';

const TherapistSelection = () => {
  const { currentUser } = useAuth();
  const { 
    therapists, 
    loading, 
    searchTherapists, 
    getTherapistsByType,
    getNextAvailableAppointment 
  } = useTherapists();
  
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [filteredTherapists, setFilteredTherapists] = useState([]);
  const [sortBy, setSortBy] = useState('rating');
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [selectedSpecialties, setSelectedSpecialties] = useState([]);
  const [availabilityFilter, setAvailabilityFilter] = useState('any');

  const therapistTypes = [
    { id: 'all', name: 'All', icon: UserGroupIcon },
    { id: 'therapist', name: 'Licensed Therapists', icon: HeartIcon },
    { id: 'buddy', name: 'Support Buddies', icon: ChatBubbleLeftRightIcon }
  ];

  const allSpecialties = [
    'Anxiety', 'Depression', 'Relationships', 'Stress Management',
    'Life Transitions', 'Mindfulness', 'Goal Setting', 'Motivation',
    'Self-Care', 'Couples Therapy', 'Family Dynamics', 'Communication'
  ];

  const sortOptions = [
    { id: 'rating', name: 'Highest Rated' },
    { id: 'price-low', name: 'Price: Low to High' },
    { id: 'price-high', name: 'Price: High to Low' },
    { id: 'availability', name: 'Soonest Available' }
  ];

  // Debounced search function
  const debouncedSearch = debounce((term) => {
    if (term) {
      const searchResults = searchTherapists(term, selectedType === 'all' ? null : selectedType);
      setFilteredTherapists(searchResults);
    } else {
      filterAndSortTherapists();
    }
  }, 300);

  useEffect(() => {
    if (searchTerm) {
      debouncedSearch(searchTerm);
    } else {
      filterAndSortTherapists();
    }
  }, [searchTerm, selectedType, sortBy, priceRange, selectedSpecialties, availabilityFilter, therapists]);

  const filterAndSortTherapists = () => {
    let filtered = selectedType === 'all' 
      ? therapists 
      : getTherapistsByType(selectedType);

    // Apply price filter
    filtered = filtered.filter(therapist => 
      therapist.hourlyRate >= priceRange[0] && therapist.hourlyRate <= priceRange[1]
    );

    // Apply specialty filter
    if (selectedSpecialties.length > 0) {
      filtered = filtered.filter(therapist =>
        therapist.specialties.some(specialty =>
          selectedSpecialties.includes(specialty)
        )
      );
    }

    // Apply availability filter
    if (availabilityFilter === 'today') {
      const today = new Date().toISOString().split('T')[0];
      filtered = filtered.filter(therapist => {
        const nextAvailable = getNextAvailableAppointment(therapist.id);
        return nextAvailable && nextAvailable.date === today;
      });
    } else if (availabilityFilter === 'week') {
      filtered = filtered.filter(therapist => {
        const nextAvailable = getNextAvailableAppointment(therapist.id);
        if (!nextAvailable) return false;
        const appointmentDate = new Date(nextAvailable.date);
        const weekFromNow = new Date();
        weekFromNow.setDate(weekFromNow.getDate() + 7);
        return appointmentDate <= weekFromNow;
      });
    }

    // Sort therapists
    switch (sortBy) {
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'price-low':
        filtered.sort((a, b) => a.hourlyRate - b.hourlyRate);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.hourlyRate - a.hourlyRate);
        break;
      case 'availability':
        filtered.sort((a, b) => {
          const nextA = getNextAvailableAppointment(a.id);
          const nextB = getNextAvailableAppointment(b.id);
          if (!nextA && !nextB) return 0;
          if (!nextA) return 1;
          if (!nextB) return -1;
          return new Date(nextA.date) - new Date(nextB.date);
        });
        break;
      default:
        break;
    }

    setFilteredTherapists(filtered);
  };

  const toggleSpecialty = (specialty) => {
    setSelectedSpecialties(prev =>
      prev.includes(specialty)
        ? prev.filter(s => s !== specialty)
        : [...prev, specialty]
    );
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedType('all');
    setSortBy('rating');
    setPriceRange([0, 200]);
    setSelectedSpecialties([]);
    setAvailabilityFilter('any');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" message="Finding your perfect match..." />
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
                <h1 className="text-xl font-bold text-gray-800">Find Your Support</h1>
                <p className="text-sm text-gray-600">Connect with caring professionals</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`btn ${showFilters ? 'btn-primary' : 'btn-outline'} flex items-center`}
              >
                <FunnelIcon className="w-5 h-5 mr-2" />
                Filters
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          {/* Search Bar */}
          <div className="relative mb-6">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, specialty, or approach..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all text-lg"
            />
          </div>

          {/* Type Tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            {therapistTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`flex items-center px-6 py-3 rounded-full font-medium transition-all ${
                  selectedType === type.id
                    ? 'bg-primary-500 text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                <type.icon className="w-5 h-5 mr-2" />
                {type.name}
              </button>
            ))}
          </div>

          {/* Sort Options */}
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-sm font-medium text-gray-600">Sort by:</span>
            {sortOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setSortBy(option.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  sortBy === option.id
                    ? 'bg-secondary-100 text-secondary-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {option.name}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="card mb-8 overflow-hidden"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  Clear All
                </button>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Price Range: {formatCurrency(priceRange[0])} - {formatCurrency(priceRange[1])}
                  </label>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                      className="w-full"
                    />
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Availability */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Availability
                  </label>
                  <div className="space-y-2">
                    {[
                      { id: 'any', name: 'Any time' },
                      { id: 'today', name: 'Available today' },
                      { id: 'week', name: 'This week' }
                    ].map((option) => (
                      <label key={option.id} className="flex items-center">
                        <input
                          type="radio"
                          name="availability"
                          value={option.id}
                          checked={availabilityFilter === option.id}
                          onChange={(e) => setAvailabilityFilter(e.target.value)}
                          className="mr-3 text-primary-600"
                        />
                        {option.name}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Specialties */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Specialties
                  </label>
                  <div className="max-h-32 overflow-y-auto space-y-2">
                    {allSpecialties.map((specialty) => (
                      <label key={specialty} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedSpecialties.includes(specialty)}
                          onChange={() => toggleSpecialty(specialty)}
                          className="mr-3 text-primary-600 rounded"
                        />
                        <span className="text-sm">{specialty}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              {filteredTherapists.length} {filteredTherapists.length === 1 ? 'match' : 'matches'} found
            </h2>
          </div>

          {filteredTherapists.length > 0 ? (
            <div className="grid gap-6">
              {filteredTherapists.map((therapist, index) => (
                <motion.div
                  key={therapist.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="card hover:shadow-2xl transition-all duration-300 cursor-pointer group"
                  onClick={() => navigate(`/book/${therapist.id}`)}
                >
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Profile Image */}
                    <div className="flex-shrink-0">
                      <img
                        src={therapist.image}
                        alt={therapist.name}
                        className="w-32 h-32 rounded-2xl object-cover mx-auto lg:mx-0"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 space-y-4">
                      {/* Header */}
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-800 mb-1">
                            {therapist.name}
                          </h3>
                          <p className="text-gray-600 mb-2">{therapist.title}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center">
                              <StarIcon className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                              <span className="font-medium">{therapist.rating}</span>
                            </div>
                            <div className="flex items-center">
                              <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                              <span className="capitalize">{therapist.type}</span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-2xl font-bold text-primary-600 mb-1">
                            {formatCurrency(therapist.hourlyRate)}
                          </div>
                          <div className="text-sm text-gray-500">per session</div>
                        </div>
                      </div>

                      {/* Bio */}
                      <p className="text-gray-700 leading-relaxed">
                        {therapist.bio}
                      </p>

                      {/* Specialties */}
                      <div>
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

                      {/* Availability and Actions */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center text-sm text-gray-600">
                          <CalendarIcon className="w-4 h-4 mr-2" />
                          {(() => {
                            const nextAvailable = getNextAvailableAppointment(therapist.id);
                            return nextAvailable 
                              ? `Next available: ${nextAvailable.dateFormatted} at ${nextAvailable.timeFormatted}`
                              : 'Contact for availability';
                          })()}
                        </div>

                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-1 text-gray-400">
                            <VideoCameraIcon className="w-5 h-5" />
                            <PhoneIcon className="w-5 h-5" />
                            <ChatBubbleLeftRightIcon className="w-5 h-5" />
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/book/${therapist.id}`);
                            }}
                            className="btn btn-primary group-hover:shadow-lg"
                          >
                            Book Session
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-16"
            >
              <UserGroupIcon className="w-24 h-24 text-gray-300 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-gray-600 mb-4">
                No matches found
              </h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                Try adjusting your search criteria or filters to find the perfect match for your needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={clearFilters}
                  className="btn btn-outline"
                >
                  Clear Filters
                </button>
                <button
                  onClick={() => setSearchTerm('')}
                  className="btn btn-primary"
                >
                  View All Providers
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default TherapistSelection;
