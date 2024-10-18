'use client'

import React, { useState } from 'react';
import { User } from 'firebase/auth';
import { collection, Timestamp, setDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebase';

interface PostCreationProps {
  user: User;
  onPostCreated: () => void;
}

export default function PostCreation({ user, onPostCreated }: PostCreationProps) {
  const [text, setText] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const resizeImage = async (file: File, maxWidth: number, maxHeight: number): Promise<Blob> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d')!;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxWidth) {
              height *= maxWidth / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width *= maxHeight / height;
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob((blob) => {
            resolve(blob!);
          }, file.type);
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !text || !image) return;

    setUploading(true);
    setError(null);

    try {
      console.log('Starting post creation process');
      console.log('User ID:', user.uid);
      console.log('Text content:', text);

      // Upload images
      console.log('Resizing and uploading images');
      const smallImage = await resizeImage(image, 400, 300);
      const mediumImage = await resizeImage(image, 800, 600);

      const smallImageRef = ref(storage, `posts/${user.uid}/${Date.now()}_small`);
      const mediumImageRef = ref(storage, `posts/${user.uid}/${Date.now()}_medium`);

      await uploadBytes(smallImageRef, smallImage);
      await uploadBytes(mediumImageRef, mediumImage);

      const smallImageUrl = await getDownloadURL(smallImageRef);
      const mediumImageUrl = await getDownloadURL(mediumImageRef);

      console.log('Images uploaded successfully');
      console.log('Small image URL:', smallImageUrl);
      console.log('Medium image URL:', mediumImageUrl);

      // Create Firestore document
      console.log('Creating Firestore document');
      const postData = {
        text,
        smallImageUrl,
        mediumImageUrl,
        createdAt: Timestamp.now(),
        userId: user.uid,
      };

      console.log('Post data:', postData);

      // Try using setDoc instead of addDoc
      const newPostRef = doc(collection(db, 'posts'));
      await setDoc(newPostRef, postData);

      console.log('Firestore document created successfully', newPostRef.id);

      setText('');
      setImage(null);
      onPostCreated();
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      if (error instanceof Error) {
        setError(`Failed to create post: ${error.message}`);
      } else {
        setError('An unknown error occurred while creating the post');
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 bg-beige-50 p-6 rounded-lg shadow-md">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="What's on your mind?"
        className="w-full p-2 mb-4 border rounded bg-white"
        required
      />
      <input
        type="file"
        onChange={handleImageChange}
        accept="image/*"
        className="mb-4"
        required
      />
      {image && (
        <p className="mb-4 text-beige-700">Selected image: {image.name}</p>
      )}
      <button
        type="submit"
        disabled={uploading}
        className="px-4 py-2 bg-beige-500 text-white rounded hover:bg-beige-600 transition-colors disabled:opacity-50"
      >
        {uploading ? 'Uploading...' : 'Post'}
      </button>
      {error && (
        <p className="mt-4 text-red-500">{error}</p>
      )}
    </form>
  );
}