import * as React from "react";
import axios from "axios";

export default class RecentAnnouncements extends React.Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      recentAnnouncements: [],
    };
  }

  componentDidMount() {
    this._isMounted = true;

    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    const deptId = user.departmentId;
    const headers = { Authorization: `Bearer ${token}` };

    // Fetch both department and college announcements
    Promise.all([
      axios.get(`/api/departmentAnnouncements/recent/department/${deptId}`, {
        headers,
      }),
      axios.get(`/api/collegeAnnouncements/recent`, { headers }),
    ])
      .then(([deptRes, collegeRes]) => {
        if (this._isMounted) {
          const merged = [...deptRes.data, ...collegeRes.data];

          // Sort by created_at descending
          merged.sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at)
          );

          this.setState({ recentAnnouncements: merged });
        }
      })
      .catch((err) => {
        console.error("Failed to load announcements:", err);
      });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    return (
      <div className="card">
        <div className="mt-1" style={{ textAlign: "center" }}></div>
        <ul>
          {this.state.recentAnnouncements.map((announcement) => {
            const date = new Date(announcement.created_at);
            const isCollegeAnnouncement = !!announcement.college;
            const label = isCollegeAnnouncement
              ? `(${announcement.college})`
              : `(${
                  announcement.department?.departmentName || "Unknown Dept"
                })`;

            return (
              <li
                key={announcement.id}
                className="mb-2 mt-1"
                style={{ listStyle: "none" }}
              >
                <div className="float-left mr-2">
                  <time dateTime={date.toISOString()} className="icon p-0">
                    <em>{days[date.getDay()]}</em>
                    <strong>{monthNames[date.getMonth()]}</strong>
                    <span>{date.getDate()}</span>
                  </time>
                </div>
                <span>
                  <strong>{announcement.announcementTitle}</strong> {label}
                </span>
                <br className="p-1" />
                <small>{announcement.announcementDescription}</small>
                <hr className="pt-2 pb-1 mb-0" />
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}
