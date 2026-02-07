'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import CategorySelector from '../components/CategorySelector';
import SwipeableCardStack from '../components/SwipeableCardStack';

export default function ClientPage({ categories }) {
    const searchParams = useSearchParams();
    const questionParam = searchParams.get('q');
    const categoryParam = searchParams.get('c');
    const initialQuestionIndex = (questionParam && !isNaN(questionParam)) ? parseInt(questionParam, 10) : 0;

    // Determine default category: URL param 'c' > 'daily_life' > null
    let foundCategory = null;
    if (categoryParam) {
        foundCategory = categories.find(c => c.id === categoryParam);
    }
    const defaultCategory = foundCategory || categories.find(c => c.id === 'daily_life') || null;

    const [currentCategory, setCurrentCategory] = useState(defaultCategory);
    // If we have a category from URL, menu should definitely be CLOSED.
    // Actually, if we have ANY default category (which we almost always do), menu is closed.
    // But if user just lands on root and we default to Daily Life, maybe menu shouldn't be open?
    // The previous logic was: !defaultCategory. 
    // If categoryParam is present, we definitely want to show that category (menu closed).
    // If no param, we show Daily Life.
    // Let's keep it simple: Menu is closed if we have a category.
    // If a default category is set, start with the menu CLOSED (false).
    // If no default, keep menu open (true).
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
