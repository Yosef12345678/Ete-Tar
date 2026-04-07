'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);

  // Check if user is admin on page load
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    
    if (!token) {
      router.push('/login');
      return;
    }

    // Decode token to check role
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.role === 'admin') {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    } catch (err) {
      setIsAdmin(false);
    }
    
    setChecking(false);
  }, [router]);

  const handlePromote = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setIsLoading(true);

    try {
      const token = localStorage.getItem('accessToken');
      
      const response = await fetch('http://localhost:3000/api/admin/promote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Promotion failed');
      }

      setMessage(data.message);
      setEmail('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-100 text-red-700 p-6 rounded-lg shadow-md text-center">
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p>You do not have permission to view this page.</p>
          <a href="/profile" className="text-blue-600 hover:underline mt-4 inline-block">
            Go to Profile
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
        
        {message && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
            {message}
          </div>
        )}
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        <div className="border-t pt-6">
          <h2 className="text-xl font-semibold mb-4">Promote User to Admin</h2>
          
          <form onSubmit={handlePromote}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">User Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="user@example.com"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
            >
              {isLoading ? 'Promoting...' : 'Promote to Admin'}
            </button>
          </form>
        </div>
        
        <div className="mt-8 pt-6 border-t">
          <a href="/profile" className="text-blue-600 hover:underline">
            ← Back to Profile
          </a>
        </div>
      </div>
    </div>
  );
}