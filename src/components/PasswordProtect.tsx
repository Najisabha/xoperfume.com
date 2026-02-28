"use client";

import { useState, useEffect } from 'react';

export default function PasswordProtect({ children }: { children: React.ReactNode }) {
  const [authorized, setAuthorized] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [loading, setLoading] = useState(true);

  const correctPassword = 'xo123';
  const storageKey = 'xoperfumes-auth';
  const fourHoursInMs = 4 * 60 * 60 * 1000; // 4 hours in milliseconds

  // Check localStorage on component mount
  useEffect(() => {
    const authData = localStorage.getItem(storageKey);

    if (authData) {
      try {
        const { timestamp } = JSON.parse(authData);
        const currentTime = new Date().getTime();

        // Check if the timestamp is less than 4 hours old
        if (currentTime - timestamp < fourHoursInMs) {
          setAuthorized(true);
        } else {
          // Clear expired auth data
          localStorage.removeItem(storageKey);
        }
      } catch (error) {
        // If parsing fails, clear invalid data
        localStorage.removeItem(storageKey);
      }
    }

    setLoading(false);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === correctPassword) {
      // Store auth status with current timestamp
      const authData = {
        timestamp: new Date().getTime()
      };
      localStorage.setItem(storageKey, JSON.stringify(authData));
      setAuthorized(true);
    } else {
      alert('Incorrect password');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (authorized) {
    return <>{children}</>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <form onSubmit={handleSubmit} className="text-center">
          <h1 className="text-2xl font-bold mb-4">Site Under Maintenance</h1>
          <p className="mb-6 text-gray-600">Please enter the password to continue.</p>
          <input
            type="password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            className="w-full border rounded-md p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="Password"
            autoFocus
          />
          <button
            type="submit"
            className="w-full bg-black text-white px-4 py-3 rounded-md hover:bg-gray-800 transition"
          >
            Enter
          </button>
        </form>
      </div>
    </div>
  );
}