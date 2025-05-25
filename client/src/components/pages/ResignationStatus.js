import React, { useEffect, useState } from "react";
import axios from "axios";

const ResignationStatus = () => {
  const [resignation, setResignation] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;

    const decoded = JSON.parse(atob(token.split(".")[1]));
    const role = decoded.user.role;

    let url = "";
    if (role === "ROLE_HOD") {
      url = "/api/resignations/hod/status";
    } else if (role === "ROLE_ADMIN") {
      url = "/api/resignations/admin/status";
    } else {
      url = "/api/resignations/faculty";
    }

    axios
      .get(url, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setResignation(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch resignation status", err);
        setLoading(false);
      });
  }, [token]);

  if (loading) return <p>Loading...</p>;
  if (!resignation) return <p>No resignation data found.</p>;

  // Calculate countdown
  let countdown = null;
  if (resignation.noticeStartDate && resignation.noticeEndDate) {
    const today = new Date();
    const end = new Date(resignation.noticeEndDate);
    const diff = Math.ceil((end - today) / (1000 * 60 * 60 * 24));
    countdown = diff > 0 ? `${diff} day(s)` : "Notice period ended";
  }

  return (
    <div className="container mt-5">
      <h4>Resignation Status</h4>
      <div className="card">
        <div className="card-body">
          <p>
            <strong>Full Name:</strong> {resignation.fullName}
          </p>
          <p>
            <strong>Employee ID:</strong> {resignation.employeeId}
          </p>
          <p>
            <strong>Department:</strong> {resignation.department}
          </p>
          <p>
            <strong>Submitted On:</strong> {resignation.dateOfSubmission}
          </p>
          <p>
            <strong>HOD Status:</strong> {resignation.hodStatus}
          </p>
          {resignation.hodStatus === "rejected" && (
            <p>
              <strong>HOD Rejection Reason:</strong> {resignation.hodComment}
            </p>
          )}
          <p>
            <strong>Principal Status:</strong> {resignation.principalStatus}
          </p>
          {resignation.principalStatus === "rejected" && (
            <p>
              <strong>Principal Rejection Reason:</strong>{" "}
              {resignation.principalComment}
            </p>
          )}
          <p>
            <strong>HR Status:</strong> {resignation.hrStatus}
          </p>
          {resignation.hrStatus === "rejected" && (
            <p>
              <strong>SuperAdmin Rejection Reason:</strong>{" "}
              {resignation.hrComment}
            </p>
          )}

          {resignation.hrStatus === "approved" && (
            <>
              <p>
                <strong>Notice Period:</strong> 3 months
              </p>
              <p>
                <strong>Start Date:</strong> {resignation.noticeStartDate}
              </p>
              <p>
                <strong>End Date:</strong> {resignation.noticeEndDate}
              </p>
              <p>
                <strong>Days Left:</strong> {countdown}
              </p>
              <p className="text-danger">
                Note: Please note that any leaves availed during the notice
                period will be added to the notice duration, thereby extending
                the overall notice period accordingly.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResignationStatus;
