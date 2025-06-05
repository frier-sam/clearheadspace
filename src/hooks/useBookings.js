import { useState, useEffect } from 'react';
import { 
  createDocument, 
  getDocuments, 
  updateDocument, 
  deleteDocument,
  sendBookingConfirmation 
} from '../services/firebase';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { format, parseISO, isAfter, isBefore, addHours } from 'date-fns';

export const useBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  // Load user's bookings
  const loadBookings = async () => {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      const bookingsSnapshot = await getDocuments('bookings', [
        { field: 'userId', operator: '==', value: currentUser.uid }
      ]);
      
      const bookingsData = bookingsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setBookings(bookingsData);
    } catch (error) {
      console.error('Error loading bookings:', error);
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  // Create new booking
  const createBooking = async (bookingData) => {
    try {
      const booking = {
        userId: currentUser.uid,
        userEmail: currentUser.email,
        userName: bookingData.userName,
        therapistId: bookingData.therapistId,
        therapistName: bookingData.therapistName,
        therapistEmail: bookingData.therapistEmail,
        date: bookingData.date,
        time: bookingData.time,
        duration: bookingData.duration || 60, // Default 60 minutes
        type: bookingData.type, // 'therapy' or 'buddy'
        sessionType: bookingData.sessionType || 'video', // 'video', 'audio', 'chat'
        notes: bookingData.notes || '',
        status: 'confirmed',
        paymentStatus: bookingData.paymentStatus || 'pending',
        amount: bookingData.amount,
        timezone: bookingData.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
        reminderSent: false,
        meetingLink: '', // Will be populated by cloud function
        meetingPassword: '' // Will be populated by cloud function
      };

      const docRef = await createDocument('bookings', booking);
      
      // Send confirmation email
      try {
        await sendBookingConfirmation({
          bookingId: docRef.id,
          userEmail: currentUser.email,
          therapistEmail: bookingData.therapistEmail,
          bookingDetails: booking
        });
      } catch (emailError) {
        console.error('Error sending confirmation email:', emailError);
      }

      const newBooking = { id: docRef.id, ...booking };
      setBookings(prev => [...prev, newBooking]);
      
      toast.success('Booking confirmed! 🎉 Check your email for details.');
      return newBooking;
    } catch (error) {
      console.error('Error creating booking:', error);
      toast.error('Failed to create booking. Please try again.');
      throw error;
    }
  };

  // Update booking
  const updateBooking = async (bookingId, updates) => {
    try {
      await updateDocument('bookings', bookingId, updates);
      
      setBookings(prev => 
        prev.map(booking => 
          booking.id === bookingId 
            ? { ...booking, ...updates }
            : booking
        )
      );
      
      toast.success('Booking updated successfully! ✨');
    } catch (error) {
      console.error('Error updating booking:', error);
      toast.error('Failed to update booking');
      throw error;
    }
  };

  // Cancel booking
  const cancelBooking = async (bookingId, reason = '') => {
    try {
      const now = new Date();
      const booking = bookings.find(b => b.id === bookingId);
      
      if (!booking) {
        throw new Error('Booking not found');
      }

      const bookingDateTime = new Date(`${booking.date}T${booking.time}`);
      const hoursBefore = (bookingDateTime - now) / (1000 * 60 * 60);

      // Check if cancellation is within policy (e.g., 24 hours before)
      const cancellationPolicy = 24;
      const isWithinPolicy = hoursBefore >= cancellationPolicy;

      await updateDocument('bookings', bookingId, {
        status: 'cancelled',
        cancellationReason: reason,
        cancelledAt: new Date().toISOString(),
        cancelledBy: 'user',
        refundEligible: isWithinPolicy
      });
      
      setBookings(prev => 
        prev.map(b => 
          b.id === bookingId 
            ? { 
                ...b, 
                status: 'cancelled', 
                cancellationReason: reason,
                cancelledAt: new Date().toISOString(),
                cancelledBy: 'user',
                refundEligible: isWithinPolicy
              }
            : b
        )
      );
      
      if (isWithinPolicy) {
        toast.success('Booking cancelled. Refund will be processed within 3-5 business days.');
      } else {
        toast.success('Booking cancelled. No refund available due to short notice.');
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast.error('Failed to cancel booking');
      throw error;
    }
  };

  // Reschedule booking
  const rescheduleBooking = async (bookingId, newDate, newTime) => {
    try {
      const booking = bookings.find(b => b.id === bookingId);
      if (!booking) {
        throw new Error('Booking not found');
      }

      const now = new Date();
      const currentBookingDateTime = new Date(`${booking.date}T${booking.time}`);
      const hoursBefore = (currentBookingDateTime - now) / (1000 * 60 * 60);

      // Check if reschedule is allowed (e.g., 4 hours before)
      if (hoursBefore < 4) {
        throw new Error('Reschedule must be done at least 4 hours before the session');
      }

      await updateDocument('bookings', bookingId, {
        date: newDate,
        time: newTime,
        status: 'rescheduled',
        originalDate: booking.date,
        originalTime: booking.time,
        rescheduledAt: new Date().toISOString()
      });
      
      setBookings(prev => 
        prev.map(b => 
          b.id === bookingId 
            ? { 
                ...b, 
                date: newDate,
                time: newTime,
                status: 'rescheduled',
                originalDate: booking.date,
                originalTime: booking.time,
                rescheduledAt: new Date().toISOString()
              }
            : b
        )
      );
      
      toast.success('Session rescheduled successfully! 📅');
    } catch (error) {
      console.error('Error rescheduling booking:', error);
      toast.error(error.message || 'Failed to reschedule booking');
      throw error;
    }
  };

  // Get upcoming bookings
  const getUpcomingBookings = () => {
    const now = new Date();
    return bookings
      .filter(booking => {
        const bookingDateTime = new Date(`${booking.date}T${booking.time}`);
        return isAfter(bookingDateTime, now) && booking.status === 'confirmed';
      })
      .sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.time}`);
        const dateB = new Date(`${b.date}T${b.time}`);
        return dateA - dateB;
      });
  };

  // Get past bookings
  const getPastBookings = () => {
    const now = new Date();
    return bookings
      .filter(booking => {
        const bookingDateTime = new Date(`${booking.date}T${booking.time}`);
        return isBefore(bookingDateTime, now) || booking.status === 'completed';
      })
      .sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.time}`);
        const dateB = new Date(`${b.date}T${b.time}`);
        return dateB - dateA; // Most recent first
      });
  };

  useEffect(() => {
    if (currentUser) {
      loadBookings();
    }
  }, [currentUser]);

  return {
    bookings,
    loading,
    createBooking,
    updateBooking,
    cancelBooking,
    rescheduleBooking,
    getUpcomingBookings,
    getPastBookings,
    loadBookings
  };
};

export default useBookings;
