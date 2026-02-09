'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import CategorySelector from '../components/CategorySelector';
import SwipeableCardStack from '../components/SwipeableCardStack';

import { Suspense } from 'react';

// 10: ClientPageContent({ categories, lang }) {
function ClientPageContent({ categories, lang = 'en' }) {
    const searchParams = useSearchParams();
    const questionParam = searchParams.get('q');
    const categoryParam = searchParams.get('c');

    const t = {
        en: {
            photoAnalysisTitle: 'Photo Analysis',
            photoAnalysisDesc: 'Questions generated from your photo',
            loading: 'Loading...'
        },
        ja: {
            photoAnalysisTitle: '写真分析',
            photoAnalysisDesc: 'あなたの写真から生成された質問',
            loading: '読み込み中...',
        }
    };
    const strings = t[lang] || t.en;

    // ... (rest of logic) ...
    // ...
    // 51: title: strings.photoAnalysisTitle,
    // 52: description: strings.photoAnalysisDesc,

    // Determine default category: URL param 'c' > 'daily_life' > null
    let foundCategory = null;
    if (categoryParam) {
        foundCategory = categories.find(c => c.id === categoryParam);
    }
    const defaultCategory = foundCategory || categories.find(c => c.id === 'daily_life') || null;

    const [initialQuestionIndex, setInitialQuestionIndex] = useState((questionParam && !isNaN(questionParam)) ? parseInt(questionParam, 10) : null);
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
                            title: strings.photoAnalysisTitle,
                            description: strings.photoAnalysisDesc,
                            icon: '📷',
                            questions: questions
                        };
                        setCurrentCategory(photoCategory);
                        setInitialQuestionIndex(null)
                    }}
                    initialQuestionIndex={initialQuestionIndex}
                    key={`${currentCategory?.id}-${initialQuestionIndex}`}
                    lang={lang}
                />
            </div>

            {/* Category Overlay */}
            <CategorySelector
                categories={categories}
                onSelect={handleSelectCategory}
                isOpen={isMenuOpen}
                onClose={() => currentCategory && setIsMenuOpen(false)} // Allow closing if category exists
                lang={lang}
            />
        </div>
    );
}

export default function ClientPage(props) {
    // Props contain lang now
    const strings = {
        en: 'Loading...',
        ja: '読み込み中...'
    };
    const loadingText = strings[props.lang] || strings.en;

    return (
        <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>{loadingText}</div>}>
            <ClientPageContent {...props} />
        </Suspense>
    );
}
