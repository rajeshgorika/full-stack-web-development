import React, { useState, useEffect } from 'react';

export const FetchHook = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        fetch('https://jsonplaceholder.typicode.com/posts/1')
            .then(res => res.json())
            .then(post => {
                if (isMounted) {
                    setData(post);
                    setLoading(false);
                }
            })
            .catch(() => {
                if (isMounted) setLoading(false);
            });

        return () => {
            isMounted = false;
        };
    }, []);

    if (loading) return <p>Loading with useEffect hook...</p>;

    return (
        <div style={{ padding: '16px', border: '1px solid #e2e8f0', borderRadius: '6px', marginTop: '16px' }}>
            <h3>Fetch Hook (useEffect)</h3>
            <h4>{data?.title}</h4>
            <p>{data?.body}</p>
        </div>
    );
};
