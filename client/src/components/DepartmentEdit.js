import React, { Component } from "react";
import { Redirect } from 'react-router-dom'
import { Modal, Button, Form, Alert } from "react-bootstrap";
import moment from 'moment'
import axios from 'axios'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"


export default class DepartmentEdit extends Component {
  constructor(props) {
    super(props);

    this.state = {
      departmentName: "",
      college: "",
      id: null,
      colleges: [],
      showAlert: false,
      errorMsg: "",
      done: false,
      showSuccess: false,
      successMsg: ""
    };
  }

  componentDidMount() {
    this.setState({
      departmentName: this.props.data.departmentName,
      college: this.props.data.college,
      id: this.props.data.id
    });

    // Fetch list of colleges
    axios({
      method: "get",
      url: "/api/colleges",      // Change this URL if needed
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
    .then(res => {
      this.setState({ colleges: res.data });
    })
    .catch(err => {
      console.error("Failed to fetch colleges:", err);
    });
  }

  handleChange = (event) => {
    const { value, name } = event.target;
    this.setState({ [name]: value });
  };

  onSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (this.state.departmentName.trim() === "" || this.state.college.trim() === "") {
      this.setState({
        showAlert: true,
        errorMsg: "Please fill all fields properly."
      });
      return;
    }

    let data = {
      departmentName: this.state.departmentName,
      college: this.state.college
    };

    axios({
      method: 'put',
      url: `/api/departments/${this.state.id}`,
      data: data,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    .then(res => {
      this.setState({ 
        showSuccess: true,          // Add this
        successMsg: "Department updated successfully!"  // Add this
      });
      setTimeout(() => this.setState({ done: true }), 1500);  // Add this
    })
    .catch(err => {
      this.setState({
        showAlert: true,
        errorMsg: err.response?.data?.message || "Something went wrong."
      });
    });
  };

  render() {
    const { showAlert, showSuccess, done, departmentName, college, colleges, successMsg } = this.state;
    return (
      <Modal
        {...this.props}
        size="sm"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Edit Department
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {done && <Redirect to="/departments" />}

          {showSuccess && (
            <Alert variant="success" className="m-1">
              {successMsg}
            </Alert>
          )}

          {showAlert && (
            <Alert variant="warning" className="m-1">
              {this.state.errorMsg}
            </Alert>
          )}

          <Form onSubmit={this.onSubmit}>
            {/* Department Name */}
            <Form.Group controlId="formDepartmentName">
              <Form.Label className="mb-2">Department Name</Form.Label>
              <Form.Control
                type="text"
                className="col-8"
                name="departmentName"
                value={departmentName}
                onChange={this.handleChange}
                autoComplete="off"
                required
              />
            </Form.Group>

            {/* College Select */}
            <Form.Group controlId="formCollegeName" className="mt-3">
              <Form.Label className="mb-2">College Name</Form.Label>
              <Form.Control
                as="select"
                className="col-8"
                name="college"
                value={college}
                onChange={this.handleChange}
                required
              >
                <option value="">-- Select College --</option>
                {colleges.map((college, idx) => (
                  <option key={idx} value={college}>
                    {college}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Button variant="success" type="submit" className="mt-3">
              Submit
            </Button>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button onClick={this.props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
