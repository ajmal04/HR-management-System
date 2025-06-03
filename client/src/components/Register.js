import React, { Component } from "react";
import axios from "axios";
import { Alert } from "react-bootstrap";
import { NavLink } from "react-router-dom";

export default class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      checkPassword: "",
      fullname: "",
      passwordShow: false,
      passwordCheckShow: false,
      completed: false,
      hasError: false,
      errorMessage: "",
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  passwordVisibilityHandler = () => {
    var x = document.getElementById("password");
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
  };

  passwordVisibilityHandlerCheck = () => {
    var x = document.getElementById("checkPassword");
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
  };

  onChange = (event) => {
    const { value, name } = event.target;
    this.setState({
      [name]: value,
    });
  };

  onSubmit = (event) => {
    event.preventDefault();

    if (this.state.password !== this.state.checkPassword) {
      alert("Passwords don't match");
    } else {
      var newUser = {
        username: this.state.username,
        password: this.state.password,
        fullname: this.state.fullname,
      };

      axios({
        method: "post",
        url: "/register",
        data: newUser,
      })
        .then((res) => {
          this.setState({ completed: true, hasError: false });
        })
        .catch((err) => {
          this.setState({
            hasError: true,
            errorMessage: err.response.data.message,
          });
        });
    }
  };

  render() {
    return (
      <div className="login-background">
        <div className="login-container">
          <div className="register-box">
            <div className="register-logo">
              <img
                src="/clg-logo.png"
                alt="College Logo"
                style={{ width: "300px", marginBottom: "20px" }}
              />
              <div className="login-heading">HR Management</div>
              <p className="login-box-msg">Register</p>
            </div>
            {/* <div className="card"> */}
            <div className="card-body register-card-body">
              {this.state.hasError && (
                <Alert variant="danger">{this.state.errorMessage}</Alert>
              )}
              {this.state.completed && (
                <Alert variant="success">
                  You have been registered successfully.{" "}
                  <NavLink to="/login">Go to Login.</NavLink>
                </Alert>
              )}

              <form onSubmit={this.onSubmit}>
                <div className="input-group mb-3">
                  <input
                    type="text"
                    className="form-control"
                    name="username"
                    placeholder="Username"
                    value={this.state.username}
                    onChange={this.onChange}
                    required
                  />
                  <div className="input-group-append">
                    <div className="input-group-text">
                      <span className="fas fa-user" />
                    </div>
                  </div>
                </div>

                <div className="input-group mb-3">
                  <input
                    type="text"
                    className="form-control"
                    name="fullname"
                    placeholder="Fullname"
                    value={this.state.fullname}
                    onChange={this.onChange}
                    required
                  />
                  <div className="input-group-append">
                    <div className="input-group-text">
                      <span className="fas fa-user" />
                    </div>
                  </div>
                </div>

                <div className="input-group mb-3">
                  <input
                    type={this.state.passwordShow ? "text" : "password"}
                    className="form-control"
                    name="password"
                    id="password"
                    placeholder="Password"
                    value={this.state.password}
                    onChange={this.onChange}
                    required
                  />
                  <div className="input-group-append">
                    <div className="input-group-text">
                      <span className="fas fa-lock" />
                    </div>
                  </div>
                  <div className="input-group-append">
                    <div className="input-group-text">
                      <span
                        className={
                          this.state.passwordShow
                            ? "fas fa-eye"
                            : "fas fa-eye-slash"
                        }
                        onClick={() =>
                          this.setState((prevState) => ({
                            passwordShow: !prevState.passwordShow,
                          }))
                        }
                        style={{ cursor: "pointer" }}
                      />
                    </div>
                  </div>
                </div>

                <div className="input-group mb-3">
                  <input
                    type={this.state.passwordCheckShow ? "text" : "password"}
                    className="form-control"
                    name="checkPassword"
                    id="checkPassword"
                    placeholder="Retype Password"
                    value={this.state.checkPassword}
                    onChange={this.onChange}
                    required
                  />
                  <div className="input-group-append">
                    <div className="input-group-text">
                      <span className="fas fa-lock" />
                    </div>
                  </div>
                  <div className="input-group-append">
                    <div className="input-group-text">
                      <span
                        className={
                          this.state.passwordCheckShow
                            ? "fas fa-eye"
                            : "fas fa-eye-slash"
                        }
                        onClick={() =>
                          this.setState((prevState) => ({
                            passwordCheckShow: !prevState.passwordCheckShow,
                          }))
                        }
                        style={{ cursor: "pointer" }}
                      />
                    </div>
                  </div>
                </div>

                <button type="submit" className="btn btn-primary btn-block">
                  Register
                </button>
              </form>

              <a href="/login" className="text-center mt-1">
                Already have an account? Login
              </a>
            </div>
            {/* </div> */}
          </div>
        </div>
      </div>
    );
  }
}
