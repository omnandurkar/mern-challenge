import { useEffect, useState } from 'react';
import axios from 'axios';

const TransactionsTable = ({ selectedMonth }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);  
  const [error, setError] = useState(null);  

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);  
        setError(null);    

        const apiUrl = import.meta.env.VITE_API_URL;
        const response = await axios.get(
          `${apiUrl}/transactions?month=${selectedMonth}&page=1&perPage=10`
        );

        console.log("API Response:", response.data);  

       
        if (response.data && Array.isArray(response.data)) {
          setTransactions(response.data);
        } else {
          setError("No transactions found.");
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
        setError("Failed to fetch transactions.");
      } finally {
        setLoading(false);  
      }
    };

    fetchTransactions();
  }, [selectedMonth]);

  if (loading) return <div>Loading transactions...</div>; 
  if (error) return <div>{error}</div>;  

  return (
    <div>
      <h2>Transactions for Month {String(selectedMonth).padStart(2, '0')}</h2>
      {transactions.length === 0 ? (
        <p>No transactions available for this month.</p>
      ) : (
        <ul>
          {transactions.map((transaction) => (
            <li key={transaction.id}>
              {transaction.title} - ${transaction.price} - {transaction.sold ? 'Sold' : 'Not Sold'}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TransactionsTable;
