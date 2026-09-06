const BASE_URL =
  "https://data.melbourne.vic.gov.au/api/v2/catalog/datasets/trees-with-species-and-dimensions-urban-forest/records";

interface MelbourneFields {
  com_id: string;
  common_name: string | null;
  scientific_name: string | null;
  genus: string | null;
  family: string | null;
  diameter_breast_height: number | null;
  date_planted: string | null;
  age_description: string | null;
  precinct: string | null;
  located_in: string | null;
  latitude: number;
  longitude: number;
}

interface MelbourneRecord {
  fields: MelbourneFields;
}

interface MelbourneRecordEntry {
  record: MelbourneRecord;
}

interface MelbourneApiResponse {
  records?: MelbourneRecordEntry[];
}

export interface BloomingTree {
  id: string;
  commonName: string | null;
  scientificName: string | null;
  genus: string | null;
  family: string | null;
  dbh: number | null;
  datePlanted: string | null;
  ageDescription: string | null;
  precinct: string | null;
  locationType: string | null;
  latitude: number;
  longitude: number;
}

/*
 * Finds every City of Melbourne tree matching any of
 * the given scientific names. The API caps each request
 * at 100 rows, so this pages through with `offset` until
 * a page comes back short (no more results) or the safety
 * cap is hit - a single request was silently dropping most
 * trees for any species with more than 100 instances.
 */
export async function findTreesBySpecies(
  scientificNames: string[],
  maxResults = 2000
): Promise<BloomingTree[]> {
  if (scientificNames.length === 0) {
    return [];
  }

  const whereClause = scientificNames
    .map((name) => {
      const safeName = name.replace(/"/g, '\\"');
      return `search(scientific_name, "${safeName}")`;
    })
    .join(" OR ");

  const pageSize = 100;
  const trees: BloomingTree[] = [];
  let offset = 0;

  while (trees.length < maxResults) {
    const url =
      `${BASE_URL}?where=${encodeURIComponent(whereClause)}` +
      `&limit=${pageSize}&offset=${offset}`;

    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();

      console.error(
        "City of Melbourne species search error:",
        errorText
      );

      throw new Error(
        `City of Melbourne API error: ${response.status}`
      );
    }

    const data: MelbourneApiResponse = await response.json();
    const records = data.records ?? [];

    if (records.length === 0) {
      break;
    }

    trees.push(
      ...records.map((entry) => {
        const fields = entry.record.fields;

        return {
          id: fields.com_id,
          commonName: fields.common_name,
          scientificName: fields.scientific_name,
          genus: fields.genus,
          family: fields.family,
          dbh: fields.diameter_breast_height,
          datePlanted: fields.date_planted,
          ageDescription: fields.age_description,
          precinct: fields.precinct,
          locationType: fields.located_in,
          latitude: fields.latitude,
          longitude: fields.longitude,
        };
      })
    );

    if (records.length < pageSize) {
      break;
    }

    offset += pageSize;
  }

  return trees;
}
