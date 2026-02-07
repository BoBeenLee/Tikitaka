'use client';

import React from 'react';

const CategorySelector = ({ categories, onSelect, isOpen, onClose }) => {
  return (
    <div 
      className={`category-selector-overlay ${isOpen ? 'open' : 'closed'}`}
    >
      <div className="category-header">
         <h1 className="main-title">Choose a Topic</h1>
         {/* Close button if we can close (i.e. we have a current category) */}
         {onClose && (
            <button onClick={onClose} className="close-menu-btn" style={{ visibility: isOpen ? 'visible' : 'hidden' }}>
                ✕
            </button>
         )}
      </div>
      
      <div className="category-grid">
        {categories.map((category) => (
          <button 
            key={category.id} 
            className="category-card" 
            onClick={() => onSelect(category)}
          >
            <div className="category-icon">{category.icon}</div>
            <h3 className="category-name">{category.title}</h3>
            <p className="category-desc">{category.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategorySelector;
