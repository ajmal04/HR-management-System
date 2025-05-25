import React, { Component } from "react";

import "../../App.css";
import Calendar from "../Calendar";
import RecentApplciations from "../employee/RecentApplications";
import RecentAnnouncements from "../RecentAnnouncementsManagerEmp";
import EmployeeViewDashboard from "./EmployeeViewDashboard";
import LeaveDetails from "../LeaveDetails";

export default class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      totalEmployees: 0,
      totalExpenses: 0,
      totalPayments: 0,
      recentApplications: [],
    };
  }

<<<<<<< HEAD
  componentDidMount() {
    let departmentId = JSON.parse(localStorage.getItem("user")).departmentId;
  }
  render() {
=======


  
  render() {    
>>>>>>> e0349e3f2d10d722e3d8954792197004c6aee799
    return (
      <div>
        {/* Second Row with Calendar and Expense Report */}
        <div className="row pt-4">
          {/* Calendar */}
          <div className="col-sm-6">
            <EmployeeViewDashboard />
            <div className="panel panel-default">
              <div
                className="panel-heading with-border"
                style={{ backgroundColor: "#515e73", color: "white" }}
              >
                <h3 className="panel-title">Recent Announcements</h3>
              </div>
              <RecentAnnouncements />
            </div>
          </div>
          {/* Expense Report & Recent Applications */}
          <div className="col-md-6">
            {/* <div className="panel panel-default">
              <div className="panel-heading with-border" style={{ "backgroundColor": "#515e73", color: "white" }}>
                <h3 className="panel-title">My Recent Applications</h3>
              </div>
              <RecentApplciations />
            </div> */}
            <Calendar />
            <LeaveDetails />
            <div className="panel panel-default">
              <div
                className="panel-heading with-border"
                style={{ backgroundColor: "#515e73", color: "white" }}
              >
                <h3 className="panel-title">My Recent Applications</h3>
              </div>
              <RecentApplciations />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
