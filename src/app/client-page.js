'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import CategorySelector from '../components/CategorySelector';
import SwipeableCardStack from '../components/SwipeableCardStack';

import { Suspense } from 'react';

function ClientPageContent({ categories }) {
    const searchParams = useSearchParams();
    const questionParam = searchParams.get('q');
    const categoryParam = searchParams.get('c');
    const [initialQuestionIndex, setInitialQuestionIndex] = (questionParam && !isNaN(questionParam)) ? parseInt(questionParam, 10) : null;

    // Determine default category: URL param 'c' > 'daily_life' > null
    let foundCategory = null;
    if (categoryParam) {
        foundCategory = categories.find(c => c.id === categoryParam);
    }
    const defaultCategory = foundCategory || categories.find(c => c.id === 'daily_life') || null;

    const [currentCategory, setCurrentCategory] = useState(defaultCategory);
    const [isMenuOpen, setIsMenuOpen] = useState(!defaultCategory);

    const handleSelectCategory = (category) => {
        setCurrentCategory(category);
        setIsMenuOpen(false);
    };

    const handleOpenMenu = () => {
        setIsMenuOpen(true);
    };

    return (
        <div className="app-container" style={{ position: 'relative', overflow: 'hidden', height: '100vh', width: '100vw' }}>
            {/* Main Card Stack - Always Rendered but maybe blurred/dimmed when menu is open */}
            <div style={{
                height: '100%',
                width: '100%',
                filter: isMenuOpen ? 'blur(5px) brightness(0.9)' : 'none',
                transition: 'filter 0.3s ease',
                pointerEvents: isMenuOpen ? 'none' : 'auto'
            }}>
                <SwipeableCardStack
                    category={currentCategory}
                    onBack={handleOpenMenu} // reused to open menu
                    onPhotoAnalyzed={(questions) => {
                        const photoCategory = {
                            id: `photo-${Date.now()}`,
                            title: 'Photo Analysis',
                            description: 'Questions generated from your photo',
                            icon: '📷',
                            questions: questions
                        };
                        setCurrentCategory(photoCategory);
                        setInitialQuestionIndex(null)
                    }}
                    initialQuestionIndex={initialQuestionIndex}
                    key={`${currentCategory?.id}-${initialQuestionIndex}`}
                />
            </div>

            {/* Category Overlay */}
            <CategorySelector
                categories={categories}
                onSelect={handleSelectCategory}
                isOpen={isMenuOpen}
                onClose={() => currentCategory && setIsMenuOpen(false)} // Allow closing if category exists
            />
        </div>
    );
}

export default function ClientPage(props) {
    return (
        <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>}>
            <ClientPageContent {...props} />
        </Suspense>
    );
}
