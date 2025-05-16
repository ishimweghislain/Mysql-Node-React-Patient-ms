import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import AdminDashboard from '../components/Admindashboard';
import StaffDashboard from '../components/StaffDashboard';
import DoctorDashboard from '../components/DoctorDashboard';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Patients from '../pages/Patients';
import Doctors from '../pages/Doctors';
import Reports from '../pages/Report';
import Users from '../pages/Users';
import MonthlyReport from '../pages/MonthlyReport';
import axios from 'axios';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState('');
  const [users, setUsers] = useState([]); // State for users data

  useEffect(() => {
    if (isLoggedIn && role === 'Admin') {
      axios.get('http://localhost:5000/api/users', { withCredentials: true })
        .then(response => {
          console.log('Fetched users:', response.data); // Debug
          setUsers(response.data);
        })
        .catch(err => console.error('Failed to fetch users:', err));
    }
  }, [isLoggedIn, role]);

  const renderDashboard = () => {
    switch (role) {
      case 'Admin':
        return <AdminDashboard users={users} />;
      case 'Staff':
        return <StaffDashboard />;
      case 'Doctor':
        return <DoctorDashboard />;
      default:
        return <Navigate to="/login" />;
    }
  };

  return (
    <Router>
      <div className="flex">
        {isLoggedIn && <Sidebar role={role} />}
        <div className="flex-1">
          {isLoggedIn && <Header setIsLoggedIn={setIsLoggedIn} setRole={setRole} />}
          
          
          <Routes>
            <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} setRole={setRole} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={isLoggedIn ? renderDashboard() : <Navigate to="/login" />} />
            <Route path="/patients" element={isLoggedIn ? <Patients role={role} /> : <Navigate to="/login" />} />
            <Route path="/doctors" element={isLoggedIn ? <Doctors role={role} /> : <Navigate to="/login" />} />
            <Route path="/reports" element={isLoggedIn ? <Reports role={role} /> : <Navigate to="/login" />} />
            <Route path="/users" element={isLoggedIn && role === 'Admin' ? <Users /> : <Navigate to="/login" />} />
            <Route path="/monthly-report" element={isLoggedIn ? <MonthlyReport /> : <Navigate to="/login" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;