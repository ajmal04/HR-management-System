import React, { useState } from "react";
import axios from "axios";

const JobRequisitionForm = () => {
  const [formData, setFormData] = useState({
    jobTitle: "",
    department: "",
    vacancies: 1,
    jobType: "",
    qualification: "",
    experience: "",
    reason: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/recruitment/requisitions", formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      alert("Job requisition submitted!");
    } catch (err) {
      alert("Error: " + err.response.data.error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded shadow-md">
      <h2 className="text-xl font-bold mb-2">Job Requisition</h2>
      {[
        "jobTitle",
        "department",
        "jobType",
        "qualification",
        "experience",
        "reason",
      ].map((field) => (
        <input
          key={field}
          type="text"
          placeholder={field}
          value={formData[field]}
          onChange={(e) =>
            setFormData({ ...formData, [field]: e.target.value })
          }
          className="block w-full p-2 my-2 border"
        />
      ))}
      <input
        type="number"
        min="1"
        placeholder="Vacancies"
        value={formData.vacancies}
        onChange={(e) =>
          setFormData({ ...formData, vacancies: parseInt(e.target.value) })
        }
        className="block w-full p-2 my-2 border"
      />
      <button className="bg-blue-500 text-white px-4 py-2 mt-3 rounded">
        Submit
      </button>
    </form>
  );
};

export default JobRequisitionForm;
