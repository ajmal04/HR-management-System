import React, { useState, useEffect } from "react";
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
    departmentId: null,
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

  const [departments, setDepartments] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [roles, setRoles] = useState([
    "ROLE_SUPER_ADMIN",
    "ROLE_SYSTEM_ADMIN",
    "ROLE_ADMIN",
    "ROLE_HOD",
    "ROLE_FACULTY",
    "ROLE_EMPLOYEE",
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    // Fetch departments
    axios
      .get("/api/departments", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        const mappedDepartments = res.data.map((dept) => ({
          id: dept.id,
          departmentName: dept.departmentName,
        }));
        setDepartments(mappedDepartments);
      })
      .catch((err) => {
        console.error("Error fetching departments:", err);
      });

    // axios({
    //   method: "get",
    //   url: "/api/departments",
    //   headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    // })
    //   .then((res) => {
    //     console.log("Departments API response:", res.data);
    //     // Ensure we have an array of departments with id and departmentName
    //     const depts = Array.isArray(res.data)
    //       ? res.data.map((item) => ({
    //           id: item.departmentId, // Adjust these property names if needed
    //           departmentName: item.name,
    //         }))
    //       : [];
    //     console.log("Processed departments:", depts);
    //     setDepartments(depts);
    //   })
    //   .catch((err) => {
    //     console.error("Error fetching departments:", err);
    //     setDepartments([]);
    //   });

    // Fetch colleges
    axios({
      method: "get",
      url: "/api/colleges",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => {
        // Ensure we have an array of colleges
        const cols = Array.isArray(res.data) ? res.data : [];
        setColleges(cols);
      })
      .catch((err) => {
        console.error("Error fetching colleges:", err);
        setColleges([]);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleDepartmentChange = (e) => {
    const selectedId = parseInt(e.target.value);
    const selectedDept = departments.find((d) => d.id == selectedId);

    setFormData((prev) => ({
      ...prev,
      department: selectedDept?.departmentName || "",
      departmentId: selectedDept?.id || null,
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

    const token = localStorage.getItem("token");
    if (!token) {
      setHasError(true);
      setErrMsg("No token found. Please login again.");
      return;
    }

    setIsSubmitting(true);
    setHasError(false);

    try {
      const submissionData = {
        fullName: formData.fullName,
        employeeId: formData.employeeId,
        department: formData.department,
        departmentId: formData.departmentId,
        role: formData.role,
        collegeEmail: formData.collegeEmail,
        personalEmail: formData.personalEmail,
        phone: formData.phone,
        reasonForResignation: formData.reasonForResignation,
        dateOfJoining: formData.dateOfJoining
          ? moment(formData.dateOfJoining).format("YYYY-MM-DD")
          : null,
        dateOfSubmission: moment(formData.dateOfSubmission).format(
          "YYYY-MM-DD"
        ),
        noticePeriod: formData.noticePeriod,
        college: formData.college,
        hodStatus: "pending",
        principalStatus: "pending",
        hrStatus: "pending",
        resignationStatus: "Resignation submitted and pending HOD approval",
      };

      const response = await axios.post("/api/resignations", submissionData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Resignation submitted successfully", response.data);
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
                name="departmentId"
                value={formData.departmentId || ""}
                onChange={handleDepartmentChange}
                required
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.departmentName}
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
                    {role.replace("ROLE_", "").replace(/_/g, " ")}
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
