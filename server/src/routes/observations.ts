import { Router } from "express";
import { fetchRecentObservations } from "../services/inaturalistService";
import { getBloomStatus } from "../services/getBloomStatus";

const router = Router();

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