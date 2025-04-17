import React, { Component } from "react";
import { Card, Form, Button, Alert, Spinner } from "react-bootstrap";
import { Redirect } from 'react-router-dom';
import axios from "axios";

export default class DepartmentAdd extends Component {
  constructor(props) {
    super(props);

    this.state = {
      departmentName: "",
      college: "",
      colleges: [],               // To store fetched colleges
      hasError: false,
      errMsg: "",
      completed: false,
      isLoading: false,
      isSubmitting: false,
      successMsg: "",
      validationErrors: {
        departmentName: "",
        college: ""
      }
    };
  }

  componentDidMount() {
    this.setState({ isLoading: true });
    
    axios({
      method: "get",
      url: "/api/colleges",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => {
        this.setState({ colleges: res.data, isLoading: false });
      })
      .catch((err) => {
        this.setState({ 
          hasError: true, 
          errMsg: "Failed to load colleges. Please try again later.",
          isLoading: false 
        });
        console.error("Failed to load colleges", err);
      });
  }

  validateForm = () => {
    const { departmentName, college } = this.state;
    const errors = {
      departmentName: "",
      college: ""
    };
    
    let isValid = true;
    
    if (!departmentName.trim()) {
      errors.departmentName = "Department name is required";
      isValid = false;
    } else if (departmentName.length > 100) {
      errors.departmentName = "Department name cannot exceed 100 characters";
      isValid = false;
    }
    
    if (!college) {
      errors.college = "Please select a college";
      isValid = false;
    }
    
    this.setState({ validationErrors: errors });
    return isValid;
  };

  handleChange = (event) => {
    const { value, name } = event.target;
    this.setState({
      [name]: value,
      // Clear validation error when user types
      validationErrors: {
        ...this.state.validationErrors,
        [name]: ""
      }
    });
  };

  onSubmit = (e) => {
    e.preventDefault();

    if (!this.validateForm()) {
      return;
    }

    this.setState({ 
      hasError: false, 
      errMsg: "", 
      isSubmitting: true,
      successMsg: "" 
    });

    let department = {
      departmentName: this.state.departmentName,
      college: this.state.college
    };

    axios({
      method: "post",
      url: "/api/departments",
      data: department,
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => {
        this.setState({ 
          successMsg: "Department added successfully!",
          isSubmitting: false
        });
        setTimeout(() => {
          this.setState({ completed: true });
        }, 1500);
      })
      .catch((err) => {
        this.setState({ 
          hasError: true, 
          errMsg: err.response?.data?.message || "An error occurred while adding the department.",
          isSubmitting: false 
        });
        window.scrollTo(0, 0);
      });
  };

  render() {
    const { validationErrors, isLoading, isSubmitting, successMsg } = this.state;

    if (isLoading) {
      return (
        <div className="text-center mt-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p>Loading colleges...</p>
        </div>
      );
    }

    return (
      <Card className="mb-3 secondary-card">
        <Card.Header>
          <b>Add Department</b>
        </Card.Header>
        <Card.Body>
          {this.state.hasError && (
            <Alert variant="danger" className="mb-3">
              {this.state.errMsg}
            </Alert>
          )}
          
          {successMsg && (
            <Alert variant="success" className="mb-3">
              {successMsg}
            </Alert>
          )}

          <Card.Text>
            <Form onSubmit={this.onSubmit}>
              
              {/* Department Name */}
              <Form.Group controlId="formDepartmentName">
                <Form.Label className="text-muted mb-2">
                  Department Name
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Department Name"
                  name="departmentName"
                  style={{ width: "50%" }}
                  value={this.state.departmentName}
                  onChange={this.handleChange}
                  isInvalid={!!validationErrors.departmentName}
                />
                <Form.Control.Feedback type="invalid">
                  {validationErrors.departmentName}
                </Form.Control.Feedback>
              </Form.Group>

              {/* College Dropdown */}
              <Form.Group controlId="formCollege" className="mt-3">
                <Form.Label className="text-muted mb-2">
                  College
                </Form.Label>
                <Form.Control
                  as="select"
                  name="college"
                  style={{ width: "50%" }}
                  value={this.state.college}
                  onChange={this.handleChange}
                  isInvalid={!!validationErrors.college}
                >
                  <option value="">Select College</option>
                  {this.state.colleges.map((college, index) => (
                    <option key={index} value={college}>
                      {college}
                    </option>
                  ))}
                </Form.Control>
                <Form.Control.Feedback type="invalid">
                  {validationErrors.college}
                </Form.Control.Feedback>
              </Form.Group>

              {/* Submit Button */}
              <Button 
                variant="primary" 
                type="submit" 
                className="mt-3"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />
                    <span className="ms-2">Adding...</span>
                  </>
                ) : "Add"}
              </Button>

            </Form>
          </Card.Text>
        </Card.Body>

        {this.state.completed && (
          <Redirect to="/departments" />
        )}
      </Card>
    );
  }
}