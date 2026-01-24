"use client"
import React, { useState, useEffect } from 'react';
import { Users, Package, Sparkles, AlertCircle } from 'lucide-react';

interface User {
    _id: string;
    name: string;
    email: string;
}

interface Stats {
    totalProducts: number;
    totalStock: number;
}

const API_BASE_URL = 'http://localhost:5000/api/v1';

export default function DashboardPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [stats, setStats] = useState<Stats>({ totalProducts: 0, totalStock: 0 });
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

    const fetchStats = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/products/stats`);
            const data = await response.json();
            
            if (data.success) {
                setStats(data.data);
            }
        } catch (err) {
            console.error('Error fetching stats:', err);
        }
    };

    useEffect(() => {
        fetchUsers();
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="text-center py-12">
                <div className="inline-block w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-600">Loading...</p>
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Total Users</p>
                            <p className="text-3xl font-semibold text-gray-800 mt-2">{users.length}</p>
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                            <Users className="w-6 h-6 text-white" />
                        </div>
                    </div>
                </div>
                
                <div className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Total Products</p>
                            <p className="text-3xl font-semibold text-gray-800 mt-2">{stats.totalProducts}</p>
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                            <Package className="w-6 h-6 text-white" />
                        </div>
                    </div>
                </div>
                
                <div className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Total Stock</p>
                            <p className="text-3xl font-semibold text-gray-800 mt-2">{stats.totalStock}</p>
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                            <Sparkles className="w-6 h-6 text-white" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}