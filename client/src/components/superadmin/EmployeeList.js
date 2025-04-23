import React, { Component } from "react";
import { Card, Badge, Button, Form, Modal, Alert, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Redirect } from 'react-router-dom';
import MaterialTable from 'material-table';
import DeleteModal from '../DeleteModal';
import axios from 'axios';
import { ThemeProvider } from '@material-ui/core';
import { createMuiTheme } from '@material-ui/core/styles';

export default class EmployeeList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      users: [],
      selectedUser: null,
      viewRedirect: false,
      editRedirect: false,
      deleteModal: false,
      onboardingConfirmModal: false,
      error: null,
      loading: false,
      success: null
    };
  }

  refreshEmployeeList = () => {
    this.setState({ loading: true, error: null });
    Promise.all([
      axios({
        method: 'get',
        url: '/api/users',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      }),
      axios({
        method: 'get',
        url: '/api/onboarding/requests',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
    ])
      .then(([usersRes, requestsRes]) => {
        const users = usersRes.data;
        const requests = requestsRes.data.requests || [];

        const userOnboardingMap = {};
        requests.forEach(request => {
          userOnboardingMap[request.userId] = true;
        });

        const updatedUsers = users.map(user => ({
          ...user,
          onboardingRequested: !!userOnboardingMap[user.id]
        }));

        this.setState({ users: updatedUsers, loading: false });
      })
      .catch(err => {
        console.error('Failed to fetch data:', err);
        this.setState({
          error: 'Failed to load employee list. Please try again later.',
          loading: false
        });
      });
  };

  componentDidMount() {
    this.refreshEmployeeList();
  }

  onView = (user) => {
    return (event) => {
      event.preventDefault();
      this.setState({ selectedUser: user, viewRedirect: true });
    };
  };

  onEdit = (user) => {
    return (event) => {
      event.preventDefault();
      this.setState({ selectedUser: user, editRedirect: true });
    };
  };

  onDelete = (user) => {
    return (event) => {
      event.preventDefault();
      this.setState({ selectedUser: user, deleteModal: true });
    };
  };

  onRequestOnboarding = (user) => {
    return (event) => {
      event.preventDefault();
      this.setState({ selectedUser: user, onboardingConfirmModal: true });
    };
  };

  handleOnboardingConfirm = async () => {
    try {
      const currentUser = JSON.parse(localStorage.getItem("user"));
      const userRole = currentUser.role;
      
      const hasPermission = ["ROLE_SUPER_ADMIN", "ROLE_SYSTEM_ADMIN", "ROLE_ADMIN", "ROLE_HOD"].includes(userRole);
      
      if (!hasPermission) {
        this.setState({
          error: "You don't have permission to create onboarding requests. Please contact an administrator."
        });
        
        setTimeout(() => {
          this.setState({ error: null });
        }, 3000);
        
        return;
      }
      
      await axios.post("/api/onboarding/requests", {
        userId: this.state.selectedUser.id,
        requestedBy: currentUser.id,
        college: this.state.selectedUser.college || 'Engineering',
        departmentId: this.state.selectedUser.departmentId || null
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      
      const updatedUsers = this.state.users.map(user => {
        if (user.id === this.state.selectedUser.id) {
          return { ...user, onboardingRequested: true };
        }
        return user;
      });
      
      this.setState({
        users: updatedUsers,
        success: "Onboarding request created successfully",
        onboardingConfirmModal: false
      });
      
      setTimeout(() => {
        this.setState({ success: null });
      }, 3000);
      
    } catch (error) {
      console.error("Error creating onboarding request:", error);
      this.setState({
        error: error.response?.data?.message || "Failed to create onboarding request",
        onboardingConfirmModal: false
      });
      
      setTimeout(() => {
        this.setState({ error: null });
      }, 3000);
    }
  };

  render() {
    const closeDeleteModel = () => this.setState({ deleteModal: false });
    const closeOnboardingConfirmModal = () => this.setState({ onboardingConfirmModal: false });

    const theme = createMuiTheme({
      overrides: {
        MuiTableCell: {
          root: {
            padding: "6px 6px 6px 6px",
          },
        },
      },
    });

    const styles = {
      actionBtn: {
        width: '32px',
        height: '32px',
        padding: '0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '4px',
        transition: 'all 0.2s ease',
        '&:hover': {
          transform: 'scale(1.1)',
        }
      }
    };

    return (
      <div className="container-fluid pt-4">
        {this.state.error && (
          <Alert variant="danger" onClose={() => this.setState({ error: null })} dismissible>
            {this.state.error}
          </Alert>
        )}
        {this.state.success && (
          <Alert variant="success" onClose={() => this.setState({ success: null })} dismissible>
            {this.state.success}
          </Alert>
        )}
        {this.state.viewRedirect && (
          <Redirect to={{ pathname: '/employee-view', state: { selectedUser: this.state.selectedUser }}} />
        )}
        {this.state.editRedirect && (
          <Redirect to={{ pathname: '/employee-edit', state: { selectedUser: this.state.selectedUser }}} />
        )}
        {this.state.deleteModal && (
          <DeleteModal show={true} onHide={closeDeleteModel} data={this.state.selectedUser} onDeleteSuccess={this.refreshEmployeeList} />
        )}
        {this.state.onboardingConfirmModal && (
          <Modal show={true} onHide={closeOnboardingConfirmModal}>
            <Modal.Header closeButton>
              <Modal.Title>Confirm Onboarding Request</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Are you sure you want to create an onboarding request for {this.state.selectedUser?.fullName}?
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={closeOnboardingConfirmModal}>
                Cancel
              </Button>
              <Button variant="primary" onClick={this.handleOnboardingConfirm}>
                Confirm
              </Button>
            </Modal.Footer>
          </Modal>
        )}
        <h4>
          <a className="fa fa-plus mb-2 ml-2" href="/employee-add">
            Add Employee
          </a>
        </h4>
        <div className="col-sm-12">
          <Card>
            <Card.Header style={{ backgroundColor: "#515e73", color: "white" }}>
              <div className="panel-title">
                <strong>Employee List</strong>
              </div>
            </Card.Header>
            <Card.Body>
              <ThemeProvider theme={theme}>
                <MaterialTable
                  columns={[
                    { 
                      title: '#', 
                      render: rowData => rowData.tableData.id + 1,
                      width: 50
                    },
                    { title: 'Full Name', field: 'fullName' },
                    { title: 'Department', field: 'department.departmentName' },
                    {
                      title: 'Job Title', 
                      field: 'jobs',
                      render: rowData => {
                        if (!rowData.jobs || rowData.jobs.length === 0) return 'N/A';
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        const currentJob = rowData.jobs.find(job => {
                          try {
                            const startDate = new Date(job.startDate);
                            const endDate = new Date(job.endDate);
                            const startUTC = Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
                            const endUTC = Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
                            const todayUTC = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
                            return todayUTC >= startUTC && todayUTC <= endUTC;
                          } catch (e) {
                            console.error("Invalid job dates:", job);
                            return false;
                          }
                        });
                        return currentJob ? currentJob.jobTitle : rowData.jobs[0].jobTitle;
                      }
                    },
                    { title: 'Mobile', field: 'user_personal_info.mobile' },
                    {
                      title: 'Status',
                      field: 'active',
                      render: (rowData) =>
                        rowData.active ? (
                          <Badge pill variant="success">
                            Active
                          </Badge>
                        ) : (
                          <Badge pill variant="danger">
                            Inactive
                          </Badge>
                        ),
                    },
                    {
                      title: 'Onboarding', 
                      render: rowData => (
                        rowData.onboardingRequested ? (
                          <Badge pill variant="info">Requested</Badge>
                        ) : (
                          <Badge pill variant="secondary">Not Requested</Badge>
                        )
                      )
                    },
                    {
                      title: 'View',
                      render: rowData => (
                        <Form>
                          <OverlayTrigger
                            placement="top"
                            overlay={
                              <Tooltip id={`view-tooltip-${rowData.id}`}>
                                View employee details
                              </Tooltip>
                            }
                          >
                            <Button 
                              size="sm" 
                              variant="info" 
                              onClick={this.onView(rowData)}
                              className="action-btn"
                            >
                              <i className="far fa-address-card"></i>
                            </Button>
                          </OverlayTrigger>
                        </Form>
                      ),
                    },
                    {
                      title: 'Actions',
                      render: rowData => (
                        <div className="d-flex align-items-center">
                          <OverlayTrigger
                            placement="top"
                            overlay={
                              <Tooltip id={`edit-tooltip-${rowData.id}`}>
                                Edit employee information
                              </Tooltip>
                            }
                          >
                            <Button 
                              size="sm" 
                              variant="primary" 
                              onClick={this.onEdit(rowData)}
                              className="action-btn mr-2"
                            >
                              <i className="far fa-edit"></i>
                            </Button>
                          </OverlayTrigger>

                          <OverlayTrigger
                            placement="top"
                            overlay={
                              <Tooltip id={`onboard-tooltip-${rowData.id}`}>
                                {rowData.onboardingRequested 
                                  ? "Onboarding already requested for this employee"
                                  : "Request employee onboarding"}
                              </Tooltip>
                            }
                          >
                            <Button 
                              size="sm" 
                              variant="warning" 
                              onClick={this.onRequestOnboarding(rowData)}
                              className="action-btn mr-2"
                              disabled={rowData.onboardingRequested}
                            >
                              <i className="fas fa-user-plus"></i>
                            </Button>
                          </OverlayTrigger>

                          {rowData.id !== JSON.parse(localStorage.getItem('user')).id && (
                            <OverlayTrigger
                              placement="top"
                              overlay={
                                <Tooltip id={`delete-tooltip-${rowData.id}`}>
                                  Delete employee record
                                </Tooltip>
                              }
                            >
                              <Button 
                                size="sm" 
                                variant="danger" 
                                onClick={this.onDelete(rowData)}
                                className="action-btn"
                              >
                                <i className="far fa-trash-alt"></i>
                              </Button>
                            </OverlayTrigger>
                          )}
                        </div>
                      )
                    }
                  ]}
                  data={this.state.users}
                  options={{
                    rowStyle: (rowData, index) => ({
                      backgroundColor: index % 2 ? '#f9f9f9' : '#ffffff',
                      '&:hover': {
                        backgroundColor: '#f0f0f0',
                      }
                    }),
                    pageSize: 10,
                    pageSizeOptions: [10, 20, 30, 50, 75, 100],
                    loadingType: 'linear',
                    showTitle: true,
                    search: true,
                    filtering: true,
                    sorting: true,
                    draggable: false,
                    emptyStateMessage: this.state.loading ? 'Loading...' : 'No employees found',
                    cellStyle: {
                      padding: '8px 16px',
                    },
                    headerStyle: {
                      backgroundColor: '#f5f5f5',
                      color: '#333',
                      fontWeight: 'bold',
                    },
                  }}
                  title="Employees"
                  isLoading={this.state.loading}
                />
              </ThemeProvider>
            </Card.Body>
          </Card>
        </div>
      </div>
    );
  }
}