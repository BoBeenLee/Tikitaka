'use client';

import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import TopicCard from './TopicCard';

const SwipeableCardStack = ({ category, onNext, onBack }) => {
  const [cards, setCards] = useState([]);

  // Helper to create a unique card object
  const createCard = (cat) => {
    const questions = cat.questions;
    const randomIndex = Math.floor(Math.random() * questions.length);
    return {
      id: Math.random().toString(36).substr(2, 9),
      question: questions[randomIndex],
      category: cat
    };
  };
  
  // Initialize stack with 2 cards
  useEffect(() => {
    if (category) {
      setCards([createCard(category), createCard(category)]);
    } else {
        setCards([]); // partial reset
    }
  }, [category]);

  const removeCard = (id) => {
    setCards((current) => {
      // Limit stack size to prevent memory issues, keep max 3
      const remaining = current.filter((c) => c.id !== id);
      return [...remaining, createCard(category)];
    });
    // Optional: trigger external handler if we want to count questions answered
    if (onNext) onNext(); 
  };

  if (cards.length === 0) {
      return (
        <div className="card-stack-container" style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
             <button 
                onClick={onBack}
                style={{
                  position: 'absolute',
                  top: '2rem',
                  left: '2rem',
                  zIndex: 10,
                  background: 'rgba(255,255,255,0.8)',
                  border: 'none',
                  padding: '0.8rem 1.2rem',
                  borderRadius: '50px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  cursor: 'pointer',
                  fontWeight: '600',
                  color: '#555',
                  backdropFilter: 'blur(5px)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <span style={{ fontSize: '1.2rem' }}>☰</span> Menu
              </button>
              <div style={{ opacity: 0.5, fontStyle: 'italic' }}>Select a topic to start</div>
        </div>
      );
  }

  // We only render the top 2 cards for performance
  return (
    <div className="card-stack-container" style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      
      {/* Absolute Back Button */}
      <button 
        onClick={onBack}
        style={{
          position: 'absolute',
          top: '2rem',
          left: '2rem',
          zIndex: 10,
          background: 'rgba(255,255,255,0.8)',
          border: 'none',
          padding: '0.8rem 1.2rem',
          borderRadius: '50px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          cursor: 'pointer',
          fontWeight: '600',
          color: '#555',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}
      >
        <span style={{ fontSize: '1.2rem' }}>☰</span> Menu
      </button>

      {cards.slice(0, 2).reverse().map((card, index, array) => {
        // array.length will be 1 or 2. 
        // If 2 cards: index 0 (bottom), index 1 (top).
        // validation: we sliced 0,2 and reversed. 
        // Original: [Top, Bottom] -> Slice: [Top, Bottom] -> Reverse: [Bottom, Top]
        // So last element is Top.
        const isTop = index === array.length - 1;
        return (
          <SwipeableCard
            key={card.id}
            card={card}
            isTop={isTop}
            onSwipe={() => removeCard(card.id)}
            onBack={onBack}
          />
        );
      })}
    </div>
  );
};

const SwipeableCard = ({ card, isTop, onSwipe, onBack }) => {
  const y = useMotionValue(0);
  // Rotate slightly as you drag up/down
  const rotate = useTransform(y, [-200, 200], [-10, 10]);
  // Fade out as you drag away
  const opacity = useTransform(y, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);
  
  // Scale down the card behind
  const scale = isTop ? 1 : 0.95;
  // Offset the card behind slightly to show depth
  const translateY = isTop ? y : 15;

  const handleDragEnd = (_, info) => {
    // If dragged more than 100px up or down
    if (Math.abs(info.offset.y) > 100) {
      onSwipe();
    }
  };

  return (
    <motion.div
      style={{
        position: 'absolute',
        zIndex: isTop ? 2 : 1,
        y: translateY,
        rotate: isTop ? rotate : 0,
        opacity: isTop ? opacity : 1,
        scale: scale,
        cursor: isTop ? 'grab' : 'default',
        width: '100%',
        maxWidth: '400px', // Narrower for portrait card look
        height: '600px',    // Fixed height for card look
        perspective: 1000,
      }}
      drag={isTop ? 'y' : false}
      dragConstraints={{ top: 0, bottom: 0 }}
      onDragEnd={handleDragEnd}
      animate={{ 
        scale: scale,
        y: isTop ? 0 : 15, // Reset position or keep offset
        opacity: 1 
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      whileTap={{ cursor: 'grabbing' }}
    >
      <TopicCard 
        category={card.category} 
        question={card.question} 
        onNext={onSwipe} 
        onBack={onBack}
        disableNext={!isTop}
      />
    </motion.div>
  );
};

export default SwipeableCardStack;
