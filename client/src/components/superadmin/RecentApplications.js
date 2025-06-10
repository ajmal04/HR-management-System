import React from "react";
import axios from "axios";

export default class RecentApplications extends React.Component {
  state = {
    recentApplications: [],
    isLoading: true,
    error: null,
  };

  componentDidMount() {
    axios({
      method: "get",
      url: "/api/applications/recent",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => {
        this.setState({ recentApplications: res.data, isLoading: false });
      })
      .catch((err) => {
        this.setState({
          error: "Failed to load applications",
          isLoading: false,
        });
        console.error("API Error:", err);
      });
  }

  render() {
    const { recentApplications, isLoading, error } = this.state;

    if (isLoading) return <div className="card p-3">Loading...</div>;
    if (error) return <div className="card p-3 text-danger">{error}</div>;
    if (recentApplications.length === 0) {
      return <div className="card p-3">No recent applications found.</div>;
    }

    return (
      <div className="card">
        <div className="card-body">
          <ul className="list-unstyled">
            {recentApplications.map((app) => (
              <li key={app.id} className="py-2 border-bottom">
                <div className="d-flex align-items-center">
                  <img
                    src={
                      app.user.avatarUrl ||
                      process.env.PUBLIC_URL + "/user-40.png"
                    }
                    alt={app.user.fullName}
                    className="rounded-circle mr-3"
                    width="40"
                    height="40"
                  />
                  <div className="flex-grow-1">
                    <h6 className="mb-0" style={{ fontSize: "1.3rem" }}>
                      {app.user.fullName}{" "}
                      <small className="text-muted">({app.type})</small>
                    </h6>
                    <div className="d-flex justify-content-between">
                      <small className="text-muted">
                        {new Date(app.createdAt).toLocaleDateString()}
                      </small>
                      <small
                        className={`${
                          app.status === "Approved"
                            ? "text-success"
                            : app.status === "Rejected"
                            ? "text-danger"
                            : "text-warning"
                        }`}
                        style={{ fontSize: "1.1rem" }}
                      >
                        {app.status}
                      </small>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}
