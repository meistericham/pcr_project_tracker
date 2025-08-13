import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useApp } from '../../contexts/AppContext';
import { formatMYR } from '../../utils/currency';

const YearlySpendingChart = () => {
  const { budgetEntries } = useApp();

  // Get yearly spending data for the last 5 years
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 4 + i);

  const yearlyData = years.map(year => {
    const yearExpenses = budgetEntries
      .filter(entry => {
        const entryDate = new Date(entry.date);
        return entryDate.getFullYear() === year && entry.type === 'expense';
      })
      .reduce((sum, entry) => sum + entry.amount, 0);

    const yearIncome = budgetEntries
      .filter(entry => {
        const entryDate = new Date(entry.date);
        return entryDate.getFullYear() === year && entry.type === 'income';
      })
      .reduce((sum, entry) => sum + entry.amount, 0);

    return {
      year: year.toString(),
      expenses: yearExpenses,
      income: yearIncome,
      net: yearIncome - yearExpenses
    };
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            Year {label}
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
        <BarChart data={yearlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis 
            dataKey="year" 
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

export default YearlySpendingChart;