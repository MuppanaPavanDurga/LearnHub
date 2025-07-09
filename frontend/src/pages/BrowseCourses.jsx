import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Card, Button, Form, Row, Col, Alert } from "react-bootstrap";
import { BASE_API } from "../api/api";

const BrowseCourses = () => {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  const fetchCourses = async () => {
    try {
      const res = await axios.get(`${BASE_API}/courses?search=${search}&category=${category}`);
      setCourses(res.data);
    } catch (err) {
      setMessage("Failed to load courses.");
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [search, category]);

  const handleEnroll = async (courseId) => {
    try {
      await axios.post(
        `${BASE_API}/courses/${courseId}/enroll`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("Enrolled successfully!");
    } catch (err) {
      setMessage(err.response?.data?.message || "Enrollment failed.");
    }
  };

  return (
    <Container style={{ marginTop: "40px" }}>
      <h3>Available Courses</h3>
      {message && <Alert variant={message.startsWith("E") ? "success" : "danger"}>{message}</Alert>}

      <Row className="mb-3">
        <Col>
          <Form.Control
            placeholder="Search by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Col>
        <Col>
          <Form.Control
            placeholder="Search by category..."
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </Col>
      </Row>

      {courses.map((course) => (
        <Card key={course._id} className="mb-3">
          <Card.Body>
            <Card.Title>{course.C_title}</Card.Title>
            <Card.Text>{course.C_description}</Card.Text>
            <Card.Subtitle className="mb-2 text-muted">
              Category: {course.C_categories} | Price: ₹{course.C_price}
            </Card.Subtitle>
            <Button variant="success" onClick={() => handleEnroll(course._id)}>Enroll</Button>
          </Card.Body>
        </Card>
      ))}
    </Container>
  );
};

export default BrowseCourses;
