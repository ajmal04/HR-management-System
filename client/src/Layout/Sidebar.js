import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  // Menu items based on role
  const menuItems = {
    superadmin: [
      { name: "Dashboard", path: "/superadmin/dashboard" },
      { name: "Manage Admins", path: "/superadmin/admins" },
      { name: "Settings", path: "/superadmin/settings" },
    ],
    systemadmin: [
      { name: "Dashboard", path: "/systemadmin/dashboard" },
      { name: "Technical Allocations", path: "/systemadmin/allocations" },
    ],
    admin: [
      { name: "Dashboard", path: "/admin/dashboard" },
      { name: "Faculties", path: "/admin/faculties" },
      { name: "Departments", path: "/admin/departments" },
    ],
    hod: [
      { name: "Dashboard", path: "/hod/dashboard" },
      { name: "Manage Faculties", path: "/hod/faculties" },
    ],
    faculty: [
      { name: "Dashboard", path: "/faculty/dashboard" },
      { name: "My Profile", path: "/faculty/profile" },
    ],
  };

  // Get user role from localStorage
  const role = localStorage.getItem("role");

  // Get menu for the role, if not found make it empty
  const items = menuItems[role] || [];

  return (
    <div className="sidebar" style={{ width: "250px", padding: "20px", backgroundColor: "#f5f5f5", height: "100vh" }}>
      <h2>Sidebar</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {items.map((item, index) => (
          <li key={index} style={{ margin: "10px 0" }}>
            <Link to={item.path} style={{ textDecoration: "none", color: "#333" }}>
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
