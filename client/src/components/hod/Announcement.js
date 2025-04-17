import React, { Component } from "react";
import { 
  Card, 
  Button, 
  Form, 
  Alert, 
  Spinner,
  Modal,
  Badge
} from "react-bootstrap";
import { Redirect, NavLink } from 'react-router-dom';
import axios from 'axios';
import MaterialTable from 'material-table';
import { ThemeProvider } from '@material-ui/core';
import { createMuiTheme } from '@material-ui/core/styles';
import moment from 'moment';

export default class Announcement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      announcements: [],
      departments: [],
      title: "",
      description: "",
      userId: null,
      departmentId: null,
      hasError: false,
      errorMsg: '',
      successMsg: '',
      completed: false,
      isLoading: false,
      isSubmitting: false,
      showDeleteModal: false,
      announcementToDelete: null,
      showSuccessModal: false
    };
  }

  componentDidMount() {
    this.fetchAnnouncements();
    this.fetchDepartments();
  }

  fetchAnnouncements = () => {
    this.setState({ isLoading: true });
    const deptId = JSON.parse(localStorage.getItem('user')).departmentId;
    
    axios({
      method: 'get',
      url: '/api/departmentAnnouncements/department/' + deptId,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    .then(res => {
      this.setState({ 
        announcements: res.data,
        isLoading: false,
        hasError: false 
      });
    })
    .catch(err => {
      this.setState({ 
        hasError: true, 
        errorMsg: err.response?.data?.message || 'Failed to load announcements',
        isLoading: false 
      });
    });
  }

  fetchDepartments = () => {
    axios.get('/api/departments', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    .then(res => {
      this.setState({ departments: res.data });
    });
  }

  handleDeleteConfirmation = (announcement) => {
    this.setState({ 
      showDeleteModal: true,
      announcementToDelete: announcement 
    });
  }

  handleDelete = () => {
    const { announcementToDelete } = this.state;
    
    axios({
      method: 'delete',
      url: '/api/departmentAnnouncements/' + announcementToDelete.id,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    .then(() => {
      this.setState({ 
        completed: true,
        showDeleteModal: false,
        successMsg: 'Announcement deleted successfully!',
        showSuccessModal: true
      }, () => {
        setTimeout(() => {
          this.setState({ showSuccessModal: false });
          this.fetchAnnouncements();
        }, 2000);
      });
    })
    .catch(err => {
      this.setState({ 
        hasError: true, 
        errorMsg: err.response?.data?.message || 'Failed to delete announcement',
        showDeleteModal: false 
      });
    });
  }

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  onSubmit = (event) => {
    event.preventDefault();
    this.setState({ isSubmitting: true });

    const user = JSON.parse(localStorage.getItem('user'));
    const data = {
      announcementTitle: this.state.title,
      announcementDescription: this.state.description,
      createdByUserId: user.id,
      departmentId: user.departmentId
    };

    axios({
      method: 'post',
      url: 'api/departmentAnnouncements',
      data: data,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    .then(() => {
      this.setState({ 
        completed: true,
        title: "",
        description: "",
        isSubmitting: false,
        successMsg: 'Announcement published successfully!',
        showSuccessModal: true
      }, () => {
        setTimeout(() => {
          this.setState({ showSuccessModal: false });
          this.fetchAnnouncements();
        }, 2000);
      });
    })
    .catch(err => {
      this.setState({ 
        hasError: true, 
        errorMsg: err.response?.data?.message || 'Failed to create announcement',
        isSubmitting: false 
      });
    });
  }

  render() {
    const { 
      announcements, 
      title, 
      description, 
      hasError, 
      errorMsg, 
      successMsg,
      isLoading, 
      isSubmitting,
      showDeleteModal,
      showSuccessModal,
      departments
    } = this.state;

    const theme = createMuiTheme({
      overrides: {
        MuiTableCell: {
          root: {
            padding: '6px 6px 6px 6px'
          }
        }
      }
    });

    const currentUser = JSON.parse(localStorage.getItem('user'));

    return (
      <div className="container-fluid pt-2">
        {this.state.completed && <Redirect to="/announcement" />}
        
        {/* Success Modal */}
        <Modal show={showSuccessModal} onHide={() => this.setState({ showSuccessModal: false })} centered>
          <Modal.Header closeButton>
            <Modal.Title>Success</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Alert variant="success">{successMsg}</Alert>
          </Modal.Body>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal show={showDeleteModal} onHide={() => this.setState({ showDeleteModal: false })} centered>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Delete</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to delete this announcement?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => this.setState({ showDeleteModal: false })}>
              Cancel
            </Button>
            <Button variant="danger" onClick={this.handleDelete}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Error Alert */}
        {hasError && (
          <Alert variant="danger" onClose={() => this.setState({ hasError: false })} dismissible>
            {errorMsg}
          </Alert>
        )}

        <div className="row mb-4">
          <div className="col-sm-12">
            <Card className="main-card">
              <Card.Header>
                <strong>Add Announcement</strong>
                <Badge pill variant="info" className="ml-2">
                  {departments.find(d => d.id === currentUser.departmentId)?.departmentName || 'Your Department'}
                </Badge>
              </Card.Header>
              <Card.Body>
                <Form onSubmit={this.onSubmit}>
                  <Form.Group>
                    <Form.Label>Title</Form.Label>
                    <Form.Control 
                      type="text"
                      value={title}
                      onChange={this.handleChange}
                      name="title"
                      required
                      maxLength={100}
                    />
                    <Form.Text className="text-muted">
                      {title.length}/100 characters
                    </Form.Text>
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Description</Form.Label>
                    <Form.Control 
                      as="textarea"
                      rows={3}
                      value={description}
                      onChange={this.handleChange}
                      name="description"
                      required
                      maxLength={500}
                    />
                    <Form.Text className="text-muted">
                      {description.length}/500 characters
                    </Form.Text>
                  </Form.Group>
                  <Button 
                    type="submit" 
                    size="sm" 
                    className="mt-1"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                        <span className="ml-2">Publishing...</span>
                      </>
                    ) : 'Publish'}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </div>
        </div>

        <div className="row">
          <div className="col-sm-12">
            <Card className="main-card">
              <Card.Header>
                <div className="d-flex justify-content-between align-items-center">
                  <strong>Announcement List</strong>
                  <Button 
                    variant="outline-primary" 
                    size="sm" 
                    onClick={this.fetchAnnouncements}
                    disabled={isLoading}
                  >
                    <i className="fas fa-sync"></i> Refresh
                  </Button>
                </div>
              </Card.Header>
              <Card.Body>
                {isLoading ? (
                  <div className="text-center py-4">
                    <Spinner animation="border" role="status">
                      <span className="sr-only">Loading...</span>
                    </Spinner>
                  </div>
                ) : announcements.length === 0 ? (
                  <Alert variant="info">
                    No announcements found. Create one above!
                  </Alert>
                ) : (
                  <ThemeProvider theme={theme}>
                    <MaterialTable
                      columns={[
                        { 
                          title: '#', 
                          render: rowData => rowData.tableData.id + 1,
                          width: 50
                        },
                        { title: 'Title', field: 'announcementTitle' },
                        { 
                          title: 'Description', 
                          field: 'announcementDescription',
                          render: rowData => (
                            <div style={{ whiteSpace: 'pre-line' }}>
                              {rowData.announcementDescription}
                            </div>
                          )
                        },
                        { 
                          title: 'Created By', 
                          field: 'user.fullName',
                          render: rowData => rowData.user?.fullName || 'System'
                        },
                        { 
                          title: 'Department', 
                          render: rowData => (
                            departments.find(d => d.id === rowData.departmentId)?.departmentName || 'N/A'
                          )
                        },
                        { 
                          title: 'Date', 
                          render: rowData => moment(rowData.createdAt).format('DD MMM YYYY')
                        },
                        {
                          title: 'Action',
                          render: rowData => (
                            rowData.user?.id === currentUser.id && (
                              <Button 
                                onClick={() => this.handleDeleteConfirmation(rowData)} 
                                size="sm" 
                                variant="danger"
                              >
                                <i className="fas fa-trash"></i> Delete
                              </Button>
                            )
                          )
                        }
                      ]}
                      data={announcements}
                      options={{
                        rowStyle: (rowData, index) => ({
                          backgroundColor: index % 2 ? '#f2f2f2' : 'white'
                        }),
                        pageSize: 10,
                        pageSizeOptions: [5, 10, 20],
                        headerStyle: {
                          backgroundColor: '#515e73',
                          color: '#FFF'
                        },
                        search: true,
                        filtering: false,
                        toolbar: true
                      }}
                      title=""
                    />
                  </ThemeProvider>
                )}
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>
    );
  }
}