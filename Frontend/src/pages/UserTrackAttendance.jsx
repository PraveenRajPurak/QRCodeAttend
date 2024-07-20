import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserTrackAttendance = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    trackSelfAttendance();
  }, []);

  const trackSelfAttendance = async () => {
    try {
      const response = await axios.post('/user/track-self-attendance');
      setAttendanceRecords(response.data.data.attendanceRecord);
      console.log(response.data.data);
    } catch (error) {
      console.error('Error tracking self attendance:', error);
    }
  };

  return (
    <div className="track-attendance">
      <h1>Track Attendance</h1>
      <div className="attendance-records">
        {attendanceRecords.length > 0 ? (
          attendanceRecords.map((record) => (
            <div key={record.courseId} className="attendance-record">
              <h2>{record.courseName}</h2>
              <p>Total Classes: {record.totalClasses}</p>
              <p>Attended Classes: {record.attendedClassesCount}</p>
              <p>Attendance Percentage: {record.attendancePercentage.toFixed(2)}%</p>
            </div>
          ))
        ) : (
          <p>No attendance records found.</p>
        )}
      </div>
      <button onClick={() => navigate('/user-dashboard')}>Back to Dashboard</button>
    </div>
  );
};

export default UserTrackAttendance;
