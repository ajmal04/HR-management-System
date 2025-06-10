import React, { Component } from "react";
import { Card, Button, Form, Alert, Spinner, Modal } from "react-bootstrap";
import axios from "axios";
import MaterialTable from "material-table";
import { ThemeProvider } from "@material-ui/core";
import { createMuiTheme } from "@material-ui/core/styles";

export default class DepartmentEventFormHOD extends Component {
  state = {
    events: [],
    eventName: "",
    eventDescription: "",
    startDate: "",
    endDate: "",
    departmentId: null,
    hasError: false,
    errorMsg: "",
    isSubmitting: false,
    isLoading: false,
    showDeleteModal: false,
    eventToDelete: null,
    showSuccessAlert: false,
  };

  componentDidMount() {
    const user = JSON.parse(localStorage.getItem("user"));
    this.setState({ departmentId: user.departmentId }, this.fetchEvents);
  }

  fetchEvents = () => {
    const { departmentId } = this.state;

    this.setState({ isLoading: true, hasError: false });

    axios
      .get(`/api/departmentEvents/department/${departmentId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        this.setState({ events: res.data, isLoading: false });
      })
      .catch((err) => {
        this.setState({
          hasError: true,
          errorMsg: err.response?.data?.message || "Failed to load events",
          isLoading: false,
        });
      });
  };

  handleChange = (e) => this.setState({ [e.target.name]: e.target.value });

  handleSubmit = (e) => {
    e.preventDefault();
    const { eventName, eventDescription, startDate, endDate, departmentId } =
      this.state;
    const createdByUserId = JSON.parse(localStorage.getItem("user"))?.id;

    if (
      !eventName ||
      !startDate ||
      !endDate ||
      !departmentId ||
      !createdByUserId
    ) {
      this.setState({
        hasError: true,
        errorMsg: "All fields are required",
        isSubmitting: false,
      });
      return;
    }

    this.setState({ isSubmitting: true });

    axios
      .post(
        "/api/departmentEvents",
        {
          eventName,
          eventDescription,
          startDate,
          endDate,
          departmentId,
          createdByUserId,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      )
      .then(() => {
        this.setState({
          showSuccessAlert: true,
          isSubmitting: false,
          eventName: "",
          eventDescription: "",
          startDate: "",
          endDate: "",
        });
        this.fetchEvents();
      })
      .catch((err) => {
        this.setState({
          hasError: true,
          errorMsg: err.response?.data?.message || "Failed to create event",
          isSubmitting: false,
        });
      });
  };

  handleDeleteClick = (event) =>
    this.setState({ showDeleteModal: true, eventToDelete: event });

  handleDeleteConfirm = () => {
    axios
      .delete(`/api/departmentEvents/${this.state.eventToDelete.id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then(() => {
        this.setState({
          showDeleteModal: false,
          showSuccessAlert: true,
          eventToDelete: null,
        });
        this.fetchEvents();
      })
      .catch((err) => {
        this.setState({
          hasError: true,
          errorMsg: err.response?.data?.message || "Failed to delete event",
          showDeleteModal: false,
        });
      });
  };

  render() {
    const theme = createMuiTheme({
      overrides: {
        MuiTableCell: { root: { padding: "6px" } },
      },
    });

    return (
      <div className="container-fluid pt-2">
        {this.state.showSuccessAlert && (
          <Alert
            variant="success"
            onClose={() => this.setState({ showSuccessAlert: false })}
            dismissible
          >
            Event operation successful!
          </Alert>
        )}

        {this.state.hasError && (
          <Alert
            variant="danger"
            onClose={() => this.setState({ hasError: false })}
            dismissible
          >
            {this.state.errorMsg}
          </Alert>
        )}

        {/* Add Event Form */}
        <div className="row">
          <div className="col-sm-12">
            <Card className="main-card">
              <Card.Header>
                <strong>Add Department Event</strong>
              </Card.Header>
              <Card.Body>
                <Form onSubmit={this.handleSubmit}>
                  <Form.Group>
                    <Form.Label>Event Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="eventName"
                      value={this.state.eventName}
                      onChange={this.handleChange}
                      required
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      name="eventDescription"
                      value={this.state.eventDescription}
                      onChange={this.handleChange}
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Start Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="startDate"
                      value={this.state.startDate}
                      onChange={this.handleChange}
                      required
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>End Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="endDate"
                      value={this.state.endDate}
                      onChange={this.handleChange}
                      required
                    />
                  </Form.Group>
                  <Button type="submit" disabled={this.state.isSubmitting}>
                    {this.state.isSubmitting
                      ? "Publishing..."
                      : "Publish Event"}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </div>
        </div>

        {/* Events Table */}
        <div className="row mt-4">
          <div className="col-sm-12">
            <Card className="main-card">
              <Card.Header>
                <strong>My Department Events</strong>
              </Card.Header>
              <Card.Body>
                <ThemeProvider theme={theme}>
                  <MaterialTable
                    columns={[
                      {
                        title: "#",
                        render: (rowData) => rowData.tableData.id + 1,
                      },
                      { title: "Event Name", field: "eventName" },
                      { title: "Description", field: "eventDescription" },
                      { title: "Start", field: "startDate" },
                      { title: "End", field: "endDate" },
                      { title: "Created By", field: "user.fullName" },
                      {
                        title: "Action",
                        render: (rowData) => (
                          <Button
                            size="sm"
                            variant="outline-danger"
                            onClick={() => this.handleDeleteClick(rowData)}
                          >
                            Delete
                          </Button>
                        ),
                      },
                    ]}
                    data={this.state.events}
                    options={{
                      pageSize: 8,
                      headerStyle: {
                        backgroundColor: "#515e73",
                        color: "#FFF",
                      },
                    }}
                    title=""
                  />
                </ThemeProvider>
              </Card.Body>
            </Card>
          </div>
        </div>

        {/* Delete Modal */}
        <Modal
          show={this.state.showDeleteModal}
          onHide={() => this.setState({ showDeleteModal: false })}
        >
          <Modal.Header closeButton>
            <Modal.Title>Confirm Delete</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you want to delete this event?</Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => this.setState({ showDeleteModal: false })}
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={this.handleDeleteConfirm}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}
