'use client'

import React from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider, db } from './firebase';
import { collection, addDoc } from 'firebase/firestore';

export default function AuthComponent() {
  const signIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      await addDoc(collection(db, 'users'), {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
      });
    } catch (error) {
      console.error('Error signing in with Google', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] bg-beige-50 rounded-lg shadow-md p-8">
      <h2 className="text-3xl font-bold text-beige-900 mb-6">Join to test</h2>
      <button
        onClick={signIn}
        className="px-6 py-3 bg-beige-500 text-white rounded-full hover:bg-beige-600 transition-colors text-lg font-semibold"
      >
        Sign in with Google
      </button>
    </div>
  );
}