'use client';

import { useState } from 'react';
import { signIn, signUp } from '@/lib/auth';
import { useRouter } from 'next/navigation'; // use 'next/router' for pages dir


export default function AuthForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignUp) {
        const { error } = await signUp(email, password);
        if (error) alert(error.message);
        else alert('Check your email to confirm sign-up.');
    } else {
        const { error } = await signIn(email, password);
        if (error) alert(error.message);
        else router.push('/dashboard');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="input w-full"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="input w-full"
      />
      <button type="submit" className="bg-blue-600 text-white p-2 rounded w-full">
        {isSignUp ? 'Sign Up' : 'Sign In'}
      </button>
      <button
        type="button"
        onClick={() => setIsSignUp(!isSignUp)}
        className="text-sm text-blue-500"
      >
        {isSignUp ? 'Have an account? Sign In' : 'No account? Sign Up'}
      </button>
    </form>
  );
}
