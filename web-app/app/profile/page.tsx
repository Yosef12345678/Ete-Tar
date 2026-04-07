'use client';

import { useState, useEffect } from 'react';

interface UserData {
  id: string;
  email: string;
  role: string;
}

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    console.log('Token exists?', !!token);
    
    if (!token) {
      window.location.href = '/login';
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        const userData = await response.json();

        if (!response.ok) {
          throw new Error(userData.error || 'Failed to fetch user');
        }
        
        setUser(userData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user:', error);
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold mb-6">My Profile</h1>
        
        {loading ? (
          <div className="text-center py-8">Loading your profile...</div>
        ) : user ? (
          <div className="space-y-4">
            <div>
              <label className="block text-gray-600 text-sm">User ID</label>
              <p className="text-gray-900 font-mono text-sm">{user.id}</p>
            </div>
            
            <div>
              <label className="block text-gray-600 text-sm">Email</label>
              <p className="text-gray-900">{user.email}</p>
            </div>
            
            <div>
              <label className="block text-gray-600 text-sm">Role</label>
              <p className="text-gray-900">
                {user.role === 'admin' ? 'Administrator' : 'Regular User'}
              </p>
            </div>
            
            {/* Admin Dashboard Link - MOVED INSIDE HERE */}
            {user.role === 'admin' && (
              <div className="pt-2">
                <a
                  href="/admin"
                  className="inline-block bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
                >
                  Admin Dashboard
                </a>
              </div>
            )}
            
            <div className="pt-6">
              <button
                onClick={() => {
                  localStorage.removeItem('accessToken');
                  localStorage.removeItem('refreshToken');
                  window.location.href = '/login';
                }}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center text-red-600">Failed to load profile</div>
        )}
      </div>
    </div>
  );
}