import React, { Component } from "react";
import axios from "axios";

export default class RecentEventWidgetManagerEmp extends Component {
  state = {
    recentEvents: [],
  };

  componentDidMount() {
    const user = JSON.parse(localStorage.getItem("user"));
    const deptId = user.departmentId;

    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    };

    Promise.all([
      axios.get(`/api/departmentEvents/department/${deptId}`, { headers }),
      axios.get(`/api/collegeEvents/recent`, { headers }),
    ])
      .then(([deptRes, collegeRes]) => {
        const merged = [...deptRes.data, ...collegeRes.data];
        merged.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        this.setState({ recentEvents: merged.slice(0, 3) }); // show top 3 if needed
      })
      .catch((err) => {
        console.error("Failed to load recent events", err);
      });
  }

  render() {
    return (
      <div className="card">
        <div className="mt-2 mb-1 text-center">
          <strong>Recent Events</strong>
        </div>
        <ul className="pl-3 pr-3">
          {this.state.recentEvents.map((event) => (
            <li key={event.id} className="mb-2" style={{ listStyle: "none" }}>
              <strong>{event.eventName}</strong>{" "}
              <span className="text-muted" style={{ fontSize: "0.85em" }}>
                (
                {event.college
                  ? `College: ${event.college}`
                  : `Dept: ${event.department?.departmentName || "N/A"}`}
                )
              </span>
              <br />
              <small className="text-muted">{event.eventDescription}</small>
              <br />
              <span style={{ fontSize: "0.8em" }}>
                {new Date(event.startDate).toLocaleDateString()} to{" "}
                {new Date(event.endDate).toLocaleDateString()}
              </span>
              <hr className="mt-2 mb-2" />
            </li>
          ))}
        </ul>
      </div>
    );
  }
}
