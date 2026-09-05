import unresolvedSpecies from "../data/unresolvedSpecies.json";
import { searchTaxa } from "./vicFloraService";

async function main() {
  console.log(
    `Checking suggestions for ${unresolvedSpecies.length} unresolved records...\n`
  );

  for (const item of unresolvedSpecies) {
    console.log(`\nCITY NAME: ${item.scientificName}`);

    try {
      const results = await searchTaxa(item.scientificName);

      if (results.length === 0) {
        console.log("  No VicFlora suggestions");
        continue;
      }

      for (const result of results.slice(0, 5)) {
        console.log(
          `  → ${result.scientificName} | status: ${
            result.taxonomicStatus ?? "unknown"
          }`
        );
      }
    } catch (error) {
      console.error("  Error:", error);
    }
  }
}

main().catch(console.error);