import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useApp } from '../../contexts/AppContext';
import { formatMYR } from '../../utils/currency';

const MonthlySpendingChart = () => {
  const { budgetEntries } = useApp();

  // Get monthly spending data for the current year
  const currentYear = new Date().getFullYear();
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const monthlyData = monthNames.map((month, index) => {
    const monthExpenses = budgetEntries
      .filter(entry => {
        const entryDate = new Date(entry.date);
        return entryDate.getFullYear() === currentYear && 
               entryDate.getMonth() === index && 
               entry.type === 'expense';
      })
      .reduce((sum, entry) => sum + entry.amount, 0);

    const monthIncome = budgetEntries
      .filter(entry => {
        const entryDate = new Date(entry.date);
        return entryDate.getFullYear() === currentYear && 
               entryDate.getMonth() === index && 
               entry.type === 'income';
      })
      .reduce((sum, entry) => sum + entry.amount, 0);

    return {
      month,
      expenses: monthExpenses,
      income: monthIncome,
      net: monthIncome - monthExpenses
    };
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            {label} {currentYear}
          </p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm">
              <span className="inline-block w-3 h-3 rounded-full mr-2" style={{ backgroundColor: entry.color }}></span>
              {entry.name}: <span className="font-semibold" style={{ color: entry.color }}>
                {formatMYR(entry.value)}
              </span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis 
            dataKey="month" 
            className="text-xs text-gray-600 dark:text-gray-400"
          />
          <YAxis 
            className="text-xs text-gray-600 dark:text-gray-400"
            tickFormatter={(value) => `RM${(value / 1000).toFixed(0)}K`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="expenses" fill="#EF4444" name="Expenses" radius={[2, 2, 0, 0]} />
          <Bar dataKey="income" fill="#10B981" name="Income" radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlySpendingChart;