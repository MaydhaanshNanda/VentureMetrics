export interface RevenueModel {
  model: string;
  description: string;
  viability: 'High' | 'Medium' | 'Low';
}

export interface Risk {
  risk: string;
  impact: 'High' | 'Medium' | 'Low';
  mitigation: string;
}

export interface Competitor {
  name: string;
  differentiation: string;
}

export interface EvaluationResult {
  startupName: string;
  startupDescription: string;
  overallScore: number;
  marketPotentialScore: number;
  marketPotentialAnalysis: string;
  scalabilityScore: number;
  scalabilityAnalysis: string;
  revenueModels: RevenueModel[];
  majorRisks: Risk[];
  competitors: Competitor[];
  summary: string;
}
