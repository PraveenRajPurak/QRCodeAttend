import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/CourseDetails.css';

const CourseDetails = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [classes, setClasses] = useState([]);
  const navigate = useNavigate();

  const proftoken = localStorage.getItem('ProfauthToken');

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await axios.get(`https://qrcodeattend.onrender.com/api/v1/course/get-course-details/${courseId}`);
        if (response.status === 200) {
          setCourse(response.data.message);
        }
      } catch (error) {
        console.error('Error fetching course details:', error);
        alert('Failed to fetch course details. Please try again.');
      }
    };

    const fetchAttendanceRecords = async () => {
      try {
        const response = await axios.get(`https://qrcodeattend.onrender.com/api/v1/course/get-attendance/${courseId}`);
        if (response.status === 200) {
          setAttendanceRecords(response.data.message || []);
        }
      } catch (error) {
        console.error('Error fetching attendance records:', error);
        alert('Failed to fetch attendance records. Please try again.');
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

    fetchCourseDetails();
    fetchAttendanceRecords();
    fetchClasses();
  }, [courseId]);

  const handleClassClick = async (classId) => {

    console.log("Class ID : ", classId);
    console.log("Prof Token : ", proftoken);
    try {
      const response = await axios.post(
        `https://qrcodeattend.onrender.com/api/v1/attendance/create-attendance/${classId}`,
        {
          headers: {
            Authorization: `Bearer ${proftoken}`,
          },
        }
      );

      if (response.status === 200) {
        navigate(`/professor-take-attendance/${classId}`);
      } else {
        console.error('Failed to make class regular:', response.data.message);
        alert('Failed to make class regular. Please try again.');
      }
    } catch (error) {
      console.error('Error making class regular:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <section>

      <h2 style = {{textAlign : "center", fontSize: "24px", marginBottom : "20px", fontWeight: "bold"}}>Course Details</h2>

      {course && (
        <div className="course-header">
          <h1>{course.name} ({course.code})</h1>
        </div>
      )}

      <hr style = {{marginBottom : "20px"}}/>

      <div className="attendance-records">
        <h2>Attendance Records</h2>
        <table>
          <thead>
            <tr>
              <th>Enrollment No</th>
              <th>Attendance Count</th>
              <th>Attendance Percentage</th>
            </tr>
          </thead>
          <tbody>
            {attendanceRecords.map((record, index) => (
              <tr key={index}>
                <td>{record.studentInfo.enrollNo}</td>
                <td>{record.studentInfo.attendanceCount}</td>
                <td>{record.attendancePercentage.toFixed(2)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="class-list">
        <h2>Classes</h2>
        {classes.map((classItem) => (
          <button
            key={classItem._id}
            onClick={() => handleClassClick(classItem._id)}
            className="class-button"
          >
            {new Date(classItem.date).toLocaleDateString()} ({classItem.startTime} - {classItem.endTime})
          </button>
        ))}
      </div>
    </section>
  );
};

export default CourseDetails;
