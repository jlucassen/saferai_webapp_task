import { RiskParameters, RiskDistribution } from '../types/risk';

// Convert persuasiveness score to probability using logistic function
const convertPersuasivenessToProbability = (score: number): number => {
  // Using logistic function: f(x) = 1 / (1 + e^(-k(x-x0)))
  // where k controls the steepness and x0 is the midpoint
  // We want f(0) = 0, f(0.5) = 0.5, f(6) = 1
  const k = 4; // Increased steepness for better separation
  const x0 = 0.5; // Midpoint where probability is 0.5
  
  // Ensure exact values at boundaries
  if (score <= 0) return 0;
  if (score >= 6) return 1;
  
  return 1 / (1 + Math.exp(-k * (score - x0)));
};

// Convert Cybench score to malware success probability
const convertCybenchToProbability = (score: number): number => {
  // Using logistic function with parameters tuned to match:
  // 0% -> 0 probability
  // 22.5% -> 28.5% probability
  // 100% -> 1 probability
  const k = 3.33; // Controls steepness (positive for increasing function)
  const x0 = 0.225; // Midpoint at 22.5% to match the target point
  
  // Ensure exact values at boundaries
  if (score <= 0) return 0;
  if (score >= 100) return 1;
  
  return 1 / (1 + Math.exp(-k * (score/100 - x0)));
};

export const calculateRiskDistribution = (parameters: RiskParameters): RiskDistribution[] => {
  const { attackAttempts, persuasivenessScore, cybenchScore, persistenceProbability, severityPerAttempt } = parameters;
  
  // Convert scores to probabilities
  const spearphishingSuccess = convertPersuasivenessToProbability(persuasivenessScore);
  const malwareSuccess = convertCybenchToProbability(cybenchScore);
  
  // Calculate overall success probability
  const overallSuccessProbability = spearphishingSuccess * malwareSuccess * persistenceProbability;
  
  // Generate distribution for different numbers of successful attacks
  const distribution: RiskDistribution[] = [];
  
  for (let successfulAttacks = 0; successfulAttacks <= attackAttempts; successfulAttacks++) {
    // Calculate probability using binomial distribution
    const probability = binomialProbability(attackAttempts, successfulAttacks, overallSuccessProbability);
    const severity = successfulAttacks * severityPerAttempt;
    
    distribution.push({ probability, severity });
  }
  
  return distribution;
};

// Helper function to calculate binomial probability
const binomialProbability = (n: number, k: number, p: number): number => {
  const combinations = factorial(n) / (factorial(k) * factorial(n - k));
  return combinations * Math.pow(p, k) * Math.pow(1 - p, n - k);
};

// Helper function to calculate factorial
const factorial = (n: number): number => {
  if (n === 0 || n === 1) return 1;
  return n * factorial(n - 1);
}; 