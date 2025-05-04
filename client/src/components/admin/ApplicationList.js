import React, { Component } from "react";
import { Card, Button, Modal, Form, Alert } from "react-bootstrap";
import axios from "axios";
import moment from "moment";
import MaterialTable from "material-table";
import { ThemeProvider } from "@material-ui/core";
import { createMuiTheme } from "@material-ui/core/styles";

export default class CollegeApplicationList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      applications: [],
      showModal: false,
      selectedApp: null,
      comment: "",
      hasError: false,
      errorMsg: "",
      completed: false,
    };
  }

  componentDidMount() {
    axios({
      method: "get",
      url: "/api/applications/college",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => {
        const filtered = res.data.filter(
          (app) => app.hodStatus === "Approved" && app.adminStatus === "Pending"
        );

        const formattedData = filtered.map((app) => ({
          ...app,
          startDate: moment(app.startDate).format("YYYY-MM-DD"),
          endDate: moment(app.endDate).format("YYYY-MM-DD"),
        }));

        this.setState({ applications: formattedData });
      })
      .catch((err) => {
        this.setState({
          hasError: true,
          errorMsg:
            err.response?.data?.message || "Failed to fetch applications",
        });
      });
  }

  handleApprove = (id) => {
    axios
      .put(
        `/api/applications/admin/approve/${id}`,
        { status: "Approved", comment: "" },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      )
      .then(() => {
        this.setState({ completed: true });
        this.componentDidMount(); // refresh list
      })
      .catch((err) => {
        this.setState({
          hasError: true,
          errorMsg: err.response?.data?.message || "Approval failed",
        });
      });
  };

  handleRejectClick = (app) => {
    this.setState({ selectedApp: app, showModal: true });
  };

  submitRejection = () => {
    const { selectedApp, comment } = this.state;

    axios
      .put(
        `/api/applications/admin/approve/${selectedApp.id}`,
        { status: "Rejected", comment },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      )
      .then(() => {
        this.setState({ showModal: false, comment: "", selectedApp: null });
        this.componentDidMount(); // refresh list
      })
      .catch((err) => {
        this.setState({
          hasError: true,
          errorMsg: err.response?.data?.message || "Rejection failed",
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
                <strong>College Applications (Admin)</strong>
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
                    {
                      title: "Department",
                      field: "user.department.departmentName",
                    },
                    { title: "Start Date", field: "startDate" },
                    { title: "End Date", field: "endDate" },
                    { title: "Reason", field: "reason" },
                    { title: "HOD Status", field: "hodStatus" },
                    { title: "HOD Comment", field: "hodComment" },
                    {
                      title: "Action",
                      render: (rowData) => (
                        <>
                          <Button
                            onClick={() => this.handleApprove(rowData.id)}
                            variant="success"
                            size="sm"
                            className="mr-2"
                          >
                            <i className="fas fa-check"></i> Approve
                          </Button>
                          <Button
                            onClick={() => this.handleRejectClick(rowData)}
                            variant="danger"
                            size="sm"
                            className="ml-2"
                          >
                            <i className="fas fa-times"></i> Reject
                          </Button>
                        </>
                      ),
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
                    filtering: false,
                    exportButton: true,
                  }}
                  title="Pending Applications for Admin"
                />
              </ThemeProvider>
            </Card.Body>
          </Card>
        </div>

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
            <Button variant="danger" onClick={this.submitRejection}>
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
