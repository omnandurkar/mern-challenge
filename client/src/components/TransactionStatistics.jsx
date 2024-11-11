import { useEffect, useState } from 'react';
import axios from 'axios';

const TransactionStatistics = ({ selectedMonth }) => {
  const [statistics, setStatistics] = useState(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        const response = await axios.get(`${apiUrl}/statistics?month=${selectedMonth}`);
        setStatistics(response.data);
      } catch (error) {
        console.error('Error fetching statistics:', error);
      }
    };

    fetchStatistics();
  }, [selectedMonth]);

  if (!statistics) return <div>Loading statistics...</div>;

 
  const formattedMonth = String(selectedMonth).padStart(2, '0'); 

  return (
    <div>
      <h2>Statistics for Month {formattedMonth}</h2>
      <div>Total Sale Amount: ${statistics.totalSaleAmount}</div>
      <div>Total Sold Items: {statistics.totalSoldItems}</div>
      <div>Total Not Sold Items: {statistics.totalNotSoldItems}</div>
    </div>
  );
};

export default TransactionStatistics;
