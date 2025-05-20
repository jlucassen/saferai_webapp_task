import React, { useMemo } from 'react';
import { Typography, Box } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { RiskDistribution } from '../types/risk';

interface RiskDistributionChartProps {
  distribution: RiskDistribution[];
}

const RiskDistributionChart: React.FC<RiskDistributionChartProps> = ({ distribution }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(value);
  };

  const formatProbability = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  // Find the last point with probability > 1% and adjust x-axis domain
  const { domainMax, filteredData } = useMemo(() => {
    // Handle empty or undefined distribution
    if (!distribution || distribution.length === 0) {
      return {
        domainMax: 0,
        filteredData: []
      };
    }

    // Find the last point with probability > 1%
    let lastSignificantIndex = -1;
    for (let i = distribution.length - 1; i >= 0; i--) {
      if (distribution[i].probability > 0.01) {
        lastSignificantIndex = i;
        break;
      }
    }

    // If no significant points found, use the entire distribution
    if (lastSignificantIndex === -1) {
      return {
        domainMax: distribution[distribution.length - 1].severity,
        filteredData: distribution
      };
    }

    // Calculate domain max to be at least halfway to the maximum severity
    const maxSeverity = distribution[distribution.length - 1].severity;
    const lastSignificantSeverity = distribution[lastSignificantIndex].severity;
    const domainMax = Math.max(lastSignificantSeverity * 2, maxSeverity / 2);

    // Filter data to only include points up to domainMax
    const filteredData = distribution.filter(point => point.severity <= domainMax);

    return { domainMax, filteredData };
  }, [distribution]);

  // If no data, show a message
  if (!distribution || distribution.length === 0) {
    return (
      <Box sx={{ width: '100%', height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          No risk distribution data available
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', height: 500, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <Typography variant="h6" gutterBottom>
        Risk Distribution
      </Typography>
      <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={filteredData}
            margin={{
              top: 20,
              right: 20,
              left: 20,
              bottom: 20,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="severity"
              tickFormatter={formatCurrency}
              domain={[0, domainMax]}
              angle={45}
              textAnchor="start"
              interval={1}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              tickFormatter={formatProbability}
            />
            <Tooltip
              formatter={(value: number) => [formatProbability(value), 'Probability']}
              labelFormatter={(label) => `Loss: ${formatCurrency(label)}`}
            />
            <Bar 
              dataKey="probability" 
              fill="#8884d8"
            />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

export default RiskDistributionChart; 