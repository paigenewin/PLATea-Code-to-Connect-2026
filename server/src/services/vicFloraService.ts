const VICFLORA_API = "https://vicflora.rbg.vic.gov.au/graphql";

export interface PhenologyItem {
  month: string;
  total: number;
  buds: number;
  flowers: number;
  fruit: number;
}

export interface VicFloraTaxon {
  id: string;
  scientificName: string;
  taxonomicStatus: string | null;
}

interface VicFloraAutocompleteResult {
  id: string | number;
  taxonomicStatus?: string | null;
  taxonName?: {
    fullName?: string | null;
  } | null;
}

/**
 * Search VicFlora autocomplete and return all suggestions.
 *
 * This does NOT decide which result is correct.
 */
export async function searchTaxa(
  scientificName: string
): Promise<VicFloraTaxon[]> {
  const query = `
    query taxonConceptAutocomplete($q: String!) {
      taxonConceptAutocomplete(q: $q) {
        id
        taxonomicStatus
        taxonName {
          fullName
        }
      }
    }
  `;

  const response = await fetch(VICFLORA_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables: {
        q: scientificName,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`VicFlora API error: ${response.status}`);
  }

  const data = await response.json();

  if (data.errors) {
    throw new Error(
      `VicFlora GraphQL error: ${JSON.stringify(data.errors)}`
    );
  }

  const results: VicFloraAutocompleteResult[] =
    data.data?.taxonConceptAutocomplete ?? [];

  return results
    .filter((result) => result.taxonName?.fullName)
    .map((result) => ({
      id: String(result.id),
      scientificName: result.taxonName!.fullName!,
      taxonomicStatus: result.taxonomicStatus ?? null,
    }));
}

/**
 * Find an exact VicFlora taxon.
 *
 * We deliberately DO NOT use the first autocomplete result
 * if the scientific name does not match.
 */
export async function findTaxon(
  scientificName: string
): Promise<VicFloraTaxon | null> {
  const results = await searchTaxa(scientificName);

  const normalizedInput = scientificName.trim().toLowerCase();

  const exactMatch = results.find(
    (result) =>
      result.scientificName.trim().toLowerCase() === normalizedInput
  );

  return exactMatch ?? null;
}

export async function fetchPhenology(
  taxonConceptId: string
): Promise<PhenologyItem[]> {
  const query = `
    query taxonConceptPhenology($taxonConceptId: ID!) {
      taxonConceptPhenology(taxonConceptId: $taxonConceptId) {
        month
        total
        buds
        flowers
        fruit
      }
    }
  `;

  const response = await fetch(VICFLORA_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables: {
        taxonConceptId,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`VicFlora API error: ${response.status}`);
  }

  const data = await response.json();

  if (data.errors) {
    throw new Error(
      `VicFlora GraphQL error: ${JSON.stringify(data.errors)}`
    );
  }

  return data.data?.taxonConceptPhenology ?? [];
}