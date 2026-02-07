'use client';

import React, { useState } from 'react';
import CategorySelector from '../components/CategorySelector';
import TopicCard from '../components/TopicCard';

export default function ClientPage({ categories }) {
    const [currentCategory, setCurrentCategory] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(null);

    const handleSelectCategory = (category) => {
        setCurrentCategory(category);
        generateQuestion(category);
    };

    const generateQuestion = (category) => {
        const questions = category.questions;
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
                    categories={categories}
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
