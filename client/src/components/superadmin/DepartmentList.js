import React, { Component } from "react";
import { Card, Button, Form, Alert, Spinner } from "react-bootstrap";
import { Redirect, NavLink } from "react-router-dom";
import PropTypes from "prop-types";
import AddDepartment from "../DepartmentAdd";
import DepartmentEdit from "../DepartmentEdit";
import axios from "axios";
import MaterialTable from "material-table";
import { ThemeProvider } from "@material-ui/core";
import { createMuiTheme } from "@material-ui/core/styles";
import AlertModal from "../AlertModal";
import DeleteConfirmationModal from "../DeleteConfirmationModal";

export default class DepartmentList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      departments: [],
      selectedDepartment: null,
      hasError: false,
      errorMsg: "",
      isLoading: true,
      isDeleting: false,
      completed: false,
      showEditModal: false,
      showAlertModal: false,
      showDeleteModal: false,
      successMsg: "",
    };
  }

  componentDidMount() {
    this.fetchDepartments();
  }

  fetchDepartments = () => {
    this.setState({ isLoading: true });
    axios({
      method: "get",
      url: "/api/departments",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => {
        this.setState({
          departments: res.data,
          isLoading: false,
          hasError: false,
        });
      })
      .catch((err) => {
        this.setState({
          hasError: true,
          errorMsg: err.response?.data?.message || "Failed to load departments",
          isLoading: false,
        });
      });
  };

  onEdit = (department) => (event) => {
    event.preventDefault();
    this.setState({
      selectedDepartment: department,
      showEditModal: true,
    });
  };

  onDelete = (department) => (event) => {
    event.preventDefault();
    this.setState({
      selectedDepartment: department,
      showDeleteModal: true,
    });
  };

  handleConfirmDelete = () => {
    const { selectedDepartment } = this.state;

    if (selectedDepartment.users && selectedDepartment.users.length > 0) {
      this.setState({
        showDeleteModal: false,
        showAlertModal: true,
      });
      return;
    }

    this.setState({ isDeleting: true });

    axios({
      method: "delete",
      url: "/api/departments/" + selectedDepartment.id,
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then(() => {
        this.setState({
          showDeleteModal: false,
          successMsg: "Department deleted successfully!",
          isDeleting: false,
        });
        this.fetchDepartments();
      })
      .catch((err) => {
        this.setState({
          hasError: true,
          errorMsg:
            err.response?.data?.message || "Failed to delete department",
          isDeleting: false,
          showDeleteModal: false,
        });
      });
  };

  render() {
    const {
      departments,
      isLoading,
      hasError,
      errorMsg,
      completed,
      showEditModal,
      showAlertModal,
      showDeleteModal,
      selectedDepartment,
      successMsg,
      isDeleting,
    } = this.state;

    const theme = createMuiTheme({
      overrides: {
        MuiTableCell: {
          root: {
            padding: "6px 6px 6px 6px",
          },
        },
      },
    });

    if (isLoading) {
      return (
        <div className="text-center mt-5">
          <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
          <p>Loading departments...</p>
        </div>
      );
    }

    return (
      <div className="container-fluid pt-2">
        <div className="row">
          <div className="col-sm-12">
            <AddDepartment onDepartmentAdded={this.fetchDepartments} />
          </div>
        </div>

        {hasError && (
          <Alert variant="danger" className="m-3">
            {errorMsg}
          </Alert>
        )}

        {successMsg && (
          <Alert variant="success" className="m-3">
            {successMsg}
          </Alert>
        )}

        <div className="row">
          <div className="col-sm-12">
            <Card className="main-card">
              <Card.Header>
                <div className="panel-title">
                  <strong>Department List</strong>
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
                      {
                        title: "Department Name",
                        field: "departmentName",
                        width: 200,
                      },
                      {
                        title: "College",
                        field: "college",
                        width: 200,
                      },
                      // {
                      //     title: 'Jobs',
                      //     width: 150,
                      //     render: dept => (
                      //         <NavLink
                      //             to={{
                      //                 pathname: '/job-list',
                      //                 state: { selectedDepartment: dept.id }
                      //             }}
                      //         >
                      //             Go to Job List
                      //         </NavLink>
                      //     )
                      // },
                      {
                        title: "Action",
                        width: 300,
                        render: (rowData) => (
                          <Form className="row">
                            <div className="col pl-5">
                              <Button
                                size="sm"
                                variant="info"
                                onClick={this.onEdit(rowData)}
                              >
                                <i className="fas fa-edit"></i> Edit
                              </Button>
                            </div>
                            <div className="col pr-5">
                              <Button
                                onClick={this.onDelete(rowData)}
                                size="sm"
                                variant="danger"
                              >
                                <i className="fas fa-trash"></i> Delete
                              </Button>
                            </div>
                          </Form>
                        ),
                      },
                    ]}
                    data={departments}
                    options={{
                      rowStyle: (rowData, index) => ({
                        backgroundColor: index % 2 ? "#f2f2f2" : "white",
                      }),
                      pageSize: 8,
                      pageSizeOptions: [5, 10, 20, 30, 50, 75, 100],
                      emptyRowsWhenPaging: false,
                      padding: "dense",
                      headerStyle: {
                        backgroundColor: "#f8f9fa",
                        fontWeight: "bold",
                      },
                    }}
                    localization={{
                      body: {
                        emptyDataSourceMessage: "No departments to display",
                      },
                    }}
                    title="Departments"
                  />
                </ThemeProvider>
              </Card.Body>
            </Card>

            {showEditModal && (
              <DepartmentEdit
                show={true}
                onHide={() => this.setState({ showEditModal: false })}
                data={selectedDepartment}
                onDepartmentUpdated={this.fetchDepartments}
              />
            )}

            {showAlertModal && (
              <AlertModal
                show={true}
                onHide={() => this.setState({ showAlertModal: false })}
                message="Cannot delete department with assigned users"
              />
            )}

            {showDeleteModal && (
              <DeleteConfirmationModal
                show={true}
                onHide={() => this.setState({ showDeleteModal: false })}
                onConfirm={this.handleConfirmDelete}
                isProcessing={isDeleting}
                itemName={
                  selectedDepartment?.departmentName || "this department"
                }
              />
            )}
          </div>
        </div>

        {completed && <Redirect to="/departments" />}
      </div>
    );
  }
}

DepartmentList.propTypes = {
  history: PropTypes.object.isRequired,
};
