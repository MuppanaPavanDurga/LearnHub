import React, { useState } from "react";
import axios from "axios";
import { Card, Container, Form, Button, Alert } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import "./Home.css"
import { BASE_API } from "../api/api";


const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error,    setError]  = useState("");
  const navigate = useNavigate();

  const handleChange = e =>
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      const { data } = await axios.post(`${BASE_API}/auth/login`, formData);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user",  JSON.stringify(data.user));
      if (data.user.type === "student") {
      navigate("/home");
      } 
      else  {
      navigate("/dashboard");
      }
    } 
    catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="auth-bg">
      <Container className="d-flex justify-content-end">
        <Card className="login-card">
          <h3 className="text-center mb-4">Learn Hub</h3>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <div className="text-end mb-3">
              <Link to="#">Forgot password?</Link>
            </div>

            <Button type="submit" variant="primary" className="w-100">Login</Button>
          </Form>

          <div className="text-center mt-3">
            New user? <Link to="/register">Create an account</Link>
          </div>
        </Card>
      </Container>
    </div>
  );
};

export default Login;