import { hortFloraProfiles } from "../data/hortFloraProfiles";

import type { FlowerProfile } from "../types/flowerProfile";
import type { BloomPrediction } from "../types/bloomPrediction";

import { predictBloom } from "./bloomPrediction";
import { fetchRecentObservations } from "./inaturalistService";

import {
  findTaxon,
  fetchPhenology,
} from "./vicFloraService";

import { phenologyToFlowerProfile } from "./phenologyToFlowerProfile";

function findHortFloraProfile(
  scientificName: string
): FlowerProfile | null {
  const normalized =
    scientificName.trim().toLowerCase();

  return (
    hortFloraProfiles.find((profile) =>
      profile.scientificNames.some(
        (name) =>
          name.trim().toLowerCase() === normalized
      )
    ) ?? null
  );
}

export async function getBloomStatus(
  scientificName: string,
  date: Date = new Date()
): Promise<BloomPrediction> {
  /*
   * 1. HortFlora
   *
   * Highest priority because these flowering
   * periods were manually verified.
   */
  const hortFloraProfile =
    findHortFloraProfile(scientificName);

  if (hortFloraProfile) {
    console.log(
      `[HortFlora] Using manual profile for ${scientificName}`
    );

    return predictBloom(
      hortFloraProfile,
      date
    );
  }

  /*
   * 2. VicFlora
   *
   * Only exact taxon matches are used.
   * Monthly phenology observations are converted
   * into a flowering window using our PLATea
   * heuristic.
   */
  try {
    console.log(
      `[VicFlora] Checking ${scientificName}`
    );

    const taxon =
      await findTaxon(scientificName);

    if (taxon) {
      console.log(
        `[VicFlora] Exact match found: ${taxon.scientificName}`
      );

      const phenology =
        await fetchPhenology(taxon.id);

      const vicFloraProfile =
        phenologyToFlowerProfile(
          scientificName,
          phenology
        );

      if (vicFloraProfile) {
        console.log(
          `[VicFlora] Flowering window: ${vicFloraProfile.floweringStartMonth}-${vicFloraProfile.floweringEndMonth}`
        );

        return predictBloom(
          vicFloraProfile,
          date
        );
      }

      console.log(
        `[VicFlora] No usable flowering window for ${scientificName}`
      );
    } else {
      console.log(
        `[VicFlora] No exact match for ${scientificName}`
      );
    }
  } catch (error) {
    console.error(
      `[VicFlora] Lookup failed for ${scientificName}:`,
      error
    );
  }

  /*
   * 3. iNaturalist fallback
   *
   * Only explicit Flowers annotations count as
   * positive bloom evidence.
   *
   * An observation without the Flowers annotation
   * does NOT mean the plant is not flowering.
   */
  try {
    console.log(
      `[iNaturalist] Checking ${scientificName}`
    );

    const observations =
      await fetchRecentObservations(
        scientificName,
        14
      );

    console.log(
      `[iNaturalist] Found ${observations.length} recent observations`
    );

    const floweringObservations =
      observations.filter(
        (observation) =>
          observation.hasFlowers
      );

    console.log(
      `[iNaturalist] ${floweringObservations.length} observations explicitly annotated with flowers`
    );

    if (floweringObservations.length > 0) {
      return {
        status: "blooming",
      };
    }
  } catch (error) {
    console.error(
      `[iNaturalist] Lookup failed for ${scientificName}:`,
      error
    );
  }

  /*
   * 4. No reliable evidence
   */
  console.log(
    `[BloomStatus] No reliable bloom evidence for ${scientificName}`
  );

  return {
    status: "unknown",
  };
}