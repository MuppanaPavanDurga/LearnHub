import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Container, Row, Col, ListGroup, Card, Button, Alert } from "react-bootstrap";
import DownloadCertificate from "./DownloadCertificate";
import { BASE_API } from "../api/api";


const CoursePlayer = () => {
  const { id } = useParams();
  const token = localStorage.getItem("token");
  const user  = JSON.parse(localStorage.getItem("user") || "{}");

  const [course, setCourse] = useState(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [error, setError]  = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${BASE_API}/courses/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCourse(res.data);
        setCompleted(res.data.completed?.includes(user?._id));
      } catch (err) {
        setError("Failed to load course");
      }
    })();
  }, [id, token, user?._id]);

  const markCompleted = async () => {
    try {
      await axios.post(
        `${BASE_API}/courses/${id}/complete`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCompleted(true);
      //alert("Mared as Completed");
    } catch {
      //alert("❌ Failed to mark course as completed.");
    }
  };

  if (error)   return <Alert variant="danger">{error}</Alert>;
  if (!course)  return <div>Loading…</div>;
  if (!course.sections.length)
    return <Alert variant="warning">No sections have been added yet.</Alert>;

  const current = course.sections[currentIdx];

  return (
    <Container fluid className="mt-4">
      <h3>{course.C_title}</h3>
      <p>{course.C_description}</p>

      <Row>
        <Col md={2}>
          <h5 className="mb-3">📑 Sections</h5>
          <ListGroup>
            {course.sections.map((sec, idx) => (
              <ListGroup.Item
                key={idx}
                action
                active={idx === currentIdx}
                onClick={() => setCurrentIdx(idx)}
              >
                {sec.title}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>

        <Col md={9}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>{current.title}</Card.Title>

              {current.videoUrl && (
                <div style={{ width: "100%", aspectRatio: "16 / 9" }}>
                  <iframe
                    src={current.videoUrl}
                    title={current.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{ width: "100%", height: "100%", border: "none" }}
                  />
                </div>
              )}

              {current.externalLink && (
                <p className="mt-3">
                  📖 External resource:&nbsp;
                  <a href={current.externalLink} target="_blank" rel="noopener noreferrer">
                    {current.externalLink}
                  </a>
                </p>
              )}
            </Card.Body>
          </Card>

          {course.enrolled.includes(user?._id) && !completed && (
            <div className="text-center my-4">
              <Button variant="success" onClick={markCompleted}>
                Mark as Completed
              </Button>
            </div>
          )}

          {course.enrolled.includes(user?._id) && completed && (
            <DownloadCertificate user={user} course={course} />
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default CoursePlayer;
