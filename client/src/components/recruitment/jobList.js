import React, { useEffect, useState } from "react";
import axios from "axios";

const JobList = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    axios
      .get("/api/recruitment/jobs/openings")
      .then((res) => setJobs(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Open Job Positions</h2>
      {jobs.map((job) => (
        <div key={job.id} className="border p-3 my-3 rounded shadow">
          <h3 className="text-xl font-semibold">{job.jobTitle}</h3>
          <p>
            <strong>Department:</strong> {job.department}
          </p>
          <p>
            <strong>Qualification:</strong> {job.qualification}
          </p>
          <p>
            <strong>Experience:</strong> {job.experience}
          </p>
          <a href={`/apply/${job.id}`} className="text-blue-600 underline">
            Apply Now
          </a>
        </div>
      ))}
    </div>
  );
};

export default JobList;
