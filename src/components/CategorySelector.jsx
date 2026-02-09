'use client';

import Link from 'next/link';

const CategorySelector = ({ categories, onSelect, isOpen, onClose, lang = 'en' }) => {
  const t = {
    en: { title: 'Choose a Topic', langBtn: '🇯🇵 日本語', targetLang: 'ja' },
    ja: { title: 'トピックを選択', langBtn: '🇺🇸 English', targetLang: 'en' }
  };
  const strings = t[lang] || t.en;

  return (
    <div 
      className={`category-selector-overlay ${isOpen ? 'open' : 'closed'}`}
    >
      <div className="category-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem' }}>
         <h1 className="main-title" style={{ margin: 0 }}>{strings.title}</h1>
         
         <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
             {/* Close button if we can close (i.e. we have a current category) */}
             {onClose && (
                <button onClick={onClose} className="close-menu-btn" style={{ visibility: isOpen ? 'visible' : 'hidden', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>
                    ✕
                </button>
             )}
         </div>
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
