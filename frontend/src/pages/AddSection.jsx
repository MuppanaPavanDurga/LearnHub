import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { BASE_API } from "../api/api";

const AddSection = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [sectionData, setSectionData] = useState({ title: "", videoUrl: "", externalLink: "",});
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.type !== "teacher") {
      navigate("/dashboard");
    } else {
      fetchCourses();
    }
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await axios.get(`${BASE_API}/courses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const ownCourses = res.data.filter((c) => c.userID === user._id);
      setCourses(ownCourses);

      const lastCreatedId = localStorage.getItem("lastCreatedCourseId");
      if (lastCreatedId) {
        setSelectedCourse(lastCreatedId);
        localStorage.removeItem("lastCreatedCourseId"); 
      }
    } catch (err) {
      setMessage("Failed to load courses.");
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    await axios.post(
      `${BASE_API}/courses/${selectedCourse}/add-section`,
      sectionData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setMessage("Section added successfully");
    setSectionData({ title: "", videoUrl: "", externalLink: "" });

    setTimeout(() => {
      navigate("/dashboard");
    }, 1000); 

  } catch (err) {
    setMessage("Failed to add section");
  }
};


  return (
    <Container style={{ maxWidth: "600px", marginTop: "40px" }}>
      <h3>Add Section to Course</h3>
      {message && (
        <Alert variant={message.startsWith("S") ? "success" : "danger"}>
          {message}
        </Alert>
      )}
      <Form onSubmit={handleSubmit}>
        {/* Course Selector */}
        <Form.Group className="mb-3">
          <Form.Label>Select Course</Form.Label>
          <Form.Select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            required
          >
            <option value="">-- Select Course --</option>
            {courses.map((course) => (
              <option key={course._id} value={course._id}>
                {course.C_title}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Section Title</Form.Label>
          <Form.Control
            type="text"
            name="title"
            value={sectionData.title}
            onChange={(e) => setSectionData({ ...sectionData, title: e.target.value })}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>YouTube Embed URL</Form.Label>
          <Form.Control
            type="text"
            name="videoUrl"
            placeholder=""
            value={sectionData.videoUrl}
            onChange={(e) => setSectionData({ ...sectionData, videoUrl: e.target.value })}
          />
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label>External Article Link</Form.Label>
          <Form.Control
            type="text"
            name="externalLink"
            placeholder=""
            value={sectionData.externalLink}
            onChange={(e) => setSectionData({ ...sectionData, externalLink: e.target.value })}
          />
        </Form.Group>

        <Button type="submit" variant="primary">
          ➕ Add Section
        </Button>
      </Form>
    </Container>
  );
};

export default AddSection;
