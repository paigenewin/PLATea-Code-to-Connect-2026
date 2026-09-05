import { getTargetSpecies } from "./melbourneSpeciesService";

async function main() {
  const species = await getTargetSpecies();

  console.log(
    `Found ${species.length} species/common-name combinations\n`
  );

  for (const item of species) {
    console.log(
      `${item.genus} | ${item.scientific_name} | ${
        item.common_name ?? "No common name"
      } | ${item.tree_count} trees`
    );
  }
}

main().catch(console.error);