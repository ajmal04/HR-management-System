import React, { Component } from "react";
import { Card, Button, Alert, Spinner, Modal } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import MaterialTable from "material-table";
import { ThemeProvider } from "@material-ui/core";
import { createMuiTheme } from "@material-ui/core/styles";

export default class ApplicationList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      applications: [],
      isLoading: true,
      hasError: false,
      errorMsg: "",
      showSuccessAlert: false,
      successMsg: "",
      showConfirmModal: false,
      currentAction: null,
      applicationToProcess: null,
    };
  }

  componentDidMount() {
    this.fetchApplications();
  }

  fetchApplications = () => {
    this.setState({ isLoading: true, hasError: false });

    axios({
      method: "get",
      url: "/api/applications",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => {
        const formattedData = res.data.map((app) => ({
          ...app,
          startDate: moment(app.startDate).format("DD MMM YYYY"),
          endDate: moment(app.endDate).format("DD MMM YYYY"),
        }));
        this.setState({
          applications: formattedData,
          isLoading: false,
        });
      })
      .catch((err) => {
        this.setState({
          hasError: true,
          errorMsg:
            err.response?.data?.message || "Failed to load applications",
          isLoading: false,
        });
      });
  };

  handleStatusChange = (action, application) => {
    this.setState({
      showConfirmModal: true,
      currentAction: action,
      applicationToProcess: application,
    });
  };

  confirmStatusChange = () => {
    const { currentAction, applicationToProcess } = this.state;
    const newStatus = currentAction === "approve" ? "Approved" : "Rejected";

    this.setState({ isLoading: true, showConfirmModal: false });

    axios({
      method: "put",
      url: `/api/applications/${applicationToProcess.id}`,
      data: { status: newStatus },
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then(() => {
        this.setState({
          showSuccessAlert: true,
          successMsg: `Application ${newStatus.toLowerCase()} successfully`,
          isLoading: false,
        });
        this.fetchApplications();
      })
      .catch((err) => {
        this.setState({
          hasError: true,
          errorMsg:
            err.response?.data?.message ||
            `Failed to ${currentAction} application`,
          isLoading: false,
        });
      });
  };

  cancelStatusChange = () => {
    this.setState({
      showConfirmModal: false,
      currentAction: null,
      applicationToProcess: null,
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

    const currentUserId = JSON.parse(localStorage.getItem("user"))?.id;

    return (
      <div className="container-fluid pt-5">
        {/* Success Alert */}
        {this.state.showSuccessAlert && (
          <Alert
            variant="success"
            onClose={() => this.setState({ showSuccessAlert: false })}
            dismissible
          >
            {this.state.successMsg}
          </Alert>
        )}

        {/* Error Alert */}
        {this.state.hasError && (
          <Alert
            variant="danger"
            onClose={() => this.setState({ hasError: false })}
            dismissible
          >
            {this.state.errorMsg}
          </Alert>
        )}

        <div className="col-sm-12">
          <Card>
            <Card.Header style={{ backgroundColor: "#515e73", color: "white" }}>
              <div className="panel-title">
                <strong>Application List</strong>
              </div>
            </Card.Header>
            <Card.Body>
              {this.state.isLoading ? (
                <div className="text-center">
                  <Spinner animation="border" role="status">
                    <span className="sr-only">Loading...</span>
                  </Spinner>
                </div>
              ) : (
                <ThemeProvider theme={theme}>
                  <MaterialTable
                    columns={[
                      {
                        title: "#",
                        render: (rowData) => rowData.tableData.id + 1,
                        width: 50,
                        cellStyle: { textAlign: "center" },
                      },
                      {
                        title: "Full Name",
                        field: "user.fullName",
                        cellStyle: { minWidth: 150 },
                      },
                      {
                        title: "Start Date",
                        field: "startDate",
                        cellStyle: { minWidth: 120 },
                      },
                      {
                        title: "End Date",
                        field: "endDate",
                        cellStyle: { minWidth: 120 },
                      },
                      // {
                      //   title: 'Leave Type',
                      //   field: 'type',
                      //   cellStyle: { minWidth: 120 }
                      // },
                      {
                        title: "Reason",
                        field: "reason",
                        cellStyle: { minWidth: 200 },
                      },
                      {
                        title: "Status",
                        field: "status",
                        render: (rowData) => (
                          <Button
                            size="sm"
                            variant={
                              rowData.status === "Approved"
                                ? "success"
                                : rowData.status === "Pending"
                                ? "warning"
                                : "danger"
                            }
                            disabled
                          >
                            {rowData.status}
                          </Button>
                        ),
                        cellStyle: { minWidth: 120 },
                      },
                      {
                        title: "Action",
                        render: (rowData) =>
                          rowData.user.id !== currentUserId &&
                          rowData.status === "Pending" && (
                            <div className="d-flex">
                              <Button
                                onClick={() =>
                                  this.handleStatusChange("approve", rowData)
                                }
                                variant="outline-success"
                                size="sm"
                                className="mr-2"
                              >
                                <i className="fas fa-check mr-1"></i>Approve
                              </Button>
                              <Button
                                onClick={() =>
                                  this.handleStatusChange("reject", rowData)
                                }
                                variant="outline-danger"
                                size="sm"
                              >
                                <i className="fas fa-times mr-1"></i>Reject
                              </Button>
                            </div>
                          ),
                        cellStyle: { minWidth: 180 },
                      },
                    ]}
                    data={this.state.applications}
                    options={{
                      maxBodyHeight: "calc(100vh - 300px)", // Fixed height for table body
                      minBodyHeight: "400px", // Minimum height
                      padding: "dense",
                      headerStyle: {
                        backgroundColor: "#515e73",
                        color: "#FFF",
                        fontSize: "14px",
                        position: "sticky",
                        top: 0,
                        zIndex: 1,
                      },
                      rowStyle: (rowData, index) => ({
                        backgroundColor: index % 2 ? "#f2f2f2" : "white",
                      }),
                      pageSize: 10,
                      pageSizeOptions: [10, 20, 30, 50, 75, 100],
                      headerStyle: {
                        backgroundColor: "#515e73",
                        color: "#FFF",
                        fontSize: "14px",
                      },
                      emptyRowsWhenPaging: false,
                      padding: "dense",
                      search: true,
                      filtering: false,
                    }}
                    localization={{
                      body: {
                        emptyDataSourceMessage: "No applications found",
                      },
                    }}
                  />
                </ThemeProvider>
              )}
            </Card.Body>
          </Card>
        </div>

        {/* Confirmation Modal */}
        <Modal
          show={this.state.showConfirmModal}
          onHide={this.cancelStatusChange}
        >
          <Modal.Header closeButton>
            <Modal.Title>Confirm Action</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to {this.state.currentAction} this
            application?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.cancelStatusChange}>
              Cancel
            </Button>
            <Button
              variant={
                this.state.currentAction === "approve" ? "success" : "danger"
              }
              onClick={this.confirmStatusChange}
            >
              Confirm {this.state.currentAction}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}
