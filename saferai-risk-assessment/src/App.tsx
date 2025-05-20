import React, { useState } from 'react';
import { Container, Typography, Box, Paper, Button } from '@mui/material';
import RiskInputForm from './components/RiskInputForm';
import RiskDistributionChart from './components/RiskDistributionChart';
import { RiskParameters, RiskDistribution } from './types/risk';
import { calculateRiskDistribution } from './utils/riskCalculator';
import SigmoidConversionCharts from './components/SigmoidConversionCharts';

function App() {
  const [riskDistribution, setRiskDistribution] = useState<RiskDistribution[]>([]);
  const [parameters, setParameters] = useState<RiskParameters | null>(null);
  const [showSigmoids, setShowSigmoids] = useState(false);

  const handleParametersChange = (params: RiskParameters) => {
    const distribution = calculateRiskDistribution(params);
    setRiskDistribution(distribution);
    setParameters(params);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          AI Risk Assessment Tool
        </Typography>
        <Typography variant="subtitle1" gutterBottom align="center" color="text.secondary">
          Interactive tool for assessing AI-related cybersecurity risks
        </Typography>
        
        <Box sx={{ mt: 4, display: 'flex', gap: 4, flexDirection: { xs: 'column', md: 'row' } }}>
          <Paper sx={{ p: 3, flex: 1 }}>
            <RiskInputForm onParametersChange={handleParametersChange} />
          </Paper>
          
          <Paper sx={{ p: 3, flex: 1 }}>
            <RiskDistributionChart distribution={riskDistribution} />
          </Paper>
        </Box>

        {/* Toggleable sigmoid charts below the main cards */}
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Button variant="outlined" onClick={() => setShowSigmoids(v => !v)}>
            {showSigmoids ? 'Hide' : 'Show'} Conversion Sigmoid Charts
          </Button>
        </Box>
        {showSigmoids && parameters && (
          <Box sx={{ mt: 2 }}>
            <SigmoidConversionCharts 
              persuasivenessScore={parameters.persuasivenessScore}
              cybenchScore={parameters.cybenchScore}
            />
          </Box>
        )}
      </Box>
    </Container>
  );
}

export default App;
