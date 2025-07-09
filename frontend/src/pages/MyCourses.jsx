import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { BASE_API } from "../api/api";

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const navigate = useNavigate();

  useEffect(() => {
    if (user.type !== "student") {
      navigate("/dashboard");
    } else {
      fetchEnrolledCourses();
    }
  }, []);

  const fetchEnrolledCourses = async () => {
    try {
      const res = await axios.get(`${BASE_API}/courses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const enrolled = res.data.filter(course => course.enrolled.includes(user._id));
      setCourses(enrolled);
    } catch (err) {
      console.log("Error loading enrolled courses.");
    }
  };

  return (
    <Container style={{ marginTop: "40px" }}>
      <h3>🎓 My Enrolled Courses</h3>
      {courses.map((course) => (
        <Card key={course._id} className="mb-3">
          <Card.Body>
            <Card.Title>{course.C_title}</Card.Title>
            <Card.Text>{course.C_description}</Card.Text>
            <Button variant="info" onClick={() => navigate(`/course/${course._id}`)}>▶️ Start Course</Button>
          </Card.Body>
        </Card>
      ))}
    </Container>
  );
};

export default MyCourses;