import { Router } from "express";
import { fetchRecentObservations } from "../services/inaturalistService";
import { getBloomStatus } from "../services/getBloomStatus";

const router = Router();

router.get("/:scientificName", async (req, res) => {
  try {
    const { scientificName } = req.params;

    const observations =
      await fetchRecentObservations(scientificName);

    res.json(observations);
  } catch (error) {
    console.error("Observation route failed:", error);

    res.status(500).json({
      error: "Failed to fetch observations",
    });
  }
});

export default router;