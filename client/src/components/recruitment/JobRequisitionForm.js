import React, { useState } from "react";
import axios from "axios";

const JobRequisitionForm = () => {
  const [formData, setFormData] = useState({
    department: "",
    positionTitle: "",
    jobType: "",
    vacancies: "",
    qualification: "",
    experience: "",
    collegeName: "", // You may prefill this based on HOD's login
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/api/requisition", formData);
      alert("Requisition submitted successfully");
      setFormData({
        department: "",
        positionTitle: "",
        jobType: "",
        vacancies: "",
        qualification: "",
        experience: "",
        skills: "",
        collegeName: "",
      });
    } catch (error) {
      console.error("Error submitting requisition:", error);
      alert("Submission failed");
    }
  };

  return (
    <div className="container mt-4">
      <h3>Job Requisition Form</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="department"
          value={formData.department}
          onChange={handleChange}
          placeholder="Department"
          className="form-control mb-2"
          required
        />
        <input
          type="text"
          name="positionTitle"
          value={formData.positionTitle}
          onChange={handleChange}
          placeholder="Position Title"
          className="form-control mb-2"
          required
        />
        <select
          name="jobType"
          value={formData.jobType}
          onChange={handleChange}
          className="form-control mb-2"
          required
        >
          <option value="">Select Job Type</option>
          <option value="Full-Time">Full-Time</option>
          <option value="Part-Time">Part-Time</option>
          <option value="Contract">Contract</option>
        </select>
        <input
          type="number"
          name="vacancies"
          value={formData.vacancies}
          onChange={handleChange}
          placeholder="No. of Vacancies"
          className="form-control mb-2"
          required
        />
        <input
          type="text"
          name="qualification"
          value={formData.qualification}
          onChange={handleChange}
          placeholder="Qualification"
          className="form-control mb-2"
          required
        />
        <input
          type="text"
          name="experience"
          value={formData.experience}
          onChange={handleChange}
          placeholder="Experience"
          className="form-control mb-2"
        />
        <input
          type="text"
          name="collegeName"
          value={formData.collegeName}
          onChange={handleChange}
          placeholder="College Name"
          className="form-control mb-3"
          required
        />
        <button type="submit" className="btn btn-primary">
          Submit Requisition
        </button>
      </form>
    </div>
  );
};

export default JobRequisitionForm;
