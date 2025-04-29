import React, { Component } from "react";
import { Card } from "react-bootstrap";
import MaterialTable from "material-table";
import axios from "axios";
import { ThemeProvider } from "@material-ui/core";
import { createMuiTheme } from "@material-ui/core/styles";
import moment from "moment";

export default class ResignationList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      resignedEmployees: [],
      role: "",
    };
  }

  componentDidMount() {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      this.setState({ role: decoded.user.role }, this.fetchResignations);
    }
  }

  fetchResignations = () => {
    const { role } = this.state;
    const token = localStorage.getItem("token");

    let url = "";

    if (role === "ROLE_HOD") {
      url = "/api/resignations/hod";
    } else if (role === "ROLE_ADMIN") {
      url = "/api/resignations/admin";
    } else if (role === "ROLE_SUPER_ADMIN") {
      url = "/api/resignations/superadmin";
    } else {
      return;
    }

    axios
      .get(url, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        this.setState({ resignedEmployees: res.data });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  handleStatusChange = async (resignationId, action) => {
    const token = localStorage.getItem("token");
    const { role } = this.state;

    let endpoint = "";

    if (role === "ROLE_HOD") {
      endpoint =
        action === "approved"
          ? `/api/resignations/hod/approve/${resignationId}`
          : `/api/resignations/hod/reject/${resignationId}`;
    } else if (role === "ROLE_ADMIN") {
      endpoint =
        action === "approved"
          ? `/api/resignations/admin/approve/${resignationId}`
          : `/api/resignations/admin/reject/${resignationId}`;
    }

    try {
      await axios.put(
        endpoint,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setTimeout(() => {
        this.fetchResignations();
      }, 300);
    } catch (err) {
      console.error("Status update failed:", err);
    }
  };

  handleSuperAdminApprove = async (resignationId) => {
    const token = localStorage.getItem("token");

    const leaveDays = parseInt(
      prompt("Enter number of leave days taken during notice period:", "0")
    );

    if (isNaN(leaveDays) || leaveDays < 0) {
      alert("Invalid number of leave days.");
      return;
    }

    try {
      await axios.put(
        `/api/resignations/superadmin/approve/${resignationId}`,
        { leaveDays },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setTimeout(() => {
        this.fetchResignations();
      }, 300);
    } catch (err) {
      console.error("SuperAdmin approval failed:", err);
    }
  };

  render() {
    const theme = createMuiTheme({
      overrides: {
        MuiTableCell: {
          root: {
            padding: "6px 6px 6px 6px",
          },
        },
      },
    });

    return (
      <div className="container-fluid pt-4">
        <h4>Resignation Requests</h4>
        <div className="col-sm-12">
          <Card>
            <Card.Header style={{ backgroundColor: "#515e73", color: "white" }}>
              <strong>Resignation List</strong>
            </Card.Header>
            <Card.Body>
              <ThemeProvider theme={theme}>
                <MaterialTable
                  columns={[
                    { title: "College Name", field: "college" },
                    { title: "Full Name", field: "fullName" },
                    { title: "EMP ID", field: "employeeId" },
                    { title: "Department", field: "department" },
                    { title: "Role", field: "role" },
                    { title: "Personal Email", field: "personalEmail" },
                    { title: "College Email", field: "collegeEmail" },
                    { title: "Phone", field: "phone" },
                    {
                      title: "Date of Joining",
                      field: "dateOfJoining",
                      render: (rowData) =>
                        rowData.dateOfJoining
                          ? moment(rowData.dateOfJoining).format("DD/MM/YYYY")
                          : "N/A",
                    },
                    {
                      title: "Reason for Resignation",
                      field: "reasonForResignation",
                      cellStyle: {
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: 200,
                      },
                    },
                    {
                      title: "Date of Submission",
                      field: "dateOfSubmission",
                      render: (rowData) =>
                        moment(rowData.dateOfSubmission).format("DD/MM/YYYY"),
                    },
                    { title: "Notice Period", field: "noticePeriod" },
                    { title: "Message", field: "resignationStatus" },
                    {
                      title: "Actions",
                      field: "actions",
                      render: (rowData) => {
                        const { role } = this.state;
                        const isHOD = role === "ROLE_HOD";
                        const isAdmin = role === "ROLE_ADMIN";
                        const isSuperAdmin = role === "ROLE_SUPER_ADMIN";

                        return (
                          <div>
                            {(isHOD || isAdmin) && (
                              <>
                                <button
                                  className="btn btn-sm btn-success mr-2"
                                  onClick={() =>
                                    this.handleStatusChange(
                                      rowData.id,
                                      "approved"
                                    )
                                  }
                                  disabled={
                                    (isHOD &&
                                      rowData.hodStatus !== "pending") ||
                                    (isAdmin &&
                                      rowData.principalStatus !== "pending")
                                  }
                                >
                                  Approve
                                </button>
                                <button
                                  className="btn btn-sm btn-danger"
                                  onClick={() =>
                                    this.handleStatusChange(
                                      rowData.id,
                                      "rejected"
                                    )
                                  }
                                  disabled={
                                    (isHOD &&
                                      rowData.hodStatus !== "pending") ||
                                    (isAdmin &&
                                      rowData.principalStatus !== "pending")
                                  }
                                >
                                  Reject
                                </button>
                              </>
                            )}

                            {isSuperAdmin && (
                              <button
                                className="btn btn-sm btn-success"
                                onClick={() =>
                                  this.handleSuperAdminApprove(rowData.id)
                                }
                                disabled={rowData.hrStatus !== "pending"}
                              >
                                Approve
                              </button>
                            )}
                          </div>
                        );
                      },
                      sorting: false,
                      filtering: false,
                    },
                  ]}
                  data={this.state.resignedEmployees}
                  options={{
                    rowStyle: (rowData, index) =>
                      index % 2 ? { backgroundColor: "#f2f2f2" } : {},
                    pageSize: 10,
                    pageSizeOptions: [10, 20, 30, 50, 100],
                    filtering: true,
                    sorting: true,
                    exportButton: true,
                    headerStyle: {
                      backgroundColor: "#515e73",
                      color: "#FFF",
                      fontWeight: "bold",
                    },
                    cellStyle: {
                      padding: "8px",
                    },
                  }}
                  title="Resignation Requests"
                />
              </ThemeProvider>
            </Card.Body>
          </Card>
        </div>
      </div>
    );
  }
}
