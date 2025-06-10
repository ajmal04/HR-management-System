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

    // Fetch recent college announcements
    axios({
      method: "get",
      url: "/api/collegeAnnouncements/recent", // ✅ updated endpoint
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => {
        if (this._isMounted) {
          this.setState({ recentAnnouncements: res.data });
        }
      })
      .catch((err) => {
        console.error("Failed to load recent college announcements", err);
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
                  <strong>{announcement.announcementTitle}</strong> (
                  {announcement.college})
                </span>
                <br />
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
