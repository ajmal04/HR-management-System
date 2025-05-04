import React, { Component } from "react";
import { Card, Button, Form, Alert } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";
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
      selectedApplications: null,
      done: false,
      hasError: false,
      errorMsg: "",
      completed: false,
      showModel: false,
    };
  }

  componentDidMount() {
    let userId = JSON.parse(localStorage.getItem("user")).id;
    axios({
      method: "get",
      url: "/api/applications/user/" + userId,
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }).then((res) => {
      res.data.map((app) => {
        app.startDate = moment(app.startDate).format("YYYY-MM-DD");
        app.endDate = moment(app.endDate).format("YYYY-MM-DD");
      });
      this.setState({ applications: res.data }, () => {
        console.log("applications", this.state.aplications);
      });
    });
  }

  handleChange = (event) => {
    const { value, name } = event.target;
    this.setState({
      [name]: value,
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

    return (
      <div className="container-fluid pt-5">
        <div className="col-sm-12">
          <Card>
            <Card.Header style={{ backgroundColor: "#515e73", color: "white" }}>
              <div className="panel-title">
                <strong>Application List</strong>
              </div>
            </Card.Header>
            <Card.Body>
              <ThemeProvider theme={theme}>
                <MaterialTable
                  columns={[
                    {
                      title: "#",
                      render: (rowData) => rowData.tableData.id + 1, // Show raw row number
                      width: 50,
                    },
                    { title: "Full Name", field: "user.fullName" },
                    { title: "Start Date", field: "startDate" },
                    { title: "End Date", field: "endDate" },
                    // {title: 'Leave Type', field: 'type'},
                    { title: "Reason", field: "reason" },
                    { title: "HOD Status", field: "hodStatus" },
                    { title: "HOD Comment", field: "hodComment" },
                    { title: "Admin Status", field: "adminStatus" },
                    { title: "Admin Comment", field: "adminComment" },
                    {
                      title: "Status",
                      field: "status",
                      render: (rowData) => {
                        let finalStatus = "Pending";
                        let variant = "warning";

                        if (rowData.hodStatus === "Rejected") {
                          finalStatus = "Rejected";
                          variant = "danger";
                        } else if (
                          rowData.hodStatus === "Approved" &&
                          rowData.adminStatus === "Rejected"
                        ) {
                          finalStatus = "Rejected";
                          variant = "danger";
                        } else if (
                          rowData.hodStatus === "Approved" &&
                          rowData.adminStatus === "Approved"
                        ) {
                          finalStatus = "Approved";
                          variant = "success";
                        }

                        return (
                          <Button size="sm" variant={variant}>
                            {finalStatus}
                          </Button>
                        );
                      },
                    },
                  ]}
                  data={this.state.applications}
                  options={{
                    rowStyle: (rowData, index) => {
                      if (index % 2) {
                        return { backgroundColor: "#f2f2f2" };
                      }
                    },
                    pageSize: 10,
                    pageSizeOptions: [10, 20, 30, 50, 75, 100],
                  }}
                  title="Applications"
                />
              </ThemeProvider>
            </Card.Body>
          </Card>
        </div>
        {this.state.hasError ? (
          <Alert variant="danger" className="m-3" block>
            {this.state.errMsg}
          </Alert>
        ) : this.state.completed ? (
          <Redirect to="/application-list" />
        ) : (
          <></>
        )}
      </div>
    );
  }
}
