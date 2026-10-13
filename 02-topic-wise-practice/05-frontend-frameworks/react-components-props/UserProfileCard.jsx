import React from 'react';

export const UserProfileCard = ({ name, role, email, avatarUrl, onContactClick }) => {
    return (
        <div style={{
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '16px',
            width: '240px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
            textAlign: 'center'
        }}>
            <img 
                src={avatarUrl || 'https://via.placeholder.com/80'} 
                alt={`${name}'s avatar`}
                style={{ borderRadius: '50%', width: '80px', height: '80px', marginBottom: '12px' }}
            />
            <h3 style={{ margin: '4px 0', fontSize: '18px' }}>{name}</h3>
            <p style={{ color: '#0284c7', fontSize: '14px', margin: '4px 0' }}>{role}</p>
            <p style={{ color: '#64748b', fontSize: '12px', margin: '4px 0 12px 0' }}>{email}</p>
            <button 
                onClick={() => onContactClick(name)}
                style={{
                    backgroundColor: '#0284c7',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    cursor: 'pointer'
                }}
            >
                Contact
            </button>
        </div>
    );
};
