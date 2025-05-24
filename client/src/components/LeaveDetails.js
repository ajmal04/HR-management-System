import React from "react";
import { useHistory } from "react-router-dom";

const LeaveDetails = () => {
  const history = useHistory();

  const handleApply = () => {
    history.push("/application");
  };

  const user = JSON.parse(localStorage.getItem("user"));
  const gender = user?.gender;

  // Define leave types
  const allLeaveTypes = [
    { name: "Casual Leave", total: 8, taken: 0, remaining: 8 },
    { name: "Vacation Leave", total: 15, taken: 0, remaining: 15 },
    { name: "Sick / Medical Leave", total: 10, taken: 0, remaining: 10 },
    { name: "On Duty Leave", total: 15, taken: 0, remaining: 15 },
    { name: "Paternity Leave", total: 10, taken: 0, remaining: 10 },
    { name: "Maternity Leave", total: 182, taken: 0, remaining: 182 },
  ];

  // Filter based on gender
  const filteredLeaveTypes = allLeaveTypes.filter((leave) => {
    if (leave.name === "Paternity Leave") return gender === "Male";
    if (leave.name === "Maternity Leave") return gender === "Female";
    return true; // Include all others
  });

  return (
    <div className="panel panel-default mt-4">
      <div
        className="panel-heading with-border"
        style={{ backgroundColor: "#515e73", color: "white" }}
      >
        <h3 className="panel-title mb-0">Leave </h3>
      </div>

      <div
        className="d-flex justify-content-end p-2"
        style={{ backgroundColor: "#f5f5f5" }}
      >
        <button className="btn btn-primary btn-sm" onClick={handleApply}>
          Apply for Leave
        </button>
      </div>

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
            {filteredLeaveTypes.map((leave, index) => (
              <tr key={index}>
                <td>{leave.name}</td>
                <td>{leave.total}</td>
                <td>{leave.taken}</td>
                <td>{leave.remaining}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaveDetails;
