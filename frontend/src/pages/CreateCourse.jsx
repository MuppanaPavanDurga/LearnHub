import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { BASE_API } from "../api/api";

const CreateCourse = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    C_title: "",
    C_description: "",
    C_categories: "",
    C_price: 0,
  });

  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    if (!user || user.type !== "teacher") {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${BASE_API}/courses/create`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage("Course created successfully ✅");

      localStorage.setItem("lastCreatedCourseId", res.data._id);

      setFormData({
        C_title: "",
        C_description: "",
        C_categories: "",
        C_price: 0,
      });

      setTimeout(() => {
        navigate("/add-section");
      }, 1000);
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to create course");
    }
  };

  return (
    <Container style={{ maxWidth: "600px", marginTop: "40px" }}>
      <h3>Create New Course</h3>
      {message && (
        <Alert variant={message.includes("successfully") ? "success" : "danger"}>
          {message}
        </Alert>
      )}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Course Title</Form.Label>
          <Form.Control
            type="text"
            name="C_title"
            value={formData.C_title}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Course Description</Form.Label>
          <Form.Control
            as="textarea"
            name="C_description"
            value={formData.C_description}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Category</Form.Label>
          <Form.Control
            type="text"
            name="C_categories"
            value={formData.C_categories}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-4">
          <Form.Label>Price (₹)</Form.Label>
          <Form.Control
            type="number"
            name="C_price"
            value={formData.C_price}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Button type="submit" variant="primary">
          Create Course
        </Button>
      </Form>
    </Container>
  );
};

export default CreateCourse;
