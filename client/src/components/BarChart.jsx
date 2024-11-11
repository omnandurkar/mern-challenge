import { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = ({ selectedMonth }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchBarChartData = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        const response = await axios.get(`${apiUrl}/barchart?month=${selectedMonth}`);
        setChartData(response.data);
      } catch (error) {
        console.error('Error fetching bar chart data:', error);
      }
    };

    fetchBarChartData();
  }, [selectedMonth]);

  if (chartData.length === 0) return <div>Loading chart...</div>;

  const chartLabels = chartData.map(data => data.range);
  const chartValues = chartData.map(data => data.count);

  
  const formattedMonth = String(selectedMonth).padStart(2, '0'); 

  const data = {
    labels: chartLabels,
    datasets: [
      {
        label: 'Items Sold in Price Range',
        data: chartValues,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: `Price Range Distribution for Month ${formattedMonth}`,
      },
    },
  };

  return (
    <div>
      <h1>Bar Chart for Price Range</h1>
      <Bar data={data} options={options} />
    </div>
  );
};

export default BarChart;
