import React, { useState } from 'react';
import { CalendarIcon, ChevronDownIcon } from 'lucide-react';

const Profile = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    gender: 'Male',
    dateOfBirth: '',
    mobileNumber: '',
    pincode: '',
    addressLine1: '',
    addressLine2: '',
    country: 'India',
    state: '',
    city: '',
    referralSource: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  const handleReset = () => {
    setFormData({
      firstName: '',
      lastName: '',
      gender: 'Male',
      dateOfBirth: '',
      mobileNumber: '',
      pincode: '',
      addressLine1: '',
      addressLine2: '',
      country: 'India',
      state: '',
      city: '',
      referralSource: ''
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">
          India<span className="text-orange-500">Po</span><span className="text-green-500">lls</span>
        </h1>
        <p className="text-gray-600">Please provide the following information to continue</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">First name**</label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              value={formData.firstName}
              onChange={(e) => setFormData({...formData, firstName: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Last Name**</label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              value={formData.lastName}
              onChange={(e) => setFormData({...formData, lastName: e.target.value})}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Gender*</label>
            <div className="mt-1 relative">
              <select
                className="block w-full rounded-md border border-gray-300 px-3 py-2 appearance-none"
                value={formData.gender}
                onChange={(e) => setFormData({...formData, gender: e.target.value})}
              >
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
              <ChevronDownIcon className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Date Of Birth**</label>
            <div className="mt-1 relative">
              <input
                type="date"
                className="block w-full rounded-md border border-gray-300 px-3 py-2"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
              />
              <CalendarIcon className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Mobile Number**</label>
            <input
              type="tel"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              value={formData.mobileNumber}
              onChange={(e) => setFormData({...formData, mobileNumber: e.target.value})}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Address Line 1**</label>
          <input
            type="text"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            value={formData.addressLine1}
            onChange={(e) => setFormData({...formData, addressLine1: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Address Line 2</label>
          <input
            type="text"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            value={formData.addressLine2}
            onChange={(e) => setFormData({...formData, addressLine2: e.target.value})}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Country</label>
            <div className="mt-1 relative">
              <select
                className="block w-full rounded-md border border-gray-300 px-3 py-2 appearance-none"
                value={formData.country}
                onChange={(e) => setFormData({...formData, country: e.target.value})}
              >
                <option>India</option>
              </select>
              <ChevronDownIcon className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">State*</label>
            <div className="mt-1 relative">
              <select
                className="block w-full rounded-md border border-gray-300 px-3 py-2 appearance-none"
                value={formData.state}
                onChange={(e) => setFormData({...formData, state: e.target.value})}
              >
                <option value="">Select State</option>
                {/* Add state options here */}
              </select>
              <ChevronDownIcon className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">City/Post Office*</label>
            <div className="mt-1 relative">
              <select
                className="block w-full rounded-md border border-gray-300 px-3 py-2 appearance-none"
                value={formData.city}
                onChange={(e) => setFormData({...formData, city: e.target.value})}
              >
                <option value="">Select City</option>
                {/* Add city options here */}
              </select>
              <ChevronDownIcon className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Referral Source**</label>
          <div className="mt-1 relative">
            <select
              className="block w-full rounded-md border border-gray-300 px-3 py-2 appearance-none"
              value={formData.referralSource}
              onChange={(e) => setFormData({...formData, referralSource: e.target.value})}
            >
              <option value="">Select Referral Source</option>
              {/* Add referral source options here */}
            </select>
            <ChevronDownIcon className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
          </div>
        </div>

        <div className="flex justify-center space-x-4">
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Submit
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="text-gray-700 px-6 py-2 rounded-md border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;