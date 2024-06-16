
/**
 * v0 by Vercel.
 * @see https://v0.dev/t/FEzSlRjdlCl
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import axios from "axios"
import { useRouter } from "next/router"
import Cookies from 'js-cookie';

export default function Component() {
  const [user, setUser] = useState<any>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("/v1/users", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        setUser(response.data)
        setLoading(false)
      } catch (err: any) {
        setError(err.message)
        setLoading(false)
      }
    }
    fetchUserData()
  }, [])
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-gray-900 text-white py-4 px-6">
        <div className="flex items-center">
          <Link href="#" className="mr-4" prefetch={false}>
            <ArrowLeftIcon className="h-6 w-6" />
          </Link>
          <h1 className="text-xl font-bold">User Profile</h1>
        </div>
      </header>
      <main className="flex-1 p-6">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div />
          </div>
        ) : error ? (
          <div className="text-red-500 text-center">{error}</div>
        ) : (
          <div className="max-w-md mx-auto">
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="h-32 bg-gray-200" />
              <div className="p-6">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src="/placeholder-user.jpg" />
                    <AvatarFallback>{user?.name.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-xl font-bold">{user.name}</h2>
                    <p className="text-gray-500">{user.email}</p>
                  </div>
                </div>
                <div className="mt-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-gray-500 font-medium">Role</h3>
                      <p className="text-gray-700">{user.role}</p>
                    </div>
                    <div>
                      <h3 className="text-gray-500 font-medium">Status</h3>
                      <p className="text-gray-700">{user.status}</p>
                    </div>
                    <div>
                      <h3 className="text-gray-500 font-medium">Joined</h3>
                      <p className="text-gray-700">{new Date(user.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <h3 className="text-gray-500 font-medium">Updated</h3>
                      <p className="text-gray-700">{new Date(user.updatedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
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
  )
}