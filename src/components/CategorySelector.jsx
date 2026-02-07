'use client';

import React from 'react';

const CategorySelector = ({ categories, onSelect }) => {
  return (
    <div className="category-selector">
      <h1 className="main-title">Choose a Topic</h1>
      <p className="subtitle">Select a category to start your English conversation.</p>
      
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
