import React from 'react';
import { Box, Typography } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceDot } from 'recharts';

interface SigmoidConversionChartsProps {
  persuasivenessScore: number;
  cybenchScore: number;
}

// Logistic function for persuasiveness
const convertPersuasivenessToProbability = (score: number): number => {
  const k = 4;
  const x0 = 0.5;
  if (score <= 0) return 0;
  if (score >= 6) return 1;
  return 1 / (1 + Math.exp(-k * (score - x0)));
};

// Logistic function for Cybench
const convertCybenchToProbability = (score: number): number => {
  const k = 3.33;
  const x0 = 0.225;
  if (score <= 0) return 0;
  if (score >= 100) return 1;
  return 1 / (1 + Math.exp(-k * (score / 100 - x0)));
};

const persuasivenessData = Array.from({ length: 61 }, (_, i) => {
  const score = i * 0.1;
  return {
    score: parseFloat(score.toFixed(2)),
    probability: convertPersuasivenessToProbability(score),
  };
});

const cybenchData = Array.from({ length: 101 }, (_, i) => {
  const score = i;
  return {
    score,
    probability: convertCybenchToProbability(score),
  };
});

const SigmoidConversionCharts: React.FC<SigmoidConversionChartsProps> = ({ persuasivenessScore, cybenchScore }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4, justifyContent: 'center', alignItems: 'center' }}>
      <Box sx={{ width: 350, height: 300 }}>
        <Typography variant="subtitle1" align="center" gutterBottom>
          Persuasiveness Score → Spearphishing Probability
        </Typography>
        <ResponsiveContainer width="100%" height="85%">
          <LineChart data={persuasivenessData} margin={{ top: 20, right: 20, left: 20, bottom: 30 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="score" type="number" domain={[0, 6]} label={{ value: 'Persuasiveness Score', position: 'outsideBottom', offset: 10 }} tick={{ fontSize: 12 }} />
            <YAxis domain={[0, 1]} tickFormatter={v => `${(v * 100).toFixed(0)}%`} label={{ value: 'Probability', angle: -90, position: 'insideLeft', offset: 10 }} />
            <Tooltip formatter={(v: number) => `${(v * 100).toFixed(1)}%`} labelFormatter={l => `Score: ${l}`} />
            <Line type="monotone" dataKey="probability" stroke="#1976d2" dot={false} strokeWidth={2} />
            <ReferenceDot x={persuasivenessScore} y={convertPersuasivenessToProbability(persuasivenessScore)} r={6} fill="#d32f2f" stroke="none" label={{ value: 'Current', position: 'top', fontSize: 12, fill: '#d32f2f' }} />
          </LineChart>
        </ResponsiveContainer>
      </Box>
      <Box sx={{ width: 350, height: 300 }}>
        <Typography variant="subtitle1" align="center" gutterBottom>
          Cybench Score → Malware Probability
        </Typography>
        <ResponsiveContainer width="100%" height="85%">
          <LineChart data={cybenchData} margin={{ top: 20, right: 20, left: 20, bottom: 30 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="score" type="number" domain={[0, 100]} label={{ value: 'Cybench Score (%)', position: 'outsideBottom', offset: 10 }} tick={{ fontSize: 12 }} />
            <YAxis domain={[0, 1]} tickFormatter={v => `${(v * 100).toFixed(0)}%`} label={{ value: 'Probability', angle: -90, position: 'insideLeft', offset: 10 }} />
            <Tooltip formatter={(v: number) => `${(v * 100).toFixed(1)}%`} labelFormatter={l => `Score: ${l}`} />
            <Line type="monotone" dataKey="probability" stroke="#388e3c" dot={false} strokeWidth={2} />
            <ReferenceDot x={cybenchScore} y={convertCybenchToProbability(cybenchScore)} r={6} fill="#d32f2f" stroke="none" label={{ value: 'Current', position: 'top', fontSize: 12, fill: '#d32f2f' }} />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

export default SigmoidConversionCharts; 