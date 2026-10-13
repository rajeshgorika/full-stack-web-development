import React from 'react';
import { UserProfileCard } from './UserProfileCard';

export const App = () => {
    const users = [
        { id: 1, name: 'Alice Smith', role: 'Full Stack Engineer', email: 'alice@example.com' },
        { id: 2, name: 'Bob Jones', role: 'UI/UX Designer', email: 'bob@example.com' }
    ];

    const handleContact = (userName) => {
        alert(`Opening contact modal for: ${userName}`);
    };

    return (
        <div style={{ display: 'flex', gap: '16px', padding: '24px' }}>
            {users.map(u => (
                <UserProfileCard 
                    key={u.id}
                    name={u.name}
                    role={u.role}
                    email={u.email}
                    onContactClick={handleContact}
                />
            ))}
        </div>
    );
};

export default App;
