import { writeFile } from "node:fs/promises";

import { getTargetSpecies } from "./melbourneSpeciesService";
import {
  findTaxon,
  fetchPhenology,
} from "./vicFloraService";

interface UnresolvedSpecies {
  genus: string | null;
  scientificName: string;
  commonName: string | null;
  treeCount: number;
}

async function main() {
  const species = await getTargetSpecies();

  console.log(
    `Checking ${species.length} City of Melbourne combinations...\n`
  );

  let found = 0;
  let notFound = 0;
  let unknownSpecies = 0;
  let errors = 0;

  const unresolved: UnresolvedSpecies[] = [];

  for (const item of species) {
    const scientificName = item.scientific_name;

    if (!scientificName) {
      console.log(
        `UNKNOWN | ${item.genus ?? "Unknown genus"} | missing scientific name`
      );

      unknownSpecies++;
      continue;
    }

    // Examples:
    // Acacia sp.
    // Eucalyptus sp.
    // Banksia sp.
    //
    // These trees still stay in the dataset,
    // but exact species is unknown, so we cannot
    // make a species-level flowering prediction.
    if (/\bsp\.$/i.test(scientificName.trim())) {
      console.log(
        `UNKNOWN | ${scientificName} | ${item.tree_count} trees`
      );

      unknownSpecies++;
      continue;
    }

    try {
      const taxon = await findTaxon(scientificName);

      if (!taxon) {
        console.log(
          `NOT FOUND | ${scientificName} | ${
            item.common_name ?? "No common name"
          } | ${item.tree_count} trees`
        );

        unresolved.push({
          genus: item.genus,
          scientificName,
          commonName: item.common_name,
          treeCount: item.tree_count,
        });

        notFound++;
        continue;
      }

      const phenology = await fetchPhenology(taxon.id);

      console.log(
        `FOUND | ${scientificName} → ${taxon.scientificName} | phenology rows: ${phenology.length}`
      );

      found++;
    } catch (error) {
      console.error(`ERROR | ${scientificName}`, error);
      errors++;
    }
  }

  await writeFile(
    "src/data/unresolvedSpecies.json",
    JSON.stringify(unresolved, null, 2)
  );

  console.log("\n========== SUMMARY ==========");
  console.log(`Total City combinations: ${species.length}`);
  console.log(`VicFlora found:          ${found}`);
  console.log(`VicFlora not found:      ${notFound}`);
  console.log(`Unknown species (sp.):   ${unknownSpecies}`);
  console.log(`Errors:                  ${errors}`);

  console.log(
    `\nSaved ${unresolved.length} unresolved records to src/data/unresolvedSpecies.json`
  );
}

main().catch(console.error);