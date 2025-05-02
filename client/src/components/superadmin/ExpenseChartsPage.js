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
    axios({
      method: "get",
      url: `api/expenses/year/${this.state.expenseYear}`,
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => {
        const transformedData = this.transformData(res.data);
        const chartData = this.makeArrayStructure(transformedData);
        this.setState({ chartData, isLoading: false });
      })
      .catch((err) => {
        this.setState({ error: "Failed to load data", isLoading: false });
        console.error("API Error:", err);
      });
  };

  transformData = (data) => {
    return data.map((obj) => ({
      ...obj,
      expenses: parseInt(obj.expenses),
    }));
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

    if (isLoading) return <div>Loading...</div>;
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
                yAxes: [{ ticks: { min: 0, stepSize: 300 } }],
              },
            }}
          />
        </div>
      </div>
    );
  }
}
