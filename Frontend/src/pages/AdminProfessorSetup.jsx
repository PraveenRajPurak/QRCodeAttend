import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/AdminProfessorSetup.css';

const AdminProfessorSetup = () => {
  const [profId, setProfId] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [professors, setProfessors] = useState([]);
  const [message, setMessage] = useState('');
  const { collegeId } = useParams();
  const navigate = useNavigate();

  const fetchProfessors = async () => {
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
      }
    } catch (error) {
      console.error('Error fetching professors:', error);
      alert('Failed to fetch professors. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://qrcodeattend.onrender.com/api/v1/college/setup-professor', {
        profId,
        password,
        name
      },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('AdminauthToken')}`
      }
    });

      if (response.status === 200) {
        setMessage('Professor created successfully');
        fetchProfessors(); // Fetch the updated list of professors
        setProfId('');
        setPassword('');
        setName('');
      }
    } catch (error) {
      console.error('Error setting up professor:', error);
      alert('Failed to set up professor. Please try again.');
    }
  };

  useEffect(() => {
    fetchProfessors();
  }, []);

  const handleGoBack = () => {
    navigate(`/admin-dashboard`);
  };

  return (
    <section>
      <div className="form-container">
        <h2>Setup Professor</h2>
        <form onSubmit={handleSubmit}>
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
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <button type="submit">Setup Professor</button>
        </form>
        {message && <p>{message}</p>}
      </div>

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
          <p>No professors found</p>
        )}
      </div>

      <button onClick={handleGoBack}>Go back to Admin Dashboard</button>
    </section>
  );
};

export default AdminProfessorSetup;
