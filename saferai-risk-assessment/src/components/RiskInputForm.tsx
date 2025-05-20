import React, { useState, useEffect } from 'react';
import { 
  TextField, 
  Typography, 
  Box,
  Slider,
  Tooltip,
  IconButton,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { RiskParameters } from '../types/risk';

interface RiskInputFormProps {
  onParametersChange: (parameters: RiskParameters) => void;
}

const RiskInputForm: React.FC<RiskInputFormProps> = ({ onParametersChange }) => {
  const [parameters, setParameters] = useState<RiskParameters>({
    attackAttempts: 11,
    persuasivenessScore: 0.5,
    cybenchScore: 22.5,
    persistenceProbability: 0.05,
    severityPerAttempt: 765000000, // Proportional to market cap: (100B/65B) * 498M ≈ 765M
  });

  useEffect(() => {
    onParametersChange(parameters);
  }, [parameters, onParametersChange]);

  const handleChange = (field: keyof RiskParameters) => (
    event: React.ChangeEvent<HTMLInputElement | { value: unknown }>
  ) => {
    const value = Number(event.target.value);
    setParameters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Risk Parameters
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography gutterBottom>Number of Attack Attempts</Typography>
          <Tooltip title={
            <Box sx={{ maxWidth: 400 }}>
              <Typography variant="body2">
                According to CrowdStrike's Global Threat Report 2024, there were 4,615 victim posts to Data Leak Sites (DLS) in 2023, 
                suggesting at least 11 attacks per year per Fortune 500 company.
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                This estimate is conservative as not all successful attacks are posted to DLS, and threat activity has likely expanded 
                since 2023. The concept of an "attack" is nebulous, especially when considering Advanced Persistent Threats (APTs), 
                making it difficult to find clear data for this field.
              </Typography>
              <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
                Source: CrowdStrike (2024) "Global Threat Report 2024"
              </Typography>
            </Box>
          }>
            <IconButton size="small">
              <InfoIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
        <TextField
          type="number"
          value={parameters.attackAttempts}
          onChange={handleChange('attackAttempts')}
          fullWidth
          inputProps={{ min: 1, max: 100 }}
        />
      </Box>

      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography gutterBottom>AI Persuasiveness Score (0-6)</Typography>
          <Tooltip title={
            <Box sx={{ maxWidth: 400 }}>
              <Typography variant="body2">
                The persuasiveness scoring methodology is based on Anthropic's research on measuring model persuasiveness. 
                It measures the average change in human opinions on a 1-7 Likert scale. A score of 0.5 represents roughly human-level persuasiveness, 
                while 6 is the highest possible score in principle.
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                The logistic function converts this score to a phishing success probability. Research shows that humans scoring 0.54 on the 
                Anthropic persuasiveness scale achieve approximately 54% clickthrough rates on phishing emails.
              </Typography>
              <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
                Sources: Anthropic (2024) "Measuring the Persuasiveness of Language Models" and LessWrong (2023) "Human Study on AI Spear-Phishing Campaigns"
              </Typography>
            </Box>
          }>
            <IconButton size="small">
              <InfoIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
        <TextField
          type="number"
          value={parameters.persuasivenessScore}
          onChange={handleChange('persuasivenessScore')}
          fullWidth
          inputProps={{ 
            min: 0,
            max: 6,
            step: 0.1
          }}
          helperText="0 = Not persuasive, 0.5 = Moderately persuasive, 6 = Highly persuasive"
        />
      </Box>

      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography gutterBottom>Cybench Score (%)</Typography>
          <Tooltip title={
            <Box sx={{ maxWidth: 400 }}>
              <Typography variant="body2">
                Cybench is a benchmark for evaluating the cybersecurity capabilities of language models, featuring 40 professional-level 
                Capture the Flag (CTF) tasks. The score represents the percentage of tasks solved without guidance.
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                The logistic function converts this score to a malware success probability, calibrated using data from the AI Cyber Challenge 
                (AIxCC) which tested LLMs on real-world exploit weaponization. A score of 22.5% (current state-of-the-art) maps to a 28.5% 
                success probability in malware development.
              </Typography>
              <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
                Sources: Cybench (2025) and AI Cyber Challenge Dashboard (2024)
              </Typography>
            </Box>
          }>
            <IconButton size="small">
              <InfoIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
        <TextField
          type="number"
          value={parameters.cybenchScore}
          onChange={handleChange('cybenchScore')}
          fullWidth
          inputProps={{ 
            min: 0,
            max: 100,
            step: 0.1
          }}
          helperText="Percentage of CTF tasks solved without guidance (0-100%)"
        />
      </Box>

      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography gutterBottom>Persistence Success Probability</Typography>
          <Tooltip title={
            <Box sx={{ maxWidth: 400 }}>
              <Typography variant="body2">
                There are currently no comprehensive benchmarks specifically for AI cyber persistence capabilities. The closest proxy is the 
                Remote Code Execution (RCE) web shell step from the Online Retailer cyber range task.
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                According to OpenAI's system card, both o3-mini and o4-mini models demonstrated no ability to achieve persistence through 
                RCE web shells without explicit solver code, suggesting current models have limited persistence capabilities.
              </Typography>
              <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
                Source: OpenAI (2024) "o3 and o4-mini System Card"
              </Typography>
            </Box>
          }>
            <IconButton size="small">
              <InfoIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
        <TextField
          type="number"
          value={parameters.persistenceProbability}
          onChange={handleChange('persistenceProbability')}
          fullWidth
          inputProps={{ 
            min: 0,
            max: 1,
            step: 0.01
          }}
          helperText="Probability of successful persistence (0-1)"
        />
      </Box>

      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography gutterBottom>Severity per Successful Attempt ($)</Typography>
          <Tooltip title={
            <Box sx={{ maxWidth: 400 }}>
              <Typography variant="body2">
                The cost per compromise is initialized at $765M, proportional to the average S&P 500 company market cap of $100B 
                (based on total S&P 500 market cap of $50.214T as of 2025-05-19).
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                This value is scaled from the average cost of $498M for companies with an average market cap of $65B, as reported in 
                the White House Council of Economic Advisers' report on the cost of malicious cyber activity.
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                <strong>Note:</strong> The distribution of costs per compromise is heavily right-tailed. While the mean cost is high, 
                the median cost is only $15M according to the White House report. This means most incidents cost significantly less 
                than the average, but a few extreme cases drive up the mean.
              </Typography>
              <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
                Sources: Slickcharts (2025) "Total S&P 500 Market Capitalization" and White House Council of Economic Advisers (2018) 
                "The Cost of Malicious Cyber Activity to the U.S. Economy"
              </Typography>
            </Box>
          }>
            <IconButton size="small">
              <InfoIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
        <TextField
          type="number"
          value={parameters.severityPerAttempt}
          onChange={handleChange('severityPerAttempt')}
          fullWidth
          inputProps={{ min: 0 }}
        />
      </Box>
    </Box>
  );
};

export default RiskInputForm; 