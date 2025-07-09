import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Container, Row, Col, Table, Button, Badge, Spinner, Alert, Tabs, Tab } from "react-bootstrap";
import { TrashFill } from "react-bootstrap-icons";
import { BASE_API } from "../api/api";

const AdminDashboard = () => {
  const token   = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const [users,   setUsers]   = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg,     setMsg]     = useState("");

  const fetchData = async () => {
    const [uRes, cRes] = await Promise.all([
      axios.get(`${BASE_API}/users`,   { headers }),
      axios.get(`${BASE_API}/courses/all`, { headers }),
    ]);
    setUsers(uRes.data);
    setCourses(cRes.data);
  };

  const deleteCourse = async (id) => {
    if (!window.confirm("Delete this course permanently?")) return;
    await axios.delete(`${BASE_API}/courses/${id}`, { headers });
    setMsg("Course deleted.");
    setCourses((prev) => prev.filter((c) => c._id !== id));
  };

  useEffect(() => {
    (async () => {
      await fetchData();
      setLoading(false);
    })();
  }, []);

  const totalStudents = users.filter((u) => u.type === "student").length;
  const totalTeachers = users.filter((u) => u.type === "teacher").length;
  const totalEnrols   = courses.reduce((sum, c) => sum + c.enrolled.length, 0);

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <Container fluid>
      {msg && <Alert variant="info">{msg}</Alert>}

      <Row className="g-4 mb-4">
        <Col sm={4}>
          <Card body className="shadow-sm text-center">
            <h5>Total Users</h5>
            <h2>{users.length}</h2>
            <small>
              👩‍🎓 {totalStudents} students &nbsp;|&nbsp; 👨‍🏫 {totalTeachers} teachers
            </small>
          </Card>
        </Col>
        <Col sm={4}>
          <Card body className="shadow-sm text-center">
            <h5>Total Courses</h5>
            <h2>{courses.length}</h2>
          </Card>
        </Col>
        <Col sm={4}>
          <Card body className="shadow-sm text-center">
            <h5>Total Enrolments</h5>
            <h2>{totalEnrols}</h2>
          </Card>
        </Col>
      </Row>

      <Tabs defaultActiveKey="courses" id="admin-tabs" className="mb-3">
        <Tab eventKey="courses" title="📚 Courses">
          <Table striped hover responsive className="align-middle">
            <thead className="table-light">
              <tr>
                <th>Title</th>
                <th>Educator</th>
                <th>Enrolled</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((c) => (
                <tr key={c._id}>
                  <td>{c.C_title}</td>
                  <td>{c.C_educator}</td>
                  <td>
                    <Badge bg="secondary">{c.enrolled.length}</Badge>
                  </td>
                  <td className="text-end">
                    <Button
                      size="sm"
                      variant="outline-danger"
                      onClick={() => deleteCourse(c._id)}
                    >
                      <TrashFill className="me-1" /> Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Tab>

        <Tab eventKey="users" title="👥 Users">
          <Table striped hover responsive className="align-middle">
            <thead className="table-light">
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>
                    {u.type === "teacher" ? (
                      <Badge bg="info">Teacher</Badge>
                    ) : (
                      <Badge bg="success">Student</Badge>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Tab>
      </Tabs>
    </Container>
  );
};

export default AdminDashboard;
