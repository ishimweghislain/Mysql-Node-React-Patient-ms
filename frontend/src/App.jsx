import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Login from './pages/Login'
import AdminDashboard from './pages/AdminDashboard'
import DoctorDashboard from './pages/DoctorDashboard'
import DoctorRegistration from './pages/DoctorRegistration'
import UserManagement from './pages/UserManagement'
import DoctorManagement from './pages/DoctorManagement'
import PatientManagement from './pages/PatientManagement'
import Reports from './pages/Reports'
import api from './lib/api';
import Layout from './components/Layout'

function App() {
  const [user, setUser] = useState(null);

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await api.get('/auth/me');
        setUser(data.user);
      } catch (err) {
        setUser(null);
      }
    };
    checkAuth();
  }, []);


  return (
      <Routes>
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register-doctor" element={<DoctorRegistration />} />

        <Route element={<Layout user={user} setUser={setUser} />}>
        <Route
          path="/admin"
          element={user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/doctor"
          element={user?.role === 'doctor' ? <DoctorDashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/users"
          element={user?.role === 'admin' ? <UserManagement /> : <Navigate to="/login" />}
        />
        <Route
          path="/doctors"
          element={user?.role === 'admin' ? <DoctorManagement /> : <Navigate to="/login" />}
        />
        <Route
          path="/patients"
          element={user?.role === 'doctor' ? <PatientManagement /> : <Navigate to="/login" />}
        />
        <Route
          path="/reports"
          element={user?.role === 'doctor' ? <Reports /> : <Navigate to="/login" />}
        />
        <Route path="*" element={<Navigate to="/login" />} />
        </Route>
      </Routes>
  )
}

export default App