// services/cityOfMelbourne.ts

export interface Tree {
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
  council: 'melbourne';
}

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
  id: string;
  fields: MelbourneFields;
}

interface MelbourneRecordEntry {
  record: MelbourneRecord;
}

interface MelbourneApiResponse {
  records?: MelbourneRecordEntry[];
}

export interface Bounds {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
}
const BASE_URL =
  'https://data.melbourne.vic.gov.au/api/v2/catalog/datasets/trees-with-species-and-dimensions-urban-forest/records';

export async function fetchMelbourneTrees(
  bounds: Bounds,
  limit: number = 100
): Promise<Tree[]> {
  const { minLat, maxLat, minLng, maxLng } = bounds;
  const whereClause = `latitude > ${minLat} and latitude < ${maxLat} and longitude > ${minLng} and longitude < ${maxLng}`;
  const maxPageSize = 100;
  const target = Math.min(Math.max(1, limit), 1000);
  const trees: Tree[] = [];

  try {
    let offset = 0;

    while (trees.length < target) {
      const remaining = target - trees.length;
      const pageSize = Math.min(maxPageSize, remaining);
      const url = `${BASE_URL}?where=${encodeURIComponent(whereClause)}&limit=${pageSize}&offset=${offset}`;
      const response = await fetch(url);

      if (!response.ok) {
        const errorBody = await response.text();
        console.error('Melbourne API error body:', errorBody);
        throw new Error(`Melbourne tree API error: ${response.status}`);
      }

      const data: MelbourneApiResponse = await response.json();
      const records = Array.isArray(data.records) ? data.records : [];

      if (records.length === 0) {
        break;
      }

      const pageTrees = records.map((entry) => {
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
          council: 'melbourne' as const,
        };
      });

      trees.push(...pageTrees);

      if (records.length < pageSize) {
        break;
      }

      offset += pageSize;
    }

    return trees.filter((tree) => {
      const isGumTree =
        tree.commonName?.toLowerCase().includes('gum') ||
        tree.scientificName?.toLowerCase().includes('eucalyptus') ||
        tree.scientificName?.toLowerCase().includes('corymbia');

      return (
        !isGumTree &&
        tree.latitude >= minLat &&
        tree.latitude <= maxLat &&
        tree.longitude >= minLng &&
        tree.longitude <= maxLng
      );
    });
  } catch (error) {
    console.error('Failed to fetch Melbourne trees:', error);
    return [];
  }
}

// adding a search function 
export async function searchMelbourneTrees(
  query: string,
  limit: number = 50
): Promise<Tree[]> {
  const cleanQuery = query.trim();

  // Don't search for empty text
  if (cleanQuery.length < 2) {
    return [];
  }

  const safeQuery = cleanQuery.replace(/"/g, '\\"');

  const whereClause =
    `search(common_name, "${safeQuery}") ` +
    `OR search(scientific_name, "${safeQuery}") ` +
    `OR search(genus, "${safeQuery}")`;

  const url =
    `${BASE_URL}?where=${encodeURIComponent(whereClause)}` +
    `&limit=${limit}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      const errorBody = await response.text();

      console.error(
        'Melbourne search API error:',
        errorBody
      );

      throw new Error(
        `Melbourne search API error: ${response.status}`
      );
    }

    const data: MelbourneApiResponse =
      await response.json();

    const records =
      Array.isArray(data.records)
        ? data.records
        : [];

    return records.map((entry) => {
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
        council: 'melbourne' as const,
      };
    });
  } catch (error) {
    console.error(
      'Failed to search Melbourne trees:',
      error
    );

    return [];
  }
}