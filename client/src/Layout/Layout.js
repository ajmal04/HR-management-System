// import React from "react";
// import { Redirect, useLocation } from "react-router-dom";

// function Layout({ children }) {  // Accept children prop instead of using Outlet
//   const user = JSON.parse(localStorage.getItem("user"));
//   const location = useLocation();

//   if (!user || !user.role) {
//     return <Redirect to="/login" state={{ from: location }} replace />;
//   }

//   if (location.pathname === "/") {
//     switch (user.role) {
//       case "ROLE_SUPER_ADMIN":
//         return <Redirect to="/superadmin/dashboard" replace />;
//       case "ROLE_SYSTEM_ADMIN":
//         return <Redirect to="/systemadmin/dashboard" replace />;
//       case "ROLE_ADMIN":
//         return <Redirect to="/admin/dashboard" replace />;
//       case "ROLE_HOD":
//         return <Redirect to="/hod/dashboard" replace />;
//       case "ROLE_FACULTY":
//         return <Redirect to="/faculty/dashboard" replace />;
//       default:
//         return <Redirect to="/login" replace />;
//     }
//   }

//   return (
//     <div>
//       {/* Common Header/Sidebar */}
//       {children}  {/* Render children instead of Outlet */}
//     </div>
//   );
// }

// export default Layout;


import React, { Component } from "react";

export default class Layout extends Component {
  render() {
    return (
      <div className="content-wrapper">
        <section className="content">
          <div className="container-fluid">
            {this.props.children}
          </div>
        </section>
      </div>
    );
  }
}
