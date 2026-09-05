import type { FlowerProfile } from "../types/flowerProfile";

export const flowerProfiles: FlowerProfile[] = [
  {
    id: "southern-magnolia",
    displayName: "Southern Magnolia",
    genus: "Magnolia",
    scientificNames: ["Magnolia grandiflora"],

    // RBG Victoria: late spring to early summer
    floweringStartMonth: 11,
    floweringEndMonth: 12,

    sourceName: "Royal Botanic Gardens Victoria - HortFlora",
    sourceUrl:
      "https://hortflora.rbg.vic.gov.au/taxon/ad90ed34-5340-11e7-b82b-005056b0018f",
  },
];