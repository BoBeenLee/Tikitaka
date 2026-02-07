import React from 'react';

const TopicCard = ({ category, question, onNext, onBack }) => {
  return (
    <div className="topic-card-container">
      <div className="topic-card">
        <div className="topic-header">
          <span className="topic-icon">{category.icon}</span>
          <h2 className="topic-title">{category.title}</h2>
        </div>
        
        <div className="question-content">
          <p className="question-text">{question}</p>
        </div>

        <div className="card-actions">
          <button onClick={onBack} className="btn btn-secondary">
            Change Category
          </button>
          <button onClick={onNext} className="btn btn-primary">
            Next Question
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopicCard;
