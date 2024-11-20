
import { Routes, Route } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import DoctorDashboard from './DoctorDashboard'
const Master = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/doctordashboard" element={<DoctorDashboard />}></Route>
    </Routes>
  );
};

export default Master;
