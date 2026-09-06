import { Router } from "express";
import { fetchRecentObservations } from "../services/inaturalistService";
import { getBloomStatus } from "../services/getBloomStatus";
import { predictBloom } from "../services/bloomPrediction";
import { hortFloraProfiles } from "../data/hortFloraProfiles";

const router = Router();

/*
 * GET /flowers/blooming
 *
 * Returns the curated HortFlora species that
 * are predicted to be blooming right now.
 *
 * Only covers manually-verified species -
 * doesn't touch VicFlora or iNaturalist, so
 * it's instant.
 */
router.get("/blooming", (_req, res) => {
  const blooming = hortFloraProfiles
    .filter(
      (profile) =>
        predictBloom(profile).status === "blooming"
    )
    .map((profile) => ({
      displayName: profile.displayName,
      scientificNames: profile.scientificNames,
    }));

  res.json({ species: blooming });
});

/*
 * GET /flowers/:scientificName/prediction
 *
 * Returns PLATea's bloom status.
 *
 * Priority:
 * 1. HortFlora manual profile
 * 2. VicFlora exact match + phenology
 * 3. iNaturalist recent flowering evidence
 * 4. unknown
 */
router.get("/:scientificName/prediction", async (req, res) => {
  try {
    const scientificName = req.params.scientificName;

    const prediction =
      await getBloomStatus(scientificName);

    res.json({
      scientificName,
      status: prediction.status,
    });
  } catch (error) {
    console.error(
      `Failed to get bloom prediction for ${req.params.scientificName}:`,
      error
    );

    res.status(500).json({
      error: "Failed to get bloom prediction",
    });
  }
});

/*
 * GET /flowers/:scientificName
 *
 * Returns recent iNaturalist observations
 * around Melbourne for the requested species.
 */
router.get("/:scientificName", async (req, res) => {
  try {
    const scientificName = req.params.scientificName;

    const observations =
      await fetchRecentObservations(
        scientificName,
        14
      );

    res.json({
      scientificName,
      observations,
    });
  } catch (error) {
    console.error(
      `Failed to fetch observations for ${req.params.scientificName}:`,
      error
    );

    res.status(500).json({
      error: "Failed to fetch observations",
    });
  }
});

export default router;