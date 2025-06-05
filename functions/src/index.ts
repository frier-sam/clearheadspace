import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as nodemailer from 'nodemailer';
import * as express from 'express';
import * as cors from 'cors';
import * as helmet from 'helmet';
import { v4 as uuidv4 } from 'uuid';

// Initialize Firebase Admin
admin.initializeApp();
const db = admin.firestore();

// Email transporter configuration
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: functions.config().email?.user || process.env.EMAIL_USER,
    pass: functions.config().email?.password || process.env.EMAIL_PASSWORD
  }
});

// Express app setup
const app = express();
app.use(helmet());
app.use(cors({ origin: true }));
app.use(express.json());

// Email Templates
const emailTemplates = {
  bookingConfirmation: (data: any) => ({
    subject: `Session Confirmed - ${data.therapistName}`,
    html: `
      <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #4F46E5; margin: 0;">ClearHeadSpace</h1>
          <p style="color: #6B7280; margin: 5px 0;">Your Safe Space for Mental Wellness</p>
        </div>
        
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 16px; text-align: center; margin-bottom: 30px;">
          <h2 style="margin: 0 0 10px 0;">Session Confirmed! 🎉</h2>
          <p style="margin: 0; opacity: 0.9;">Your session has been successfully booked</p>
        </div>
        
        <div style="background: #F9FAFB; padding: 25px; border-radius: 12px; margin-bottom: 25px;">
          <h3 style="margin: 0 0 20px 0; color: #374151;">Session Details</h3>
          <div style="display: grid; gap: 15px;">
            <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #E5E7EB;">
              <span style="color: #6B7280;">Therapist:</span>
              <span style="color: #374151; font-weight: 500;">${data.therapistName}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #E5E7EB;">
              <span style="color: #6B7280;">Date:</span>
              <span style="color: #374151; font-weight: 500;">${new Date(data.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #E5E7EB;">
              <span style="color: #6B7280;">Time:</span>
              <span style="color: #374151; font-weight: 500;">${data.time}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #E5E7EB;">
              <span style="color: #6B7280;">Duration:</span>
              <span style="color: #374151; font-weight: 500;">${data.duration} minutes</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #E5E7EB;">
              <span style="color: #6B7280;">Session Type:</span>
              <span style="color: #374151; font-weight: 500; text-transform: capitalize;">${data.sessionType}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 10px 0;">
              <span style="color: #6B7280;">Amount:</span>
              <span style="color: #059669; font-weight: 600;">$${data.amount}</span>
            </div>
          </div>
        </div>
        
        <div style="background: #EFF6FF; border: 1px solid #DBEAFE; padding: 20px; border-radius: 12px; margin-bottom: 25px;">
          <h4 style="margin: 0 0 10px 0; color: #1E40AF;">How to Join Your Session</h4>
          <p style="margin: 0 0 15px 0; color: #1E40AF;">You'll receive a meeting link 15 minutes before your session starts. You can also join directly from your ClearHeadSpace dashboard.</p>
          <a href="${process.env.FRONTEND_URL}/bookings" style="display: inline-block; background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 500;">View My Sessions</a>
        </div>
        
        <div style="background: #FEF3C7; border: 1px solid #FCD34D; padding: 20px; border-radius: 12px; margin-bottom: 25px;">
          <h4 style="margin: 0 0 10px 0; color: #92400E;">Cancellation Policy</h4>
          <p style="margin: 0; color: #92400E; font-size: 14px;">Sessions can be cancelled or rescheduled up to 24 hours in advance for a full refund. Cancellations within 24 hours are subject to a 50% fee.</p>
        </div>
        
        <div style="text-align: center; padding: 20px 0; border-top: 1px solid #E5E7EB;">
          <p style="color: #6B7280; margin: 0 0 10px 0;">Need help or have questions?</p>
          <a href="mailto:support@clearheadspace.com" style="color: #4F46E5; text-decoration: none;">support@clearheadspace.com</a>
        </div>
      </div>
    `
  }),
  
  bookingReminder: (data: any) => ({
    subject: `Session Reminder - Tomorrow at ${data.time}`,
    html: `
      <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #4F46E5; margin: 0;">ClearHeadSpace</h1>
        </div>
        
        <div style="background: #FEF3C7; border: 1px solid #FCD34D; padding: 25px; border-radius: 12px; text-align: center; margin-bottom: 25px;">
          <h2 style="margin: 0 0 10px 0; color: #92400E;">Session Reminder ⏰</h2>
          <p style="margin: 0; color: #92400E;">Your session with ${data.therapistName} is tomorrow</p>
        </div>
        
        <div style="background: #F9FAFB; padding: 25px; border-radius: 12px; margin-bottom: 25px;">
          <h3 style="margin: 0 0 15px 0; color: #374151;">Session Details</h3>
          <p style="margin: 5px 0; color: #6B7280;"><strong>Date:</strong> ${new Date(data.date).toLocaleDateString()}</p>
          <p style="margin: 5px 0; color: #6B7280;"><strong>Time:</strong> ${data.time}</p>
          <p style="margin: 5px 0; color: #6B7280;"><strong>Duration:</strong> ${data.duration} minutes</p>
        </div>
        
        <div style="text-align: center;">
          <a href="${process.env.FRONTEND_URL}/call/${data.bookingId}" style="display: inline-block; background: #10B981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 500; margin-bottom: 15px;">Join Session</a>
          <br>
          <a href="${process.env.FRONTEND_URL}/bookings" style="color: #4F46E5; text-decoration: none;">Manage My Sessions</a>
        </div>
      </div>
    `
  }),

  welcomeEmail: (data: any) => ({
    subject: 'Welcome to ClearHeadSpace! 🌟',
    html: `
      <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #4F46E5; margin: 0;">Welcome to ClearHeadSpace!</h1>
          <p style="color: #6B7280; margin: 5px 0;">Your journey to better mental health starts here</p>
        </div>
        
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 16px; text-align: center; margin-bottom: 30px;">
          <h2 style="margin: 0 0 10px 0;">Welcome, ${data.firstName}! 👋</h2>
          <p style="margin: 0; opacity: 0.9;">We're so glad you're here. Your mental wellness journey is important to us.</p>
        </div>
        
        <div style="margin-bottom: 30px;">
          <h3 style="color: #374151; margin-bottom: 15px;">What's Next?</h3>
          <div style="display: grid; gap: 15px;">
            <div style="display: flex; align-items: start; gap: 15px; padding: 15px; background: #F9FAFB; border-radius: 8px;">
              <div style="background: #4F46E5; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; flex-shrink: 0;">1</div>
              <div>
                <h4 style="margin: 0 0 5px 0; color: #374151;">Complete Your Profile</h4>
                <p style="margin: 0; color: #6B7280; font-size: 14px;">Help us understand your needs better</p>
              </div>
            </div>
            <div style="display: flex; align-items: start; gap: 15px; padding: 15px; background: #F9FAFB; border-radius: 8px;">
              <div style="background: #10B981; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; flex-shrink: 0;">2</div>
              <div>
                <h4 style="margin: 0 0 5px 0; color: #374151;">Browse Our Therapists</h4>
                <p style="margin: 0; color: #6B7280; font-size: 14px;">Find the perfect match for your needs</p>
              </div>
            </div>
            <div style="display: flex; align-items: start; gap: 15px; padding: 15px; background: #F9FAFB; border-radius: 8px;">
              <div style="background: #F59E0B; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; flex-shrink: 0;">3</div>
              <div>
                <h4 style="margin: 0 0 5px 0; color: #374151;">Book Your First Session</h4>
                <p style="margin: 0; color: #6B7280; font-size: 14px;">Take the first step towards wellness</p>
              </div>
            </div>
          </div>
        </div>
        
        <div style="text-align: center; margin-bottom: 30px;">
          <a href="${process.env.FRONTEND_URL}/dashboard" style="display: inline-block; background: #4F46E5; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 500;">Go to Dashboard</a>
        </div>
        
        <div style="background: #EFF6FF; border: 1px solid #DBEAFE; padding: 20px; border-radius: 12px; margin-bottom: 25px;">
          <h4 style="margin: 0 0 10px 0; color: #1E40AF;">Need Immediate Support?</h4>
          <p style="margin: 0 0 10px 0; color: #1E40AF;">If you're in crisis, please reach out immediately:</p>
          <p style="margin: 0; color: #1E40AF;">• Call 988 (Suicide & Crisis Lifeline)</p>
          <p style="margin: 0; color: #1E40AF;">• Text HOME to 741741 (Crisis Text Line)</p>
        </div>
        
        <div style="text-align: center; padding: 20px 0; border-top: 1px solid #E5E7EB;">
          <p style="color: #6B7280; margin: 0;">Questions? We're here to help!</p>
          <a href="mailto:support@clearheadspace.com" style="color: #4F46E5; text-decoration: none;">support@clearheadspace.com</a>
        </div>
      </div>
    `
  })
};

// Utility Functions
const sendEmail = async (to: string, template: any, data: any) => {
  const emailContent = template(data);
  
  const mailOptions = {
    from: '"ClearHeadSpace" <noreply@clearheadspace.com>',
    to: to,
    subject: emailContent.subject,
    html: emailContent.html
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${to}`);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

const generateMeetingLink = (bookingId: string): string => {
  // In a real implementation, integrate with video conferencing service
  // For now, we'll use our internal video call route
  return `${process.env.FRONTEND_URL}/call/${bookingId}`;
};

// Cloud Functions

// Send booking confirmation email
export const sendBookingConfirmation = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  try {
    const { bookingId, userEmail, therapistEmail, bookingDetails } = data;

    // Generate meeting link
    const meetingLink = generateMeetingLink(bookingId);
    
    // Update booking with meeting link
    await db.collection('bookings').doc(bookingId).update({
      meetingLink: meetingLink,
      meetingPassword: uuidv4().substring(0, 8).toUpperCase()
    });

    // Send confirmation email to user
    await sendEmail(userEmail, emailTemplates.bookingConfirmation, {
      ...bookingDetails,
      meetingLink
    });

    // Send notification to therapist
    await sendEmail(therapistEmail, emailTemplates.bookingConfirmation, {
      ...bookingDetails,
      meetingLink,
      isTherapistEmail: true
    });

    return { success: true, meetingLink };
  } catch (error) {
    console.error('Error sending booking confirmation:', error);
    throw new functions.https.HttpsError('internal', 'Failed to send confirmation');
  }
});

// Send booking reminder
export const sendBookingReminder = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  try {
    const { bookingId, userEmail, bookingDetails } = data;
    
    await sendEmail(userEmail, emailTemplates.bookingReminder, {
      ...bookingDetails,
      bookingId
    });

    return { success: true };
  } catch (error) {
    console.error('Error sending booking reminder:', error);
    throw new functions.https.HttpsError('internal', 'Failed to send reminder');
  }
});

// Automated reminder system (runs daily)
export const sendDailyReminders = functions.pubsub.schedule('0 9 * * *').onRun(async (context) => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  const bookingsSnapshot = await db.collection('bookings')
    .where('date', '==', tomorrowStr)
    .where('status', '==', 'confirmed')
    .where('reminderSent', '==', false)
    .get();

  const reminderPromises = bookingsSnapshot.docs.map(async (doc) => {
    const booking = doc.data();
    
    try {
      await sendEmail(booking.userEmail, emailTemplates.bookingReminder, {
        ...booking,
        bookingId: doc.id
      });

      // Mark reminder as sent
      await doc.ref.update({ reminderSent: true });
      
      console.log(`Reminder sent for booking ${doc.id}`);
    } catch (error) {
      console.error(`Failed to send reminder for booking ${doc.id}:`, error);
    }
  });

  await Promise.all(reminderPromises);
  console.log(`Processed ${bookingsSnapshot.docs.length} reminder emails`);
  return null;
});

// Send welcome email when user signs up
export const sendWelcomeEmail = functions.auth.user().onCreate(async (user) => {
  try {
    // Get user profile data
    const userDoc = await db.collection('users').doc(user.uid).get();
    const userData = userDoc.data() || {};

    await sendEmail(user.email!, emailTemplates.welcomeEmail, {
      firstName: userData.firstName || user.displayName?.split(' ')[0] || 'there',
      email: user.email
    });

    console.log(`Welcome email sent to ${user.email}`);
  } catch (error) {
    console.error('Error sending welcome email:', error);
  }
});

// Clean up user data when account is deleted
export const cleanupUserData = functions.auth.user().onDelete(async (user) => {
  const batch = db.batch();

  try {
    // Delete user profile
    batch.delete(db.collection('users').doc(user.uid));

    // Cancel and clean up bookings
    const bookingsSnapshot = await db.collection('bookings')
      .where('userId', '==', user.uid)
      .where('status', '==', 'confirmed')
      .get();

    bookingsSnapshot.docs.forEach(doc => {
      batch.update(doc.ref, { 
        status: 'cancelled',
        cancellationReason: 'Account deleted',
        cancelledAt: admin.firestore.FieldValue.serverTimestamp()
      });
    });

    // Delete user conversations
    const conversationsSnapshot = await db.collection('conversations')
      .where('participants', 'array-contains', user.uid)
      .get();

    conversationsSnapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });

    await batch.commit();
    console.log(`Cleaned up data for user ${user.uid}`);
  } catch (error) {
    console.error('Error cleaning up user data:', error);
  }
});

// Create Stripe payment intent (if using Stripe)
export const createStripePaymentIntent = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  // This would integrate with Stripe
  // For now, we'll just return success for demo purposes
  const { amount, currency = 'usd' } = data;

  return {
    clientSecret: 'demo_client_secret',
    amount: amount,
    currency: currency
  };
});

// Analytics and reporting
export const generateWeeklyReport = functions.pubsub.schedule('0 9 * * 1').onRun(async (context) => {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const bookingsSnapshot = await db.collection('bookings')
    .where('createdAt', '>=', oneWeekAgo)
    .get();

  const completedBookings = bookingsSnapshot.docs.filter(doc => 
    doc.data().status === 'completed'
  );

  const totalRevenue = completedBookings.reduce((sum, doc) => 
    sum + (doc.data().amount || 0), 0
  );

  const analyticsData = {
    week: oneWeekAgo.toISOString().split('T')[0],
    totalBookings: bookingsSnapshot.docs.length,
    completedBookings: completedBookings.length,
    totalRevenue: totalRevenue,
    averageSessionValue: completedBookings.length > 0 ? totalRevenue / completedBookings.length : 0,
    generatedAt: admin.firestore.FieldValue.serverTimestamp()
  };

  await db.collection('analytics').add(analyticsData);
  console.log('Weekly report generated:', analyticsData);
  return null;
});

// Express API endpoints
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.post('/webhook/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  // Handle Stripe webhooks
  console.log('Stripe webhook received');
  res.json({ received: true });
});

// Export the Express app as a Cloud Function
export const api = functions.https.onRequest(app);

// Firestore triggers
export const onBookingCreated = functions.firestore
  .document('bookings/{bookingId}')
  .onCreate(async (snap, context) => {
    const booking = snap.data();
    
    // Log booking creation
    console.log(`New booking created: ${context.params.bookingId}`);
    
    // Update therapist's booking count
    const therapistRef = db.collection('therapists').doc(booking.therapistId);
    await therapistRef.update({
      totalBookings: admin.firestore.FieldValue.increment(1)
    });
    
    return null;
  });

export const onBookingCompleted = functions.firestore
  .document('bookings/{bookingId}')
  .onUpdate(async (change, context) => {
    const beforeData = change.before.data();
    const afterData = change.after.data();
    
    // Check if booking was just completed
    if (beforeData.status !== 'completed' && afterData.status === 'completed') {
      console.log(`Booking completed: ${context.params.bookingId}`);
      
      // Update therapist statistics
      const therapistRef = db.collection('therapists').doc(afterData.therapistId);
      await therapistRef.update({
        completedSessions: admin.firestore.FieldValue.increment(1),
        totalRevenue: admin.firestore.FieldValue.increment(afterData.amount || 0)
      });
    }
    
    return null;
  });
