import React, { Component } from "react";
import { Card, Button, Form, Alert, Spinner, Modal } from "react-bootstrap";
import axios from 'axios';
import MaterialTable from 'material-table';
import { ThemeProvider } from '@material-ui/core';
import { createMuiTheme } from '@material-ui/core/styles';

// Constants
const ALL_DEPARTMENTS = 'all';

export default class Announcement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            announcements: [],
            departments: [],
            title: "",
            description: "",
            selectedDepartment: "",
            hasError: false,
            errorMsg: '',
            isLoading: false,
            isSubmitting: false,
            completed: false,
            showDeleteModal: false,
            announcementToDelete: null,
            showSuccessAlert: false
        };
    }

    componentDidMount() {
        this.fetchData();
    }

    fetchData = () => {
        this.setState({ isLoading: true, hasError: false });

        Promise.all([
            axios.get('/api/departments', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            }),
            axios.get('/api/departmentAnnouncements', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            })
        ])
        .then(([deptRes, annRes]) => {
            this.setState({
                departments: deptRes.data,
                announcements: annRes.data,
                isLoading: false
            });
        })
        .catch(err => {
            this.setState({
                hasError: true,
                errorMsg: err.response?.data?.message || 'Failed to load data',
                isLoading: false
            });
        });
    };

    handleChange = (event) => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    };

    handleSubmit = (event) => {
        event.preventDefault();
        this.setState({ isSubmitting: true, hasError: false });

        const { title, description, selectedDepartment } = this.state;
        const userId = JSON.parse(localStorage.getItem('user'))?.id;

        if (!userId) {
            this.setState({
                hasError: true,
                errorMsg: 'User information not found',
                isSubmitting: false
            });
            return;
        }

        const data = {
            announcementTitle: title,
            announcementDescription: description,
            createdByUserId: userId,
            departmentId: selectedDepartment === ALL_DEPARTMENTS ? null : selectedDepartment
        };

        axios.post('/api/departmentAnnouncements', data, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        .then(() => {
            this.setState({
                completed: true,
                isSubmitting: false,
                showSuccessAlert: true,
                title: "",
                description: "",
                selectedDepartment: ""
            });
            this.fetchData();
        })
        .catch(err => {
            this.setState({
                hasError: true,
                errorMsg: err.response?.data?.message || 'Failed to create announcement',
                isSubmitting: false
            });
        });
    };

    handleDeleteClick = (announcement) => {
        this.setState({
            showDeleteModal: true,
            announcementToDelete: announcement
        });
    };

    handleDeleteConfirm = () => {
        const { announcementToDelete } = this.state;
        
        axios.delete(`/api/departmentAnnouncements/${announcementToDelete.id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        .then(() => {
            this.setState({
                showDeleteModal: false,
                showSuccessAlert: true,
                announcementToDelete: null
            });
            this.fetchData();
        })
        .catch(err => {
            this.setState({
                hasError: true,
                errorMsg: err.response?.data?.message || 'Failed to delete announcement',
                showDeleteModal: false
            });
        });
    };

    handleDeleteCancel = () => {
        this.setState({
            showDeleteModal: false,
            announcementToDelete: null
        });
    };

    renderDepartmentOptions = () => {
        return this.state.departments.map((dept) => (
            <option key={dept.id} value={dept.id}>{dept.departmentName}</option>
        ));
    };

    render() {
        const theme = createMuiTheme({
            overrides: {
                MuiTableCell: {
                    root: {
                        padding: '6px 6px 6px 6px'
                    }
                }
            }
        });

        return (
            <div className="container-fluid pt-2">
                {/* Success Alert */}
                {this.state.showSuccessAlert && (
                    <Alert variant="success" onClose={() => this.setState({ showSuccessAlert: false })} dismissible>
                        Announcement published successfully!
                    </Alert>
                )}

                {/* Error Alert */}
                {this.state.hasError && (
                    <Alert variant="danger" onClose={() => this.setState({ hasError: false })} dismissible>
                        {this.state.errorMsg}
                    </Alert>
                )}

                {/* Add Announcement Form */}
                <div className="row">
                    <div className="col-sm-12">
                        <Card className="main-card">
                            <Card.Header><strong>Add Announcement</strong></Card.Header>
                            <Card.Body>
                                <Form onSubmit={this.handleSubmit}>
                                    <Form.Group>
                                        <Form.Label>Title</Form.Label>
                                        <Form.Control 
                                            type="text"
                                            value={this.state.title}
                                            onChange={this.handleChange}
                                            name="title"
                                            required
                                            maxLength={100}
                                        />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>Description</Form.Label>
                                        <Form.Control 
                                            as="textarea"
                                            rows={3}
                                            value={this.state.description}
                                            onChange={this.handleChange}
                                            name="description"
                                            required
                                        />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>Department</Form.Label>
                                        <Form.Control 
                                            as="select"
                                            value={this.state.selectedDepartment}
                                            onChange={this.handleChange}
                                            name="selectedDepartment"
                                            required
                                        >
                                            <option value="">Choose one...</option>
                                            <option value={ALL_DEPARTMENTS}>All Departments</option>
                                            {this.renderDepartmentOptions()}
                                        </Form.Control>
                                    </Form.Group>
                                    <Button 
                                        type="submit" 
                                        size="sm" 
                                        className="mt-1"
                                        disabled={this.state.isSubmitting}
                                    >
                                        {this.state.isSubmitting ? (
                                            <>
                                                <Spinner as="span" animation="border" size="sm" role="status" />
                                                <span className="ml-2">Publishing...</span>
                                            </>
                                        ) : 'Publish'}
                                    </Button>
                                </Form>
                            </Card.Body>
                        </Card>
                    </div>
                </div>

                {/* Announcement List */}
                <div className="row mt-4">
                    <div className="col-sm-12">
                        <Card className="main-card">
                            <Card.Header>
                                <div className="panel-title">
                                    <strong>Announcement List</strong>
                                </div>
                            </Card.Header>
                            <Card.Body>
                                {this.state.isLoading ? (
                                    <div className="text-center">
                                        <Spinner animation="border" role="status">
                                            <span className="sr-only">Loading...</span>
                                        </Spinner>
                                    </div>
                                ) : this.state.announcements.length === 0 ? (
                                    <Alert variant="info">
                                        No announcements found
                                    </Alert>
                                ) : (
                                    <ThemeProvider theme={theme}>
                                        <MaterialTable
                                            columns={[
                                                { 
                                                    title: '#', 
                                                    render: rowData => rowData.tableData.id + 1,  // Show raw row number
                                                    width: 50
                                                },
                                                { title: 'Title', field: 'announcementTitle' },
                                                { title: 'Description', field: 'announcementDescription' },
                                                { title: 'Created By', field: 'user.fullName' },
                                                { title: 'Department', field: 'department.departmentName' },
                                                {
                                                    title: 'Action',
                                                    render: rowData => (
                                                        <Button 
                                                            onClick={() => this.handleDeleteClick(rowData)} 
                                                            size="sm" 
                                                            variant="outline-danger"
                                                        >
                                                            <i className="fas fa-trash mr-1"></i>
                                                            Delete
                                                        </Button>
                                                    )
                                                }
                                            ]}
                                            data={this.state.announcements}
                                            options={{
                                                rowStyle: (rowData, index) => ({
                                                    backgroundColor: index % 2 ? '#f2f2f2' : 'white'
                                                }),
                                                pageSize: 8,
                                                pageSizeOptions: [5, 10, 20, 30, 50, 75, 100],
                                                headerStyle: {
                                                    backgroundColor: '#515e73',
                                                    color: '#FFF'
                                                }
                                            }}
                                            title=""
                                        />
                                    </ThemeProvider>
                                )}
                            </Card.Body>
                        </Card>
                    </div>
                </div>

                {/* Delete Confirmation Modal */}
                <Modal show={this.state.showDeleteModal} onHide={this.handleDeleteCancel}>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirm Delete</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Are you sure you want to delete this announcement?
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleDeleteCancel}>
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