'use client'

import React from 'react';
import { User } from 'firebase/auth';
import { auth, googleProvider } from './firebase';
import { signInWithPopup } from 'firebase/auth';

interface NavbarProps {
  user: User | null;
}

export default function Navbar({ user }: NavbarProps) {
  const handleLogout = async () => {
    await auth.signOut();
  };

  const signIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      // User info can be managed here if needed
      console.log('User signed in:', result.user);
    } catch (error) {
      console.error('Error signing in with Google', error);
    }
  };

  return (
    <nav className="bg-beige-200 shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <a href="/" className="text-2xl font-bold text-beige-900 hover:text-beige-700 transition-colors">
          Login+Image+Text+Firebase
        </a>
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <span className="text-beige-700">{user.displayName}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-beige-500 text-white rounded-full hover:bg-beige-600 transition-colors text-sm font-medium"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={signIn}
              className="px-4 py-2 bg-beige-500 text-white rounded-full hover:bg-beige-600 transition-colors text-sm font-medium"
            >
              Sign in with Google
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
