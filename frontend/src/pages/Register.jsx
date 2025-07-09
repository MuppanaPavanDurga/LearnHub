import React, { useState } from "react";
import axios from "axios";
import { Form, Button, Container, Card } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import "./Home.css";
import { BASE_API } from "../api/api";

const Register = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "", type: "student"});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await axios.post(`${BASE_API}/auth/register`, formData);
      setSuccess("Registered successfully!");
      setFormData({ name: "", email: "", password: "", type: "student" });

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="auth-bg">
      <Container className="d-flex justify-content-end align-items-center" style={{ minHeight: "100vh" }}>
        <Card className="login-card">
          <h3 className="text-center mb-3">Register</h3>

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Form.Group>
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
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label>Role</Form.Label>
              <Form.Select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
              </Form.Select>
            </Form.Group>
            <Button type="submit" variant="primary" className="w-100">Register</Button>
          </Form>

          <div className="text-center mt-3">
            Already have an account? <Link to="/login">Login</Link>
          </div>

          <div className="text-center mt-2">
            {success && <p style={{ color: "green", fontSize: "14px" }}>{success}</p>}
            {error && <p style={{ color: "red", fontSize: "14px" }}>{error}</p>}
          </div>
        </Card>
      </Container>
    </div>
  );
};

export default Register;