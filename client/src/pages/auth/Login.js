import React, { useState } from 'react';
import { Form, Input, Button, Typography, notification } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';

const { Title } = Typography;

const Login = () => {
   const [loading, setLoading] = useState(false);
   const navigate = useNavigate();

   const handleLogin = async values => {
      const { email, password } = values;
      setLoading(true);

      try {
         const response = await fetch('http://localhost:8080/auth/login', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
         });

         const result = await response.json();
         console.log('JSON response === ', result);
         if (result.success) {
            notification.success({
               message: 'Login Successful',
               description: result.message,
            });
            localStorage.setItem('token', result?.data?.jwtToken);
            localStorage.setItem('loggedInUser', result?.data?.name);
            navigate('/home');
         } else {
            notification.error({
               message: 'Login Failed',
               description: result.message || 'Something went wrong!',
            });
         }
      } catch (error) {
         notification.error({
            message: 'Login Error',
            description: 'An unexpected error occurred. Please try again later.',
         });
      } finally {
         setLoading(false);
      }
   };

   return (
      <div className="auth-container">
         <div className="auth-card">
            <Title level={2} className="auth-title">
               Login
            </Title>
            <Form layout="vertical" onFinish={handleLogin}>
               <Form.Item
                  name="email"
                  rules={[
                     { required: true, message: 'Please enter your email' },
                     { type: 'email', message: 'Please enter a valid email' },
                  ]}
               >
                  <Input placeholder="Enter Email" />
               </Form.Item>
               <Form.Item name="password" rules={[{ required: true, message: 'Please enter your password' }]}>
                  <Input.Password placeholder="Enter Password" />
               </Form.Item>
               <Form.Item>
                  <Button type="primary" htmlType="submit" loading={loading} block>
                     Login
                  </Button>
               </Form.Item>
            </Form>
            <div className="auth-footer">
               Don't have an account? <Link to="/signup">Signup</Link>
            </div>
         </div>
      </div>
   );
};

export default Login;
