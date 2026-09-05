import { getBloomStatus } from "./getBloomStatus";

async function main() {
  const species = [
    // HortFlora
    "Pyrus calleryana",
    "Callistemon viminalis",
    "Eucalyptus scoparia",

    // VicFlora
    "Acacia dealbata",
    "Acacia melanoxylon",

    // Should fall through to iNaturalist
    "Acacia retinodes",
  ];

  for (const scientificName of species) {
    const prediction =
      await getBloomStatus(scientificName);

    console.log(
      `${scientificName} → ${prediction.status}\n`
    );
  }
}

main().catch(console.error);