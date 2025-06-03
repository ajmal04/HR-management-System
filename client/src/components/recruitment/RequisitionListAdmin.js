import React, { Component } from "react";
import { Card, Button, Modal, Form, Alert } from "react-bootstrap";
import axios from "axios";
import MaterialTable from "material-table";
import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";

export default class RequisitionListAdmin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      requisitions: [],
      showModal: false,
      selectedReq: null,
      comment: "",
      hasError: false,
      errorMsg: "",
    };
  }

  componentDidMount() {
    this.fetchRequisitions();
  }

  fetchRequisitions = () => {
    console.log("Fetching requisitions from API...");
    axios({
      method: "get",
      url: "/api/requisition/college",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => {
        console.log("API response:", res.data);
        this.setState({ requisitions: res.data });
      })
      .catch((err) => {
        this.setState({
          hasError: true,
          errorMsg:
            err.response?.data?.message || "Failed to fetch requisitions",
        });
      });
  };

  handleApprove = (id) => {
    axios
      .put(
        `/api/requisition/approve/admin/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      )
      .then(() => {
        this.fetchRequisitions(); // refresh list
      })
      .catch((err) => {
        this.setState({
          hasError: true,
          errorMsg: err.response?.data?.message || "Approval failed",
        });
      });
  };

  handleRejectClick = (req) => {
    this.setState({ selectedReq: req, showModal: true, comment: "" });
  };

  submitRejection = () => {
    // Optional: implement rejection logic
    this.setState({ showModal: false });
  };

  render() {
    const theme = createMuiTheme({
      overrides: {
        MuiTableCell: {
          root: {
            padding: "6px 6px",
          },
        },
      },
    });

    return (
      <div className="container-fluid pt-5">
        <Card>
          <Card.Header style={{ backgroundColor: "#343a40", color: "#fff" }}>
            <strong>Job Requisition List (Admin)</strong>
          </Card.Header>
          <Card.Body>
            <ThemeProvider theme={theme}>
              <MaterialTable
                columns={[
                  { title: "#", render: (rowData) => rowData.tableData.id + 1 },
                  { title: "Department", field: "department" },
                  { title: "Position", field: "positionTitle" },
                  { title: "Job Type", field: "jobType" },
                  { title: "Vacancies", field: "vacancies" },
                  { title: "Qualification", field: "qualification" },
                  { title: "Status", field: "status" },
                  {
                    title: "Action",
                    render: (rowData) => {
                      const isPending = rowData.status === "Pending";
                      return (
                        <div style={{ display: "flex", gap: "8px" }}>
                          <Button
                            variant="success"
                            size="sm"
                            onClick={() => this.handleApprove(rowData.id)}
                            disabled={!isPending}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => this.handleRejectClick(rowData)}
                            disabled={!isPending}
                          >
                            Reject
                          </Button>
                        </div>
                      );
                    },
                  },
                ]}
                data={this.state.requisitions}
                title="Requisitions from HODs"
                options={{
                  rowStyle: (rowData, index) => {
                    if (index % 2) {
                      return { backgroundColor: "#f9f9f9" };
                    }
                  },
                  pageSize: 10,
                  exportButton: true,
                }}
              />
            </ThemeProvider>
          </Card.Body>
        </Card>

        {/* Optional Modal for Rejection */}
        <Modal
          show={this.state.showModal}
          onHide={() => this.setState({ showModal: false })}
        >
          <Modal.Header closeButton>
            <Modal.Title>Rejection Comment</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group>
              <Form.Label>Enter reason for rejection:</Form.Label>
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
