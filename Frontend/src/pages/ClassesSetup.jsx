import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/ClassesSetup.css';

const ClassesSetup = () => {
  const { courseId } = useParams();
  const [courseDetails, setCourseDetails] = useState(null);
  const [classes, setClasses] = useState([]);
  const [courseCode, setCourseCode] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const fetchCourseDetails = async () => {
    try {
      const response = await axios.get(`https://qrcodeattend.onrender.com/api/v1/course/get-course-details/${courseId}`);
      if (response.status === 200) {
        setCourseDetails(response.data.message);
      }
    } catch (error) {
      console.error('Error fetching course details:', error);
      alert('Failed to fetch course details. Please try again.');
    }
  };

  const fetchClasses = async () => {
    try {
      const response = await axios.get(`https://qrcodeattend.onrender.com/api/v1/course/get-classes/${courseId}`);
      if (response.status === 200) {
        setClasses(response.data.message || []);
      }
    } catch (error) {
      console.error('Error fetching classes:', error);
      alert('Failed to fetch classes. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://qrcodeattend.onrender.com/api/v1/class/create-class', {
        courseCode,
        date,
        startTime,
        endTime
      },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('OwnerauthToken')}`,
      },
    });

      if (response.status === 201) {
        setMessage('Class created successfully');
        fetchClasses(); // Fetch the updated list of classes
        setCourseCode('');
        setDate('');
        setStartTime('');
        setEndTime('');
      }
    } catch (error) {
      console.error('Error creating class:', error);
      alert('Failed to create class. Please try again.');
    }
  };

  useEffect(() => {
    fetchCourseDetails();
    fetchClasses();
  }, []);

  const handleGoBack = () => {
    navigate(`/admin-dashboard`);
  };

  return (
    <section>
      <div className="course-details">
        <h2>Course Details</h2>
        {courseDetails ? (
          <div>
            <p><strong>Name:</strong> {courseDetails.name}</p>
            <p><strong>Code:</strong> {courseDetails.code}</p>
          </div>
        ) : (
          <p>Loading course details...</p>
        )}
      </div>

      <div className="class-records">
        <h2>Classes</h2>
        {classes.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Start Time</th>
                <th>End Time</th>
              </tr>
            </thead>
            <tbody>
              {classes.map((cls, index) => (
                <tr key={index}>
                  <td>{cls.date}</td>
                  <td>{cls.startTime}</td>
                  <td>{cls.endTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No classes found</p>
        )}
      </div>

      <div className="form-container">
        <h2>Create Class</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="courseCode">Course Code:</label>
            <input
              type="text"
              id="courseCode"
              value={courseCode}
              onChange={(e) => setCourseCode(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="date">Date:</label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="startTime">Start Time:</label>
            <input
              type="time"
              id="startTime"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="endTime">End Time:</label>
            <input
              type="time"
              id="endTime"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
            />
          </div>
          <button type="submit">Create Class</button>
        </form>
        {message && <p className="message">{message}</p>}
      </div>

      <button className="back-button" onClick={handleGoBack}>Go back to Admin Dashboard</button>
    </section>
  );
};

export default ClassesSetup;
