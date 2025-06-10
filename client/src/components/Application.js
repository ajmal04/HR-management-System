import React, { Component } from "react";
import { Card, Form, Button, Alert } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import DatePicker from "react-datepicker";
import axios from "axios";
import 'react-datepicker/dist/react-datepicker.css';
import { isBefore, startOfDay } from 'date-fns';

export default class Application extends Component {
  constructor(props) {
    super(props);

    const user = JSON.parse(localStorage.getItem("user"));

    const maleLeaveOptions = [
      "Casual leave",
      "Sick / Medical leave",
      "Vacation leave",
      "On Duty leave",
      "Paternity leave",
    ];

    const femaleLeaveOptions = [
      "Casual leave",
      "Sick / Medical leave",
      "Vacation leave",
      "On Duty leave",
      "Maternity leave",
    ];

    this.state = {
      type: "",
      startDate: null,
      endDate: null,
      reason: "",
      hasError: false,
      errMsg: "",
      completed: false,
      gender: user.gender, // assuming 'gender' is stored in the user object
      leaveOptions:
        user.gender === "Male" ? maleLeaveOptions : femaleLeaveOptions,
    };
  }

  handleChange = (event) => {
    const { value, name } = event.target;
    this.setState({
      [name]: value,
      touched: { ...this.state.touched, [name]: true }
    });
  };

  handleDateChange = (date, field) => {
    this.setState({
      [field]: date,
      touched: { ...this.state.touched, [field]: true }
    });
  };

  validate = () => {
    const errors = {};
    
    if (!this.state.type) {
      errors.type = 'Please select an application type';
    }
    
    if (isBefore(this.state.startDate, startOfDay(new Date()))) {
      errors.startDate = 'Start date cannot be in the past';
    }
    
    if (!this.state.endDate) {
      errors.endDate = 'Please select an end date';
    } else if (this.state.startDate && isBefore(this.state.endDate, this.state.startDate)) {
      errors.endDate = 'End date must be after start date';
    }
    
    return errors;
  };

  onSubmit = (e) => {
    e.preventDefault();

    this.setState({ isSubmitting: true, hasError: false, errMsg: "" });

    let userId = JSON.parse(localStorage.getItem("user")).id;

    let application = {
      type: this.state.type,
      startDate: this.state.startDate,
      endDate: this.state.endDate,
      status: "Pending",
      reason: this.state.reason,
      userId: userId,
    };

    axios({
      method: "post",
      url: "/api/applications",
      data: application,
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => {
        this.setState({ completed: true });
      })
      .catch((err) => {
        const errMsg = err.response?.data?.message || "Failed to submit application";
        this.setState({ 
          hasError: true, 
          errMsg,
          isSubmitting: false 
        });
        window.scrollTo(0, 0);
      });
  };

  render() {
    return (
      <div className="container-fluid pt-4">
        {this.state.hasError ? (
          <Alert variant="danger" className="m-3" block>
            {this.state.errMsg}
          </Alert>
        ) : this.state.completed ? (
          <Redirect to="/application-list" />
        ) : (
          <></>
        )}
        <Card className="mb-3 main-card">
          <Card.Header>
            <b>Make Application</b>
          </Card.Header>
          <Card.Body>
            <Card.Text>
              <Form onSubmit={this.onSubmit}>
                <Form.Group>
                  <Form.Label>Start Date</Form.Label>
                  <Form.Row>
                    <DatePicker
                      selected={this.state.startDate}
                      className="form-control ml-1"
                      onChange={(newDate) =>
                        this.setState({ startDate: newDate })
                      }
                      required
                    />
                  </Form.Row>
                </Form.Group>
                <Form.Group>
                  <Form.Label>End Date</Form.Label>
                  <Form.Row>
                    <DatePicker
                      selected={this.state.endDate}
                      className="form-control ml-1"
                      onChange={(newDate) =>
                        this.setState({ endDate: newDate })
                      }
                      required
                    />
                  </Form.Row>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Reason</Form.Label>
                  <Form.Control
                    as="select"
                    name="reason"
                    value={this.state.reason}
                    onChange={this.handleChange}
                    required
                  >
                    <option value="">Choose leave type</option>
                    {this.state.leaveOptions.map((option, index) => (
                      <option key={index} value={option}>
                        {option}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
                <Button variant="primary" type="submit" className="mt-2">
                  Add
                </Button>
              </Form>
            </Card.Text>
          </Card.Body>
        </Card>
      </div>
    );
  }
}
