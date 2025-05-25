import * as React from "react";
import { Bar } from "react-chartjs-2";
import axios from "axios";

export default class ExpenseChartsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chartData: null,
      expenseYear: new Date().getFullYear(),
      isLoading: false,
      error: null,
    };
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = () => {
    this.setState({ isLoading: true, error: null });
    let deptId = JSON.parse(localStorage.getItem("user")).departmentId;
    axios({
      method: "get",
      url: "api/expenses/year/" + this.state.expenseYear + "/department/" + deptId,
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => {
        const transformedData = this.transformData(res.data);
        const chartData = this.makeArrayStructure(transformedData);
        this.setState({ chartData, isLoading: false });
      })
      .catch((err) => {
        this.setState({ 
          error: "Failed to load college expense data", 
          isLoading: false 
        });
        console.error("API Error:", err);
      });
  };

  transformData = (data) => {
    // Sort data by month to ensure proper ordering
    const monthOrder = ["January", "February", "March", "April", "May", "June",
                      "July", "August", "September", "October", "November", "December"];
    
    return data
      .map((obj) => ({
        ...obj,
        expenses: parseInt(obj.expenses),
        monthOrder: monthOrder.indexOf(obj.month)
      }))
      .sort((a, b) => a.monthOrder - b.monthOrder);
  };

  makeArrayStructure = (data) => ({
    labels: data.map((d) => d.month),
    datasets: [
      {
        data: data.map((d) => d.expenses),
        backgroundColor: "#007fad",
      },
    ],
  });

  onChange = (event) => {
    this.setState({ expenseYear: event.target.value }, this.fetchData);
  };

  generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 5 }, (_, i) => currentYear - i);
  };

  render() {
    const { chartData, expenseYear, isLoading, error } = this.state;

    if (isLoading) return <div>Loading college expenses...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!chartData) return null;

    return (
      <div className="card">
        <div className="mt-1" style={{ textAlign: "center" }}>
          <span className="ml-4">Select Year: </span>
          <select onChange={this.onChange} value={expenseYear}>
            {this.generateYearOptions().map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Bar
            data={chartData}
            height={300}
            options={{
              maintainAspectRatio: false,
              legend: { display: false },
              scales: {
                yAxes: [{ 
                  ticks: { 
                    min: 0, 
                    stepSize: 300,
                    callback: function(value) {
                      return '₹' + value.toLocaleString();
                    }
                  } 
                }],
              },
              tooltips: {
                callbacks: {
                  label: function(tooltipItem) {
                    return '₹' + tooltipItem.yLabel.toLocaleString();
                  }
                }
              }
            }}
          />
        </div>
      </div>
    );
  }
}