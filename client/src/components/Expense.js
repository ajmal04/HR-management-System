import React, { Component } from "react";
import { Card, Button, Form, Alert } from "react-bootstrap";
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import DatePicker from 'react-datepicker';

export default class Expense extends Component {
    constructor(props) {
        super(props);

        this.state = {
            departments: [],
            selectedDepartment: null,
            itemName: "",
            purchasedFrom: "",
            purchaseDate: null,
            amountSpent: 0,
            hasError: false,
            errMsg: "",
            isLoading: false,
            completed: false
        }
    }

    componentDidMount() {
        this.setState({ isLoading: true });
        axios({
            method: 'get',
            url: '/api/departments',
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
            .then(res => {
                this.setState({ departments: res.data, isLoading: false });
            })
            .catch(err => {
                this.setState({
                    hasError: true,
                    errMsg: err.response?.data?.message || "Failed to load departments",
                    isLoading: false
                });
            });
    }

    pushDepartments = () => {
        return this.state.departments.map((dept) => (
            <option key={dept.id} value={dept.id}>{dept.departmentName}</option>
        ));
    }

    handleChange = (event) => {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });
    }

    onSubmit = (event) => {
        event.preventDefault();

        if (!this.state.purchaseDate) {
            this.setState({ hasError: true, errMsg: "Please select a purchase date" });
            return;
        }

        this.setState({ isLoading: true });

        let newExpense = {
            expenseItemName: this.state.itemName,
            expenseItemStore: this.state.purchasedFrom,
            date: new Date(this.state.purchaseDate).toISOString(),
            amount: parseFloat(this.state.amountSpent).toFixed(2),
            departmentId: this.state.selectedDepartment
        };

        axios({
            method: 'post',
            url: '/api/expenses/',
            data: newExpense,
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
            .then(res => {
                this.setState({
                    completed: true,
                    isLoading: false,
                    itemName: "",
                    purchasedFrom: "",
                    purchaseDate: null,
                    amountSpent: 0,
                    selectedDepartment: null
                });
            })
            .catch(err => {
                this.setState({
                    hasError: true,
                    errMsg: err.response?.data?.message || "Failed to add expense",
                    isLoading: false
                });
                window.scrollTo(0, 0);
            });
    }

    render() {
        if (this.state.completed) {
            return <Redirect to="/expense-report" />;
        }

        return (
            <div className="container-fluid pt-2">
                <div className="row">
                    {this.state.hasError && (
                        <Alert variant="danger" className="m-3">
                            {this.state.errMsg}
                        </Alert>
                    )}

                    <div className="col-sm-12">
                        <Card className="main-card">
                            <Card.Header>Add Expense</Card.Header>
                            <Card.Body>
                                <Form onSubmit={this.onSubmit}>
                                    <Form.Group>
                                        <Form.Label>Item Name: </Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={this.state.itemName}
                                            onChange={this.handleChange}
                                            name="itemName"
                                            required
                                            disabled={this.state.isLoading}
                                        />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>Purchased From: </Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={this.state.purchasedFrom}
                                            onChange={this.handleChange}
                                            name="purchasedFrom"
                                            required
                                            disabled={this.state.isLoading}
                                        />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>Purchase Date: </Form.Label>
                                        <Form.Row>
                                            <DatePicker
                                                className="form-control ml-1"
                                                placeholderText="Pick Date"
                                                selected={this.state.purchaseDate}
                                                onChange={newDate => this.setState({ purchaseDate: newDate })}
                                                required
                                                disabled={this.state.isLoading}
                                            />
                                        </Form.Row>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>Amount Spent: </Form.Label>
                                        <Form.Control
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={this.state.amountSpent}
                                            onChange={this.handleChange}
                                            name="amountSpent"
                                            required
                                            disabled={this.state.isLoading}
                                        />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>Select Department: </Form.Label>
                                        <Form.Control
                                            as="select"
                                            value={this.state.selectedDepartment || ""}
                                            onChange={this.handleChange}
                                            name="selectedDepartment"
                                            required
                                            disabled={this.state.isLoading}
                                        >
                                            <option value="">Choose one...</option>
                                            {this.pushDepartments()}
                                        </Form.Control>
                                    </Form.Group>
                                    <Button
                                        type="submit"
                                        className="mt-2"
                                        size="sm"
                                        disabled={this.state.isLoading}
                                    >
                                        {this.state.isLoading ? 'Saving...' : 'Save'}
                                    </Button>
                                </Form>
                            </Card.Body>
                        </Card>
                    </div>
                </div>
            </div>
        );
    }
}