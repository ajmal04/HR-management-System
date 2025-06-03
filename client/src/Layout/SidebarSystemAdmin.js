import React, { Component } from "react";
import { loadTree } from "../menuTreeHelper";
import { NavLink } from "react-router-dom";

export default class SidebarAdmin extends Component {
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
            HRMS System Admin
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
                alt="User Profile"
              />
            </div>
            <div className="info">
              <span className="d-block">{this.state.user.fullname}</span>
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
                <NavLink to="/onboarding/list" className="nav-link">
                  <i className="nav-icon fas fa-users" />
                  <p>Onboarding</p>
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink to="/assets/manage" className="nav-link">
                  <i className="nav-icon fas fa-laptop" />
                  <p>Asset Management</p>
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
            </ul>
          </nav>
          {/* /.sidebar-menu */}
        </div>
        {/* /.sidebar */}
      </aside>
    );
  }
}
