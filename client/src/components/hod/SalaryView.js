import React, { Component } from "react";
import { Card, Row, Col, Form } from "react-bootstrap";
import { Redirect } from 'react-router-dom';
import axios from 'axios';

export default class SalaryView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      currentJobTitle: null,
      falseRedirect: false,
      loading: true,
      error: null
    };
    this._isMounted = false;
  }

  componentDidMount() {
    this._isMounted = true;
    if(this.props.location?.state?.selectedUser?.user?.id) {
      axios({
        method: 'get',
        url: 'api/users/' + this.props.location.state.selectedUser.user.id,
        headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}
      })
      .then(res => {
        if (this._isMounted) {
          this.setState({ 
            user: res.data, 
            loading: false 
          }, () => {
            if(this.state.user?.jobs) {
              const currentJob = this.state.user.jobs.find(job => 
                job && 
                new Date(job.startDate).setHours(0) < Date.now() && 
                new Date(job.endDate).setHours(24) > Date.now()
              );
              if (currentJob) {
                this.setState({ currentJobTitle: currentJob.jobTitle });
              }
            }
          });
        }
      })
      .catch(err => {
        if (this._isMounted) {
          console.error(err);
          this.setState({ 
            error: 'Failed to load employee data',
            loading: false 
          });
        }
      });
    } else {
      this.setState({ falseRedirect: true, loading: false });
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const { user, currentJobTitle, falseRedirect, loading, error } = this.state;
    const financialInfo = user?.user_financial_info || {};

    if (falseRedirect) return <Redirect to="/" />;
    if (loading) return <div className="container-fluid pt-3">Loading...</div>;
    if (error) return <div className="container-fluid pt-3">Error: {error}</div>;

    return (
      <div className="container-fluid pt-3">
        <Row>
          <Col sm={12}>
            <Card>
              <Card.Header style={{ backgroundColor: "#515e73", color: "white", fontSize: '17px' }}>
                Employee Salary Detail
              </Card.Header>
              <Card.Body>
                <Card.Title><strong>{user?.fullName || 'N/A'}</strong></Card.Title>
                <Card.Text>
                  <Col lg={12}>
                    <Row className="pt-4">
                      <Col lg={3}>
                        <img 
                          className="img-circle elevation-1 bp-2" 
                          src={window.location.origin + '/user-128.png'} 
                          alt="User"
                        />
                      </Col>
                      <Col className="pt-4" lg={9}>
                        <div className="emp-view-list">
                          <ul>
                            <li><span>Employee ID: </span> {user?.id || 'N/A'}</li>
                            <li><span>Department: </span> {user?.department?.departmentName || 'N/A'}</li>
                            <li><span>Job Title: </span> {currentJobTitle || 'N/A'}</li>
                            <li><span>Role: </span>
                              {user?.role === 'ROLE_ADMIN' ? 'Admin' : 
                               user?.role === 'ROLE_MANAGER' ? 'Manager' : 'Employee'}
                            </li>
                          </ul>
                        </div>
                      </Col>
                    </Row>
                    
                    {/* First Row - 2 boxes side by side */}
                    <Row className="pt-4">
                      {/* Salary Details Box */}
                      <Col sm={6}>
                        <Card className="secondary-card sal-view h-100">
                          <Card.Header>Salary Details</Card.Header>
                          <Card.Body>
                            <Card.Text>
                              <Form.Group as={Row}>
                                <Form.Label className="label">Employment Type:</Form.Label>
                                <span>{financialInfo.employmentType || 'N/A'}</span>
                              </Form.Group>
                              <Form.Group as={Row}>
                                <Form.Label className="label">Basic Salary:</Form.Label>
                                <span>€ {financialInfo.salaryBasic || 0}</span>
                              </Form.Group>
                            </Card.Text>
                          </Card.Body>
                        </Card>
                      </Col>
                      
                      {/* Allowances Box */}
                      <Col sm={6}>
                        <Card className="secondary-card sal-view h-100">
                          <Card.Header>Allowances</Card.Header>
                          <Card.Body>
                            <Card.Text>
                              <Form.Group as={Row}>
                                <Form.Label className="label">House Rent Allowance:</Form.Label>
                                <span>€ {financialInfo.allowanceHouseRent || 0}</span>
                              </Form.Group>
                              <Form.Group as={Row}>
                                <Form.Label className="label">Medical Allowance:</Form.Label>
                                <span>€ {financialInfo.allowanceMedical || 0}</span>
                              </Form.Group>
                              <Form.Group as={Row}>
                                <Form.Label className="label">Special Allowance:</Form.Label>
                                <span>€ {financialInfo.allowanceSpecial || 0}</span>
                              </Form.Group>
                              <Form.Group as={Row}>
                                <Form.Label className="label">Fuel Allowance:</Form.Label>
                                <span>€ {financialInfo.allowanceFuel || 0}</span>
                              </Form.Group>
                              <Form.Group as={Row}>
                                <Form.Label className="label">Phone Bill Allowance:</Form.Label>
                                <span>€ {financialInfo.allowancePhoneBill || 0}</span>
                              </Form.Group>
                              <Form.Group as={Row}>
                                <Form.Label className="label">Other Allowance:</Form.Label>
                                <span>€ {financialInfo.allowanceOther || 0}</span>
                              </Form.Group>
                              <Form.Group as={Row}>
                                <Form.Label className="label">Total Allowance:</Form.Label>
                                <span>€ {financialInfo.allowanceTotal || 0}</span>
                              </Form.Group>
                            </Card.Text>
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>
                    
                    {/* Second Row - 2 boxes side by side */}
                    <Row className="pt-4">
                      {/* Deductions Box */}
                      <Col sm={6}>
                        <Card className="secondary-card h-100">
                          <Card.Header>Deductions</Card.Header>
                          <Card.Body>
                            <Card.Text>
                              <Form.Group as={Row}>
                                <Form.Label className="label">Tax Deduction:</Form.Label>
                                <span>€ {financialInfo.deductionTax || 0}</span>
                              </Form.Group>
                              <Form.Group as={Row}>
                                <Form.Label className="label">Other Deduction:</Form.Label>
                                <span>€ {financialInfo.deductionOther || 0}</span>
                              </Form.Group>
                              <Form.Group as={Row}>
                                <Form.Label className="label">Total Deduction:</Form.Label>
                                <span>€ {financialInfo.deductionTotal || 0}</span>
                              </Form.Group>
                            </Card.Text>
                          </Card.Body>
                        </Card>
                      </Col>
                      
                      {/* Total Salary Box */}
                      <Col sm={6}>
                        <Card className="secondary-card h-100">
                          <Card.Header>Total Salary Details</Card.Header>
                          <Card.Body>
                            <Card.Text>
                              <Form.Group as={Row}>
                                <Form.Label className="label">Gross Salary:</Form.Label>
                                <span>€ {financialInfo.salaryGross || 0}</span>
                              </Form.Group>
                              <Form.Group as={Row}>
                                <Form.Label className="label">Total Deduction:</Form.Label>
                                <span>€ {financialInfo.deductionTotal || 0}</span>
                              </Form.Group>
                              <Form.Group as={Row}>
                                <Form.Label className="label">Net Salary:</Form.Label>
                                <span>€ {financialInfo.salaryNet || 0}</span>
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
      </div>
    );
  }
}