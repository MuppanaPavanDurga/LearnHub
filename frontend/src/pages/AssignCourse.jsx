import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { BASE_API } from "../api/api";

const AssignCourse = () => {
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchCourses();
    fetchStudents();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await axios.get(`${BASE_API}/courses/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourses(res.data);
    } catch (err) {
      setMessage("Failed to load courses.");
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await axios.get(`${BASE_API}/users/students`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudents(res.data);
    } catch (err) {
      setMessage("Failed to load students.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${BASE_API}/courses/${selectedCourse}/assign`,
        { studentIds: selectedStudents },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessage("Course assigned successfully!");
      setSelectedStudents([]);
    } catch (err) {
      setMessage("Failed to assign course.");
    }
  };

  return (
    <Container style={{ maxWidth: "700px", marginTop: "40px" }}>
      <h3>👨‍🏫 Assign Course to Students</h3>
      {message && <Alert variant={message.includes("success") ? "success" : "danger"}>{message}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Select Course</Form.Label>
          <Form.Select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)} required>
            <option value="">-- Select --</option>
            {courses.map((course) => (
              <option key={course._id} value={course._id}>
                {course.C_title}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label>Select Students</Form.Label>
          <Form.Control as="select" multiple value={selectedStudents} onChange={(e) => {
              const selectedOptions = Array.from(e.target.selectedOptions).map((opt) => opt.value);
              setSelectedStudents(selectedOptions);
            }}
            style={{ height: "200px" }}
          >
            {students.map((student) => (
              <option key={student._id} value={student._id}>
                {student.name} ({student.email})
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        <Button type="submit" variant="primary">
          📚 Assign Course
        </Button>
      </Form>
    </Container>
  );
};

export default AssignCourse;
