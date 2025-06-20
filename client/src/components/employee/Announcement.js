import React, { Component } from "react";
import { Card, Alert } from "react-bootstrap";
import axios from "axios";
import MaterialTable from "material-table";
import { ThemeProvider } from "@material-ui/core";
import { createMuiTheme } from "@material-ui/core/styles";

export default class Announcement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      announcements: [],
      hasError: false,
      errorMsg: "",
    };
  }

  componentDidMount() {
    const user = JSON.parse(localStorage.getItem("user"));
    const deptId = user.departmentId;
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    };

    Promise.all([
      axios.get(`/api/departmentAnnouncements/department/${deptId}`, {
        headers,
      }),
      axios.get(`/api/collegeAnnouncements`, { headers }),
    ])
      .then(([deptRes, collegeRes]) => {
        const merged = [...deptRes.data, ...collegeRes.data];

        // Sort by created_at descending
        merged.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        this.setState({ announcements: merged });
      })
      .catch((err) => {
        this.setState({
          hasError: true,
          errorMsg:
            err.response?.data?.message || "Failed to fetch announcements",
        });
      });
  }

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
      <div className="container-fluid pt-2">
        <div className="row">
          <div className="col-sm-12">
            <Card className="main-card">
              <Card.Header>
                <div className="panel-title">
                  <strong>Announcement List</strong>
                </div>
              </Card.Header>
              <Card.Body>
                <ThemeProvider theme={theme}>
                  <MaterialTable
                    columns={[
                      {
                        title: "#",
                        render: (rowData) => rowData.tableData.id + 1,
                        width: 50,
                      },
                      { title: "Title", field: "announcementTitle" },
                      {
                        title: "Description",
                        field: "announcementDescription",
                      },
                      { title: "Created By", field: "user.fullName" },
                      {
                        title: "Source",
                        render: (rowData) =>
                          rowData.college
                            ? `College: ${rowData.college}`
                            : `Department: ${
                                rowData.department?.departmentName || "N/A"
                              }`,
                      },
                    ]}
                    data={this.state.announcements}
                    options={{
                      rowStyle: (rowData, index) => ({
                        backgroundColor: index % 2 ? "#f2f2f2" : "white",
                      }),
                      pageSize: 8,
                      pageSizeOptions: [5, 10, 20, 30, 50, 75, 100],
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
        {this.state.hasError && (
          <Alert variant="danger" className="m-3">
            {this.state.errorMsg}
          </Alert>
        )}
      </div>
    );
  }
}
