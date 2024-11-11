import React, { useState } from 'react';
import MonthSelector from './components/MonthSelector';
import TransactionsTable from './components/TransactionsTable';
import TransactionStatistics from './components/TransactionStatistics';
import BarChart from './components/BarChart';

const App = () => {
  const [selectedMonth, setSelectedMonth] = useState(3); 

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Transaction Dashboard</h1>

      <MonthSelector onMonthChange={setSelectedMonth} />

      <TransactionStatistics selectedMonth={selectedMonth} />
      <TransactionsTable selectedMonth={selectedMonth} />
      <BarChart selectedMonth={selectedMonth} />
    </div>
  );
};

export default App;
