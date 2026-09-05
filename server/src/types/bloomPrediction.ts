export type BloomStatus =
  | "not_in_season"
  | "blooming_soon"
  | "blooming"
  | "unknown";

export interface BloomPrediction {
  status: BloomStatus;
}