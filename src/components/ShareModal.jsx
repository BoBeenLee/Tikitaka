import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

const ShareModal = ({ url, onClose }) => {
  const [copied, setCopied] = React.useState(false);

  if (!url) return null;

  const handleCopy = async () => {
    try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    } catch (err) {
        console.error('Failed to copy!', err);
    }
  };

  return (
    <div 
      className="share-modal-overlay"
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(0,0,0,0.5)',
        backdropFilter: 'blur(5px)',
        zIndex: 100,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        animation: 'fadeIn 0.2s ease-out'
      }}
    >
      <div 
        className="share-modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '24px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.5rem',
          maxWidth: '320px',
          width: '90%',
          animation: 'scaleIn 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#333' }}>Share this Question</h3>
          <p style={{ margin: '0.5rem 0 0', fontSize: '0.9rem', color: '#666' }}>Scan to open on another device</p>
        </div>

        <div style={{ 
            padding: '1rem', 
            background: 'white', 
            borderRadius: '16px',
            border: '1px solid #eee',
            marginBottom: '0.5rem'
        }}>
            <QRCodeSVG value={url} size={200} />
        </div>

        {/* Copy Link Section */}
        <div style={{ 
            width: '100%', 
            display: 'flex', 
            gap: '0.5rem',
            background: '#f8f9fa',
            padding: '0.5rem',
            borderRadius: '12px',
            border: '1px solid #eee'
        }}>
            <input 
                readOnly 
                value={url} 
                style={{
                    flex: 1,
                    border: 'none',
                    background: 'transparent',
                    fontSize: '0.9rem',
                    color: '#555',
                    outline: 'none',
                    textOverflow: 'ellipsis'
                }}
            />
            <button 
                onClick={handleCopy}
                style={{
                    background: copied ? '#4CAF50' : '#0070f3',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '0.4rem 0.8rem',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                    minWidth: '70px'
                }}
            >
                {copied ? 'Copied!' : 'Copy'}
            </button>
        </div>

        <button 
          onClick={onClose}
          style={{
            background: '#f0f2f5',
            border: 'none',
            padding: '0.8rem 2rem',
            borderRadius: '50px',
            fontSize: '1rem',
            fontWeight: '600',
            color: '#555',
            cursor: 'pointer',
            width: '100%'
          }}
        >
          Close
        </button>
      </div>
      
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default ShareModal;
