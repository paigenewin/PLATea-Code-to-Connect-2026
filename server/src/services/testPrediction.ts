import { predictBloom } from "./bloomPrediction";
import type { FlowerProfile } from "../types/flowerProfile";

const testProfile: FlowerProfile = {
  id: "test-species",
  displayName: "Test Species",
  genus: "Test",
  scientificNames: ["Test species"],

  floweringStartMonth: 9,
  floweringEndMonth: 11,

  sourceName: "Test data",
  sourceUrl: "test",
};

console.log(
  "July:",
  predictBloom(testProfile, new Date("2026-07-15"))
);

console.log(
  "August:",
  predictBloom(testProfile, new Date("2026-08-15"))
);

console.log(
  "September:",
  predictBloom(testProfile, new Date("2026-09-15"))
);

console.log(
  "November:",
  predictBloom(testProfile, new Date("2026-11-15"))
);

console.log(
  "December:",
  predictBloom(testProfile, new Date("2026-12-15"))
);

console.log(
  "Unknown:",
  predictBloom(null, new Date("2026-09-15"))
);