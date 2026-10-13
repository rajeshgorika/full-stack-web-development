import React, { useState } from 'react';

export const CounterHook = () => {
    const [count, setCount] = useState(0);

    return (
        <div style={{ padding: '16px', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
            <h3>Counter Hook (useState)</h3>
            <p>Current Count: <strong>{count}</strong></p>
            <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                <button onClick={() => setCount(prev => prev + 1)}>Increment</button>
                <button onClick={() => setCount(prev => prev - 1)}>Decrement</button>
                <button onClick={() => setCount(0)}>Reset</button>
            </div>
        </div>
    );
};
