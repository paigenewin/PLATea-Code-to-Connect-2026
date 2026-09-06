import { Router } from "express";
import multer from "multer";
import { identifyPlant } from "../services/geminiPlantService";
import { identifyPlantWithPlantNet } from "../services/plantNetService";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

router.post(
  "/",
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          error: "Image is required",
        });
      }

      if (!req.file.mimetype.startsWith("image/")) {
        return res.status(400).json({
          error: "Uploaded file must be an image",
        });
      }

      try {
        const geminiResult = await identifyPlant(
          req.file.buffer,
          req.file.mimetype
        );

        return res.json({
          ...geminiResult,
          provider: "gemini",
        });
      } catch (geminiError) {
        console.warn(
          "Gemini identification failed. Falling back to Pl@ntNet."
        );

        const plantNetResult =
          await identifyPlantWithPlantNet(
            req.file.buffer
          );

        return res.json({
          ...plantNetResult,
          provider: "plantnet",
        });
      }
    } catch (error) {
      console.error(
        "Plant identification failed:",
        error
      );

      return res.status(500).json({
        error: "Plant identification failed",
      });
    }
  }
);

export default router;