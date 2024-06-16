'use client';

import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
    const router = useRouter();

    const handleLogout = () => {
        Cookies.remove('jwt'); // Remove the JWT cookie
        router.push('/register'); // Redirect to the login page or home page
    };

    return (
        <button
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            onClick={handleLogout}
        >
            Logout
        </button>
    );
}
