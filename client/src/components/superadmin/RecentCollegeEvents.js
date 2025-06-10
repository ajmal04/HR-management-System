import React from "react";
import axios from "axios";

export default class RecentCollegeEvents extends React.Component {
  state = {
    recentEvents: [],
  };

  componentDidMount() {
    axios
      .get("/api/collegeEvents/recent", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        this.setState({ recentEvents: res.data });
      })
      .catch((err) => {
        console.error("Failed to load recent college events", err);
      });
  }

  render() {
    return (
      <div className="card">
        <div className="mt-1 text-center">
          <strong>Recent College Events</strong>
        </div>
        <ul>
          {this.state.recentEvents.map((event) => (
            <li
              key={event.id}
              style={{ listStyle: "none", marginBottom: "1rem" }}
            >
              <strong>{event.eventName}</strong> ({event.college})<br />
              <small>{event.eventDescription}</small>
              <br />
              <span>
                <i>From: {new Date(event.startDate).toLocaleDateString()}</i> to{" "}
                <i>{new Date(event.endDate).toLocaleDateString()}</i>
              </span>
              <hr />
            </li>
          ))}
        </ul>
      </div>
    );
  }
}
