import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import {
  Input,
  Ripple,
  initTWE,
} from "tw-elements";

initTWE({ Input, Ripple });

const colleges = [
  'Zenith Institute of Technology',
  'Apex Engineering College',
  'Stellar University of Engineering',
  'Horizon Technical Institute',
  'Quantum College of Technology',
  'Nova Institute of Engineering',
  'Vertex Academy of Engineering',
  'Echo Institute of Technology',
  'Pinnacle College of Engineering',
  'Ascend University of Technology',
];

const batches = [
  '1yrf5',
  '1yrf6',
  '2yrf5',
  '2yrf6',
  '3yrf5',
  '3yrf6',
  '4yrf5',
  '4yrf6',
];

function UserStudentSetup() {
  const [enrollNo, setEnrollNo] = useState('');
  const [instituteName, setInstituteName] = useState('');
  const [batch, setBatch] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://qrcodeattend.onrender.com/api/v1/student/setup-student', {
        enrollNo,
        institute_name: instituteName,
        batch,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      }
    );
      if (response.status === 201) {
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
                <p className="mb-0 me-4 text-lg text-centre">Set up your Student Account</p>
              </div>
              <div className="relative mb-6">
                <label
                  htmlFor="enrollNo"
                  className="mr-4"
                >
                  Enrollment Number
                </label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded"
                  id="enrollNo"
                  placeholder="Enrollment Number"
                  value={enrollNo}
                  onChange={(e) => setEnrollNo(e.target.value)}
                  style={{ marginBottom: '10px' }}
                />
              </div>
              <div className="relative mb-6">
                <label
                  htmlFor="instituteName"
                  className="block mb-2"
                >
                  College
                </label>
                <select
                  className="w-full p-2 border border-gray-300 rounded"
                  id="instituteName"
                  value={instituteName}
                  onChange={(e) => setInstituteName(e.target.value)}
                  style={{ marginBottom: '10px' }}
                >
                  <option value="" disabled>
                    Select College
                  </option>
                  {colleges.map((college) => (
                    <option key={college} value={college}>
                      {college}
                    </option>
                  ))}
                </select>
              </div>
              <div className="relative mb-6">
                <label
                  htmlFor="batch"
                  className="block mb-2"
                >
                  Batch
                </label>
                <select
                  className="w-full p-2 border border-gray-300 rounded"
                  id="batch"
                  value={batch}
                  onChange={(e) => setBatch(e.target.value)}
                  style={{ marginBottom: '10px' }}
                >
                  <option value="" disabled>
                    Select Batch
                  </option>
                  {batches.map((batch) => (
                    <option key={batch} value={batch}>
                      {batch}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                className="w-full p-2 bg-blue-600 text-white rounded"
                style={{ cursor: 'pointer' }}
              >
                Set Up
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default UserStudentSetup;
