"use client";

import { useState } from "react";
import { Phone, MapPin } from "lucide-react";
import { API_BASE_URL } from "@/lib/api";

interface ProfileCompletionFormProps {
  onComplete: () => void;
}

export default function ProfileCompletionForm({ onComplete }: ProfileCompletionFormProps) {
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Client-side validation
    if (!phone || phone.trim() === '') {
      setError('Phone number is required');
      return;
    }

    if (!city || city.trim() === '') {
      setError('City is required');
      return;
    }

    // Validate phone format
    const phoneRegex = /^\+?[0-9]{10,15}$/;
    if (!phoneRegex.test(phone.trim())) {
      setError('Please enter a valid phone number (10-15 digits)');
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setError('No authentication token found. Please log in again.');
        setIsLoading(false);
        return;
      }

      const requestData = {
        phone: phone.trim(),
        location: {
          city: city.trim()
        }
      };

      console.log('📤 Sending profile completion request:', requestData);

      const response = await fetch(`${API_BASE_URL}/api/auth/complete-profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestData)
      });

      console.log('📥 Response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Profile completed successfully:', data);
        onComplete();
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Failed to complete profile' }));
        console.error('❌ Backend error:', errorData);
        setError(errorData.message || 'Failed to complete profile');
      }
    } catch (error: any) {
      console.error('❌ Error completing profile:', error);
      setError(error.message || 'Network error. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-white/80 backdrop-blur-lg rounded-2xl border border-gray-200 shadow-2xl">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-slate-900">
          Complete Your Profile
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Just a couple more details to get you started
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        {/* Phone Number with Animated Label */}
        <div className="relative z-0">
          <input
            type="tel"
            id="floating_phone"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              setError('');
            }}
            className="block py-2.5 px-0 w-full text-sm text-slate-900 bg-transparent border-0 border-b-2 border-gray-400 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
          />
          <label
            htmlFor="floating_phone"
            className="absolute text-sm text-slate-600 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            <Phone className="inline-block mr-2 -mt-1" size={16} />
            Phone Number
          </label>
        </div>

        {/* City with Animated Label */}
        <div className="relative z-0">
          <input
            type="text"
            id="floating_city"
            value={city}
            onChange={(e) => {
              setCity(e.target.value);
              setError('');
            }}
            className="block py-2.5 px-0 w-full text-sm text-slate-900 bg-transparent border-0 border-b-2 border-gray-400 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
          />
          <label
            htmlFor="floating_city"
            className="absolute text-sm text-slate-600 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            <MapPin className="inline-block mr-2 -mt-1" size={16} />
            City
          </label>
        </div>

        {error && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || !phone.trim() || !city.trim()}
          className="w-full flex items-center justify-center py-3 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent focus:ring-blue-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Completing...' : 'Complete Profile'}
        </button>
      </form>

      <p className="text-center text-xs text-slate-600">
        This information helps us provide you with better event recommendations
      </p>
    </div>
  );
}

