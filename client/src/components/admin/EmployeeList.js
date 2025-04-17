import React, { Component } from "react";
import { Card, Badge, Button, Form } from "react-bootstrap";
import { Redirect } from 'react-router-dom';
import MaterialTable from 'material-table';
import axios from 'axios';
import { ThemeProvider, createTheme } from '@material-ui/core';

export default class EmployeeList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      selectedUser: null,
      viewRedirect: false,
      viewSalaryRedirect: false,
      error: null,
      loading: true
    };
    this._isMounted = false;
  }

  componentDidMount() {
    this._isMounted = true;
    axios.get('/api/colleges/users', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    .then(res => {
      if (this._isMounted) {
        this.setState({ 
          users: Array.isArray(res.data) ? res.data : [],
          loading: false 
        });
      }
    })
    .catch(err => {
      console.error('Failed to fetch users:', err);
      if (this._isMounted) {
        this.setState({ 
          error: 'Failed to load employee data', 
          loading: false 
        });
      }
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  onView = (user) => (event) => {
    event.preventDefault();
    this.setState({ selectedUser: user, viewRedirect: true });
  };

  onSalaryView = (user) => (event) => {
    event.preventDefault();
    this.setState({ 
      selectedUser: { user: { id: user.id } }, 
      viewSalaryRedirect: true 
    });
  };

  render() {
    const { users, viewRedirect, viewSalaryRedirect, selectedUser, loading, error } = this.state;

    const theme = createTheme({
      overrides: {
        MuiTableCell: {
          root: {
            padding: '6px 6px 6px 6px'
          }
        }
      }
    });

    if (viewRedirect) {
      return <Redirect to={{ 
        pathname: '/employee-view', 
        state: { selectedUser } 
      }} />;
    }

    if (viewSalaryRedirect) {
      return <Redirect to={{ 
        pathname: '/salary-view', 
        state: { selectedUser } 
      }} />;
    }

    if (loading) {
      return <div className="container-fluid pt-4">Loading...</div>;
    }

    if (error) {
      return <div className="container-fluid pt-4">Error: {error}</div>;
    }

    return (
      <div className="container-fluid pt-4">
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
                    { title: 'Department', field: 'department.department_name' },
                    {
                      title: 'Job Title', 
                      field: 'jobs',
                      render: rowData => (
                        rowData.jobs && rowData.jobs.length > 0 ? (
                          rowData.jobs
                            .filter(job => new Date(job.startDate) <= new Date() && 
                                          new Date(job.endDate) >= new Date())
                            .map(job => job.jobTitle)
                            .join(', ') || 'No current job'
                        ) : 'N/A'
                      )
                    },
                    {
                      title: 'Mobile',
                      field: 'user_personal_info.mobile',
                      render: rowData => rowData.user_personal_info?.mobile || 'N/A'
                    },
                    {
                      title: 'Status', 
                      field: 'active',
                      render: rowData => (
                        rowData.active ? (
                          <Badge pill variant="success">Active</Badge>
                        ) : (
                          <Badge pill variant="danger">Inactive</Badge>
                        )
                      )
                    },
                    {
                      title: 'Actions',
                      render: rowData => (
                        <Form inline>
                          <Button 
                            size="sm" 
                            variant="info" 
                            onClick={this.onView(rowData)}
                            className="mr-2"
                          >
                            <i className="far fa-address-card" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="info" 
                            onClick={this.onSalaryView(rowData)}
                          >
                            <i className="fas fa-euro-sign" />
                          </Button>
                        </Form>
                      )
                    }
                  ]}
                  data={users}
                  options={{
                    rowStyle: (rowData, index) => ({
                      backgroundColor: index % 2 ? '#f2f2f2' : 'white'
                    }),
                    pageSize: 10,
                    pageSizeOptions: [10, 20, 30, 50, 75, 100],
                    emptyRowsWhenPaging: false
                  }}
                  title="Employees"
                />
              </ThemeProvider>
            </Card.Body>
          </Card>
        </div>
      </div>
    );
  }
}