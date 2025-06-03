import React, { Component } from "react";
import { Card, Row, Col, Form, Button } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default class SalaryViewEmployee extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: null,
      currentJobTitle: null,
      payslipDate: moment().format("MMMM YYYY"),
    };
  }

  componentDidMount() {
    let id = JSON.parse(localStorage.getItem("user")).id;
    axios({
      method: "get",
      url: "api/users/" + id,
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => {
        console.log(res);
        this.setState({ user: res.data }, () => {
          if (this.state.user.jobs) {
            this.state.user.jobs.map((job) => {
              if (
                new Date(job.startDate).setHours(0) < new Date() &&
                new Date(job.endDate).setHours(24) > new Date()
              ) {
                this.setState({ currentJobTitle: job.jobTitle });
              }
            });
          }
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  downloadPayslip = () => {
    const input = document.getElementById("payslip");
    const payslipDate = this.state.payslipDate.replace(" ", "_");
    const fileName = `Payslip_${this.state.user.fullName.replace(
      " ",
      "_"
    )}_${payslipDate}.pdf`;

    html2canvas(input, {
      scale: 2,
      logging: true,
      useCORS: true,
    }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(fileName);
    });
  };

  render() {
    console.log("Info", this.state.user);

    return (
      <div className="container-fluid pt-3">
        {this.state.user ? (
          <>
            <Row>
              <Col sm={12}>
                <Card>
                  <Card.Header
                    style={{
                      backgroundColor: "#515e73",
                      color: "white",
                      fontSize: "17px",
                    }}
                  >
                    Employee Salary Detail
                  </Card.Header>
                  <Card.Body>
                    <Card.Title>
                      <strong>{this.state.user.fullName}</strong>
                    </Card.Title>
                    <Card.Text>
                      <Col lg={12}>
                        <Row className="pt-4">
                          <Col lg={3}>
                            <img
                              className="img-circle elevation-1 bp-2"
                              src={process.env.PUBLIC_URL + "/user-128.png"}
                            ></img>
                          </Col>
                          <Col className="pt-4" lg={9}>
                            <div className="emp-view-list">
                              <ul>
                                <li>
                                  <span>Employee ID: </span>{" "}
                                  {this.state.user.id}
                                </li>
                                <li>
                                  <span>Department: </span>{" "}
                                  {this.state.user.department.departmentName}
                                </li>
                                <li>
                                  <span>Job Position: </span>{" "}
                                  {this.state.user.jobPosition}
                                </li>
                                <li>
                                  <span>Role: </span>
                                  {this.state.user.role === "ROLE_ADMIN"
                                    ? "Admin"
                                    : this.state.user.role === "ROLE_MANAGER"
                                    ? "Manager"
                                    : "Employee"}
                                </li>
                              </ul>
                            </div>
                          </Col>
                        </Row>
                        <Row className="pt-4">
                          <Col sm={6}>
                            <Card className="secondary-card sal-view">
                              <Card.Header>Salary Details</Card.Header>
                              <Card.Body>
                                <Card.Text id="sal-view-details">
                                  <Form.Group as={Row}>
                                    <Form.Label className="label">
                                      Employment Type:
                                    </Form.Label>
                                    <span>
                                      {
                                        this.state.user.user_financial_info
                                          .employmentType
                                      }
                                    </span>
                                  </Form.Group>
                                  <Form.Group as={Row}>
                                    <Form.Label className="label">
                                      Basic Salary:
                                    </Form.Label>
                                    <span>
                                      €{" "}
                                      {
                                        this.state.user.user_financial_info
                                          .salaryBasic
                                      }
                                    </span>
                                  </Form.Group>
                                </Card.Text>
                              </Card.Body>
                            </Card>
                          </Col>
                          <Col sm={6}>
                            <Card className="secondary-card sal-view">
                              <Card.Header>Allowances</Card.Header>
                              <Card.Body>
                                <Card.Text id="sal-view-allowances">
                                  <Form.Group as={Row}>
                                    <Form.Label className="label">
                                      House Rent Allowance:
                                    </Form.Label>
                                    <span>
                                      €{" "}
                                      {
                                        this.state.user.user_financial_info
                                          .allowanceHouseRent
                                      }
                                    </span>
                                  </Form.Group>
                                  <Form.Group as={Row}>
                                    <Form.Label className="label">
                                      Medical Allowance:
                                    </Form.Label>
                                    <span>
                                      €{" "}
                                      {
                                        this.state.user.user_financial_info
                                          .allowanceMedical
                                      }
                                    </span>
                                  </Form.Group>
                                  <Form.Group as={Row}>
                                    <Form.Label className="label">
                                      Special Allowance:
                                    </Form.Label>
                                    <span>
                                      €{" "}
                                      {
                                        this.state.user.user_financial_info
                                          .allowanceSpecial
                                      }
                                    </span>
                                  </Form.Group>
                                  <Form.Group as={Row}>
                                    <Form.Label className="label">
                                      Fuel Allowance:
                                    </Form.Label>
                                    <span>
                                      €{" "}
                                      {
                                        this.state.user.user_financial_info
                                          .allowanceFuel
                                      }
                                    </span>
                                  </Form.Group>
                                  <Form.Group as={Row}>
                                    <Form.Label className="label">
                                      Phone Bill Allowance:
                                    </Form.Label>
                                    <span>
                                      €{" "}
                                      {
                                        this.state.user.user_financial_info
                                          .allowancePhoneBill
                                      }
                                    </span>
                                  </Form.Group>
                                  <Form.Group as={Row}>
                                    <Form.Label className="label">
                                      Other Allowance:
                                    </Form.Label>
                                    <span>
                                      €{" "}
                                      {
                                        this.state.user.user_financial_info
                                          .allowanceOther
                                      }
                                    </span>
                                  </Form.Group>
                                  <Form.Group as={Row}>
                                    <Form.Label className="label">
                                      Total Allowance:
                                    </Form.Label>
                                    <span>
                                      €{" "}
                                      {
                                        this.state.user.user_financial_info
                                          .allowanceTotal
                                      }
                                    </span>
                                  </Form.Group>
                                </Card.Text>
                              </Card.Body>
                            </Card>
                          </Col>
                        </Row>
                        <Row>
                          <Col cm={6}>
                            <Card className="secondary-card">
                              <Card.Header>Deductions</Card.Header>
                              <Card.Body>
                                <Card.Text id="sal-view-deductions">
                                  <Form.Group as={Row}>
                                    <Form.Label className="label">
                                      Tax Deduction:
                                    </Form.Label>
                                    <span>
                                      €{" "}
                                      {
                                        this.state.user.user_financial_info
                                          .deductionTax
                                      }
                                    </span>
                                  </Form.Group>
                                  <Form.Group as={Row}>
                                    <Form.Label className="label">
                                      Other Deduction:
                                    </Form.Label>
                                    <span>
                                      €{" "}
                                      {
                                        this.state.user.user_financial_info
                                          .deductionOther
                                      }
                                    </span>
                                  </Form.Group>
                                  <Form.Group as={Row}>
                                    <Form.Label className="label">
                                      Total Deduction:
                                    </Form.Label>
                                    <span>
                                      €{" "}
                                      {
                                        this.state.user.user_financial_info
                                          .deductionTotal
                                      }
                                    </span>
                                  </Form.Group>
                                </Card.Text>
                              </Card.Body>
                            </Card>
                          </Col>
                          <Col sm={6}>
                            <Card className="secondary-card">
                              <Card.Header>Total Salary Details</Card.Header>
                              <Card.Body>
                                <Card.Text id="sal-view-total">
                                  <Form.Group as={Row}>
                                    <Form.Label className="label">
                                      Gross Salary:
                                    </Form.Label>
                                    <span>
                                      €{" "}
                                      {
                                        this.state.user.user_financial_info
                                          .salaryGross
                                      }
                                    </span>
                                  </Form.Group>
                                  <Form.Group as={Row}>
                                    <Form.Label className="label">
                                      Total Deduction:
                                    </Form.Label>
                                    <span>
                                      €{" "}
                                      {
                                        this.state.user.user_financial_info
                                          .deductionTotal
                                      }
                                    </span>
                                  </Form.Group>
                                  <Form.Group as={Row}>
                                    <Form.Label className="label">
                                      Net Salary:
                                    </Form.Label>
                                    <span>
                                      €{" "}
                                      {
                                        this.state.user.user_financial_info
                                          .salaryNet
                                      }
                                    </span>
                                  </Form.Group>
                                </Card.Text>
                              </Card.Body>
                            </Card>
                          </Col>
                        </Row>
                      </Col>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Payslip Section */}
            <Row className="mt-4">
              <Col sm={12}>
                <Card>
                  <Card.Header
                    style={{
                      backgroundColor: "#515e73",
                      color: "white",
                      fontSize: "17px",
                    }}
                  >
                    Payslip Generator
                  </Card.Header>
                  <Card.Body>
                    <div className="d-flex justify-content-between mb-4">
                      <Button variant="primary" onClick={this.downloadPayslip}>
                        Download Payslip PDF
                      </Button>
                    </div>

                    <Row>
                      <Col md={12}>
                        {/* Payslip HTML - in half-width container */}
                        <div
                          id="payslip"
                          className="payslip-container w-50 mx-auto hidden"
                        >
                          <div className="payslip-header">
                            <h2>COMPANY NAME</h2>
                            <h3>PAYSLIP FOR {this.state.payslipDate}</h3>
                          </div>

                          <div className="payslip-employee-details">
                            <div className="row">
                              <div className="col">
                                <p>
                                  <strong>Employee Name:</strong>{" "}
                                  {this.state.user.fullName}
                                </p>
                                <p>
                                  <strong>Employee ID:</strong>{" "}
                                  {this.state.user.id}
                                </p>
                                <p>
                                  <strong>Department:</strong>{" "}
                                  {this.state.user.department.departmentName}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="payslip-salary-details">
                            <div className="row">
                              <div className="col">
                                <h4>Earnings</h4>
                                <table className="table table-bordered">
                                  <tbody>
                                    <tr>
                                      <td>Basic Salary</td>
                                      <td className="text-right">
                                        €
                                        {this.state.user.user_financial_info.salaryBasic.toLocaleString()}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>House Rent Allowance</td>
                                      <td className="text-right">
                                        €
                                        {this.state.user.user_financial_info.allowanceHouseRent.toLocaleString()}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>Medical Allowance</td>
                                      <td className="text-right">
                                        €
                                        {this.state.user.user_financial_info.allowanceMedical.toLocaleString()}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>Special Allowance</td>
                                      <td className="text-right">
                                        €
                                        {this.state.user.user_financial_info.allowanceSpecial.toLocaleString()}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>Fuel Allowance</td>
                                      <td className="text-right">
                                        €
                                        {this.state.user.user_financial_info.allowanceFuel.toLocaleString()}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>Phone Bill Allowance</td>
                                      <td className="text-right">
                                        €
                                        {this.state.user.user_financial_info.allowancePhoneBill.toLocaleString()}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>Other Allowance</td>
                                      <td className="text-right">
                                        €
                                        {this.state.user.user_financial_info.allowanceOther.toLocaleString()}
                                      </td>
                                    </tr>
                                    <tr className="total-row">
                                      <td>
                                        <strong>Total Earnings</strong>
                                      </td>
                                      <td className="text-right">
                                        <strong>
                                          €
                                          {this.state.user.user_financial_info.salaryGross.toLocaleString()}
                                        </strong>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col">
                                <h4>Deductions</h4>
                                <table className="table table-bordered">
                                  <tbody>
                                    <tr>
                                      <td>Tax Deduction</td>
                                      <td className="text-right">
                                        €
                                        {this.state.user.user_financial_info.deductionTax.toLocaleString()}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>Other Deduction</td>
                                      <td className="text-right">
                                        €
                                        {(
                                          this.state.user.user_financial_info
                                            .deductionOther || 0
                                        ).toLocaleString()}
                                      </td>
                                    </tr>
                                    <tr className="total-row">
                                      <td>
                                        <strong>Total Deductions</strong>
                                      </td>
                                      <td className="text-right">
                                        <strong>
                                          €
                                          {this.state.user.user_financial_info.deductionTotal.toLocaleString()}
                                        </strong>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>

                          <div className="payslip-summary">
                            <div className="row">
                              <div className="col">
                                <table className="table table-bordered">
                                  <tbody>
                                    <tr>
                                      <td>
                                        <strong>Gross Salary</strong>
                                      </td>
                                      <td className="text-right">
                                        <strong>
                                          €
                                          {this.state.user.user_financial_info.salaryGross.toLocaleString()}
                                        </strong>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>
                                        <strong>Total Deductions</strong>
                                      </td>
                                      <td className="text-right">
                                        <strong>
                                          €
                                          {this.state.user.user_financial_info.deductionTotal.toLocaleString()}
                                        </strong>
                                      </td>
                                    </tr>
                                    <tr className="net-salary">
                                      <td>
                                        <strong>Net Salary</strong>
                                      </td>
                                      <td className="text-right">
                                        <strong>
                                          €
                                          {this.state.user.user_financial_info.salaryNet.toLocaleString()}
                                        </strong>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>

                          <div className="payslip-footer">
                            <p>
                              <strong>Bank Details:</strong>{" "}
                              {this.state.user.user_financial_info.bankName ||
                                "N/A"}
                              ,{" "}
                              {this.state.user.user_financial_info
                                .accountName || "N/A"}
                              ,{" "}
                              {this.state.user.user_financial_info
                                .accountNumber || "N/A"}
                            </p>
                            <p className="text-center">
                              This is a computer generated payslip and does not
                              require a signature.
                            </p>
                          </div>
                        </div>
                      </Col>
                    </Row>

                    {/* Add some CSS for the payslip */}
                    <style>
                      {`
                      // .hidden {
                      //     display: none !important;
                      //   }
                        .payslip-container {
                          background-color: white;
                          padding: 20px;
                          border: 1px solid #ddd;
                          font-family: Arial, sans-serif;
                          width: 100%;
                          margin: 0 auto;
                        }
                        .payslip-header {
                          text-align: center;
                          margin-bottom: 30px;
                          border-bottom: 2px solid #333;
                          padding-bottom: 10px;
                        }
                        .payslip-header h2 {
                          color: #333;
                          margin-bottom: 5px;
                          font-size: 1.5rem;
                        }
                        .payslip-header h3 {
                          color: #555;
                          font-size: 1.2rem;
                        }
                        .payslip-employee-details {
                          margin-bottom: 20px;
                        }
                        .payslip-salary-details {
                          margin-bottom: 30px;
                        }
                        .payslip-salary-details h4 {
                          background-color: #f5f5f5;
                          padding: 8px;
                          margin-bottom: 15px;
                          font-size: 1.1rem;
                        }
                        .table {
                          width: 100%;
                          margin-bottom: 20px;
                        }
                        .table th, .table td {
                          padding: 8px;
                          vertical-align: top;
                          border-top: 1px solid #dee2e6;
                          font-size: 0.9rem;
                        }
                        .total-row {
                          background-color: #f9f9f9;
                        }
                        .net-salary {
                          background-color: #e9ecef;
                        }
                        .payslip-footer {
                          margin-top: 30px;
                          font-size: 0.8em;
                          color: #666;
                        }
                      `}
                    </style>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </>
        ) : null}
      </div>
    );
  }
}
