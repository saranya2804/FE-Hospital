
import { Routes, Route } from 'react-router-dom';
import Login from './Login';
import Register from './Register';

const Master = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
};

export default Master;
