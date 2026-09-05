import type { PhenologyItem } from "./vicFloraService";
import type { FlowerProfile } from "../types/flowerProfile";

const MONTHS: Record<string, number> = {
  jan: 1,
  january: 1,
  feb: 2,
  february: 2,
  mar: 3,
  march: 3,
  apr: 4,
  april: 4,
  may: 5,
  jun: 6,
  june: 6,
  jul: 7,
  july: 7,
  aug: 8,
  august: 8,
  sep: 9,
  sept: 9,
  september: 9,
  oct: 10,
  october: 10,
  nov: 11,
  november: 11,
  dec: 12,
  december: 12,
};

function monthToNumber(month: string): number | null {
  const normalized = month.trim().toLowerCase();

  // Handles values like "1", "01", etc.
  const numeric = Number(normalized);

  if (
    Number.isInteger(numeric) &&
    numeric >= 1 &&
    numeric <= 12
  ) {
    return numeric;
  }

  return MONTHS[normalized] ?? null;
}

interface MonthFlowerCount {
  month: number;
  flowers: number;
}

/**
 * PLATea heuristic:
 *
 * VicFlora gives monthly phenology observation counts rather than an
 * official start/end flowering season.
 *
 * We define the "main flowering window" as months whose flower count
 * is at least 20% of the species' maximum monthly flower count.
 *
 * If there are multiple separate runs of qualifying months, we use
 * the run with the highest total number of flower observations.
 */
export function phenologyToFlowerProfile(
  scientificName: string,
  phenology: PhenologyItem[]
): FlowerProfile | null {
  const monthlyCounts: MonthFlowerCount[] = phenology
    .map((item) => {
      const month = monthToNumber(item.month);

      if (month === null) {
        return null;
      }

      return {
        month,
        flowers: Number(item.flowers) || 0,
      };
    })
    .filter(
      (item): item is MonthFlowerCount => item !== null
    );

  if (monthlyCounts.length === 0) {
    return null;
  }

  const maxFlowers = Math.max(
    ...monthlyCounts.map((item) => item.flowers)
  );

  // No flowering observations at all
  if (maxFlowers <= 0) {
    return null;
  }

  const threshold = maxFlowers * 0.2;

  const qualifyingMonths = monthlyCounts
    .filter(
      (item) =>
        item.flowers > 0 &&
        item.flowers >= threshold
    )
    .sort((a, b) => a.month - b.month);

  if (qualifyingMonths.length === 0) {
    return null;
  }

  // Build consecutive runs.
  const runs: MonthFlowerCount[][] = [];
  let currentRun: MonthFlowerCount[] = [];

  for (const item of qualifyingMonths) {
    if (currentRun.length === 0) {
      currentRun.push(item);
      continue;
    }

    const previous =
      currentRun[currentRun.length - 1];

    if (item.month === previous.month + 1) {
      currentRun.push(item);
    } else {
      runs.push(currentRun);
      currentRun = [item];
    }
  }

  if (currentRun.length > 0) {
    runs.push(currentRun);
  }

  /*
   * Handle flowering periods crossing the year boundary.
   *
   * Example:
   * Nov, Dec, Jan, Feb
   *
   * Initially this becomes:
   * [Jan, Feb]
   * [Nov, Dec]
   *
   * Merge them into:
   * [Nov, Dec, Jan, Feb]
   */
  if (runs.length > 1) {
    const firstRun = runs[0];
    const lastRun = runs[runs.length - 1];

    const firstStartsInJanuary =
      firstRun[0].month === 1;

    const lastEndsInDecember =
      lastRun[lastRun.length - 1].month === 12;

    if (
      firstStartsInJanuary &&
      lastEndsInDecember
    ) {
      const mergedRun = [
        ...lastRun,
        ...firstRun,
      ];

      runs.splice(runs.length - 1, 1);
      runs.splice(0, 1);
      runs.push(mergedRun);
    }
  }

  // Pick the run with the strongest flower evidence.
  const strongestRun = runs.reduce(
    (best, current) => {
      const bestTotal = best.reduce(
        (sum, item) => sum + item.flowers,
        0
      );

      const currentTotal = current.reduce(
        (sum, item) => sum + item.flowers,
        0
      );

      return currentTotal > bestTotal
        ? current
        : best;
    }
  );

  const startMonth = strongestRun[0].month;
  const endMonth =
    strongestRun[strongestRun.length - 1].month;

  return {
    id: scientificName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, ""),

    displayName: scientificName,

    genus: scientificName.split(" ")[0],

    scientificNames: [scientificName],

    floweringStartMonth: startMonth,
    floweringEndMonth: endMonth,

    sourceName: "VicFlora",
    sourceUrl: "https://vicflora.rbg.vic.gov.au/",
  };
}