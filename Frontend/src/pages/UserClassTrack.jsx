import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const UserClassTrack = () => {
  const { courseId } = useParams();
  const [courseDetails, setCourseDetails] = useState({});
  const [classes, setClasses] = useState([]);
  const navigate = useNavigate();

  console.log("Course Id : ", courseId)

  useEffect(() => {
    fetchCourseDetails();
    fetchClasses();
  }, [courseId]);

  const fetchCourseDetails = async () => {
    try {
      const response = await axios.get(`/api/v1/course/get-course-details/${courseId}`);
      setCourseDetails(response.data.message);
      console.log(response.data.message);
    } catch (error) {
      console.error('Error fetching course details:', error);
    }
  };

  const fetchClasses = async () => {
    try {
      const response = await axios.get(`/api/v1/student/get-classes/${courseId}`);
      setClasses(response.data.message || []);
      console.log(response.data.message);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  return (
    <div className="class-track">
      <h1>Class Track</h1>
      <div className="course-details">
        <h2>Course Details</h2>
        {courseDetails ? (
          <div>
            <p>Name: {courseDetails.name}</p>
            <p>Code: {courseDetails.code}</p>
          </div>
        ) : (
          <p>Loading course details...</p>
        )}
      </div>
      <div className="classes">
        <h2>Classes</h2>
        {classes.length > 0 ? (
          classes.map((cls) => (
            <button
              key={cls._id}
              onClick={() => navigate(`/user-attendance/${cls._id}`)}
              className="class-button"
            >
              {cls.date} - {cls.startTime} to {cls.endTime}
            </button>
          ))
        ) : (
          <p>No classes found.</p>
        )}
      </div>
      <button onClick={() => navigate('/user-dashboard')}>Back to Dashboard</button>
    </div>
  );
};

export default UserClassTrack;
