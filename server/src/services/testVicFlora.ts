import { findTaxon, fetchPhenology } from "./vicFloraService";

async function test() {
  const scientificName = "Epacris impressa";

  const taxon = await findTaxon(scientificName);

  console.log("Taxon:", taxon);

  if (!taxon) {
    console.log("No VicFlora match found.");
    return;
  }

  const phenology = await fetchPhenology(taxon.id);

  console.log("Phenology:", phenology);
}

test().catch(console.error);
