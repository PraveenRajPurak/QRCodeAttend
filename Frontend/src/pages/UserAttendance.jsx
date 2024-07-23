import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import QrScanner from 'qr-scanner';
import '../styles/UserAttendance.css';

const UserAttendance = () => {
  const { classId } = useParams();
  const [classDetails, setClassDetails] = useState({});
  const [attendanceStatus, setAttendanceStatus] = useState('');
  const [isPresent, setIsPresent] = useState(false);
  const navigate = useNavigate();
  const videoRef = useRef(null);

  const token = localStorage.getItem('authToken');

  useEffect(() => {
    fetchClassDetails();
    checkAttendanceStatus();
  }, [classId]);

  const fetchClassDetails = async () => {
    try {
      const response = await axios.get(`https://qrcodeattend.onrender.com/api/v1/class/get-class-code/${classId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setClassDetails(response.data.message);
      console.log('Class details:', response.data.message);
    } catch (error) {
      console.error('Error fetching class details:', error);
    }
  };

  const checkAttendanceStatus = async () => {
    try {
      const response = await axios.get(`https://qrcodeattend.onrender.com/api/v1/class/get-attendance-of-a-student/${classId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setAttendanceStatus(response.data.message);
      console.log('Attendance status:', response.data.message);
      setIsPresent(true);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setAttendanceStatus('Absent');
      } else {
        console.error('Error checking attendance status:', error);
      }
    }
  };

  const handleMarkAttendance = async (code) => {
    try {
      const response = await axios.post(
        `https://qrcodeattend.onrender.com/api/v1/attendance/mark-attendance/${classId}`,
        { code: code },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setAttendanceStatus('Present');
      setIsPresent(true);
      console.log('Attendance marked successfully:', response.data.data);
    } catch (error) {
      console.error('Error marking attendance:', error);
    }
  };

  useEffect(() => {
    const qrScanner = new QrScanner(
      videoRef.current,
      (result) => {
        console.log('Decoded QR code:', result);
        handleMarkAttendance(result.data);
        qrScanner.stop(); // Stop scanning after successful scan
      },
      {
        onDecodeError: (error) => {
          console.error('Error decoding QR code:', error);
        },
      }
    );
    qrScanner.start();

    return () => {
      qrScanner.stop();
    };
  }, []);

  return (
    <div className="user-attendance">
      <h1>User Attendance</h1>
      <div className="class-details">
        <h2>Class Details</h2>
        {classDetails ? (
          <div>
            <p>Class Date: {classDetails.date}</p>
            <p>Start Time: {classDetails.startTime}</p>
            <p>End Time: {classDetails.endTime}</p>
          </div>
        ) : (
          <p>Loading class details...</p>
        )}
      </div>
      <div className="attendance-status">
        <h2>Attendance Status</h2>
        {isPresent ? (
          <p>You are already marked as {attendanceStatus}</p>
        ) : (
          <div>
            <p>You are currently marked as {attendanceStatus}</p>
            <video ref={videoRef} style={{ width: '100%' }} />
          </div>
        )}
      </div>
      <button onClick={() => navigate('/user-dashboard')}>Back to Dashboard</button>
    </div>
  );
};

export default UserAttendance;
