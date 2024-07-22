import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const [college, setCollege] = useState(null);
  const [professors, setProfessors] = useState([]);
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  const fetchCollegeDetails = async () => {
    try {
      const response = await axios.get('https://qrcodeattend.onrender.com/api/v1/college/get-college',
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('AdminauthToken')}`
          }
        }
      );
      if (response.status === 200) {
        setCollege(response.data.message[0]);
        console.log("College : ", response.data.message[0]);
      }
    } catch (error) {
      console.error('Error fetching college details:', error);
      alert('Failed to fetch college details. Please try again.');
    }
  };

  const fetchProfessors = async (collegeId) => {
    try {
      const response = await axios.get(`https://qrcodeattend.onrender.com/api/v1/college/get-professors/${collegeId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('AdminauthToken')}`
          }
        }
      );
      if (response.status === 201) {
        setProfessors(response.data.data || []);
        console.log("Professors : ", response.data.data);
      }
    } catch (error) {
      console.error('Error fetching professors:', error);
      alert('Failed to fetch professors. Please try again.');
    }
  };

  const fetchCourses = async (collegeId) => {
    try {
      const response = await axios.get(`https://qrcodeattend.onrender.com/api/v1/college/courses-in-a-college/${collegeId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('AdminauthToken')}`
          }
        }
      );
      if (response.status === 200) {
        setCourses(response.data.message || []);
        console.log("Courses : ", response.data.message);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      alert('Failed to fetch courses. Please try again.');
    }
  };

  useEffect(() => {
    fetchCollegeDetails();
  }, []);

  useEffect(() => {
    if (college && college._id) {
      console.log("College Id: ", college._id)
      fetchProfessors(college._id);
      fetchCourses(college._id);
    }
  }, [college]);

  const handleProfessorSetup = () => {
    navigate(`/admin-professor-setup/${college._id}`);
  };

  const handleCourseSetup = () => {
    navigate(`/admin-course-setup/${college._id}`);
  };

  const handleClassSetup = (courseId) => {
    navigate(`/classes-setup/${courseId}`);
  };

  return (
    <section>
      {college && (
        <div className="college-details">
          <h1>{college.name}</h1>
          <p>Address: {college.location}</p>
          <p>Website: <a href={college.website} target="_blank" rel="noopener noreferrer">{college.website}</a></p>
          <p>Official Email: {college.officeEmailId}</p>
        </div>
      )}

      <div className="professor-records">
        <h2>Professors</h2>
        {professors.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Courses</th>
              </tr>
            </thead>
            <tbody>
              {professors.map((professor, index) => (
                <tr key={index}>
                  <td>{professor.name}</td>
                  <td>
                    {professor.courses.map((course, idx) => (
                      <span key={idx}>{course.name} ({course.code}) </span>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No professor found</p>
        )}
        <button onClick={handleProfessorSetup}>Set up new professors</button>
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
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course, index) => (
                <tr key={index}>
                  <td>{course.name}</td>
                  <td>{course.code}</td>
                  <td>
                    {course.professors.map((prof, idx) => (
                      <span key={idx}>{prof.name} ({prof.profId}) </span>
                    ))}
                  </td>
                  <td>
                    <button onClick={() => handleClassSetup(course._id)}>Setup Classes</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No course found</p>
        )}
        <button onClick={handleCourseSetup}>Set up new courses</button>
      </div>
    </section>
  );
};

export default AdminDashboard;
