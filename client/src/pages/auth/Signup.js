import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Typography, notification } from 'antd';
import './Auth.css';

const { Title } = Typography;

const Signup = () => {
   const [loading, setLoading] = useState(false);
   const navigate = useNavigate();

   const handleSignup = async values => {
      const { name, email, password } = values;
      setLoading(true);

      try {
         const response = await fetch('http://localhost:8080/auth/signup', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password }),
         });

         const result = await response.json();
         if (result.success) {
            notification.success({
               message: 'Signup Successful',
               description: result.message,
            });
            setTimeout(() => navigate('/login'), 1000);
         } else {
            notification.error({
               message: 'Signup Failed',
               description: result.error?.details[0]?.message || result.message || 'Something went wrong!',
            });
         }
      } catch (error) {
         notification.error({
            message: 'Signup Error',
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
               Signup
            </Title>
            <Form layout="vertical" onFinish={handleSignup}>
               <Form.Item name="name" rules={[{ required: true, message: 'Please enter your name' }]}>
                  <Input placeholder="Enter Name" />
               </Form.Item>
               <Form.Item
                  name="email"
                  rules={[
                     { required: true, message: 'Please enter your email' },
                     { type: 'email', message: 'Please enter a valid email' },
                  ]}
               >
                  <Input placeholder="Email" />
               </Form.Item>
               <Form.Item
                  name="password"
                  rules={[
                     { required: true, message: 'Please enter your password' },
                     { min: 6, message: 'Password must be at least 6 characters' },
                  ]}
                  hasFeedback
               >
                  <Input.Password placeholder="Password" />
               </Form.Item>
               <Form.Item
                  name="confirmPassword"
                  dependencies={['password']}
                  hasFeedback
                  rules={[
                     { required: true, message: 'Please confirm your password' },
                     ({ getFieldValue }) => ({
                        validator(_, value) {
                           if (!value || getFieldValue('password') === value) {
                              return Promise.resolve();
                           }
                           return Promise.reject(new Error('Passwords do not match!'));
                        },
                     }),
                  ]}
               >
                  <Input.Password placeholder="Confirm Password" />
               </Form.Item>
               <Form.Item>
                  <Button type="primary" htmlType="submit" loading={loading} block>
                     Signup
                  </Button>
               </Form.Item>
            </Form>
            <div className="auth-footer">
               Already have an account? <Link to="/login">Login</Link>
            </div>
         </div>
      </div>
   );
};

export default Signup;
