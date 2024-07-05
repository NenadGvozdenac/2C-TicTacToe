import React from 'react';
import Navbar from '../components/Navbar';
import LoginForm from '../components/LoginForm';
import Footer from '../components/Footer';

const Login: React.FC = () => {
  return (
    <div className='d-flex flex-column justify-content-between min-vh-100'>
      <Navbar />
      <LoginForm />
      <Footer />
    </div>
  );
};

export default Login;
