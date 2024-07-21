import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/AdminCourseSetup.css';

const AdminCourseSetup = () => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [profId, setProfId] = useState('');
  const [courses, setCourses] = useState([]);
  const [message, setMessage] = useState('');
  const { collegeId } = useParams();
  const navigate = useNavigate();

  const fetchCourses = async () => {
    try {
      const response = await axios.get(`https://qrcodeattend.onrender.com/api/v1/college/courses-in-a-college/${collegeId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('AdminauthToken')}`
          }
        }
      );
      if (response.status === 200) {
        setCourses(response.data.message);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      alert('Failed to fetch courses. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://qrcodeattend.onrender.com/api/v1/course/setup-course', {
        name,
        code,
        profId
      },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('AdminauthToken')}`
      }
    });

      if (response.status === 201) {
        setMessage('Course created successfully');
        fetchCourses(); // Fetch the updated list of courses
        setName('');
        setCode('');
        setProfId('');
      }
    } catch (error) {
      console.error('Error setting up course:', error);
      alert('Failed to set up course. Please try again.');
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleGoBack = () => {
    navigate(`/admin-dashboard`);
  };

  return (
    <section>
      <div className="form-container">
        <h2>Setup Course</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Course Name:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="code">Course Code:</label>
            <input
              type="text"
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="profId">Professor ID:</label>
            <input
              type="text"
              id="profId"
              value={profId}
              onChange={(e) => setProfId(e.target.value)}
              required
            />
          </div>
          <button type="submit">Setup Course</button>
        </form>
        {message && <p className="message">{message}</p>}
      </div>

      <div className="course-records">
        <h2>Courses</h2>
        {courses.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Code</th>
                <th>Professor</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course, index) => (
                <tr key={index}>
                  <td>{course.name}</td>
                  <td>{course.code}</td>
                  <td>
                    {course.professors.map((professor, idx) => (
                      <span key={idx}>{professor.name} ({professor.profId}) </span>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No courses found</p>
        )}
      </div>

      <button className="back-button" onClick={handleGoBack}>Go back to Admin Dashboard</button>
    </section>
  );
};

export default AdminCourseSetup;
