import React, { useState } from 'react';
import topicsData from './data/topics.json';
import CategorySelector from './components/CategorySelector';
import TopicCard from './components/TopicCard';

function App() {
  const [currentCategory, setCurrentCategory] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [history, setHistory] = useState([]);

  const handleSelectCategory = (category) => {
    setCurrentCategory(category);
    generateQuestion(category);
  };

  const generateQuestion = (category) => {
    const questions = category.questions;
    // Simple random selection
    const randomIndex = Math.floor(Math.random() * questions.length);
    setCurrentQuestion(questions[randomIndex]);
  };

  const handleNextQuestion = () => {
    if (currentCategory) {
      generateQuestion(currentCategory);
    }
  };

  const handleBack = () => {
    setCurrentCategory(null);
    setCurrentQuestion(null);
  };

  return (
    <div className="app-container">
      {!currentCategory ? (
        <CategorySelector 
          categories={topicsData.categories} 
          onSelect={handleSelectCategory} 
        />
      ) : (
        <TopicCard 
          category={currentCategory} 
          question={currentQuestion}
          onNext={handleNextQuestion}
          onBack={handleBack}
        />
      )}
    </div>
  );
}

export default App;
