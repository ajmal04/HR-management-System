import React, { Component } from "react";
import { Card, Form, Button, Alert, Spinner } from "react-bootstrap";
import { Redirect } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import axios from "axios";
import 'react-datepicker/dist/react-datepicker.css';
import { isBefore, startOfDay } from 'date-fns';

export default class Application extends Component {
  constructor(props) {
    super(props);

    this.state = {
      type: "",
      startDate: null,
      endDate: null,
      reason: "",
      hasError: false,
      errMsg: "",
      completed: false,
      isSubmitting: false,
      touched: {
        type: false,
        startDate: false,
        endDate: false
      }
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
    
    const errors = this.validate();
    if (Object.keys(errors).length > 0) {
      this.setState({
        hasError: true,
        errMsg: 'Please fix the highlighted fields',
        touched: {
          type: true,
          startDate: true,
          endDate: true
        },
        errors // Save detailed errors
      });
      window.scrollTo(0, 0);
      return;
    }

    this.setState({ isSubmitting: true, hasError: false, errMsg: "" });

    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.id) {
      this.setState({
        hasError: true,
        errMsg: "User information not found",
        isSubmitting: false
      });
      return;
    }

    const application = {
      type: this.state.type,
      startDate: this.state.startDate,
      endDate: this.state.endDate,
      status: 'Pending',
      reason: this.state.reason,
      userId: user.id
    };

    axios({
      method: "post",
      url: "/api/applications",
      data: application,
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then(() => {
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
    const { 
      type, startDate, endDate, reason, 
      hasError, errMsg, completed, isSubmitting,
      touched
    } = this.state;

    const errors = this.validate();

    if (completed) {
      return <Redirect to="/application-list" />;
    }

    return (
      <div className="container-fluid pt-4">
        {hasError && (
          <Alert variant="danger" className="m-3">
            {errMsg}
          </Alert>
        )}

        <Card className="mb-3 main-card">
          <Card.Header>
            <h5>Make Application</h5>
          </Card.Header>
          <Card.Body>
            <Form onSubmit={this.onSubmit}>
              <Form.Group controlId="formType">
                <Form.Label>Type</Form.Label>
                <Form.Control
                    as="select"
                    name="type"
                    value={type}
                    onChange={this.handleChange}
                    isInvalid={touched.type && !!errors.type}
                    required
                  >
                    <option value="">Select application type</option>
                    <option value="annual_leave">Annual Leave</option>
                    <option value="sick_leave">Sick Leave</option>
                    <option value="medical_leave">Medical Leave</option>
                    <option value="maternity_paternity">Maternity/Paternity Leave</option>
                    <option value="bereavement_leave">Bereavement Leave</option>
                    <option value="business_trip">Business Trip</option>
                    <option value="remote_work">Remote Work Request</option>
                    <option value="training">Training/Conference</option>
                    <option value="personal_development">Personal Development Leave</option>
                    <option value="volunteer">Volunteer Day</option>
                    <option value="other">Other</option>
                  </Form.Control>
                {touched.type && errors.type && (
                  <Form.Control.Feedback type="invalid">
                    {errors.type}
                  </Form.Control.Feedback>
                )}
              </Form.Group>

              <Form.Group controlId="formStartDate">
                <Form.Label>Start Date</Form.Label>
                <DatePicker 
                  selected={startDate}
                  className={`form-control ${touched.startDate && errors.startDate ? 'is-invalid' : ''}`}
                  onChange={(date) => this.handleDateChange(date, 'startDate')}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  minDate={new Date()}
                  required
                />
                {touched.startDate && errors.startDate && (
                  <div className="invalid-feedback d-block">
                    {errors.startDate}
                  </div>
                )}
              </Form.Group>

              <Form.Group controlId="formEndDate">
                <Form.Label>End Date</Form.Label>
                <DatePicker 
                  selected={endDate}
                  className={`form-control ${touched.endDate && errors.endDate ? 'is-invalid' : ''}`}
                  onChange={(date) => this.handleDateChange(date, 'endDate')}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate || new Date()}
                  required
                />
                {touched.endDate && errors.endDate && (
                  <div className="invalid-feedback d-block">
                    {errors.endDate}
                  </div>
                )}
                {errors.dateRange && (
                  <div className="invalid-feedback d-block">
                    {errors.dateRange}
                  </div>
                )}
              </Form.Group>

              <Form.Group controlId="formReason">
                <Form.Label>Reason <span className="text-muted">(Comments)</span></Form.Label>
                <Form.Control 
                  as="textarea"
                  rows={3}
                  name="reason"
                  value={reason}
                  onChange={this.handleChange}
                />
              </Form.Group>

              <Button 
                variant="primary" 
                type="submit" 
                className="mt-2"
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
                    <span className="ml-2">Submitting...</span>
                  </>
                ) : 'Submit'}
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </div>
    );
  }
}
