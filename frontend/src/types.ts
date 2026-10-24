// SkillBridge AI - Global TypeScript Type Definitions

export type ExtractionMethod = 'keyword' | 'nlp_assisted' | 'compare_both';

export interface SkillItem {
  skill: string;
  category: string;
  matched_text?: string;
  source?: string;
  method: string;
  status: string;
  evidence: string;
  confidence: number;
  is_uncertain: boolean;
  soft_skill?: boolean;
  occurrences?: number;
  user_confirmed?: boolean;
}

export interface MatchedSkillItem extends SkillItem {
  resume_matched_text: string;
  resume_evidence: string;
  job_matched_text: string;
  job_evidence: string;
}

export interface MissingSkillItem extends SkillItem {
  job_matched_text: string;
  job_evidence: string;
}

export interface AdditionalSkillItem extends SkillItem {
  resume_matched_text: string;
  resume_evidence: string;
}

export interface ComparisonMatrixRow {
  skill: string;
  category: string;
  resume_presence: 'Detected' | 'Not Detected';
  job_requirement: 'Required' | 'Not Stated';
  status: 'Matched' | 'Missing' | 'Additional';
  resume_evidence: string;
  job_evidence: string;
  is_uncertain: boolean;
}

export interface CategoryBreakdown {
  category: string;
  matched: number;
  missing: number;
  additional: number;
  total_required: number;
}

export interface AnalysisSummary {
  total_resume_skills: number;
  total_job_required_skills: number;
  matched_skills_count: number;
  missing_skills_count: number;
  additional_skills_count: number;
  uncertain_matches_count: number;
  skill_overlap_percentage: number;
  score_status: 'calculated' | 'unavailable';
  score_message: string;
  formula_applied: string;
}

export interface MethodComparisonData {
  keyword_duration_ms: number;
  nlp_duration_ms: number;
  keyword_overlap: number;
  nlp_overlap: number;
  keyword_matched_count: number;
  nlp_matched_count: number;
  skills_matched_by_both: string[];
  skills_only_in_keyword: string[];
  skills_only_in_nlp: string[];
}

export interface AnalysisResult {
  summary: AnalysisSummary;
  matched_skills: MatchedSkillItem[];
  missing_skills: MissingSkillItem[];
  additional_skills: AdditionalSkillItem[];
  uncertain_matches: SkillItem[];
  comparison_matrix: ComparisonMatrixRow[];
  category_breakdown: CategoryBreakdown[];
  method: string;
  total_pipeline_ms?: number;
  method_comparison?: MethodComparisonData;
}

export interface TaxonomySkillMeta {
  canonical: string;
  category: string;
  aliases: string[];
  regex: string;
  anti_patterns: string[];
  description: string;
  soft_skill: boolean;
}

export interface BenchmarkComparisonRow {
  method: string;
  type: string;
  precision: number;
  recall: number;
  f1_score: number;
  true_positives: number;
  false_positives: number;
  false_negatives: number;
  duration_ms: number;
  api_cost: string;
}

export interface BenchmarkReport {
  dataset_metadata: {
    total_test_samples: number;
    total_annotated_skills: number;
    methodology: string;
  };
  comparison_table: BenchmarkComparisonRow[];
  error_analysis: Array<{
    category: string;
    description: string;
    mitigation: string;
    keyword_status: string;
    nlp_status: string;
  }>;
  academic_interpretation: string;
  sample_breakdown?: {
    keyword: any[];
    nlp: any[];
  };
}

export interface SampleResume {
  id: string;
  title: string;
  category: string;
  summary: string;
  text: string;
}

export interface SampleJob {
  id: string;
  title: string;
  company: string;
  department: string;
  text: string;
}
