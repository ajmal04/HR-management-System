import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";

export default function withAuth(ComponentToProtect) {
  return class extends Component {
    constructor() {
      super();
      this.state = {
        isAuthenticated: false,
        loading: true,
        redirect: false,
      };
    }

    componentDidMount() {
      const token = localStorage.getItem('token');
      
      if (!token) {
        this.setState({ loading: false, redirect: true });
        return ;
      }

      axios({
        method: "get",
        url: "/checkToken",
        headers: { "Authorization": `Bearer ${token}` }
      })
        .then((res) => {
          this.setState({ isAuthenticated: true });
          localStorage.setItem('user', JSON.stringify(res.data.authData.user));
          this.setState({ loading: false });
        })
        .catch((err) => {
          console.error("Authentication error:", err);
          this.setState({ loading: false, redirect: true });
        });
    }

    render() {
      const { loading, redirect } = this.state;
      
      if (loading) {
        return <div>Loading...</div>; // Better to show a spinner than null
      }
      
      if (redirect) {
        return <Redirect to="/login" replace state={{ from: this.props.location }} />;
      }
      
      return <ComponentToProtect {...this.props} />;
    }
  };
}