"use client"
import React, { useState } from 'react';
import { Lock, Mail, Eye, EyeOff, Shield, Sparkles, User } from 'lucide-react';

interface FormData {
    name: string;
    surname: string;
    email: string;
    password: string;
    confirmPassword: string;
}

interface Errors {
    [key: string]: string;
}

export default function BeautyRegister() {
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
    const [formData, setFormData] = useState<FormData>({
        name: '',
        surname: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [errors, setErrors] = useState<Errors>({});

    const handleChange = (field: keyof FormData, value: string): void => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const handleSubmit = (): void => {
        const newErrors: Errors = {};
        
        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.surname.trim()) newErrors.surname = 'Surname is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        if (!formData.password) newErrors.password = 'Password is required';
        if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            alert('Registration successful!');
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-4">
            <div className="w-full max-w-xl">
                <div className="bg-white rounded-3xl shadow-xl p-8 border border-emerald-100">
                    {/* Logo */}
                    <div className="flex items-center justify-center gap-3 mb-8">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center">
                            <Sparkles className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-2xl font-light text-gray-800">Beauty Store</h1>
                    </div>

                    <div className="mb-8 text-center">
                        <h2 className="text-2xl font-medium text-gray-800 mb-2">Create Account</h2>
                        <p className="text-gray-500">Sign up to get started</p>
                    </div>

                    <div className="space-y-5">
                        {/* Name Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Name
                            </label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => handleChange('name', e.target.value)}
                                    placeholder="Enter your name"
                                    className={`w-full pl-12 pr-4 py-3 border ${errors.name ? 'border-rose-300' : 'border-emerald-200'} rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-300 transition-all`}
                                />
                            </div>
                            {errors.name && <p className="text-xs text-rose-500 mt-1 ml-4">{errors.name}</p>}
                        </div>

                        {/* Surname Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Surname
                            </label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    value={formData.surname}
                                    onChange={(e) => handleChange('surname', e.target.value)}
                                    placeholder="Enter your surname"
                                    className={`w-full pl-12 pr-4 py-3 border ${errors.surname ? 'border-rose-300' : 'border-emerald-200'} rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-300 transition-all`}
                                />
                            </div>
                            {errors.surname && <p className="text-xs text-rose-500 mt-1 ml-4">{errors.surname}</p>}
                        </div>

                        {/* Email Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleChange('email', e.target.value)}
                                    placeholder="you@example.com"
                                    className={`w-full pl-12 pr-4 py-3 border ${errors.email ? 'border-rose-300' : 'border-emerald-200'} rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-300 transition-all`}
                                />
                            </div>
                            {errors.email && <p className="text-xs text-rose-500 mt-1 ml-4">{errors.email}</p>}
                        </div>

                        {/* Password Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={formData.password}
                                    onChange={(e) => handleChange('password', e.target.value)}
                                    placeholder="Create a password"
                                    className={`w-full pl-12 pr-12 py-3 border ${errors.password ? 'border-rose-300' : 'border-emerald-200'} rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-300 transition-all`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {errors.password && <p className="text-xs text-rose-500 mt-1 ml-4">{errors.password}</p>}
                        </div>

                        {/* Confirm Password Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={formData.confirmPassword}
                                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
                                    placeholder="Confirm your password"
                                    className={`w-full pl-12 pr-12 py-3 border ${errors.confirmPassword ? 'border-rose-300' : 'border-emerald-200'} rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-300 transition-all`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {errors.confirmPassword && <p className="text-xs text-rose-500 mt-1 ml-4">{errors.confirmPassword}</p>}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-3 rounded-full font-medium hover:from-emerald-600 hover:to-teal-600 transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 mt-6"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Creating account...
                                </>
                            ) : (
                                <>
                                    <Lock className="w-5 h-5" />
                                    Create Account
                                </>
                            )}
                        </button>
                    </div>

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-emerald-100"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white text-gray-500">Or sign up with</span>
                        </div>
                    </div>

                    {/* Social Login */}
                    <div className="grid grid-cols-2 gap-3">
                        <button className="flex items-center justify-center gap-2 border border-emerald-100 rounded-full py-3 hover:bg-emerald-50 transition-colors">
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                            </svg>
                            <span className="text-sm font-medium text-gray-700">Google</span>
                        </button>
                        <button className="flex items-center justify-center gap-2 border border-emerald-100 rounded-full py-3 hover:bg-emerald-50 transition-colors">
                            <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                            </svg>
                            <span className="text-sm font-medium text-gray-700">Facebook</span>
                        </button>
                    </div>

                    {/* Sign In Link */}
                    <p className="text-center text-gray-600 mt-6">
                        Already have an account?{' '}
                        <a href="#" className="text-emerald-600 hover:text-emerald-700 font-medium">
                            Sign in
                        </a>
                    </p>

                    {/* Security Badge */}
                    <div className="flex items-center justify-center gap-2 mt-6 text-sm text-gray-500">
                        <Shield className="w-4 h-4" />
                        <span>Secure & encrypted</span>
                    </div>
                </div>
            </div>
        </div>
    );
}