import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const JobApplicationForm = () => {
  const { jobId } = useParams();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    education: "",
    experience: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/recruitment/jobs/apply", { ...formData, jobId });
      alert("Application submitted!");
    } catch (err) {
      alert("Error: " + err.response.data.error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-3">Apply for Job</h2>
      {["name", "email", "phone", "education", "experience"].map((field) => (
        <input
          key={field}
          type="text"
          placeholder={field}
          value={formData[field]}
          onChange={(e) =>
            setFormData({ ...formData, [field]: e.target.value })
          }
          className="block w-full p-2 my-2 border rounded"
        />
      ))}
      <button
        type="submit"
        className="bg-green-500 text-white px-4 py-2 mt-2 rounded"
      >
        Submit
      </button>
    </form>
  );
};

export default JobApplicationForm;
