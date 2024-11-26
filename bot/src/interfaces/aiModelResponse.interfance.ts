export interface IAiModelResponse {
  is_suspicious: number;
  confidence: number;
  important_words: [string, number][];
  time_taken: number;
}
