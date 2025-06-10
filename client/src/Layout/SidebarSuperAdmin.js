import React, { Component } from "react";
import { loadTree } from "../menuTreeHelper";
import { NavLink } from "react-router-dom";

export default class SidebarSuperAdmin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {},
    };
  }

  componentDidMount() {
    let userData = JSON.parse(localStorage.getItem("user"));
    this.setState({ user: userData });
    loadTree();
  }

  render() {
    return (
      <aside className="main-sidebar sidebar-dark-primary elevation-4">
        {/* Brand Logo */}
        <a href="/" className="brand-link">
          <span className="brand-text font-weight-light ml-1">
            HRMS Super Admin
          </span>
        </a>
        {/* Sidebar */}
        <div className="sidebar">
          {/* Sidebar user panel (optional) */}
          <div className="user-panel mt-3 pb-3 mb-3 d-flex">
            <div className="image">
              <img
                src={process.env.PUBLIC_URL + "/user-64.png"}
                className="img-circle elevation-2"
                alt="User profile"
              />
            </div>
            <div className="info">
              <span className="d-block">
                {this.state.user.fullname}
              </span>
            </div>
          </div>
          {/* Sidebar Menu */}
          <nav className="mt-2">
            <ul
              className="nav nav-pills nav-sidebar flex-column"
              data-widget="treeview"
              role="menu"
              data-accordion="false"
            >
              {/* Add icons to the links using the .nav-icon class
         with font-awesome or any other icon font library */}
              <li className="nav-item">
                <NavLink exact to="/" className="nav-link">
                  <i className="nav-icon fas fa-tachometer-alt" />
                  <p>Dashboard</p>
                </NavLink>
              </li>
              <li className="nav-item has-treeview">
                <NavLink
                  to="/fake-url"
                  className="nav-link"
                  activeClassName="nav-link"
                >
                  <i className="nav-icon fa fa-user" />
                  <p>
                    Employee
                    <i className="right fas fa-angle-left" />
                  </p>
                </NavLink>

                {/* ADD style={{ paddingLeft: "20px" }} here */}
                <ul
                  className="nav nav-treeview"
                  style={{ paddingLeft: "20px" }}
                >
                  <li className="nav-item">
                    <NavLink to="/employee-list" className="nav-link">
                      <i className="fas fa-users nav-icon" />
                      <p>Employee List</p>
                    </NavLink>
                  </li>

                  <li className="nav-item">
                    <NavLink to="/employee-add" className="nav-link">
                      <i className="fa fa-user-plus nav-icon" />
                      <p>Add Employee</p>
                    </NavLink>
                  </li>
                </ul>
              </li>

              <li className="nav-item">
                <NavLink exact to="/departments" className="nav-link">
                  <i className="nav-icon fa fa-building" />

                  <p>
                    Departments
                  </p>
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink exact to="/onboarding-dashboard" className="nav-link">
                  <i className="nav-icon fa fa-user-plus" />
                  <p>
                    Onboarding Dashboard
                  </p>
                </NavLink>
              </li>
              
              {/* <li className="nav-item">
                <NavLink to="/job-list" className="nav-link">
                  <i className="nav-icon fas fa-briefcase" />
                  <p>
                    Job List
                  </p>
                </NavLink>
              </li> */}

              {/* <li className="nav-item">
                <NavLink to="/job-list" className="nav-link">
                  <i className="nav-icon fas fa-briefcase" />
                  <p>Job List</p>
                </NavLink>
              </li> */}

              {/* <li className="nav-item">
                <NavLink to="/termination-list" className="nav-link">
                  <i className="nav-icon fas fa-user-slash" />
                  <p>Termination List</p>
                </NavLink>
              </li> */}
              <li className="nav-item has-treeview">
                <NavLink
                  to="/resignation"
                  className="nav-link"
                  activeClassName="active"
                >
                  <i className="nav-icon fas fa-sign-out-alt" />{" "}
                  {/* Changed icon */}
                  <p>
                    Exit Manager
                    <i className="right fas fa-angle-left" />
                  </p>
                </NavLink>
                <ul
                  className="nav nav-treeview"
                  style={{ paddingLeft: "20px" }}
                >
                  <li className="nav-item">
                    <NavLink
                      to="/resignation-form"
                      className="nav-link"
                      activeClassName="active"
                    >
                      <i className="fas fa-file-alt nav-icon" />
                      <p>Resignation Form</p>
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink
                      to="/resignation-list"
                      className="nav-link"
                      activeClassName="active"
                    >
                      <i className="fas fa-list nav-icon" />
                      <p>Resignation List</p>
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink
                      to="/resignation-status"
                      className="nav-link"
                      activeClassName="active"
                    >
                      <i className="fas fa-info-circle nav-icon" />
                      <p>Resignation Status</p>
                    </NavLink>
                  </li>
                </ul>
              </li>

              <li className="nav-item has-treeview">
                <NavLink to="/application-list" className="nav-link">
                  <i className="nav-icon fa fa-rocket" />
                  <p>Leave</p>
                </NavLink>
              </li>

              <li className="nav-item has-treeview">
                <NavLink
                  to="/fake-url"
                  className="nav-link"
                  activeClassName="nav-link"
                >
                  <i className="nav-icon fas fa-euro-sign" />
                  <p>
                    Salary Management
                    <i className="right fas fa-angle-left" />
                  </p>
                </NavLink>
                <ul
                  className="nav nav-treeview"
                  style={{ paddingLeft: "20px" }}
                >
                  <li className="nav-item">
                    <NavLink to="/salary-list" className="nav-link">
                      <i className="fas fa-users nav-icon" />
                      <p>Employee Salary List</p>
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/salary-details" className="nav-link">
                      <i className="fas fa-euro-sign nav-icon" />
                      <p>Manage Salary Details</p>
                    </NavLink>
                  </li>

                  <li className="nav-item">
                    <NavLink to="/payment" className="nav-link">
                      <i className="fas fa-money-check nav-icon" />
                      <p>Make Payment</p>
                    </NavLink>
                  </li>
                </ul>
              </li>
              <li className="nav-item has-treeview">
                <NavLink
                  to="/fake-url"
                  className="nav-link"
                  activeClassName="nav-link"
                >
                  <i className="nav-icon fas fa-money-bill" />
                  <p>
                    Expense Management
                    <i className="right fas fa-angle-left" />
                  </p>
                </NavLink>
                <ul
                  className="nav nav-treeview"
                  style={{ paddingLeft: "20px" }}
                >
                  <li className="nav-item">
                    <NavLink to="/expense-report" className="nav-link">
                      <i className="fas fa-file-invoice nav-icon" />
                      <p>Expense Report</p>
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/expense" className="nav-link">
                      <i className="fas fa-shopping-cart nav-icon" />
                      <p>Make Expense</p>
                    </NavLink>
                  </li>
                </ul>
              </li>
              <li className="nav-item">
                <NavLink exact to="/announcement" className="nav-link">
                  <i className="nav-icon fa fa-bell" />
                  <p>Announcements</p>
                </NavLink>
              </li>
            </ul>
          </nav>
          {/* /.sidebar-menu */}
        </div>
        {/* /.sidebar */}
      </aside>
    );
  }
}
