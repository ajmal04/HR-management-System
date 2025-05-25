import React, { Component } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import moment from "moment";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default class EventModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.data?.id || '',
      title: props.data?.title || '',
      description: props.data?.description || '',
      startDate: props.data?.start ? new Date(props.data.start) : null,
      endDate: props.data?.end ? new Date(props.data.end) : null,
      showAlert: false,
      mode: props.mode || 'add' // 'add', 'edit', or 'view'
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.data !== prevProps.data) {
      this.setState({
        id: this.props.data?.id || '',
        title: this.props.data?.title || '',
        description: this.props.data?.description || '',
        startDate: this.props.data?.start ? new Date(this.props.data.start) : null,
        endDate: this.props.data?.end ? new Date(this.props.data.end) : null,
        mode: this.props.mode || 'add'
      });
    }
  }

  handleChange = (event) => {
    const { value, name } = event.target;
    this.setState({ [name]: value });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    
    if (this.state.startDate > this.state.endDate) {
      this.setState({ showAlert: true });
      return;
    }

    const eventData = {
      eventTitle: this.state.title,
      eventDescription: this.state.description,
      eventStartDate: moment(this.state.startDate).format("YYYY-MM-DD HH:mm:ss"),
      eventEndDate: moment(this.state.endDate).format("YYYY-MM-DD HH:mm:ss"),
      userId: JSON.parse(localStorage.getItem("user")).id
    };

    let request;
    if (this.state.mode === 'add') {
      request = axios.post("/api/personalEvents", eventData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
    } else {
      request = axios.put(`/api/personalEvents/${this.state.id}`, eventData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
    }

    request
      .then((res) => {
        if (res.status === 200) {
          this.props.onSuccess();
          this.props.onHide();
        } else {
          alert(res.data);
        }
      })
      .catch((err) => {
        console.error("Error saving event:", err);
        alert("Failed to save event");
      });
  };

  handleDelete = (e) => {
    e.preventDefault();
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    axios.delete(`/api/personalEvents/${this.state.id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
    .then((res) => {
      if (res.status === 200) {
        this.props.onSuccess();
        this.props.onHide();
      } else {
        alert(res.data);
      }
    })
    .catch((err) => {
      console.error("Error deleting event:", err);
      alert("Failed to delete event");
    });
  };

  render() {
    const { mode, showAlert, title, description, startDate, endDate } = this.state;
    const isViewMode = mode === 'view';

    return (
      <Modal
        show={this.props.show}
        onHide={this.props.onHide}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            {mode === 'add' ? 'Add Event' : mode === 'edit' ? 'Edit Event' : 'Event Details'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {showAlert && (
            <Alert variant="warning" className="m-1">
              End Date should be after Start Date
            </Alert>
          )}

          <Form onSubmit={this.handleSubmit}>
            <Form.Group controlId="formTitle">
              <Form.Label>Title <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="text"
                placeholder="Event title"
                name="title"
                value={title}
                onChange={this.handleChange}
                required
                readOnly={isViewMode}
              />
            </Form.Group>

            <Form.Group controlId="formDescription" className="mt-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Event description"
                name="description"
                value={description}
                onChange={this.handleChange}
                readOnly={isViewMode}
              />
            </Form.Group>

            <Form.Group controlId="formStartDate" className="mt-3">
              <Form.Label>Start Date <span className="text-danger">*</span></Form.Label>
              <DatePicker
                selected={startDate}
                onChange={(date) => this.setState({ startDate: date })}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={30}
                timeCaption="Time"
                dateFormat="MMMM d, yyyy h:mm aa"
                className="form-control"
                required
                readOnly={isViewMode}
              />
            </Form.Group>

            <Form.Group controlId="formEndDate" className="mt-3">
              <Form.Label>End Date <span className="text-danger">*</span></Form.Label>
              <DatePicker
                selected={endDate}
                onChange={(date) => this.setState({ endDate: date })}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={30}
                timeCaption="Time"
                dateFormat="MMMM d, yyyy h:mm aa"
                className="form-control"
                required
                readOnly={isViewMode}
              />
            </Form.Group>

            <div className="d-flex gap-2 mt-4">
              {mode !== 'view' && (
                <Button variant="primary" type="submit">
                  {mode === 'add' ? 'Add Event' : 'Save Changes'}
                </Button>
              )}
              {mode === 'edit' && (
                <Button variant="danger" onClick={this.handleDelete}>
                  Delete Event
                </Button>
              )}
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.props.onHide}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}