import React from "react";
import { Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  return (
    <div className="landing-hero">
      <div className="overlay">
        <Container className="text-center text-light landing-content">
          <h1 className="display-5 fw-bold">Small App, Big Dreams</h1>
          <h2 className="mb-4">Elevating Your Education</h2>
          <Link to="/browse">
            <Button variant="warning" size="lg">
              Explore Courses
            </Button>
          </Link>
        </Container>
      </div>
    </div>
  );
};

export default Home;
