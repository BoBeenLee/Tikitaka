'use client';

import React, { useRef, useState } from 'react';

export default function PhotoInput({ onQuestionsGenerated, onError, lang = 'en' }) {
  const fileInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  const t = {
    en: { button: 'Photo Topic', analyzing: 'Analyzing...' },
    ja: { button: '写真からトピック', analyzing: '分析中...' }
  };
  const strings = t[lang] || t.en;

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('lang', lang);

      // Call API
      const response = await fetch('/api/analyze-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to analyze image');
      }

      const data = await response.json();
      
      if (data.questions && Array.isArray(data.questions)) {
        onQuestionsGenerated(data.questions);
      } else {
        throw new Error('Invalid response format');
      }

    } catch (error) {
      console.error(error);
      if (onError) onError(error);
      else alert('Failed to analyze photo. Please try again.');
    } finally {
      setIsLoading(false);
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <>
      <input
        type="file"
        accept="image/*"
        capture="environment" // Prefer camera on mobile
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={isLoading}
        style={{
          position: 'absolute',
          top: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          background: 'rgba(255,255,255,0.8)',
          border: 'none',
          padding: '0.8rem 1.2rem',
          borderRadius: '50px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          cursor: isLoading ? 'wait' : 'pointer',
          fontWeight: '600',
          color: '#555',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          opacity: isLoading ? 0.7 : 1
        }}
      >
        <span style={{ fontSize: '1.2rem' }}>{isLoading ? '⏳' : '📷'}</span>
        {isLoading ? strings.analyzing : strings.button}
      </button>
    </>
  );
}
