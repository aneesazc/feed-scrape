'use client';

import { useState } from 'react';
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Button } from "@/components/ui/button";
import { DialogTitle, DialogDescription, DialogHeader, DialogFooter, DialogContent, Dialog } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";


const fetchFeeds = async () => {
  const response = await axios.get(`https://blog-aggregator-wrfbmzdfdq-uc.a.run.app/v1/feeds`);
  return response.data;
};

const addFeed = async (newFeed: any) => {
  const token = Cookies.get('jwt');
  const response = await axios.post(`https://blog-aggregator-wrfbmzdfdq-uc.a.run.app/v1/feeds`, newFeed, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token, // Add Authorization header with token only
    }
  });
  return response.data;
};

export function FeedComponent() {
  const queryClient = useQueryClient();
  const { data: feeds, error, isLoading } = useQuery({
    queryKey: ['feeds'],
    queryFn: fetchFeeds
  });

  const mutation = useMutation({
    mutationFn: addFeed,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feeds'] });
    },
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newFeed, setNewFeed] = useState({ name: "", url: "" });

  const handleInputChange = (e: any) => {
    const { id, value } = e.target;
    setNewFeed({ ...newFeed, [id]: value });
  };

  const handleAddFeed = () => {
    mutation.mutate(newFeed, {
      onSuccess: () => {
        setIsDialogOpen(false);
        setNewFeed({ name: "", url: "" });
      },
    });
  };

  const handleCopy = (feedId: any) => {
    navigator.clipboard.writeText(feedId);
    alert('Feed ID copied to clipboard!');
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching feeds</div>;

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="flex items-center justify-between mb-6">
        <Link
          className="inline-flex items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
          href="#"
        >
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          Back
        </Link>
        <Button
          className="inline-flex items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
          onClick={() => setIsDialogOpen(true)}
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Add Feed
        </Button>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {feeds.map((feed: any) => (
          <div key={feed.ID} className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-bold">{feed.Name}</h3>
            <p className="break-words">{feed.Url}</p> {/* Added break-words class */}
            <div className="flex items-center">
              <p className="text-sm text-gray-500">ID: {feed.ID}</p> {/* Display the feed ID */}
              <Button className="ml-2 px-3 py-0 text-xs" onClick={() => handleCopy(feed.ID)}>Copy</Button> {/* Add a copy button */}
            </div>
          </div>
        ))}
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Feed</DialogTitle>
            <DialogDescription>Enter the name and URL for your new feed.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid items-center grid-cols-4 gap-4">
              <Label className="text-right" htmlFor="name">Name</Label>
              <Input className="col-span-3" id="name" value={newFeed.name} onChange={handleInputChange} />
            </div>
            <div className="grid items-center grid-cols-4 gap-4">
              <Label className="text-right" htmlFor="url">URL</Label>
              <Input className="col-span-3" id="url" value={newFeed.url} onChange={handleInputChange} />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleAddFeed}>Save</Button>
            <div>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ArrowLeftIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  );
}

function PlusIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}
