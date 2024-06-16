'use client';

import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const fetchFeedFollows = async () => {
    const router = useRouter();

    useEffect(() => {
        const token = Cookies.get('jwt');
        if (!token) {
            router.push('/register');
        }
    }, [router]);

    const token = Cookies.get('jwt');
    const response = await axios.get(`https://blog-aggregator-wrfbmzdfdq-uc.a.run.app/v1/feed_follows`, {
        headers: {
            'Authorization': token,
        },
    });
    return response.data;
};

const fetchFeeds = async () => {
    const token = Cookies.get('jwt');
    const response = await axios.get(`https://blog-aggregator-wrfbmzdfdq-uc.a.run.app/v1/feeds`, {
        headers: {
            'Authorization': token,
        },
    });
    return response.data;
};

const deleteFeedFollow = async (feedFollowID: any) => {
    const token = Cookies.get('jwt');
    const response = await axios.delete(`https://blog-aggregator-wrfbmzdfdq-uc.a.run.app/v1/feed_follows/${feedFollowID}`, {
        headers: {
            'Authorization': token,
        },
    });
    return response.data;
};

export default function FollowedFeedsComponent() {
    const queryClient = useQueryClient();

    const { data: feedFollows, error: feedFollowsError, isLoading: feedFollowsLoading } = useQuery({
        queryKey: ['feedFollows'],
        queryFn: fetchFeedFollows,
    });

    const { data: feeds, error: feedsError, isLoading: feedsLoading } = useQuery({
        queryKey: ['feeds'],
        queryFn: fetchFeeds,
    });

    const mutation = useMutation({
        mutationFn: deleteFeedFollow,
        onSuccess: (_, feedFollowID) => {
            queryClient.setQueryData(['feedFollows'], (oldData: any) => {
                return oldData.filter((item: any) => item.FeedID !== feedFollowID);
            });
        },
        onError: (error) => {
            console.error('Error deleting feed follow:', error);
            alert('Error deleting feed follow');
        },
    });

    const handleDelete = (feedFollowID: any) => {
        mutation.mutate(feedFollowID);
    };

    if (feedFollowsLoading || feedsLoading) return <div>Loading...</div>;
    if (feedFollowsError) return <div>Error fetching feed follows</div>;
    if (feedsError) return <div>Error fetching feeds</div>;
    if (!feedFollows || !feeds) return <div>No feeds followed</div>;

    // @ts-ignore
    const feedIdToNameMap = feeds.reduce((acc, feed) => {
        acc[feed.ID] = feed.Name;
        return acc;
    }, {});

    return (
        <div>
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold">Your Followed Feeds</h1>
            </div>
            <div className="container mx-auto px-4 py-8 md:px-6 lg:py-12">
                <div className="space-y-6">
                    {feedFollows.map((feedFollow: any) => (
                        <div key={feedFollow.ID} className="rounded-lg bg-white p-4 shadow-md">
                            <div className="mb-4 flex items-center justify-between">
                                <h3 className="text-lg font-semibold">
                                    Feed: {feedIdToNameMap[feedFollow.FeedID] || feedFollow.FeedID}
                                </h3>
                                <Button
                                    className="rounded-md p-1 text-gray-500 hover:bg-gray-100"
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => handleDelete(feedFollow.FeedID)}
                                >
                                    Delete
                                </Button>
                            </div>
                            <p className="text-sm text-gray-600">Feed ID: {feedFollow.FeedID}</p>
                            <p className="text-sm text-gray-600">Feed Follow ID: {feedFollow.ID}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
