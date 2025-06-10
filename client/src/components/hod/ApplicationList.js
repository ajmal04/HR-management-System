import React, { Component } from "react";
import { Card, Button, Form, Modal, Alert } from "react-bootstrap";
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

  handleApprove = (id) => {
    const token = localStorage.getItem("token");
    axios
      .put(
        `/api/applications/hod/approve/${id}`,
        { status: "Approved", comment: "" },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        this.componentDidMount(); // Refresh the list
      })
      .catch((err) => {
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
        this.setState({ showModal: false, comment: "", selectedApp: null });
        this.componentDidMount(); // Refresh the list
      })
      .catch((err) => {
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
            padding: "6px",
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

        {/* Modal for Rejection Reason */}
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

        {this.state.hasError && (
          <Alert variant="danger" className="m-3">
            {this.state.errorMsg}
          </Alert>
        )}
      </div>
    );
  }
}
