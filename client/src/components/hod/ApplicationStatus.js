import React, { Component } from "react";
import { Card, Button, Alert } from "react-bootstrap";
import axios from "axios";
import moment from "moment";
import MaterialTable from "material-table";
import { ThemeProvider } from "@material-ui/core";
import { createMuiTheme } from "@material-ui/core/styles";

export default class ApplicationStatus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      applications: [],
      hasError: false,
      errorMsg: "",
    };
  }

  componentDidMount() {
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?.id;

    axios({
      method: "get",
      url: `/api/applications/user/${userId}`,
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => {
        const formattedApps = res.data.map((app) => ({
          ...app,
          startDate: moment(app.startDate).format("YYYY-MM-DD"),
          endDate: moment(app.endDate).format("YYYY-MM-DD"),
        }));
        this.setState({ applications: formattedApps });
      })
      .catch((err) => {
        this.setState({
          hasError: true,
          errorMsg: "Failed to load leave applications.",
        });
        console.error(err);
      });
  }

  render() {
    const theme = createMuiTheme({
      overrides: {
        MuiTableCell: {
          root: {
            padding: "6px 6px",
          },
        },
      },
    });

    return (
      <div className="container-fluid pt-4">
        <div className="col-sm-12">
          <Card>
            <Card.Header style={{ backgroundColor: "#515e73", color: "white" }}>
              <strong>My Leave Applications</strong>
            </Card.Header>
            <Card.Body>
              <ThemeProvider theme={theme}>
                <MaterialTable
                  title="Leave Application Status"
                  columns={[
                    {
                      title: "#",
                      render: (rowData) => rowData.tableData.id + 1,
                      width: 40,
                    },
                    { title: "Start Date", field: "startDate" },
                    { title: "End Date", field: "endDate" },
                    { title: "Reason", field: "reason" },
                    { title: "Admin Status", field: "adminStatus" },
                    { title: "Admin Comment", field: "adminComment" },
                    {
                      title: "Final Status",
                      render: (rowData) => {
                        let finalStatus = "Pending";
                        let variant = "warning";

                        if (rowData.adminStatus === "Rejected") {
                          finalStatus = "Rejected";
                          variant = "danger";
                        } else if (rowData.adminStatus === "Approved") {
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
                    pageSize: 5,
                    pageSizeOptions: [5, 10, 20],
                    rowStyle: (rowData, index) => ({
                      backgroundColor: index % 2 === 0 ? "#fff" : "#f9f9f9",
                    }),
                  }}
                />
              </ThemeProvider>
            </Card.Body>
          </Card>
          {this.state.hasError && (
            <Alert variant="danger" className="mt-3">
              {this.state.errorMsg}
            </Alert>
          )}
        </div>
      </div>
    );
  }
}
