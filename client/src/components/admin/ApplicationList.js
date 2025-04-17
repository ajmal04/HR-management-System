import React, { Component } from "react";
import { Card, Button, Alert } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import axios from "axios";
import moment from 'moment'
import MaterialTable from 'material-table'
import { ThemeProvider } from '@material-ui/core'
import { createMuiTheme } from '@material-ui/core/styles'

export default class CollegeApplicationList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      applications: [],
      selectedApplications: null,
      done: false,
      hasError: false,
      errorMsg: "",
      completed: false,
      showModel: false,
    };
  }

  componentDidMount() {
    axios({
      method: "get",
      url: "/api/applications/college",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }).then((res) => {
        const formattedData = res.data.map(app => ({
          ...app,
          startDate: moment(app.startDate).format('YYYY-MM-DD'),
          endDate: moment(app.endDate).format('YYYY-MM-DD')
        }));
        this.setState({ applications: formattedData });
    })
    .catch(err => {
        this.setState({
          hasError: true,
          errorMsg: err.response?.data?.message || 'Failed to fetch applications'
        });
        console.error('Error fetching college applications:', err);
    })
  }

  handleChange = (event) => {
    const { value, name } = event.target;
    this.setState({
      [name]: value,
    });
  };

  onApprove(app) {
    return (event) => {
      event.preventDefault();

      axios({
        method: "put",
        url: "/api/applications/" + app.id,
        data: {
          status: 'Approved'
        },
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
        .then((res) => {
          this.setState({ completed: true });
          // Refresh the list after approval
          this.componentDidMount();
        })
        .catch((err) => {
          this.setState({
            hasError: true,
            errorMsg: err.response?.data?.message || 'Approval failed',
          });
        });
    };
  }

  onReject(app) {
    return (event) => {
      event.preventDefault()

      axios({
        method: "put",
        url: "/api/applications/" + app.id,
        data: {
          status: 'Rejected'
        },
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
        .then((res) => {
          this.setState({ completed: true });
          // Refresh the list after rejection
          this.componentDidMount();
        })
        .catch((err) => {
          this.setState({
            hasError: true,
            errorMsg: err.response?.data?.message || 'Rejection failed',
          });
        });
    }
  }

  render() {
    const theme = createMuiTheme({
        overrides: {
            MuiTableCell: {
                root: {
                    padding: '6px 6px 6px 6px'
                }
            }
        }
    })

    return (
      <div className="container-fluid pt-5">
        <div className="col-sm-12">
          <Card>
            <Card.Header style={{ backgroundColor: "#515e73", color: "white" }}>
              <div className="panel-title">
                <strong>College Applications</strong>
              </div>
            </Card.Header>
            <Card.Body>
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
                        {title: 'Full Name', field: 'user.fullName'},
                        {title: 'Department', field: 'user.department.departmentName'},
                        {title: 'Start Date', field: 'startDate'},
                        {title: 'End Date', field: 'endDate'},
                        {title: 'Leave Type', field: 'type'},
                        {title: 'Comments', field: 'reason'},
                        {
                            title: 'Status', 
                            field: 'status',
                            render: rowData => (
                                <Button size="sm" variant={rowData.status==='Approved' ? "success" : rowData.status==='Pending' ? "warning" : "danger"}>{rowData.status}</Button>
                            )
                        },
                        {
                            title: 'Action',
                            render: rowData => (
                              rowData.user.id !== JSON.parse(localStorage.getItem('user')).id && rowData.status === "Pending" ? (
                                <>
                                  <Button onClick={this.onApprove(rowData)} variant="success" size="sm" className="mr-2">
                                    <i className="fas fa-check"></i> Approve
                                  </Button>
                                  <Button onClick={this.onReject(rowData)} variant="danger" size="sm" className="ml-2">
                                    <i className="fas fa-times"></i> Reject
                                  </Button>
                                </>
                              ) : null
                            )
                        }
                    ]}
                    data={this.state.applications}
                    options={{
                      rowStyle: (rowData, index) => {
                        if(index%2) {
                          return {backgroundColor: '#f2f2f2'}
                        }
                      },
                      pageSize: 10,
                      pageSizeOptions: [10, 20, 30, 50, 75, 100],
                      filtering: true,
                      exportButton: true
                    }}
                    title="College-wide Applications"
                />
              </ThemeProvider>
            </Card.Body>
          </Card>
        </div>
        {this.state.hasError && (
          <Alert variant="danger" className="m-3" block>
            {this.state.errorMsg}
          </Alert>
        )}
        {this.state.completed && <Redirect to="/college-applications" />}
      </div>
    );
  }
}