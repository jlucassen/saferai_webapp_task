export interface RiskParameters {
  attackAttempts: number;
  persuasivenessScore: number;
  cybenchScore: number;
  persistenceProbability: number;
  severityPerAttempt: number;
}

export interface RiskDistribution {
  probability: number;
  severity: number;
}

export interface RiskModel {
  parameters: RiskParameters;
  distribution: RiskDistribution[];
} 