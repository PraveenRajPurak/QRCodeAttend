// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Frontpage from './pages/Frontpage';
import UserSignUp from './pages/UserSignUp';
import AdminSignUp from './pages/AdminSignUp';
import AdminChoicer from './pages/AdminChoicer';
import ProfessorLogin from './pages/ProfessorLogin';
import UserDetailsCollection from './components/UserDetailsCollection';
import UserLogin from './pages/UserLogin';
import UserDashboard from './pages/UserDashboard';
import UserStudentSetup from './pages/UserStudentSetup'
import AdminLogin from './pages/AdminLogin'
import AdminDetailsCollection from './components/AdminDetailsCollection';
import AdminDashboard from './pages/AdminDashboard';
import AdminCollegeSetup from './pages/AdminCollegeSetup';
import ProfessorDashboard from './pages/ProfessorDashboard';
import CourseDetails from './pages/CourseDetails';
import ProfessorTakeAttendance from './pages/ProfessorTakeAttendance';
import AdminCourseSetup from './pages/AdminCourseSetup';
import ClassesSetUp from './pages/ClassesSetup';
import ProfessorSetup from './pages/AdminProfessorSetup';
import UserTrackAttendance from './pages/UserTrackAttendance';
import UserClassTrack from './pages/UserClassTrack';
import UserAttendance from './pages/UserAttendance';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/user-signup" element={<UserSignUp />} />
        <Route path="/admin-choicer" element={<AdminChoicer />} />
        <Route path="/admin-signup" element={<AdminSignUp />} />
        <Route path="/professor-login" element={<ProfessorLogin />} />
        <Route path="/user-details-collection" element={<UserDetailsCollection />} />
        <Route path="/user-login" element={<UserLogin />} />
        <Route path="/user-student-setup" element={<UserStudentSetup />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-details-collection" element={<AdminDetailsCollection />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin-college-setup" element={<AdminCollegeSetup />} />
        <Route path="/professor-login" element={<ProfessorLogin />}/>
        <Route path="/professor-dashboard" element={<ProfessorDashboard />}/>
        <Route path="/course-details/:courseId" element={<CourseDetails />} />
        <Route path="/professor-take-attendance/:classId" element={<ProfessorTakeAttendance />} />
        <Route path="/admin-course-setup/:collegeId" element={<AdminCourseSetup />} />
        <Route path="/classes-setup/:courseId" element={<ClassesSetUp />} />
        <Route path="/admin-professor-setup/:collegeId" element={<ProfessorSetup />} />
        <Route path="/user-track-attendance" element={<UserTrackAttendance />} />
        <Route path="/user-class-track/:courseId" element={<UserClassTrack />} />
        <Route path="/user-attendance/:classId" element={<UserAttendance />} />

        <Route path="/" element={<Frontpage />} />
      </Routes>
    </Router>
  );
}

export default App;
