import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  HeartIcon, 
  ShieldCheckIcon, 
  ClockIcon, 
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  SparklesIcon,
  StarIcon,
  PhoneIcon
} from '@heroicons/react/24/outline';

const LandingPage = () => {
  const [mounted, setMounted] = useState(false);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, -50]);
  const y2 = useTransform(scrollY, [0, 300], [0, -100]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const features = [
    {
      icon: HeartIcon,
      title: 'Compassionate Care',
      description: 'Connect with licensed therapists and caring buddies who truly understand your journey.',
      color: 'from-pink-400 to-rose-400'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Safe & Secure',
      description: 'Your privacy is our priority. All conversations are confidential and secure.',
      color: 'from-blue-400 to-cyan-400'
    },
    {
      icon: ClockIcon,
      title: 'Flexible Scheduling',
      description: 'Book sessions that fit your schedule, from early morning to late evening.',
      color: 'from-purple-400 to-violet-400'
    },
    {
      icon: UserGroupIcon,
      title: 'Diverse Specialists',
      description: 'Choose from therapists and peer support specialists with various backgrounds.',
      color: 'from-green-400 to-emerald-400'
    },
    {
      icon: ChatBubbleLeftRightIcon,
      title: 'Multiple Formats',
      description: 'Video calls, voice calls, or text chat - communicate in the way that feels right.',
      color: 'from-yellow-400 to-orange-400'
    },
    {
      icon: SparklesIcon,
      title: 'Personalized Matching',
      description: 'Our smart system helps match you with the perfect therapist or buddy.',
      color: 'from-indigo-400 to-purple-400'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah M.',
      rating: 5,
      text: 'ClearHeadSpace gave me the courage to start my healing journey. The therapists are amazing!',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b1ab?w=100&h=100&fit=crop&crop=face'
    },
    {
      name: 'Michael R.',
      rating: 5,
      text: 'Having a supportive buddy to talk to whenever I need has been life-changing. Highly recommend!',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
    },
    {
      name: 'Emma L.',
      rating: 5,
      text: 'The flexibility and ease of booking sessions fits perfectly with my busy schedule.',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
    }
  ];

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 relative overflow-hidden">
      {/* Navigation */}
      <nav className="relative z-50 px-6 py-4 bg-white/80 backdrop-blur-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center space-x-2"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
              <HeartIcon className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold font-display bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              ClearHeadSpace
            </span>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex items-center space-x-4"
          >
            <Link
              to="/signin"
              className="px-4 py-2 text-gray-700 hover:text-primary-600 transition-colors font-medium"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="btn btn-primary px-6 py-3"
            >
              Get Started
            </Link>
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-6 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <h1 className="text-4xl lg:text-6xl font-bold font-display leading-tight">
                Your{' '}
                <span className="bg-gradient-to-r from-primary-600 via-secondary-500 to-accent-500 bg-clip-text text-transparent">
                  Safe Space
                </span>{' '}
                for Healing & Growth
              </h1>
              
              <p className="text-lg lg:text-xl text-gray-600 leading-relaxed">
                Connect with compassionate therapists and supportive buddies in a judgment-free environment. 
                Your mental wellness journey starts here.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/signup"
                  className="btn btn-primary text-lg px-8 py-4 inline-flex items-center justify-center"
                >
                  <SparklesIcon className="w-5 h-5 mr-2" />
                  Start Your Journey
                </Link>
                <Link
                  to="/therapists"
                  className="btn btn-outline text-lg px-8 py-4 inline-flex items-center justify-center"
                >
                  <UserGroupIcon className="w-5 h-5 mr-2" />
                  Meet Our Team
                </Link>
              </div>

              <div className="flex items-center space-x-8 pt-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-600">1000+</div>
                  <div className="text-sm text-gray-500">Happy Users</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-secondary-600">24/7</div>
                  <div className="text-sm text-gray-500">Support Available</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent-600">4.9★</div>
                  <div className="text-sm text-gray-500">Average Rating</div>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              style={{ y: y1 }}
              className="relative"
            >
              <div className="relative z-10 bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-rose-400 rounded-full flex items-center justify-center">
                      <HeartIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Dr. Sarah Johnson</h3>
                      <p className="text-sm text-gray-500">Licensed Clinical Psychologist</p>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl p-4">
                    <p className="text-gray-700 italic">
                      "Ready to support you on your journey to better mental health. Let's talk!"
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <StarIcon key={star} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">Available Now</span>
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <motion.div
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 5, 0]
                }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -top-6 -right-6 w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full opacity-20"
              />
              <motion.div
                animate={{ 
                  y: [0, 15, 0],
                  rotate: [0, -8, 0]
                }}
                transition={{ duration: 5, repeat: Infinity, delay: 1 }}
                className="absolute -bottom-4 -left-4 w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full opacity-20"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 px-6 py-20 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-5xl font-bold font-display mb-6">
              Why Choose{' '}
              <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                ClearHeadSpace?
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We've created a platform that prioritizes your comfort, privacy, and personal growth
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className="card group hover:shadow-2xl"
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-5xl font-bold font-display mb-6">
              Trusted by{' '}
              <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                Thousands
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Real stories from real people who found their path to better mental health
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="card"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-800">{testimonial.name}</h4>
                    <div className="flex space-x-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <StarIcon key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 italic leading-relaxed">"{testimonial.text}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 py-20 bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center text-white"
        >
          <h2 className="text-3xl lg:text-5xl font-bold font-display mb-6">
            Ready to Begin Your Journey?
          </h2>
          <p className="text-lg lg:text-xl mb-8 opacity-90">
            Join thousands who have found their path to better mental health. Your transformation starts today.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="bg-white text-primary-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-50 transition-colors inline-flex items-center justify-center"
            >
              <SparklesIcon className="w-5 h-5 mr-2" />
              Get Started Free
            </Link>
            <a
              href="tel:+1-800-CLEAR-HS"
              className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-primary-600 transition-colors inline-flex items-center justify-center"
            >
              <PhoneIcon className="w-5 h-5 mr-2" />
              Call Now: 1-800-CLEAR-HS
            </a>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-12 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
              <HeartIcon className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold font-display">ClearHeadSpace</span>
          </div>
          <p className="text-gray-400 mb-4">
            Your safe space for mental wellness and growth
          </p>
          <p className="text-sm text-gray-500">
            © 2024 ClearHeadSpace. All rights reserved. | Privacy Policy | Terms of Service
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
