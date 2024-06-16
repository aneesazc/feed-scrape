'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { CardTitle, CardDescription, CardHeader, Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Cookies from 'js-cookie';

const followFeed = async (feed: any) => {
    const token = Cookies.get('jwt');
    const { data } = await axios.post(`https://blog-aggregator-wrfbmzdfdq-uc.a.run.app/v1/feed_follows`, feed, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token,
        },
    });
    return data;
};

export default function FeedFollowComponent() {
    const [feedId, setFeedId] = useState('');
    const queryClient = useQueryClient();
    const router = useRouter();
    useEffect(() => {
        const token = Cookies.get('jwt');
        if (!token) {
            router.push('/register');
        }
    }, [router]);

    const mutation = useMutation({
        mutationFn: followFeed,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['feedFollows'] });
            router.push('/');
        },
        onError: () => {
            alert('Already following feed or error following feed');
        },
    });


    useEffect(() => {
        const token = Cookies.get('jwt');
        if (!token) {
            router.push('/register');
        }
    }, [router]);

    const handleSubmit = (e: any) => {
        e.preventDefault();
        mutation.mutate({ feed_id: feedId });
    };

    return (
        <div className="flex items-center justify-center h-screen">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Follow Feed</CardTitle>
                    <CardDescription>Enter the feed ID to follow a new feed.</CardDescription>
                </CardHeader>
                <form className="space-y-4 p-6" onSubmit={handleSubmit}>
                    <div className="space-y-2">
                        <Label htmlFor="feedId">Feed ID</Label>
                        <Input id="feedId" required value={feedId} onChange={(e) => setFeedId(e.target.value)} />
                    </div>
                    <Button className="w-full" type="submit" disabled={mutation.isPending}>
                        {mutation.isPending ? 'Following...' : 'Follow'}
                    </Button>
                </form>
            </Card>
        </div>
    );
}
