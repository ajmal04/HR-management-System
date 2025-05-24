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
      userName: "",
      showRejectModal: false,
      selectedResignationId: null,
      rejectReason: "",
    };
  }

  componentDidMount() {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      this.setState(
        {
          role: decoded.user.role,
          userName: decoded.user.name,
        },
        this.fetchResignations
      );
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

    if (action === "rejected") {
      this.setState({
        showRejectModal: true,
        selectedResignationId: resignationId,
      });
      return;
    }

    let endpoint = "";
    if (role === "ROLE_HOD") {
      endpoint = `/api/resignations/hod/approve/${resignationId}`;
    } else if (role === "ROLE_ADMIN") {
      endpoint = `/api/resignations/admin/approve/${resignationId}`;
    }

    try {
      await axios.put(
        endpoint,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      this.fetchResignations();
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
        { headers: { Authorization: `Bearer ${token}` } }
      );
      this.fetchResignations();
    } catch (err) {
      console.error("SuperAdmin approval failed:", err);
    }
  };

  submitRejectReason = async () => {
    const { role, selectedResignationId, rejectReason } = this.state;
    const token = localStorage.getItem("token");

    let endpoint = "";
    if (role === "ROLE_HOD") {
      endpoint = `/api/resignations/hod/reject/${selectedResignationId}`;
    } else if (role === "ROLE_ADMIN") {
      endpoint = `/api/resignations/admin/reject/${selectedResignationId}`;
    } else if (role === "ROLE_SUPER_ADMIN") {
      endpoint = `/api/resignations/superadmin/reject/${selectedResignationId}`;
    }

    try {
      await axios.put(
        endpoint,
        { comment: rejectReason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      this.setState({ showRejectModal: false, rejectReason: "" });
      this.fetchResignations();
    } catch (err) {
      console.error("Rejection failed", err);
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

    const { role, resignedEmployees, showRejectModal, rejectReason, userName } =
      this.state;
    const isHOD = role === "ROLE_HOD";
    const isAdmin = role === "ROLE_ADMIN";
    const isSuperAdmin = role === "ROLE_SUPER_ADMIN";

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
                    {
                      title: "Actions",
                      field: "actions",
                      render: (rowData) => {
                        const isOwnRequest = rowData.fullName === userName;
                        return (
                          <div className="d-flex gap-2">
                            {(isHOD || isAdmin || isSuperAdmin) &&
                              !isOwnRequest && (
                                <>
                                  <button
                                    className="btn btn-sm btn-success"
                                    onClick={() =>
                                      isSuperAdmin
                                        ? this.handleSuperAdminApprove(
                                            rowData.id
                                          )
                                        : this.handleStatusChange(
                                            rowData.id,
                                            "approved"
                                          )
                                    }
                                    disabled={
                                      (isHOD &&
                                        rowData.hodStatus !== "pending") ||
                                      (isAdmin &&
                                        rowData.principalStatus !==
                                          "pending") ||
                                      (isSuperAdmin &&
                                        rowData.hrStatus !== "pending")
                                    }
                                  >
                                    Approve
                                  </button>
                                  <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() =>
                                      this.setState({
                                        showRejectModal: true,
                                        selectedResignationId: rowData.id,
                                      })
                                    }
                                    disabled={
                                      (isHOD &&
                                        rowData.hodStatus !== "pending") ||
                                      (isAdmin &&
                                        rowData.principalStatus !==
                                          "pending") ||
                                      (isSuperAdmin &&
                                        rowData.hrStatus !== "pending")
                                    }
                                  >
                                    Reject
                                  </button>
                                </>
                              )}
                          </div>
                        );
                      },
                      sorting: false,
                      filtering: false,
                    },
                  ]}
                  data={resignedEmployees}
                  options={{
                    filtering: false,
                    sorting: true,
                    exportButton: true,
                    pageSize: 10,
                    pageSizeOptions: [10, 20, 30],
                    headerStyle: {
                      backgroundColor: "#515e73",
                      color: "#FFF",
                      fontWeight: "bold",
                    },
                    cellStyle: { padding: "8px" },
                  }}
                  title="Resignation Requests"
                />
              </ThemeProvider>
            </Card.Body>
          </Card>
        </div>

        {showRejectModal && (
          <div
            className="modal-backdrop-custom"
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1050,
            }}
          >
            <div
              className="modal-content-custom"
              style={{
                backgroundColor: "white",
                padding: "20px",
                borderRadius: "8px",
                width: "500px",
                maxWidth: "90%",
                boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
              }}
            >
              <h5 className="mb-3">Reject Reason</h5>
              <textarea
                className="form-control mb-3"
                value={rejectReason}
                onChange={(e) =>
                  this.setState({ rejectReason: e.target.value })
                }
                rows="4"
                placeholder="Enter reason for rejection"
              />
              <div className="d-flex justify-content-end gap-2">
                <button
                  className="btn btn-secondary"
                  onClick={() => this.setState({ showRejectModal: false })}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-danger"
                  onClick={this.submitRejectReason}
                >
                  Reject Resignation
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}
