import React from "react";
import { Bar } from "react-chartjs-2";
import axios from "axios";

export default class ExpenseChartsPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      chartData: null,
      paymentYear: new Date().getFullYear(), // Default to current year
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

    axios({
      method: "get",
      url: `api/payments/year/${this.state.paymentYear}`,
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => {
        const data = this.transformData(res.data);
        const chartData = this.makeArrayStructure(data);
        this.setState({ chartData, isLoading: false });
      })
      .catch((err) => {
        this.setState({ 
          error: "Failed to load payment data", 
          isLoading: false 
        });
        console.error("API Error:", err);
      });
  };

  transformData = (data) => {
    return data.map((obj) => ({
      ...obj,
      expenses: parseInt(obj.expenses) || 0, // Fallback to 0 if parsing fails
    }));
  };

  makeArrayStructure = (data) => ({
    labels: data.map((d) => d.month),
    datasets: [
      {
        label: "Payments",
        data: data.map((d) => d.expenses),
        backgroundColor: "#007fad",
        borderColor: "#005f81",
        borderWidth: 1,
      },
    ],
  });

  generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 5 }, (_, i) => currentYear - i);
  };

  onChange = (event) => {
    this.setState({ paymentYear: event.target.value }, this.fetchData);
  };

  render() {
    const { chartData, paymentYear, isLoading, error } = this.state;

    return (
      <div className="card">
        <div className="mt-1" style={{ textAlign: "center" }}>
          <span className="ml-4">Select Year: </span>
          <select 
            onChange={this.onChange} 
            value={paymentYear}
            disabled={isLoading}
          >
            {this.generateYearOptions().map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <div style={{ position: "relative", height: "300px" }}>
          {isLoading && (
            <div className="text-center py-5">Loading payment data...</div>
          )}

          {error && (
            <div className="alert alert-danger m-3">{error}</div>
          )}

          {!isLoading && !error && chartData && (
            <Bar
              data={chartData}
              options={{
                maintainAspectRatio: false,
                responsive: true,
                plugins: {
                  legend: {
                    display: false,
                  },
                  tooltip: {
                    callbacks: {
                      label: (context) => 
                        `$${context.parsed.y.toLocaleString()}`,
                    },
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      stepSize: 2000,
                      callback: (value) => `$${value.toLocaleString()}`,
                    },
                  },
                },
              }}
            />
          )}
        </div>
      </div>
    );
  }
}
