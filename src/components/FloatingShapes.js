import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const FloatingShapes = () => {
  const [shapes, setShapes] = useState([]);

  useEffect(() => {
    const generateShapes = () => {
      const newShapes = [];
      const shapeCount = window.innerWidth < 768 ? 8 : 15; // Fewer shapes on mobile
      
      for (let i = 0; i < shapeCount; i++) {
        newShapes.push({
          id: i,
          size: Math.random() * 80 + 20, // 20-100px
          x: Math.random() * 100, // 0-100%
          y: Math.random() * 100, // 0-100%
          color: [
            'rgba(255, 107, 157, 0.1)', // Pink
            'rgba(78, 205, 196, 0.1)', // Teal
            'rgba(69, 183, 209, 0.1)', // Blue
            'rgba(249, 202, 36, 0.1)', // Yellow
            'rgba(108, 92, 231, 0.1)', // Purple
            'rgba(253, 121, 168, 0.1)', // Light Pink
            'rgba(253, 203, 110, 0.1)', // Light Orange
            'rgba(0, 184, 148, 0.1)', // Green
          ][Math.floor(Math.random() * 8)],
          duration: Math.random() * 20 + 20, // 20-40 seconds
          delay: Math.random() * 20, // 0-20 seconds delay
          shape: ['circle', 'square', 'triangle', 'hexagon'][Math.floor(Math.random() * 4)],
        });
      }
      setShapes(newShapes);
    };

    generateShapes();
    
    // Regenerate on window resize
    const handleResize = () => {
      generateShapes();
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getShapeVariants = (shape) => {
    const baseVariants = {
      initial: { y: '100vh', opacity: 0, rotate: 0 },
      animate: { 
        y: '-100px', 
        opacity: [0, 1, 1, 0],
        rotate: 360,
        transition: {
          duration: shape.duration,
          delay: shape.delay,
          repeat: Infinity,
          ease: 'linear'
        }
      }
    };

    if (shape.shape === 'triangle') {
      return {
        ...baseVariants,
        animate: {
          ...baseVariants.animate,
          rotate: [0, 120, 240, 360],
        }
      };
    }

    if (shape.shape === 'hexagon') {
      return {
        ...baseVariants,
        animate: {
          ...baseVariants.animate,
          rotate: [0, 60, 120, 180, 240, 300, 360],
        }
      };
    }

    return baseVariants;
  };

  const renderShape = (shape) => {
    const baseClasses = `absolute pointer-events-none`;
    const style = {
      left: `${shape.x}%`,
      width: `${shape.size}px`,
      height: `${shape.size}px`,
      backgroundColor: shape.color,
    };

    switch (shape.shape) {
      case 'circle':
        return (
          <motion.div
            key={shape.id}
            className={`${baseClasses} rounded-full`}
            style={style}
            variants={getShapeVariants(shape)}
            initial="initial"
            animate="animate"
          />
        );
      
      case 'square':
        return (
          <motion.div
            key={shape.id}
            className={`${baseClasses} rounded-lg`}
            style={style}
            variants={getShapeVariants(shape)}
            initial="initial"
            animate="animate"
          />
        );
      
      case 'triangle':
        return (
          <motion.div
            key={shape.id}
            className={`${baseClasses}`}
            style={{
              left: `${shape.x}%`,
              width: 0,
              height: 0,
              borderLeft: `${shape.size / 2}px solid transparent`,
              borderRight: `${shape.size / 2}px solid transparent`,
              borderBottom: `${shape.size}px solid ${shape.color}`,
            }}
            variants={getShapeVariants(shape)}
            initial="initial"
            animate="animate"
          />
        );
      
      case 'hexagon':
        return (
          <motion.div
            key={shape.id}
            className={`${baseClasses} hexagon`}
            style={{
              left: `${shape.x}%`,
              width: `${shape.size}px`,
              height: `${shape.size}px`,
              backgroundColor: shape.color,
              clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
            }}
            variants={getShapeVariants(shape)}
            initial="initial"
            animate="animate"
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {shapes.map(renderShape)}
      
      {/* Additional floating elements */}
      <motion.div
        className="absolute top-10 left-10 w-3 h-3 bg-pink-300 rounded-full opacity-60"
        animate={{
          y: [0, -20, 0],
          x: [0, 10, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div
        className="absolute top-1/4 right-20 w-4 h-4 bg-blue-300 rounded-full opacity-60"
        animate={{
          y: [0, 15, 0],
          x: [0, -15, 0],
          scale: [1, 0.8, 1],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />
      
      <motion.div
        className="absolute bottom-1/4 left-1/4 w-5 h-5 bg-yellow-300 rounded-full opacity-60"
        animate={{
          y: [0, -25, 0],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      />
      
      <motion.div
        className="absolute top-1/3 left-1/2 w-6 h-6 bg-purple-300 opacity-60"
        style={{
          clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
        }}
        animate={{
          y: [0, 20, 0],
          rotate: [0, -180, 0],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 3
        }}
      />
      
      <motion.div
        className="absolute bottom-1/3 right-1/3 w-4 h-4 bg-green-300 opacity-60"
        style={{
          clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
        }}
        animate={{
          y: [0, -30, 0],
          x: [0, 20, 0],
          rotate: [0, 360, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 4
        }}
      />
    </div>
  );
};

export default FloatingShapes;
