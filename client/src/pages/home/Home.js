import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Table, Input, Modal, Form, notification, Row, Col, Divider } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';
import './Home.css';

const Home = () => {
   const [loggedInUser, setLoggedInUser] = useState('');
   const [products, setProducts] = useState([]);
   const [loading, setLoading] = useState(false);
   const [isModalVisible, setIsModalVisible] = useState(false);
   const [editingProduct, setEditingProduct] = useState(null);
   const navigate = useNavigate();
   const [form] = Form.useForm();

   // Get the logged-in user's name from localStorage
   useEffect(() => {
      setLoggedInUser(localStorage.getItem('loggedInUser'));
   }, []);

   // Handle logout functionality
   const handleLogout = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('loggedInUser');
      notification.success({
         message: 'Logged out',
         description: 'You have successfully logged out.',
      });
      setTimeout(() => {
         navigate('/login');
      }, 1000);
   };

   // Fetch products from API
   const fetchProducts = async () => {
      setLoading(true);
      try {
         const response = await axios.get('http://localhost:8080/api/getAllProducts', {
            headers: {
               Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
         });
         setProducts(response.data.data); // Assuming the data is in `data.data` based on the API response format
      } catch (err) {
         notification.error({
            message: 'Error fetching products',
            description: err.response?.data?.message || 'Error occurred while fetching products.',
         });
      } finally {
         setLoading(false);
      }
   };

   // Add or Edit Product (API call)
   const handleProductSave = async values => {
      try {
         const url = editingProduct ? `http://localhost:8080/api/updateProduct/${editingProduct._id}` : 'http://localhost:8080/api/createProduct';
         const method = editingProduct ? 'put' : 'post';

         const response = await axios({
            method,
            url,
            data: values,
            headers: {
               'Content-Type': 'application/json',
               Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
         });

         if (response.status === 200 || response.status === 201) {
            notification.success({
               message: editingProduct ? 'Product updated' : 'Product added',
               description: `${values.name} has been successfully ${editingProduct ? 'updated' : 'added'}.`,
            });
            fetchProducts(); // Refresh product list after adding/editing
            setIsModalVisible(false);
            setEditingProduct(null);
         }
      } catch (err) {
         notification.error({
            message: 'Error',
            description: err.response?.data?.message || 'Error occurred while saving the product.',
         });
      }
   };

   // Show edit modal with pre-filled data
   const handleEdit = product => {
      setEditingProduct(product);
      setIsModalVisible(true);
   };

   // Handle Delete Product
   const handleDelete = async id => {
      try {
         const response = await axios.delete(`http://localhost:8080/api/deleteProduct/${id}`, {
            headers: {
               Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
         });

         if (response.status === 200) {
            notification.success({
               message: 'Product deleted',
               description: 'The product has been deleted successfully.',
            });
            fetchProducts(); // Refresh product list after deletion
         }
      } catch (err) {
         notification.error({
            message: 'Error deleting product',
            description: err.response?.data?.message || 'Error occurred while deleting the product.',
         });
      }
   };

   // Fetch products on component mount
   useEffect(() => {
      fetchProducts();
   }, []);

   // Columns for Table
   const columns = [
      { title: 'S. No', dataIndex: 'index', key: 'index', render: (data, record, index) => <>{index + 1}</> }, // Assuming `_id` is the product ID
      { title: 'Product Name', dataIndex: 'name', key: 'name' },
      { title: 'Price', dataIndex: 'price', key: 'price' },
      { title: 'Category', dataIndex: 'category', key: 'category' },
      { title: 'Stock', dataIndex: 'stock', key: 'stock' },
      {
         title: 'Actions',
         key: 'actions',
         render: (_, record) => (
            <>
               <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} style={{ marginRight: 10 }} />
               <Button icon={<DeleteOutlined />} onClick={() => handleDelete(record._id)} danger />
            </>
         ),
      },
   ];

   return (
      <div className="home-container">
         <Row className="header">
            <Col span={18}>
               <h2>Welcome, {loggedInUser}</h2>
            </Col>
            <Col span={6}>
               <Button className="logout-btn" type="primary" onClick={handleLogout}>
                  Logout
               </Button>
            </Col>
         </Row>
         <Divider style={{ borderColor: 'darkgrey', margin: '0.5rem 0' }} />

         {/* Add Product Button */}
         <Button type="primary" style={{ marginBottom: 20 }} onClick={() => setIsModalVisible(true)}>
            Add Product
         </Button>

         {/* Product Table */}
         <Table columns={columns} dataSource={products} rowKey="_id" loading={loading} pagination={{ pageSize: 5 }} />

         {/* Modal for Add/Edit Product */}
         <Modal
            maskClosable={false}
            title={editingProduct ? 'Edit Product' : 'Add Product'}
            open={isModalVisible}
            onCancel={() => {
               setIsModalVisible(false);
               form.resetFields();
            }}
            footer={null}
         >
            <Form initialValues={editingProduct} onFinish={handleProductSave} layout="vertical">
               <Form.Item label="Product Name" name="name" rules={[{ required: true, message: 'Please input product name!' }]}>
                  <Input />
               </Form.Item>
               <Form.Item label="Price" name="price" rules={[{ required: true, message: 'Please input product price!' }]}>
                  <Input type="number" />
               </Form.Item>
               <Form.Item label="Category" name="category" rules={[{ required: true, message: 'Please input product category!' }]}>
                  <Input />
               </Form.Item>
               <Form.Item label="Stock" name="stock" rules={[{ required: true, message: 'Please input product stock!' }]}>
                  <Input type="number" />
               </Form.Item>
               <Form.Item>
                  <Button type="primary" htmlType="submit">
                     {editingProduct ? 'Update Product' : 'Add Product'}
                  </Button>
                  <Button style={{ marginLeft: 10 }} onClick={() => setIsModalVisible(false)}>
                     Cancel
                  </Button>
               </Form.Item>
            </Form>
         </Modal>
      </div>
   );
};

export default Home;
