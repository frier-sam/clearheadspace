import { useState, useEffect } from 'react';
import { getDocuments, createDocument, defaultTherapists } from '../services/firebase';
import { format, addDays, parseISO, isToday, isTomorrow, isThisWeek } from 'date-fns';

export const useTherapists = () => {
  const [therapists, setTherapists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load therapists from Firestore
  const loadTherapists = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const therapistsSnapshot = await getDocuments('therapists', [
        { field: 'isActive', operator: '==', value: true }
      ]);
      
      let therapistsData = therapistsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // If no therapists exist, seed with default data
      if (therapistsData.length === 0) {
        console.log('No therapists found, seeding with default data...');
        await seedTherapists();
        therapistsData = defaultTherapists;
      }
      
      setTherapists(therapistsData);
    } catch (err) {
      console.error('Error loading therapists:', err);
      setError(err.message);
      
      // Fallback to default therapists if Firestore fails
      setTherapists(defaultTherapists);
    } finally {
      setLoading(false);
    }
  };

  // Seed default therapists into Firestore
  const seedTherapists = async () => {
    try {
      const seedPromises = defaultTherapists.map(therapist => 
        createDocument('therapists', therapist)
      );
      await Promise.all(seedPromises);
      console.log('Therapists seeded successfully');
    } catch (error) {
      console.error('Error seeding therapists:', error);
    }
  };

  // Get therapists by type
  const getTherapistsByType = (type) => {
    return therapists.filter(therapist => therapist.type === type);
  };

  // Get therapist by ID
  const getTherapistById = (id) => {
    return therapists.find(therapist => therapist.id === id);
  };

  // Get available slots for a therapist on a specific date
  const getAvailableSlots = (therapistId, date) => {
    const therapist = getTherapistById(therapistId);
    if (!therapist) return [];

    const dayOfWeek = format(parseISO(date), 'EEEE').toLowerCase();
    const availableSlots = therapist.availability[dayOfWeek] || [];
    
    // Filter out past slots if it's today
    if (isToday(parseISO(date))) {
      const currentHour = new Date().getHours();
      return availableSlots.filter(slot => {
        const slotHour = parseInt(slot.split(':')[0]);
        return slotHour > currentHour;
      });
    }
    
    return availableSlots;
  };

  // Check if a therapist is available at a specific date and time
  const isTherapistAvailable = (therapistId, date, time) => {
    const availableSlots = getAvailableSlots(therapistId, date);
    return availableSlots.includes(time);
  };

  // Get therapists available on a specific date
  const getAvailableTherapists = (date, type = null) => {
    return therapists.filter(therapist => {
      if (type && therapist.type !== type) return false;
      
      const availableSlots = getAvailableSlots(therapist.id, date);
      return availableSlots.length > 0;
    });
  };

  // Search therapists by name or specialty
  const searchTherapists = (query, type = null) => {
    const lowerQuery = query.toLowerCase();
    
    return therapists.filter(therapist => {
      if (type && therapist.type !== type) return false;
      
      const matchesName = therapist.name.toLowerCase().includes(lowerQuery);
      const matchesSpecialty = therapist.specialties.some(specialty => 
        specialty.toLowerCase().includes(lowerQuery)
      );
      const matchesTitle = therapist.title.toLowerCase().includes(lowerQuery);
      
      return matchesName || matchesSpecialty || matchesTitle;
    });
  };

  // Get recommended therapists based on user preferences
  const getRecommendedTherapists = (userPreferences = []) => {
    if (userPreferences.length === 0) {
      return therapists.slice(0, 4); // Return top 4 therapists
    }

    const scored = therapists.map(therapist => {
      let score = 0;
      
      // Score based on specialty match
      therapist.specialties.forEach(specialty => {
        if (userPreferences.some(pref => 
          specialty.toLowerCase().includes(pref.toLowerCase()) ||
          pref.toLowerCase().includes(specialty.toLowerCase())
        )) {
          score += 10;
        }
      });
      
      // Bonus for higher ratings
      score += therapist.rating * 2;
      
      return { ...therapist, score };
    });

    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, 6); // Return top 6 recommended
  };

  // Get next available appointment for a therapist
  const getNextAvailableAppointment = (therapistId) => {
    const therapist = getTherapistById(therapistId);
    if (!therapist) return null;

    const today = new Date();
    
    // Check next 14 days for availability
    for (let i = 0; i < 14; i++) {
      const checkDate = addDays(today, i);
      const dateString = format(checkDate, 'yyyy-MM-dd');
      const availableSlots = getAvailableSlots(therapistId, dateString);
      
      if (availableSlots.length > 0) {
        return {
          date: dateString,
          time: availableSlots[0],
          dateFormatted: format(checkDate, 'EEEE, MMMM d'),
          timeFormatted: format(new Date(`2000-01-01T${availableSlots[0]}`), 'h:mm a')
        };
      }
    }
    
    return null; // No availability in next 14 days
  };

  // Get therapist statistics
  const getTherapistStats = (therapistId) => {
    const therapist = getTherapistById(therapistId);
    if (!therapist) return null;

    const today = new Date();
    const totalSlotsThisWeek = Object.keys(therapist.availability)
      .reduce((total, day) => total + therapist.availability[day].length, 0);

    return {
      rating: therapist.rating,
      hourlyRate: therapist.hourlyRate,
      specialties: therapist.specialties,
      totalSlotsThisWeek,
      nextAvailable: getNextAvailableAppointment(therapistId)
    };
  };

  useEffect(() => {
    loadTherapists();
  }, []);

  return {
    therapists,
    loading,
    error,
    getTherapistsByType,
    getTherapistById,
    getAvailableSlots,
    isTherapistAvailable,
    getAvailableTherapists,
    searchTherapists,
    getRecommendedTherapists,
    getNextAvailableAppointment,
    getTherapistStats,
    loadTherapists
  };
};

export default useTherapists;
