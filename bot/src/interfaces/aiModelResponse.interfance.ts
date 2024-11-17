export interface IAiModelResponse {
  is_suspicious: number;
  confidence: number;
  important_words: [number, number][];
  time_taken: number;
}
