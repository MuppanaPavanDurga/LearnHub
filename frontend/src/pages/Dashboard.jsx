import React, { useEffect, useState } from "react";
import { Container, Card, Row, Col } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import TeacherDashboard from "../pages/TeacherDashboard";
import AdminDashboard from "../pages/AdminDashboard"; 

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login");
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, [navigate]);

  if (!user) return null;

  return (
    <Container style={{ marginTop: "40px" }}>
      <h2 className="mb-4">Dashboard</h2>

      {user.type === "student" && (
        <Card body className="mb-4 shadow-sm">
          <h5>🎓 Welcome Student, {user.name}!</h5>
          <Row className="mt-3">
            <Col xs="auto">
              <Link to="/browse" className="btn btn-outline-success">📚 Browse Courses</Link>
            </Col>
            <Col xs="auto">
              <Link to="/my-courses" className="btn btn-outline-warning">📘 My Courses</Link>
            </Col>
          </Row>
        </Card>
      )}

      {user.type === "teacher" && (
        <>
          <Card body className="mb-4 shadow-sm">
            <h5>👨‍🏫 Welcome Teacher, {user.name}!</h5>
            <Row className="mt-3">
              <Col xs="auto">
                <Link to="/create-course" className="btn btn-outline-primary">➕ Create Course</Link>
              </Col>
              <Col xs="auto">
                <Link to="/add-section" className="btn btn-outline-info">🎬 Add Sections</Link>
              </Col>
              <Col xs="auto">
                <Link to="/assign-course" className="btn btn-outline-dark">📤 Assign Courses</Link>
              </Col>
            </Row>
          </Card>
          <TeacherDashboard />
        </>
      )}

    {user.type === "admin" && (
      <>
        <Card body className="shadow-sm mb-4">
          <h5>🛡️ Welcome Admin, {user.name}!</h5>
        </Card>
        <AdminDashboard />
      </>
    )}

    </Container>
  );
};

export default Dashboard;
