import type { FlowerProfile } from "../types/flowerProfile";
import type { BloomPrediction } from "../types/bloomPrediction";

export function predictBloom(
  profile: FlowerProfile | null,
  date: Date = new Date()
): BloomPrediction {
  if (!profile) {
    return {
      status: "unknown",
    };
  }

  const month = date.getMonth() + 1;

  const start = profile.floweringStartMonth;
  const end = profile.floweringEndMonth;

  // One month before flowering starts.
  // If flowering starts in January, blooming soon is December.
  const bloomingSoonMonth = start === 1 ? 12 : start - 1;

  if (month === bloomingSoonMonth) {
    return {
      status: "blooming_soon",
    };
  }

  // Normal flowering period, e.g. September -> November
  if (start <= end) {
    return {
      status:
        month >= start && month <= end
          ? "blooming"
          : "not_in_season",
    };
  }

  // Flowering period crosses New Year,
  // e.g. November -> February
  return {
    status:
      month >= start || month <= end
        ? "blooming"
        : "not_in_season",
  };
}