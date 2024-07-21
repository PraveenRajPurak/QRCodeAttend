import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import QRCode from 'qrcode.react';
import '../styles/ProfessorTakeAttendance.css';

const ProfessorTakeAttendance = () => {
  const { classId } = useParams();
  const [classDetails, setClassDetails] = useState(null);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const navigate = useNavigate();

  const proftoken = localStorage.getItem('ProfauthToken');

  console.log("Class ID : ", classId);

  useEffect(() => {
    const fetchClassDetails = async () => {
      try {
        const response = await axios.get(`https://qrcodeattend.onrender.com/api/v1/class/get-class-code/${classId}`,
          {
            headers: {
              Authorization: `Bearer ${proftoken}`,
            },
          }
        );
        if (response.status === 200) {
          setClassDetails(response.data.message);
        }
      } catch (error) {
        console.error('Error fetching class details:', error);
        alert('Failed to fetch class details. Please try again.');
      }
    };

    const fetchAttendanceRecords = async () => {
      try {
        const response = await axios.get(`https://qrcodeattend.onrender.com/api/v1/class/get-attendance/${classId}`,
          {
            headers: {
              Authorization: `Bearer ${proftoken}`,
            },
          }
        );
        if (response.status === 200) {
          setAttendanceRecords(response.data.message);
        }
      } catch (error) {
        console.error('Error fetching attendance records:', error);
        alert('Failed to fetch attendance records. Please try again.');
      }
    };

    fetchClassDetails();
    fetchAttendanceRecords();
  }, [classId]);

  return (
    <section>
      {classDetails && (
        <div className="class-header">
          <h1>Class Code: {classDetails.code}</h1>
          <p>Date: {new Date(classDetails.date).toLocaleDateString()}</p>
          <p>Time: {classDetails.startTime} - {classDetails.endTime}</p>
        </div>
      )}

      {classDetails && (
        <div className="qr-section">
          <QRCode value={classDetails.code} size={256} />
          <p>Scan this QR code to mark your attendance.</p>
        </div>
      )}

      <div className="attendance-records">
        <h2>Attendance Records</h2>
        <table>
          <thead>
            <tr>
              <th>Enrollment Numbers</th>
            </tr>
          </thead>
          <tbody>
            {attendanceRecords.map((record, index) => (
              <tr key={index}>
                <td>{record.enrollmentNumber}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default ProfessorTakeAttendance;
