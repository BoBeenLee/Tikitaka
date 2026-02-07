'use client';

import React from 'react';

const TopicCard = ({ category, question, onNext, onBack, disableNext }) => {
  // Generate a stable random number for the badge (1-50) using a hash of the question string
  const getQNumber = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash % 50) + 1;
  };

  const qNum = getQNumber(question || "");

  // Naive logic to split question if it has multiple sentences for the layout
  // If not, just show main question.
  // const parts = question.split('?');
  // const mainQ = parts[0] + '?';
  // const subQ = parts.length > 1 && parts[1].trim() !== "" ? parts[1].trim() : "What makes you think that?"; 
  
  // Actually, let's keep it simple. Main question takes the center spot.
  // We can add a generic sub-question if needed, or just style the single question.
  
  return (
    <div className="topic-card-container">
      <div className="topic-card">
        
        {/* Q Badge */}
        <div className="q-badge">
          <span className="q-label">Q.</span>
          <span className="q-number">{qNum}</span>
        </div>

        <div className="question-content">
          <p className="question-text">
            {question}
          </p>
          
          <div className="divider"></div>
          
          {/* Optional placeholder sub-question if real data doesn't have it */}
          {/* <p className="sub-question-text">
            Say whatever comes to your mind.
          </p> */}
        </div>

        {/* Footer */}
        <div className="card-footer">
            <div className="footer-icon"></div>
            <span className="footer-text">{category ? category.title : 'TIKITAKA'}</span>
        </div>

      </div>
    </div>
  );
};

export default TopicCard;
