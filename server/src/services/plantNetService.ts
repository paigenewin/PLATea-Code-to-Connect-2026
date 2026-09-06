import sharp from "sharp";

const PLANTNET_URL =
  "https://my-api.plantnet.org/v2/identify/all";

export interface PlantNetIdentification {
  identified: boolean;
  commonName: string | null;
  scientificName: string | null;
  score: number | null;
  needsBetterPhoto: boolean;
}

export async function identifyPlantWithPlantNet(
  imageBuffer: Buffer
): Promise<PlantNetIdentification> {
  const apiKey = process.env.PLANTNET_API_KEY;

  if (!apiKey) {
    throw new Error("PLANTNET_API_KEY is not configured");
  }

  // Pl@ntNet accepts JPEG/PNG.
  // Convert uploads such as WebP/HEIC into JPEG first.
  const jpegBuffer = await sharp(imageBuffer)
    .rotate()
    .jpeg({
      quality: 85,
    })
    .toBuffer();

  const formData = new FormData();

  const blob = new Blob([new Uint8Array(jpegBuffer)], {
    type: "image/jpeg",
  });

  formData.append(
    "images",
    blob,
    "plant.jpg"
  );

  formData.append(
    "organs",
    "flower"
  );

  const response = await fetch(
    `${PLANTNET_URL}?api-key=${encodeURIComponent(apiKey)}`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    const text = await response.text();

    throw new Error(
      `Pl@ntNet request failed (${response.status}): ${text}`
    );
  }

  const data = await response.json() as any;

  const bestResult = data.results?.[0];

  if (!bestResult) {
    return {
      identified: false,
      commonName: null,
      scientificName: null,
      score: null,
      needsBetterPhoto: true,
    };
  }

  const score =
    typeof bestResult.score === "number"
      ? bestResult.score
      : null;

  const scientificName =
    bestResult.species
      ?.scientificNameWithoutAuthor ??
    null;

  const commonNames =
    bestResult.species?.commonNames;

  const commonName =
    Array.isArray(commonNames) &&
    commonNames.length > 0
      ? commonNames[0]
      : null;

  return {
    identified: Boolean(scientificName),
    commonName,
    scientificName,
    score,

    // PLATea heuristic:
    // low Pl@ntNet score means we'd prefer a better photo.
    needsBetterPhoto:
      score !== null && score < 0.5,
  };
}