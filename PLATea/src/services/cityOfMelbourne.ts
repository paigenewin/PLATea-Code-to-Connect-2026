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

interface MelbourneRecord {
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

interface MelbourneApiResponse {
  results: MelbourneRecord[];
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

  const whereClause = `latitude>${minLat} AND latitude<${maxLat} AND longitude>${minLng} AND longitude<${maxLng}`;
  const url = `${BASE_URL}?where=${encodeURIComponent(whereClause)}&limit=${limit}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Melbourne tree API error: ${response.status}`);
    }
    const data: MelbourneApiResponse = await response.json();

    return data.results.map((record) => ({
      id: record.com_id,
      commonName: record.common_name,
      scientificName: record.scientific_name,
      genus: record.genus,
      family: record.family,
      dbh: record.diameter_breast_height,
      datePlanted: record.date_planted,
      ageDescription: record.age_description,
      precinct: record.precinct,
      locationType: record.located_in,
      latitude: record.latitude,
      longitude: record.longitude,
      council: 'melbourne' as const,
    }));
  } catch (error) {
    console.error('Failed to fetch Melbourne trees:', error);
    return [];
  }
}