import React, { Component } from "react";
import { Card } from "react-bootstrap";
import MaterialTable from "material-table";
import axios from "axios";
import { ThemeProvider } from "@material-ui/core";
import { createMuiTheme } from "@material-ui/core/styles";

export default class TerminationList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      terminatedEmployees: [],
    };
  }

  componentDidMount() {
    axios({
      method: 'get',
      url: '/api/terminated-employees', // API endpoint for terminated employees
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
      .then((res) => {
        this.setState({ terminatedEmployees: res.data });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    const theme = createMuiTheme({
      overrides: {
        MuiTableCell: {
          root: {
            padding: '6px 6px 6px 6px',
          },
        },
      },
    });

    return (
      <div className="container-fluid pt-4">
        <h4>Terminated Employees</h4>
        <div className="col-sm-12">
          <Card>
            <Card.Header style={{ backgroundColor: "#515e73", color: "white" }}>
              <strong>Termination List</strong>
            </Card.Header>
            <Card.Body>
              <ThemeProvider theme={theme}>
                <MaterialTable
                  columns={[
                    { title: 'EMP ID', field: 'id' },
                    { title: 'Full Name', field: 'fullName' },
                    { title: 'Department', field: 'department.departmentName' },
                    { title: 'Termination Date', field: 'terminationDate' },
                  ]}
                  data={this.state.terminatedEmployees}
                  options={{
                    rowStyle: (rowData, index) =>
                      index % 2 ? { backgroundColor: '#f2f2f2' } : {},
                    pageSize: 10,
                    pageSizeOptions: [10, 20, 30, 50, 100],
                  }}
                  title="Terminated Employees"
                />
              </ThemeProvider>
            </Card.Body>
          </Card>
        </div>
      </div>
    );
  }
}
