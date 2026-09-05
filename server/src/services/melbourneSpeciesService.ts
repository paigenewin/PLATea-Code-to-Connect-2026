const BASE_URL =
  "https://data.melbourne.vic.gov.au/api/explore/v2.1/catalog/datasets/trees-with-species-and-dimensions-urban-forest/records";

const TARGET_GENERA = [
  "Acacia",
  "Pyrus",
  "Callistemon",
  "Brachychiton",
  "Grevillea",
  "Eucalyptus",
  "Corymbia",
  "Banksia",
  "Melaleuca",
];

export interface SpeciesRecord {
  genus: string | null;
  scientific_name: string | null;
  common_name: string | null;
  tree_count: number;
}

interface MelbourneResponse {
  results?: SpeciesRecord[];
}

export async function getTargetSpecies(): Promise<SpeciesRecord[]> {
  const species: SpeciesRecord[] = [];

  for (const genus of TARGET_GENERA) {
    const params = new URLSearchParams({
      select:
        "genus, scientific_name, common_name, count(*) as tree_count",
      where: `genus = "${genus}"`,
      group_by: "genus, scientific_name, common_name",
      order_by: "tree_count desc",
      limit: "100",
    });

    const response = await fetch(`${BASE_URL}?${params.toString()}`);

    if (!response.ok) {
      const errorText = await response.text();

      console.error(`Error for ${genus}:`, errorText);

      throw new Error(
        `City of Melbourne API error for ${genus}: ${response.status}`
      );
    }

    const data: MelbourneResponse = await response.json();

    species.push(...(data.results ?? []));
  }

  return species;
}