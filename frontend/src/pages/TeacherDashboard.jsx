import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Table, Button, Modal, Form, Alert, Badge, Card, Spinner} from "react-bootstrap";
import { PeopleFill, Trash3Fill } from "react-bootstrap-icons";
import { BASE_API } from "../api/api";

const TeacherDashboard = () => {
  const [courses,  setCourses] = useState([]);
  const [students, setStudents]= useState([]);
  const [selectedCourse,   setSelectedCourse] = useState(null);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [message, setMessage] = useState("");
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const token   = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const fetchCourses = async () => {
    const res = await axios.get(`${BASE_API}/courses/all`, { headers });
    setCourses(res.data);
  };

  const fetchStudents = async () => {
    const res = await axios.get(`${BASE_API}/users/students`, { headers });
    setStudents(res.data);
  };

  const handleDelete = async (courseId) => {
    if (!window.confirm("Delete this course? This cannot be undone.")) return;
    try {
      await axios.delete(`${BASE_API}/courses/${courseId}`, { headers });
      setMessage("Course deleted");
      fetchCourses();
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to delete course");
    }
  };

  const handleAssignSubmit = async () => {
    try {
      await axios.post(
        `${BASE_API}/courses/${selectedCourse._id}/assign`,
        { studentIds: selectedStudents },
        { headers }
      );
      setMessage("Course assigned to students");
      setShowAssignModal(false);
      fetchCourses();
    } catch {
      setMessage("Failed to assign");
    }
  };

  useEffect(() => {
    (async () => {
      await Promise.all([fetchCourses(), fetchStudents()]);
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Card className="shadow-sm">
        <Card.Body>
          <Card.Title>Teacher Dashboard</Card.Title>
          {message && <Alert variant="info">{message}</Alert>}

          <Table striped hover responsive className="align-middle">
            <thead className="table-light">
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Educator</th>
                <th className="text-center">Enrolled</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((c) => (
                <tr key={c._id}>
                  <td>{c.C_title}</td>
                  <td>{c.C_categories}</td>
                  <td>{c.C_educator}</td>
                  <td className="text-center">
                    <Badge bg="secondary">{c.enrolled.length}</Badge>
                  </td>
                  <td className="text-end">
                    <Button
                      size="sm"
                      variant="outline-primary"
                      className="me-2"
                      onClick={() => {
                        setSelectedCourse(c);
                        setShowAssignModal(true);
                        setSelectedStudents([]);
                      }}
                    >
                      <PeopleFill className="me-1" /> Assign
                    </Button>
                    <Button
                      size="sm"
                      variant="outline-danger"
                      onClick={() => handleDelete(c._id)}
                    >
                      <Trash3Fill className="me-1" /> Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Modal
        centered
        size="lg"
        show={showAssignModal}
        onHide={() => setShowAssignModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Assign “{selectedCourse?.C_title}”</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: "60vh", overflowY: "auto" }}>
          <Form.Group>
            <Form.Label>Select students</Form.Label>
            <Form.Select
              multiple
              value={selectedStudents}
              onChange={(e) =>
                setSelectedStudents(
                  Array.from(e.target.selectedOptions, (o) => o.value)
                )
              }
              style={{ minHeight: "220px" }}
            >
              {students.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name} ({s.email})
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAssignModal(false)}>
            Cancel
          </Button>
          <Button
            variant="success"
            disabled={selectedStudents.length === 0}
            onClick={handleAssignSubmit}
          >
            Assign Now
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default TeacherDashboard;