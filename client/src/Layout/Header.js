import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import NewPasswordModal from '../components/NewPasswordModal';

class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showModal: false
    };
  }

  onLogout = (event) => {
    event.preventDefault();
    localStorage.removeItem('token');
    localStorage.removeItem('user');  // optional, if you are storing user
    this.props.history.push("/");     // Redirect to login/home
  }

  newPassword = (event) => {
    event.preventDefault();
    this.setState({ showModal: true });
  }

  render() {
    const closeModal = () => this.setState({ showModal: false });
    const user = JSON.parse(localStorage.getItem('user')); // Safely get user data

    return (
      <nav className="main-header navbar navbar-expand navbar-white navbar-light">
        {this.state.showModal && <NewPasswordModal show={true} onHide={closeModal} />}
        
        {/* Left navbar: Sidebar toggle */}
        <ul className="navbar-nav">
          <li className="nav-item">
            <a className="nav-link" data-widget="pushmenu" href="#" role="button">
              <i className="fas fa-bars" />
            </a>
          </li>
        </ul>

        {/* Right navbar: User dropdown */}
        <ul className="navbar-nav ml-auto">
          <li className="nav-item dropdown">
            <a className="nav-link" data-toggle="dropdown" href="#">
              <i className="fas fa-user" />
              <span className="pl-1">{user?.fullname || "User"}</span>
            </a>
            <div className="dropdown-menu dropdown-menu-lg dropdown-menu-right">
              <span className="dropdown-header">Options</span>
              <div className="dropdown-divider" />
              <a onClick={this.newPassword} href="#" className="dropdown-item">
                <i className="fas fa-key mr-2" /> Change Password
              </a>
              <div className="dropdown-divider" />
              <a onClick={this.onLogout} href="#" className="dropdown-item">
                <i className="fas fa-sign-out-alt mr-2" /> Log out
              </a>
            </div>
          </li>
        </ul>
      </nav>
    );
  }
}

export default withRouter(Header); // Wrap with withRouter
