'use client';

import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import TopicCard from './TopicCard';
import ShareModal from './ShareModal';

const SwipeableCardStack = ({ category, onNext, onBack, initialQuestionIndex }) => {
  const [shareUrl, setShareUrl] = useState(null); 
  const questions = category?.questions ?? [];

  // Helper to create a unique card object
  const createCard = (cat, questionIndex) => {
    return {
      id: questionIndex,
      question: questions[questionIndex],
      questionIndex,
      category: cat
    };
  };

  const [cards, setCards] = useState(() => {
    // Lazy initialization determines initial cards immediately
    if (category) {
      // If initialQuestionIndex is null/undefined, pick a random start
      const startIndex = (initialQuestionIndex !== null && initialQuestionIndex !== undefined) 
        ? initialQuestionIndex 
        : Math.floor(Math.random() * questions.length);

      console.log('SwipeableCardStack INIT (Lazy):', { categoryId: category.id, startIndex });
      const firstCard = createCard(category, startIndex);
      const secondCard = createCard(category, (startIndex + 1) % questions.length); 
      return [firstCard, secondCard];
    }
    return [];
  });
  console.log('cards', cards);

  // Effect only needed to handle updates if key DOES NOT change but category does 
  useEffect(() => {
    // If we already have cards and category matches, don't reset.
    if (category && cards.length > 0 && cards[0].category.id !== category.id) {
       // New category selected, but component reused.
       // Recalculate start index.
       const startIndex = (initialQuestionIndex !== null && initialQuestionIndex !== undefined) 
        ? initialQuestionIndex 
        : Math.floor(Math.random() * questions.length);
       
       const firstCard = createCard(category, startIndex);
       const secondCard = createCard(category, (startIndex + 1) % questions.length);
       setCards([firstCard, secondCard]);
    }
  }, [category, initialQuestionIndex]);

  const handleShare = (card) => {
      // Construct URL: origin + ?c=category_id&q=question_index
      if (typeof window !== 'undefined') {
          const url = new URL(window.location.origin);
          url.searchParams.set('c', card.category.id);
          url.searchParams.set('q', card.questionIndex);
          setShareUrl(url.toString());
      }
  };

  const removeCard = (id) => {
    setCards((current) => {
      // Limit stack size to prevent memory issues, keep max 3
      const remaining = current.filter((c) => c.id !== id);
      const lastQuestionIndex = remaining[remaining.length - 1].questionIndex;
      return [...remaining, createCard(category, (lastQuestionIndex + 1) % questions.length)];
    });
    // Optional: trigger external handler if we want to count questions answered
    if (onNext) onNext(); 
  };

  const goBack = () => {
      setCards((current) => {
          if (current.length === 0) return current;
          const currentTop = current[0]; // The card currently on top
          const currentIdx = currentTop.questionIndex;

          // Calculate previous index (circularly)
          // If current is 0, prev is length - 1
          const prevIdx = (currentIdx - 1 + questions.length) % questions.length;
          
          // We want the previous card to appear on TOP.
          // And the current top card to become the SECOND card.
          // Basically unshifting the previous card.
          // But our state is [Top, Bottom]. 
          return [createCard(category, prevIdx), currentTop];
      });
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

      {/* Share Button (Top Right) */}
      <button 
        onClick={() => handleShare(cards[cards.length - 1])} // Share top card
        style={{
          position: 'absolute',
          top: '2rem',
          right: '2rem',
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
        <span style={{ fontSize: '1.2rem' }}>🔗</span> Share
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
            key={`${card.id}-${index}`}
            card={card}
            isTop={isTop}
            onSwipe={() => removeCard(card.id)}
            onSwipeBack={goBack}
            onBack={onBack}
          />
        );
      })}

      <ShareModal url={shareUrl} onClose={() => setShareUrl(null)} />
    </div>
  );
};

const SwipeableCard = ({ card, isTop, onSwipe, onSwipeBack, onBack }) => {
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
    // If dragged more than 100px down (positive y)
    if (info.offset.y > 100) {
      onSwipe();
    }
    // If dragged more than 100px up (negative y)
    else if (info.offset.y < -100) {
       onSwipeBack();
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
        maxWidth: '340px', // Narrower for portrait card look
        height: '600px',    // Fixed height for card look, should match min-height loosely but relies on content
        maxHeight: '80vh',
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
        questionIndex={card.questionIndex}  
        onNext={onSwipe} 
        onBack={onBack}
        disableNext={!isTop}
      />
    </motion.div>
  );
};

export default SwipeableCardStack;
