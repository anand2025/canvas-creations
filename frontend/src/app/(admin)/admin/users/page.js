"use client";
import React, { useEffect, useState } from 'react';
import { adminApi } from '@/services/adminApi';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await adminApi.getUsers();
      setUsers(data); 
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading Users...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-3xl font-black text-foreground">Users</h1>
           <p className="text-foreground/50">View registered users</p>
        </div>
      </div>

      <div className="bg-card rounded-2xl shadow-sm border border-[var(--border-color)] overflow-hidden transition-colors duration-500">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
             <thead className="bg-secondary-bg border-b border-[var(--border-color)]">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">User ID</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y border-[var(--border-color)]">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-secondary-hover transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-foreground/40">{user.id.substring(0, 8)}...</td>
                  <td className="px-6 py-4 font-bold text-foreground">{user.email}</td>
                  <td className="px-6 py-4">
                     <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.role === 'admin' 
                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' 
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                    }`}>
                        {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        Active
                    </span>
                  </td>
                </tr>
              ))}
               {users.length === 0 && (
                <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                        No users found.
                    </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
