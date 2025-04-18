import React, { useState } from "react";
import { Card, Form, Button, Alert, Spinner } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import DatePicker from "react-datepicker";
import axios from "axios";
import moment from "moment";

export default function ResignationForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    employeeId: "",
    department: "",
    role: "",
    collegeEmail: "",
    dateOfJoining: null,
    personalEmail: "",
    phone: "",
    reasonForResignation: "",
    dateOfSubmission: new Date(),
    noticePeriod: "",
    confirm: false,
    college: "",
  });

  const departments = [
    "Computer Science",
    "Electrical Engineering",
    "Mechanical Engineering",
    "Agricultural Engineering",
    "Pharmaceutics",
    "Pharmacology",
    "Nursing",
    "Physiotherapy",
    "OInformation Technology",
  ];

  const colleges = [
    "Engineering",
    "Pharmacy",
    "Nursing",
    "Allied Health Science",
    "Medical Science and Research",
    "N/A",
  ];

  const roles = [
    "Super Admin",
    "System Admin",
    "Admin",
    "HOD",
    "Faculty",
    "Employee",
  ];

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [completed, setCompleted] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleDateChange = (date, field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: date,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.confirm) {
      setHasError(true);
      setErrMsg("Please confirm the resignation terms");
      return;
    }

    setIsSubmitting(true);
    setHasError(false);

    try {
      const submissionData = {
        fullName: formData.fullName,
        employeeId: formData.employeeId,
        department: formData.department,
        role: formData.role,
        collegeEmail: formData.collegeEmail,
        dateOfJoining: formData.dateOfJoining
          ? moment(formData.dateOfJoining).format("YYYY-MM-DD")
          : null,
        personalEmail: formData.personalEmail,
        phone: formData.phone,
        reasonForResignation: formData.reasonForResignation,
        dateOfSubmission: moment(formData.dateOfSubmission).format(
          "YYYY-MM-DD"
        ),
        noticePeriod: formData.noticePeriod,
        college: formData.college,
        status: "pending",
      };

      await axios({
        method: "post",
        url: "/api/resignations",
        data: submissionData,
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        timeout: 10000,
      });

      setCompleted(true);
    } catch (err) {
      setHasError(true);
      setErrMsg(err.response?.data?.message || "Failed to submit resignation");
      window.scrollTo(0, 0);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (completed) {
    return <Redirect to="/my-applications" />;
  }

  return (
    <div className="container">
      <h4 className="mb-4 fw-bold text-center">Resignation Form</h4>

      {hasError && (
        <Alert variant="danger" className="m-3">
          {errMsg || "Failed to submit form"}
        </Alert>
      )}

      <Card
        style={{
          backgroundColor: "white",
          borderColor: "#b5e1f7",
          boxShadow: "0 1px rgba(0, 0, 0, 0.05)",
          marginBottom: "20px",
        }}
      >
        <Card.Header
          style={{
            backgroundColor: "#515e73",
            color: "white",
            fontWeight: "bold",
          }}
        >
          Employee Details
        </Card.Header>
        <Card.Body>
          <Form.Group className="mb-3">
            <Form.Label style={{ color: "#515e73", fontWeight: "bold" }}>
              College Name
            </Form.Label>
            <Form.Control
              as="select"
              name="college"
              value={formData.college}
              onChange={handleChange}
              required
            >
              <option value="">Select College</option>
              {colleges.map((college, index) => (
                <option key={index} value={college}>
                  {college}
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          <div className="row mb-3">
            <div className="col">
              <Form.Label style={{ color: "#515e73", fontWeight: "bold" }}>
                Full Name
              </Form.Label>
              <Form.Control
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col">
              <Form.Label style={{ color: "#515e73", fontWeight: "bold" }}>
                Employee ID
              </Form.Label>
              <Form.Control
                type="text"
                name="employeeId"
                value={formData.employeeId}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="row mb-3">
            <div className="col">
              <Form.Label style={{ color: "#515e73", fontWeight: "bold" }}>
                Department
              </Form.Label>
              <Form.Control
                as="select"
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
              >
                <option value="">Select Department</option>
                {departments.map((dept, index) => (
                  <option key={index} value={dept}>
                    {dept}
                  </option>
                ))}
              </Form.Control>
            </div>
            <div className="col">
              <Form.Label style={{ color: "#515e73", fontWeight: "bold" }}>
                Role
              </Form.Label>
              <Form.Control
                as="select"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="">Select Role</option>
                {roles.map((role, index) => (
                  <option key={index} value={role}>
                    {role}
                  </option>
                ))}
              </Form.Control>
            </div>
          </div>

          <div className="row mb-3">
            <div className="col">
              <Form.Label style={{ color: "#515e73", fontWeight: "bold" }}>
                Personal Email
              </Form.Label>
              <Form.Control
                type="email"
                name="personalEmail"
                value={formData.personalEmail}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col">
              <Form.Label style={{ color: "#515e73", fontWeight: "bold" }}>
                College Email
              </Form.Label>
              <Form.Control
                type="email"
                name="collegeEmail"
                value={formData.collegeEmail}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="row mb-3">
            <div className="col">
              <Form.Label style={{ color: "#515e73", fontWeight: "bold" }}>
                Phone
              </Form.Label>
              <Form.Control
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col">
              <Form.Label style={{ color: "#515e73", fontWeight: "bold" }}>
                Date of Joining
              </Form.Label>
              <div>
                <DatePicker
                  selected={formData.dateOfJoining}
                  onChange={(date) => handleDateChange(date, "dateOfJoining")}
                  className="form-control"
                  dateFormat="yyyy-MM-dd"
                  required
                />
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>

      <Card
        style={{
          backgroundColor: "white",
          borderColor: "#b5e1f7",
          boxShadow: "0 1px rgba(0, 0, 0, 0.05)",
          marginBottom: "20px",
        }}
      >
        <Card.Header
          style={{
            backgroundColor: "#515e73",
            color: "white",
            fontWeight: "bold",
          }}
        >
          Resignation Details
        </Card.Header>
        <Card.Body>
          <Form.Group className="mb-3">
            <Form.Label style={{ color: "#515e73", fontWeight: "bold" }}>
              Reason for Resignation
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="reasonForResignation"
              value={formData.reasonForResignation}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <div className="row mb-3">
            <div className="col">
              <Form.Label style={{ color: "#515e73", fontWeight: "bold" }}>
                Date of Submission
              </Form.Label>
              <Form.Control
                type="text"
                name="dateOfSubmission"
                value={moment(formData.dateOfSubmission).format("MM/DD/YYYY")}
                readOnly
              />
            </div>
            <div className="col">
              <Form.Label style={{ color: "#515e73", fontWeight: "bold" }}>
                Notice Period
              </Form.Label>
              <Form.Control
                type="text"
                name="noticePeriod"
                value={formData.noticePeriod}
                onChange={handleChange}
                placeholder="Example: 30 days"
              />
            </div>
          </div>

          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              label="I confirm that my resignation is voluntary, and I will fulfill my duties during the notice period as required."
              name="confirm"
              checked={formData.confirm}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Card.Body>
      </Card>

      <div className="d-flex justify-content-end mb-4">
        <Button
          variant="primary"
          type="submit"
          onClick={handleSubmit}
          disabled={isSubmitting}
          style={{
            backgroundColor: "#515e73",
            borderColor: "#b5e1f7",
          }}
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
          ) : (
            "Submit"
          )}
        </Button>
      </div>
    </div>
  );
}
