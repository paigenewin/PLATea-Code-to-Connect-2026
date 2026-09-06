import { Router } from "express";
import { fetchRecentObservations } from "../services/inaturalistService";
import { getBloomStatus } from "../services/getBloomStatus";
import { predictBloom } from "../services/bloomPrediction";
import { hortFloraProfiles } from "../data/hortFloraProfiles";
import { findNearbyTrees } from "../services/nearbyTreeService";
import { findTreesBySpecies } from "../services/bloomingTreeService";

const router = Router();

function getBloomingSpecies() {
  return hortFloraProfiles
    .filter(
      (profile) =>
        predictBloom(profile).status === "blooming"
    )
    .map((profile) => ({
      displayName: profile.displayName,
      scientificNames: profile.scientificNames,
    }));
}

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
  res.json({ species: getBloomingSpecies() });
});

/*
 * GET /flowers/blooming/trees
 *
 * Same blooming species as above, but also looks
 * up every real City of Melbourne tree matching
 * them, fully paginated. Lets the client make one
 * request instead of calling the City of Melbourne
 * API directly itself.
 */
router.get("/blooming/trees", async (_req, res) => {
  try {
    const species = getBloomingSpecies();

    const scientificNames = species.flatMap(
      (profile) => profile.scientificNames
    );

    const trees = await findTreesBySpecies(scientificNames);

    res.json({ species, trees });
  } catch (error) {
    console.error(
      "Failed to load blooming trees:",
      error
    );

    res.status(500).json({
      error: "Failed to load blooming trees",
    });
  }
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
 * GET /flowers/:scientificName/nearby
 *
 * Returns the nearest City of Melbourne trees
 * matching the requested species.
 *
 * Query parameters:
 * lat   - user's latitude
 * lng   - user's longitude
 * limit - optional number of trees, default 5
 */
router.get("/:scientificName/nearby", async (req, res) => {
  try {
    const scientificName = req.params.scientificName;

    const lat = Number(req.query.lat);
    const lng = Number(req.query.lng);

    const requestedLimit =
      req.query.limit !== undefined
        ? Number(req.query.limit)
        : 5;

    if (
      !Number.isFinite(lat) ||
      !Number.isFinite(lng)
    ) {
      return res.status(400).json({
        error: "Valid lat and lng are required",
      });
    }

    if (
      lat < -90 ||
      lat > 90 ||
      lng < -180 ||
      lng > 180
    ) {
      return res.status(400).json({
        error: "Invalid latitude or longitude",
      });
    }

    if (
      !Number.isInteger(requestedLimit) ||
      requestedLimit < 1 ||
      requestedLimit > 20
    ) {
      return res.status(400).json({
        error: "limit must be an integer between 1 and 20",
      });
    }

    const trees = await findNearbyTrees(
      scientificName,
      lat,
      lng,
      requestedLimit
    );

    return res.json({
      scientificName,
      userLocation: {
        latitude: lat,
        longitude: lng,
      },
      trees,
    });
  } catch (error) {
    console.error(
      `Failed to find nearby trees for ${req.params.scientificName}:`,
      error
    );

    return res.status(500).json({
      error: "Failed to find nearby trees",
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