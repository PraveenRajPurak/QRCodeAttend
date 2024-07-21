import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/UserDashboard.css';

const UserDashboard = () => {
  const [student, setStudent] = useState({});
  const [courses, setCourses] = useState([]);
  const [enrollCode, setEnrollCode] = useState('');
  const [showEnrollForm, setShowEnrollForm] = useState(false);

  const token = localStorage.getItem('authToken');

  const navigate = useNavigate();

  useEffect(() => {
    fetchStudentData();
    fetchCourses();
  }, []);

  const fetchStudentData = async () => {
    
      const response = await axios.get('https://qrcodeattend.onrender.com/api/v1/student/get-student-data', 
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

     // const token = localStorage.getItem('authToken');
      setStudent(response.data.message);
      console.log(response.data);
   
  };

  const fetchCourses = async () => {
    try {
      const response = await axios.get('https://qrcodeattend.onrender.com/api/v1/student/get-courses',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
        
      );
      setCourses(response.data.message);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const handleEnroll = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://qrcodeattend.onrender.com/api/v1/course/enroll-in-a-course', 
        { code: enrollCode },{
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      alert(response.data.data);
      fetchCourses(); 
      setShowEnrollForm(false);
    } catch (error) {
      console.error('Error enrolling in course:', error);
    }
  };

  const handleCourseClick = (courseId) => {
    navigate(`/user-class-track/${courseId}`);
  };

  return (
    <div className="user-dashboard">
      <h1>User Dashboard</h1>
      <div className="student-details">
        <h2>Student Details</h2>
        <p>Enrollment Number: {student.enrollNo}</p>
        <p>Batch: {student.batch}</p>
      </div>
      <div className="courses-list">
        <h2>Courses Enrolled In</h2>
        <ul>
          {courses.map((course) => (
            <li key={course._id}>
              <button
                className="course-button"
                onClick={() => handleCourseClick(course._id)}
              >
                <p>Course Name: {course.name}</p>
                <p>Course Code: {course.code}</p>
                <p>Professor: {course.professorName}</p>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <button onClick={() => setShowEnrollForm(!showEnrollForm)}>
        {showEnrollForm ? 'Cancel' : 'Enroll in a Course'}
      </button>
      {showEnrollForm && (
        <form onSubmit={handleEnroll} className="enroll-form">
          <label htmlFor="courseCode">Course Code:</label>
          <input
            type="text"
            id="courseCode"
            value={enrollCode}
            onChange={(e) => setEnrollCode(e.target.value)}
            required
          />
          <button type="submit">Enroll</button>
        </form>
      )}
      <button onClick={() => navigate('/user-track-attendance')}>
        Track Attendance
      </button>
    </div>
  );
};

export default UserDashboard;
