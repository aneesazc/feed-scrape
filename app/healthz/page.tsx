'use client';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const fetchHealth = async () => {
    const { data } = await axios.get(`${BACKEND_URL}/v1/healthz`);
    return data;
};

const Healthz = () => {
    const { data, error, isLoading } = useQuery({ queryKey: ["health"], queryFn: fetchHealth });

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error fetching health status</p>;

    return (
        <div>
            <h1>Health Check</h1>
            <p>Status: {data.status}</p>
        </div>
    );
};

export default Healthz;
