/**
* This code was generated by v0 by Vercel.
* @see https://v0.dev/t/O47dnTaFhgA
* Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
*/

/** Add fonts into your Next.js project:

import { Inter } from 'next/font/google'

inter({
  subsets: ['latin'],
  display: 'swap',
})

To read more about using these font, please visit the Next.js documentation:
- App Directory: https://nextjs.org/docs/app/building-your-application/optimizing/fonts
- Pages Directory: https://nextjs.org/docs/pages/building-your-application/optimizing/fonts
**/
'use client';

import { useState } from 'react';
import Link from "next/link";
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { Button } from "@/components/ui/button";

const fetchPosts = async () => {
  const token = Cookies.get('jwt');
  const response = await axios.get(`https://blog-aggregator-wrfbmzdfdq-uc.a.run.app/v1/posts`, {
    headers: {
      'Authorization': token,
    },
  });
  return response.data;
};

export function PostsComponent() {
  const { data: posts, error, isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts
  });

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    alert('URL copied to clipboard!');
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching posts</div>;
  if (!posts) return <div>No posts found</div>;

  return (
    <div>
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">Blog Posts</h1>
      </div>
      <div className="container mx-auto px-4 py-8 md:px-6 lg:py-12">
        <div className="space-y-6">
          {posts.map((post: any) => (
            <div key={post.ID} className="rounded-lg bg-white p-4 shadow-md">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold">{post.Title}</h3>
                <div className="flex items-center gap-2">
                  <Link className="text-sm font-medium text-blue-500 hover:underline" href={post.Url}>
                    View
                  </Link>
                  <Button
                    className="rounded-md p-1 text-gray-500 hover:bg-gray-100"
                    size="icon"
                    variant="ghost"
                    onClick={() => handleCopy(post.Url)}
                  >
                    <CopyIcon className="h-4 w-4" />
                    <span className="sr-only">Copy URL</span>
                  </Button>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                {post.Description}
              </p>
              <p className="mt-4 text-sm text-gray-500">
                Published on {new Date(post.PublishedAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CopyIcon(props: any) {
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
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  );
}

export default PostsComponent;
