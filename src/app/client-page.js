'use client';

import React, { useState } from 'react';
import CategorySelector from '../components/CategorySelector';
import SwipeableCardStack from '../components/SwipeableCardStack';

export default function ClientPage({ categories }) {
    // Set "Daily Life" (id: daily_life) as the default category.
    // If not found, fall back to null (though it should be there).
    const defaultCategory = categories.find(c => c.id === 'daily_life') || null;

    const [currentCategory, setCurrentCategory] = useState(defaultCategory);
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
