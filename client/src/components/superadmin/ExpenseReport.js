import React, { Component } from "react";
import { Card, Button, Alert, Spinner, Overlay } from "react-bootstrap";
import MaterialTable from 'material-table';
import DatePicker from 'react-datepicker';
import axios from 'axios';
import moment from 'moment';
import { ThemeProvider } from '@material-ui/core';
import { createMuiTheme } from '@material-ui/core/styles';

export default class ExpenseReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expenses: [],
      selectedDate: new Date(),
      isLoading: false,
      hasError: false,
      errorMsg: '',
      totalAmount: 0,
      showDatePicker: false
    };
    this.datePickerRef = React.createRef();
    this.datePickerButtonRef = React.createRef();
  }

  componentDidMount() {
    this.fetchExpenses();
  }

  fetchExpenses = () => {
    if (!this.state.selectedDate) return;
    
    this.setState({ isLoading: true, hasError: false });
    
    const year = this.state.selectedDate.getFullYear();
    const month = this.state.selectedDate.getMonth() + 1;
    
    axios({
      method: 'get',
      url: `/api/expenses/monthly?year=${year}&month=${month}`,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    .then(res => {
      this.setState({
        expenses: res.data.expenses,
        totalAmount: res.data.totalAmount,
        isLoading: false
      });
    })
    .catch(err => {
      this.setState({
        hasError: true,
        errorMsg: err.response?.data?.message || 'Failed to load expenses',
        isLoading: false
      });
    });
  };

  handleDateChange = (newDate) => {
    this.setState({ 
      selectedDate: newDate,
      showDatePicker: false
    }, () => {
      this.fetchExpenses();
    });
  };

  toggleDatePicker = () => {
    this.setState(prev => ({ showDatePicker: !prev.showDatePicker }));
  };

  render() {
    const theme = createMuiTheme({
      overrides: {
        MuiTableCell: {
          root: {
            padding: '6px 6px 6px 6px'
          }
        }
      }
    });

    return (
      <div className="container-fluid pt-4">
        {this.state.hasError && (
          <Alert variant="danger" onClose={() => this.setState({ hasError: false })} dismissible>
            {this.state.errorMsg}
          </Alert>
        )}

        <Card>
          <Card.Header style={{ 
            backgroundColor: "#515e73", 
            color: "white",
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'relative'
          }}>
            <div className="panel-title">
              <strong>Expense Report</strong>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Button 
                variant="light" 
                size="sm"
                ref={this.datePickerButtonRef}
                onClick={this.toggleDatePicker}
                style={{ marginRight: '10px' }}
              >
                {moment(this.state.selectedDate).format('MMMM YYYY')}
                <i className="fa fa-calendar ml-2"></i>
              </Button>
              
              <Button 
                variant="light" 
                size="sm"
                href="/expense"
              >
                <i className="fa fa-plus mr-2"></i>
                Add Expense
              </Button>
            </div>

            <Overlay
              show={this.state.showDatePicker}
              target={this.datePickerButtonRef.current}
              placement="bottom-end"
              container={this.datePickerButtonRef.current}
              containerPadding={20}
              rootClose
              onHide={() => this.setState({ showDatePicker: false })}
            >
              {({ placement, arrowProps, show: _show, popper, ...props }) => (
                <div
                  {...props}
                  style={{
                    ...props.style,
                    backgroundColor: 'white',
                    padding: '10px',
                    borderRadius: '4px',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                    zIndex: 1000
                  }}
                >
                  <DatePicker
                    selected={this.state.selectedDate}
                    onChange={this.handleDateChange}
                    showMonthYearPicker
                    inline
                    dateFormat="MMMM yyyy"
                    maxDate={new Date()}
                  />
                </div>
              )}
            </Overlay>
          </Card.Header>
          
          <Card.Body>
            {this.state.isLoading ? (
              <div className="text-center">
                <Spinner animation="border" role="status">
                  <span className="sr-only">Loading...</span>
                </Spinner>
              </div>
            ) : this.state.expenses.length === 0 ? (
              <Alert variant="info">
                No expenses found for {moment(this.state.selectedDate).format('MMMM YYYY')}
              </Alert>
            ) : (
              <ThemeProvider theme={theme}>
                <MaterialTable
                  columns={[
                    { 
                      title: '#', 
                      render: rowData => rowData.tableData.id + 1,
                      width: 50
                    },
                    { title: 'Item Name', field: 'expenseItemName' },
                    { title: 'Purchased From', field: 'expenseItemStore' },
                    {
                      title: 'Purchase Date',
                      render: rowData => moment(rowData.date).format('DD MMM, YYYY')
                    },
                    { title: 'Department', field: 'department.departmentName' },
                    {
                      title: 'Amount',
                      render: rowData => `$${parseFloat(rowData.amount).toFixed(2)}`,
                      customFooter: () => (
                        <div>
                          <strong>Total: ${this.state.totalAmount.toFixed(2)}</strong>
                        </div>
                      )
                    }
                  ]}
                  data={this.state.expenses}
                  options={{
                    rowStyle: (rowData, index) => ({
                      backgroundColor: index % 2 ? '#f2f2f2' : 'white'
                    }),
                    pageSize: 10,
                    pageSizeOptions: [10, 20, 30, 50, 75, 100],
                    headerStyle: {
                      backgroundColor: '#515e73',
                      color: '#FFF'
                    },
                    search: true,
                    filtering: false,
                    toolbar: false
                  }}
                />
              </ThemeProvider>
            )}
          </Card.Body>
        </Card>
      </div>
    );
  }
}