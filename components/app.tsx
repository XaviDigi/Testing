'use client'

import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { auth } from './firebase';
import Navbar from './Navbar';
// import AuthComponent from './AuthComponent';
import PostCreation from './PostCreation';
import PostFeed from './PostFeed';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [refreshPosts, setRefreshPosts] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  const handlePostCreated = () => {
    setRefreshPosts((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-beige-100">
      <Navbar user={user} />
      <main className="container mx-auto p-4">
        <h1 className="text-4xl font-bold text-beige-900 mb-8 text-center">Just testing Firebase</h1>
        <div className="space-y-8">
       
          {user && <PostCreation user={user} onPostCreated={handlePostCreated} />}
          <h2 className="text-2xl font-semibold text-beige-800 mb-4">Recent Posts</h2>
 
          <PostFeed key={refreshPosts.toString()} user={user || undefined} />
        </div>
        {/* {!user && (
          <div className="max-w-md mx-auto">
            <AuthComponent />
          </div>
        )} */}
      </main>
      <footer className="bg-beige-200 py-4 mt-12">
        <div className="container mx-auto text-center text-beige-700">
          &copy; 2024 XaviDigi. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
