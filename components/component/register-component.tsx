'use client';

import { useState } from 'react';
import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { CardTitle, CardDescription, CardHeader, Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Cookies from 'js-cookie';

const registerUser = async (user: any) => {
  const { data } = await axios.post(`https://blog-aggregator-wrfbmzdfdq-uc.a.run.app/v1/users`, user);
  return data;
};

export default function RegisterComponent() {
  const [name, setName] = useState('');
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      // Set the ApiKey as a JWT cookie
      Cookies.set('jwt', data.Apikey, { path: '/' });

      queryClient.invalidateQueries({ queryKey: ['users'] });
      router.push('/');
    },
    onError: () => {
      alert('Error creating user');
    },
  });

  const handleSubmit = (e: any) => {
    e.preventDefault();
    mutation.mutate({ Name: name });
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Register</CardTitle>
          <CardDescription>Create a new account to get started.</CardDescription>
        </CardHeader>
        <form className="space-y-4 p-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <Button className="w-full" type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? 'Registering...' : 'Register'}
          </Button>
        </form>
      </Card>
    </div>
  );
}
