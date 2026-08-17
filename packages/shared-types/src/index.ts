import { z } from "zod";

export const DeepSearchTypeSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  slug: z.string(),
});

export type DeepSearchType = z.infer<typeof DeepSearchTypeSchema>;

export const CategorySchema = z.object({
  id: z.string().uuid(),
  type_id: z.string().uuid(),
  name: z.string(),
  slug: z.string(),
  description: z.string().optional(),
  embedding: z.array(z.number()).optional(), // Assuming pgvector
});

export type Category = z.infer<typeof CategorySchema>;

export const InvestorSchema = z.object({
  id: z.string().uuid(),
  firm_name: z.string(),
  contact_name: z.string().nullable(),
  role: z.string().nullable(),
  stage_focus: z.array(z.string()),
  check_size_min: z.number().nullable(),
  check_size_max: z.number().nullable(),
  website: z.string().url().nullable(),
  linkedin_url: z.string().url().nullable(),
  notes: z.string().nullable(),
});

export type Investor = z.infer<typeof InvestorSchema>;

export const InvestorCategoryScoreSchema = z.object({
  investor_id: z.string().uuid(),
  category_id: z.string().uuid(),
  relevance_score: z.number(),
  source_url: z.string().url(),
  source_type: z.string(),
  extracted_at: z.date(),
  verified: z.boolean(),
});

export type InvestorCategoryScore = z.infer<typeof InvestorCategoryScoreSchema>;

export const SearchRunSchema = z.object({
  id: z.string().uuid(),
  type_id: z.string().uuid(),
  category_id: z.string().uuid(),
  keywords: z.string().nullable(),
  status: z.enum(["pending", "processing", "completed", "failed"]),
  started_at: z.date().nullable(),
  completed_at: z.date().nullable(),
});

export type SearchRun = z.infer<typeof SearchRunSchema>;

export const ExtractedInvestorDataSchema = z.object({
  firm_name: z.string(),
  contact_name: z.string().nullable(),
  role: z.string().nullable(),
  stage_focus: z.array(z.string()),
  check_size: z.string().nullable(), // Raw string from LLM, e.g. "$1M - $5M"
  portfolio_examples: z.array(z.string()),
  thesis_summary: z.string(),
  source_url: z.string().url(),
});

export type ExtractedInvestorData = z.infer<typeof ExtractedInvestorDataSchema>;
