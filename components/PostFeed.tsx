'use client';

import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs, Timestamp } from 'firebase/firestore';
import { db } from './firebase';
import Image from 'next/image'; // Import next/image for optimized image handling

interface Post {
  id: string;
  text: string;
  smallImageUrl: string;
  mediumImageUrl: string;
  createdAt: Timestamp;
  userId: string;
}

export default function PostFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      setError(null);
      try {
        const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const fetchedPosts = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Post[];
        setPosts(fetchedPosts);
      } catch (err) {
        console.error('Error fetching posts: ', err);
        setError('Failed to load posts. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  const handleImageClick = (url: string) => {
    setSelectedImage(url);
  };

  const handleCloseImage = () => {
    setSelectedImage(null);
  };

  if (loading) {
    return <div className="text-center py-4">Loading posts...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">{error}</div>;
  }

  if (posts.length === 0) {
    return <div className="text-center py-4">No posts yet. Be the first to share!</div>;
  }

  return (
    <div className="relative">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105"
          >
            {/* Using next/image for optimized images */}
            <Image
              src={post.mediumImageUrl}
              alt="Post"
              width={500}
              height={300}
              className="w-full h-48 object-cover cursor-pointer"
              onClick={() => handleImageClick(post.mediumImageUrl)} // Opens the image in larger view
            />
            <div className="p-4">
              <p className="text-beige-900 text-sm mb-2 line-clamp-3">{post.text}</p>
              <p className="text-beige-600 text-xs">
                {post.createdAt.toDate().toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Enlarged Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50"
          onClick={handleCloseImage} // Close modal when clicking anywhere on the modal background
        >
          {/* Using next/image for the enlarged modal as well */}
          <Image
            src={selectedImage}
            alt="Enlarged"
            width={1000}
            height={600}
            className="max-w-full max-h-full p-4 cursor-pointer"
            onClick={(e) => e.stopPropagation()} // Prevent click on image from closing modal
          />
        </div>
      )}
    </div>
  );
}
