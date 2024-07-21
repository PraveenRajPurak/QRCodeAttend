import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import {
  Input,
  Ripple,
  initTWE,
} from "tw-elements";

initTWE({ Input, Ripple });


function AdminCollegeSetup() {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [website, setWebsite] = useState('');
  const [officeEmailId, setOfficeEmailId] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/v1/college/setup-college', {
        name,
        location,
        website,
        officeEmailId,
      });
      if (response.status === 200) {
        navigate('/user-dashboard');
      }
    } catch (error) {
      console.error('Error setting up student:', error);
      alert('Failed to set up student. Please try again.');
    }
  };

  return (
    <section className="h-screen">
      <div className="h-full">
        <div className="flex h-full flex-wrap items-center justify-center lg:justify-between">
          <div className="shrink-1 mb-12 grow-0 basis-auto md:mb-0 md:w-9/12 md:shrink-0 lg:w-6/12 xl:w-6/12">
            <img
              src="https://tecdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
              className="w-full"
              alt="Sample image"
            />
          </div>
          <div className="mb-12 md:mb-0 md:w-8/12 lg:w-5/12 xl:w-5/12">
            <form onSubmit={handleSubmit} style={{ padding: '20px', borderRadius: '8px', boxShadow: '2px 4px 6px rgba(0, 0, 0, 0.1)', marginRight : "20px"}}>
              <div className="flex items-center justify-center mb-6">
                <p className="mb-0 me-4 text-lg text-centre">Set up your College</p>
              </div>
              <div className="relative mb-6">
                <label
                  htmlFor="name"
                  className="mr-4"
                >
                  Name of the College
                </label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded"
                  id="name"
                  placeholder="Enter College Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ marginBottom: '10px' }}
                />
              </div>
              <div className="relative mb-6">
                <label
                  htmlFor="location"
                  className="block mb-2"
                >
                  Location
                </label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded"
                  id="location"
                  placeholder="Enter Location"
                  value={location} 
                  onChange={(e) => setLocation(e.target.value)}
                  style={{ marginBottom: '10px' }}
                />
              </div>
              <div className="relative mb-6">
                <label
                  htmlFor="batch"
                  className="block mb-2"
                >
                  Website
                </label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded"
                  id="website"
                  placeholder="Enter Website"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  style={{ marginBottom: '10px' }}
                />
              </div>
              <div className="relative mb-6">
                <label
                  htmlFor="batch"
                  className="block mb-2"
                >
                  Office Email Id
                </label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded"
                  id="officeEmailId"
                  placeholder="Enter Office Email Id"
                  value={officeEmailId}
                  onChange={(e) => setOfficeEmailId(e.target.value)}
                  style={{ marginBottom: '10px' }}
                />
              </div>

              <button
                type="submit"
                className="w-full p-2 bg-blue-600 text-white rounded"
                style={{ cursor: 'pointer' }}
              >
                Set Up the college
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AdminCollegeSetup;
