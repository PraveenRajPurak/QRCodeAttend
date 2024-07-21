import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/ProfessorDashboard.css';
import apiClient from '../config/apiClient';

const ProfessorDashboard = () => {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await apiClient.get('/api/v1/professor/courses-taught-by-professor');
        if (response.status === 200) {
          setCourses(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
        alert('Failed to fetch courses. Please try again.');
      }
    };

    fetchCourses();
  }, []);

  const handleCourseClick = (courseId) => {
    navigate(`/course-details/${courseId}`);
  };

  return (
    <section>
      <h1>Courses Taught</h1>
      <div className="course-list">
        {courses.map((course) => (
          <button
            key={course._id}
            onClick={() => handleCourseClick(course._id)}
            className="course-button"
          >
            {course.name} ({course.code})
          </button>
        ))}
      </div>
    </section>
  );
};

export default ProfessorDashboard;
