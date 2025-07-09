import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar, Container, Nav, Button } from "react-bootstrap";

const AppNavbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">LearnHub</Navbar.Brand>
        <Navbar.Toggle aria-controls="main-navbar" />
        <Navbar.Collapse id="main-navbar">
          <Nav className="ms-auto">

            <Nav.Link as={Link} to="/">Home</Nav.Link>
            {!user && (
              <>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                <Nav.Link as={Link} to="/register">Register</Nav.Link>
              </>
            )}

            {user && (
              <>
                <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
                {user.type === "teacher" && (
                  <>
                    <Nav.Link as={Link} to="/create-course">Create Course</Nav.Link>
                    <Nav.Link as={Link} to="/add-section">Add Section</Nav.Link>
                    <Nav.Link as={Link} to="/assign-course">Assign Course</Nav.Link>
                  </>
                )}

                {user.type === "student" && (
                  <Nav.Link as={Link} to="/my-courses">My Courses</Nav.Link>
                )}

              </>
            )}
          </Nav>

          {user && (
            <div className="d-flex align-items-center ms-3">
              <Button variant="outline-danger" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
