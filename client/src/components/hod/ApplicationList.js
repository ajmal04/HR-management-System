import React, { Component } from "react";
<<<<<<< HEAD
import { Card, Button, Form, Modal, Alert } from "react-bootstrap";
=======
import { Card, Button, Alert } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";
>>>>>>> e0349e3f2d10d722e3d8954792197004c6aee799
import axios from "axios";
import moment from "moment";
import MaterialTable from "material-table";
import { ThemeProvider } from "@material-ui/core";
import { createMuiTheme } from "@material-ui/core/styles";

export default class HODApplicationList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      applications: [],
      showModal: false,
      selectedApp: null,
      comment: "",
      hasError: false,
      errorMsg: "",
    };
  }

  componentDidMount() {
<<<<<<< HEAD
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    axios
      .get(`/api/applications/department/${user.departmentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        res.data.forEach((app) => {
          app.startDate = moment(app.startDate).format("YYYY-MM-DD");
          app.endDate = moment(app.endDate).format("YYYY-MM-DD");
        });

        this.setState({ applications: res.data });
      })
      .catch((err) => {
        console.error("Error fetching applications:", err);
        this.setState({
          hasError: true,
          errorMsg: "Failed to load applications",
        });
      });
  }
=======
    let deptId = JSON.parse(localStorage.getItem('user')).departmentId;
    axios({
        method: "get",
        url: "/api/applications/department/" + deptId,
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }).then((res) => {
        res.data.forEach(app => {  // Changed from map to forEach
            app.startDate = moment(app.startDate).format('YYYY-MM-DD');
            app.endDate = moment(app.endDate).format('YYYY-MM-DD');
        });
        this.setState({ applications: res.data });
    })
    .catch(err => {
        console.log(err);
    });
}
>>>>>>> e0349e3f2d10d722e3d8954792197004c6aee799

  handleApprove = (id) => {
    const token = localStorage.getItem("token");
    axios
      .put(
        `/api/applications/hod/approve/${id}`,
        { status: "Approved", comment: "" },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        console.log("Approved successfully");
        this.componentDidMount(); // Refresh
      })
      .catch((err) => {
        console.error("Approval error:", err);
        this.setState({
          hasError: true,
          errorMsg: "Approval failed. Check console for details.",
        });
      });
  };

  handleRejectClick = (app) => {
    this.setState({ showModal: true, selectedApp: app, comment: "" });
  };

  handleRejectSubmit = () => {
    const { selectedApp, comment } = this.state;
    const token = localStorage.getItem("token");

    if (!selectedApp || !selectedApp.id) {
      console.error("No selected application for rejection.");
      this.setState({ showModal: false });
      return;
    }

    axios
      .put(
        `/api/applications/hod/approve/${selectedApp.id}`,
        { status: "Rejected", comment },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        console.log("Rejected successfully");
        this.setState({ showModal: false, comment: "", selectedApp: null });
        this.componentDidMount(); // Refresh
      })
      .catch((err) => {
        console.error("Rejection error:", err);
        this.setState({
          hasError: true,
          errorMsg: "Rejection failed. Check console for details.",
        });
      });
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
      <div className="container-fluid pt-5">
        <div className="col-sm-12">
          <Card>
            <Card.Header style={{ backgroundColor: "#515e73", color: "white" }}>
              <div className="panel-title">
                <strong>HOD Leave Applications</strong>
              </div>
            </Card.Header>
            <Card.Body>
              <ThemeProvider theme={theme}>
                <MaterialTable
<<<<<<< HEAD
                  columns={[
                    {
                      title: "#",
                      render: (rowData) => rowData.tableData.id + 1,
                      width: 50,
                    },
                    { title: "Full Name", field: "user.fullName" },
                    { title: "Start Date", field: "startDate" },
                    { title: "End Date", field: "endDate" },
                    { title: "Reason", field: "reason" },
                    { title: "Status", field: "hodStatus" },
                    {
                      title: "Actions",
                      render: (rowData) => {
                        const user = JSON.parse(localStorage.getItem("user"));
                        const isProcessed = rowData.hodStatus !== "Pending";
                        const isOwnApplication =
                          rowData.user && rowData.user.id === user.id;
                        if (isOwnApplication) return null;
                        return (
                          <>
                            <Button
                              variant="success"
                              size="sm"
                              onClick={() => this.handleApprove(rowData.id)}
                              disabled={isProcessed}
                            >
                              Approve
                            </Button>{" "}
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => this.handleRejectClick(rowData)}
                              disabled={isProcessed}
                            >
                              Reject
                            </Button>
                          </>
                        );
                      },
                    },
                  ]}
                  data={this.state.applications}
                  options={{
=======
                    columns={[
                        { 
                            title: '#', 
                            render: rowData => rowData.tableData.id + 1,
                            width: 50
                        },
                        {title: 'Full Name', field: 'user.fullName'},
                        {title: 'Start Date', field: 'startDate'},
                        {title: 'End Date', field: 'endDate'},
                        {title: 'Leave Type', field: 'type'},
                        {title: 'Comments', field: 'reason'},
                        {
                            title: 'Status', 
                            field: 'status',
                            render: rowData => (
                                <Button size="sm" variant={rowData.status==='Approved' ? "success" : rowData.status==='Pending' ? "warning" : "danger"}>{rowData.status}</Button>
                            )
                        },
                        {
                            title: 'Action',
                            render: rowData => (
                              rowData.user.id !== JSON.parse(localStorage.getItem('user')).id ? (
                                rowData.status==="Pending" ? (
                                  <>
                                    <Button onClick={this.onApprove(rowData)} variant="success" size="sm" className="mr-2"><i className="fas fa-edit"></i>Approve</Button>
                                    <Button onClick={this.onReject(rowData)} variant="danger" size="sm" className="ml-2"><i className="fas fa-trash"></i>Reject</Button>
                                  </>
                                ) : null
                              ) : null
                            )
                        }
                    ]}
                    data={this.state.applications}
                    
                    options={{
>>>>>>> e0349e3f2d10d722e3d8954792197004c6aee799
                    rowStyle: (rowData, index) => {
                      if (index % 2) {
                        return { backgroundColor: "#f2f2f2" };
                      }
                    },
                    pageSize: 10,
                    pageSizeOptions: [10, 20, 30],
                  }}
                  title="Leave Applications"
                />
              </ThemeProvider>
            </Card.Body>
          </Card>
        </div>

        {/* Rejection Reason Modal */}
        <Modal
          show={this.state.showModal}
          onHide={() => this.setState({ showModal: false })}
        >
          <Modal.Header closeButton>
            <Modal.Title>Rejection Reason</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group>
              <Form.Label>Enter Reason for Rejection:</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={this.state.comment}
                onChange={(e) => this.setState({ comment: e.target.value })}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => this.setState({ showModal: false })}
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={this.handleRejectSubmit}>
              Submit Rejection
            </Button>
          </Modal.Footer>
        </Modal>

        {this.state.hasError ? (
          <Alert variant="danger" className="m-3">
            {this.state.errorMsg}
          </Alert>
        ) : null}
      </div>
    );
  }
}
