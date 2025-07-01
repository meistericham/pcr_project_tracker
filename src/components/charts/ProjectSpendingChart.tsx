import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useApp } from '../../contexts/AppContext';
import { formatMYR } from '../../utils/currency';

const ProjectSpendingChart = () => {
  const { projects, budgetEntries } = useApp();

  const COLORS = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', 
    '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'
  ];

  function getProjectColor(projectId: string) {
    const index = projects.findIndex(p => p.id === projectId);
    return COLORS[index % COLORS.length];
  }

  const projectSpendingData = projects.map(project => {
    const projectExpenses = budgetEntries
      .filter(entry => entry.projectId === project.id && entry.type === 'expense')
      .reduce((sum, entry) => sum + entry.amount, 0);

    return {
      name: project.name,
      value: projectExpenses,
      color: getProjectColor(project.id)
    };
  }).filter(item => item.value > 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {payload[0].name}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Spending: <span className="font-semibold text-red-600 dark:text-red-400">
              {formatMYR(payload[0].value)}
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  if (projectSpendingData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
        <p>No spending data available</p>
      </div>
    );
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={projectSpendingData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
          >
            {projectSpendingData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            formatter={(value, entry: any) => (
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {value} ({formatMYR(entry.payload.value)})
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProjectSpendingChart;