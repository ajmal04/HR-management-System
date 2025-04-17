import React, { Component } from "react";
import { Card, Button, Alert, Badge, Spinner } from "react-bootstrap";
import axios from 'axios';
import moment from 'moment';
import MaterialTable from 'material-table';
import { ThemeProvider } from '@material-ui/core';
import { createMuiTheme } from '@material-ui/core/styles';

export default class CollegeJobList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      jobs: [],
      loading: true,
      error: null,
      selectedJob: null
    };
  }

  componentDidMount() {
    this.fetchJobs();
  }

  fetchJobs = async () => {
    try {
      this.setState({ loading: true, error: null });
      
      const response = await axios.get('/api/jobs/college/list', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      const jobs = response.data.map(job => ({
        ...job,
        startDate: moment(job.startDate).isValid() ? moment(job.startDate).format('YYYY-MM-DD') : 'N/A',
        endDate: moment(job.endDate).isValid() ? moment(job.endDate).format('YYYY-MM-DD') : 'N/A',
        user: job.user || { fullName: 'Unknown' },
        department: job.user?.department || { departmentName: 'Unassigned' }
      }));

      this.setState({ jobs, loading: false });
    } catch (error) {
      console.error('Error fetching jobs:', error);
      this.setState({ 
        error: error.response?.data?.message || 'Failed to load jobs. Please try again.',
        loading: false 
      });
    }
  };

  render() {
    const { jobs, loading, error } = this.state;

    const theme = createMuiTheme({
      overrides: {
        MuiTableCell: {
          root: {
            padding: '8px 16px',
            fontSize: '0.875rem'
          }
        },
        MuiTableHead: {
          root: {
            backgroundColor: '#f5f5f5'
          }
        }
      }
    });

    if (loading) {
      return (
        <div className="container-fluid pt-5 text-center">
          <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
          <p className="mt-2">Loading college jobs...</p>
        </div>
      );
    }

    return (
      <div className="container-fluid pt-3">
        {error && (
          <Alert variant="danger" className="m-3">
            {error}
            <Button 
              variant="outline-danger" 
              onClick={this.fetchJobs}
              className="ml-3"
              size="sm"
            >
              <i className="fas fa-redo"></i> Retry
            </Button>
          </Alert>
        )}

        <Card className="shadow-sm">
          <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
            <h5 className="mb-0">College Job List</h5>
            <div>
              <Button 
                variant="light" 
                size="sm"
                onClick={this.fetchJobs}
                className="mr-2"
              >
                <i className="fas fa-sync-alt"></i> Refresh
              </Button>
            </div>
          </Card.Header>
          
          <Card.Body className="p-0">
            <ThemeProvider theme={theme}>
              <MaterialTable
                columns={[
                  { 
                    title: '#', 
                    field: 'tableData.id',
                    render: rowData => rowData.tableData.id + 1,
                    width: 50,
                    filtering: false
                  },
                  { 
                    title: 'Job Title', 
                    field: 'jobTitle',
                    filterPlaceholder: 'Filter by title...'
                  },
                  { 
                    title: 'Employee', 
                    field: 'user.fullName',
                    render: rowData => rowData.user.fullName,
                    filterPlaceholder: 'Filter by employee...'
                  },
                  { 
                    title: 'Department', 
                    field: 'department.departmentName',
                    render: rowData => rowData.department.departmentName,
                    filterPlaceholder: 'Filter by department...'
                  },
                  { 
                    title: 'Start Date', 
                    field: 'startDate',
                    type: 'date',
                    filtering: false
                  },
                  { 
                    title: 'End Date', 
                    field: 'endDate',
                    type: 'date',
                    filtering: false
                  },
                  {
                    title: 'Status', 
                    field: 'status',
                    render: job => {
                      try {
                        const start = new Date(job.startDate);
                        const end = new Date(job.endDate);
                        const now = new Date();
                        
                        start.setHours(0, 0, 0, 0);
                        end.setHours(23, 59, 59, 999);
                        
                        if (start > now) {
                          return <Badge variant="warning">Scheduled</Badge>;
                        } else if (end >= now) {
                          return <Badge variant="success">Active</Badge>;
                        } else {
                          return <Badge variant="secondary">Completed</Badge>;
                        }
                      } catch {
                        return <Badge variant="light">Unknown</Badge>;
                      }
                    },
                    filtering: false,
                    cellStyle: {
                      textAlign: 'center'
                    }
                  }
                ]}
                data={jobs}
                options={{
                  pageSize: 10,
                  pageSizeOptions: [5, 10, 20, 50],
                  filtering: true,
                  padding: 'dense',
                  headerStyle: {
                    backgroundColor: '#f5f5f5',
                    fontWeight: '600',
                    whiteSpace: 'nowrap'
                  },
                  rowStyle: rowData => ({
                    backgroundColor: rowData.tableData.id % 2 ? '#fafafa' : '#fff'
                  })
                }}
                localization={{
                  body: {
                    emptyDataSourceMessage: 'No jobs found for your college'
                  },
                  toolbar: {
                    searchPlaceholder: 'Search jobs...'
                  },
                  pagination: {
                    labelRowsSelect: 'rows',
                    labelDisplayedRows: '{from}-{to} of {count}'
                  }
                }}
              />
            </ThemeProvider>
          </Card.Body>
        </Card>
      </div>
    );
  }
}