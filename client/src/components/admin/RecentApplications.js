import * as React from "react";
import axios from "axios";

export default class RecentApplications extends React.Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      recentApplications: [],
      loading: true,
      error: null
    };
  }

  componentDidMount() {
    this._isMounted = true;
    this.fetchRecentApplications();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  fetchRecentApplications = () => {
    this.setState({ loading: true, error: null });
    axios({
      method: "get",
      url: "/api/applications/recent/college",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
    .then((res) => {
      if (this._isMounted) {
        this.setState({ 
          recentApplications: res.data,
          loading: false 
        });
      }
    })
    .catch((err) => {
      if (this._isMounted) {
        this.setState({ 
          error: "Failed to load recent applications",
          loading: false 
        });
        console.error("API Error:", err);
      }
    });
  };

  render() {
    const { recentApplications, loading, error } = this.state;

    if (loading) return <div className="text-center p-3">Loading applications...</div>;
    if (error) return <div className="alert alert-danger">{error}</div>;
    if (recentApplications.length === 0) return <div className="alert alert-info">No recent applications found</div>;

    return (
      <div className="card">
        <div className="card-body">
          <ul className="list-unstyled">
            {recentApplications.map((app) => (
              <li key={app.id} className="mb-3">
                <div className="d-flex align-items-center">
                  <div className="mr-3">
                    <img 
                      src={process.env.PUBLIC_URL + '/user-40.png'} 
                      alt="Applicant"
                      width="40"
                      height="40"
                    />
                  </div>
                  <div className="flex-grow-1">
                    <h6 className="mb-0">
                      {app.applicantName || 'N/A'} 
                      <small className="text-muted ml-2">({app.type})</small>
                    </h6>
                    <small className="text-muted">
                      {new Date(app.startDate).toLocaleDateString()}
                    </small>
                  </div>
                  <div>
                    <span 
                      className={`badge ${
                        app.status === 'Approved' ? 'badge-success' :
                        app.status === 'Rejected' ? 'badge-danger' :
                        'badge-warning'
                      }`}
                    >
                      {app.status}
                    </span>
                  </div>
                </div>
                <hr className="my-2" />
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}