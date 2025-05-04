import React from "react";
import { useHistory } from "react-router-dom";

const LeaveDetails = () => {
  const history = useHistory();

  const handleApply = () => {
    history.push("/application"); // Change if your route is different
  };

  return (
    <div className="panel panel-default mt-4">
      {/* Header */}
      <div
        className="panel-heading with-border"
        style={{
          backgroundColor: "#515e73",
          color: "white",
        }}
      >
        <h3 className="panel-title mb-0">Leave </h3>
      </div>

      {/* Apply Button (positioned separately) */}
      <div
        className="d-flex justify-content-end p-2"
        style={{ backgroundColor: "#f5f5f5" }}
      >
        <button className="btn btn-primary btn-sm" onClick={handleApply}>
          Apply for Leave
        </button>
      </div>

      {/* Table */}
      <div className="panel-body p-0" style={{ backgroundColor: "#ffffff" }}>
        <table className="table table-bordered mb-0">
          <thead>
            <tr>
              <th>Leave Type</th>
              <th>Total Leave</th>
              <th>Leave Taken</th>
              <th>Remaining Leave</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Casual Leave</td>
              <td>10</td>
              <td>0</td>
              <td>10</td>
            </tr>
            <tr>
              <td>Vacation Leave</td>
              <td>10</td>
              <td>0</td>
              <td>10</td>
            </tr>
            <tr>
              <td>Medical Leave</td>
              <td>10</td>
              <td>0</td>
              <td>10</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaveDetails;
