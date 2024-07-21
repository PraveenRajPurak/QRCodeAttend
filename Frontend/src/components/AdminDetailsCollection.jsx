import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import apiClient from '../config/apiClient';

function AdminDetailsCollection({ phoneNumber } ) {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        institutionType: 'college',
    });

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match");
            setLoading(false);
            return;
        }

        const data = new URLSearchParams();
        data.append('phoneNumber', phoneNumber);
        for (const key in formData) {
            data.append(key, formData[key]);
        }

        try {
            const response = await apiClient.post('/api/v1/owner/register', data, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            });
            console.log('Admin signed up successfully', response.data);
            navigate('/admin-login');
            setLoading(false);
        } catch (error) {
            console.error('Error signing up user', error);
            setLoading(false);
        }
    };

    return (
        <section className="bg-gray-50 dark:bg-gray-900">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            Create an account
                        </h1>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Confirm Password
                                </label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Institution Type
                                </label>
                                <select
                                    name="institutionType"
                                    value={formData.institutionType}
                                    onChange={handleChange}
                                    className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                                    required
                                >
                                    <option value="college">College</option>
                                </select>
                            </div>
                            <button
                                type="submit"
                                className="bg-blue-500 text-white p-2 rounded-md w-full"
                                disabled={loading}
                            >
                                {loading ? 'Signing Up...' : 'Sign Up'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default AdminDetailsCollection;
