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
    const user = JSON.parse(localStorage.getItem('user'));

    return (
      <nav className="main-header navbar navbar-expand navbar-white navbar-light">
        {this.state.showModal && <NewPasswordModal show={true} onHide={closeModal} />}
        
        {/* Left navbar: Sidebar toggle */}
        <ul className="navbar-nav">
          <li className="nav-item">
            <button 
              className="nav-link" 
              onClick={(e) => e.preventDefault()} 
              data-widget="pushmenu"
              aria-label="Toggle sidebar"
            >
              <i className="fas fa-bars" />
            </button>
          </li>
        </ul>

        {/* Right navbar: User dropdown */}
        <ul className="navbar-nav ml-auto">
          <li className="nav-item dropdown">
            <button 
              className="nav-link" 
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
              aria-label="User menu"
            >
              <i className="fas fa-user" />
              <span className="pl-1">{user?.fullname || "User"}</span>
            </button>
            <div className="dropdown-menu dropdown-menu-lg dropdown-menu-right">
              <span className="dropdown-header">Options</span>
              <div className="dropdown-divider" />
              <button 
                onClick={this.newPassword} 
                className="dropdown-item text-left w-100" 
                style={{ background: 'none', border: 'none' }}
              >
                <i className="fas fa-key mr-2" /> Change Password
              </button>
              <div className="dropdown-divider" />
              <button 
                onClick={this.onLogout} 
                className="dropdown-item text-left w-100" 
                style={{ background: 'none', border: 'none' }}
              >
                <i className="fas fa-sign-out-alt mr-2" /> Log out
              </button>
            </div>
          </li>
        </ul>
      </nav>
    );
  }
}

export default withRouter(Header); // Wrap with withRouter
