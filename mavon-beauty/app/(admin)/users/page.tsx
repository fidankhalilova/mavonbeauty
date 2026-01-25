"use client"
import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, AlertCircle } from 'lucide-react';

interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
}

const API_BASE_URL = 'http://localhost:5000/api/v1';
export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`${API_BASE_URL}/auth/users`);
            const data = await response.json();
            
            if (data.success) {
                setUsers(data.data || []);
            } else {
                setError('Failed to fetch users');
            }
        } catch (err) {
            setError('Error connecting to server');
            console.error('Error fetching users:', err);
        } finally {
            setLoading(false);
        }
    };

    const deleteUser = async (id: string) => {
        if (!confirm('Are you sure you want to delete this user?')) return;
        
        try {
            const response = await fetch(`${API_BASE_URL}/auth/users/${id}`, {
                method: 'DELETE'
            });
            const data = await response.json();
            
            if (data.success) {
                setUsers(users.filter(u => u._id !== id));
            } else {
                alert('Failed to delete user');
            }
        } catch (err) {
            alert('Error deleting user');
            console.error('Error:', err);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    if (loading) {
        return (
            <div className="text-center py-12">
                <div className="inline-block w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-600">Loading users...</p>
            </div>
        );
    }

    return (
        <div>
            {error && (
                <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    <span className="text-red-700">{error}</span>
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Name</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Email</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Role</th>
                                <th className="px-6 py-4 text-center text-sm font-medium text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                        No users found
                                    </td>
                                </tr>
                            ) : (
                                users.map((user, idx) => (
                                    <tr key={user._id} className={idx > 0 ? 'border-t border-emerald-50' : ''}>
                                        <td className="px-6 py-4 text-gray-800">{user.name}</td>
                                        <td className="px-6 py-4 text-gray-600">{user.email}</td>
                                        <td className="px-6 py-4">
                                            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm">
                                                {user.role || 'User'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <button className="p-2 hover:bg-emerald-50 rounded-lg text-emerald-600 transition-colors">
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button 
                                                    onClick={() => deleteUser(user._id)}
                                                    className="p-2 hover:bg-rose-50 rounded-lg text-rose-600 transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}