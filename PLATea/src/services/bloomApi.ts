import { Tree } from './cityOfMelbourne';

const API_URL =
  process.env.EXPO_PUBLIC_API_URL ??
  'http://localhost:3000';

export type BloomStatus =
  | 'not_in_season'
  | 'blooming_soon'
  | 'blooming'
  | 'unknown';

export async function fetchBloomPrediction(
  scientificName: string
): Promise<BloomStatus> {
  const response = await fetch(
    `${API_URL}/flowers/${encodeURIComponent(scientificName)}/prediction`
  );

  if (!response.ok) {
    throw new Error(
      `Bloom prediction request failed with status ${response.status}`
    );
  }

  const data = await response.json();
  return data.status as BloomStatus;
}

export type BloomingSpecies = {
  displayName: string;
  scientificNames: string[];
};

export async function fetchBloomingSpecies(): Promise<BloomingSpecies[]> {
  const response = await fetch(`${API_URL}/flowers/blooming`);

  if (!response.ok) {
    throw new Error(
      `Blooming species request failed with status ${response.status}`
    );
  }

  const data = await response.json();
  return data.species as BloomingSpecies[];
}

type BloomingTreeFields = {
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
};

/*
 * One call for both the blooming species list and
 * every real City of Melbourne tree matching them -
 * the server does the species lookup and the paginated
 * tree search, instead of the client calling the City
 * of Melbourne API directly itself.
 */
export async function fetchBloomingTrees(): Promise<{
  species: BloomingSpecies[];
  trees: Tree[];
}> {
  const response = await fetch(`${API_URL}/flowers/blooming/trees`);

  if (!response.ok) {
    throw new Error(
      `Blooming trees request failed with status ${response.status}`
    );
  }

  const data = await response.json();

  const trees: Tree[] = (data.trees as BloomingTreeFields[]).map(
    (tree) => ({
      ...tree,
      council: 'melbourne' as const,
    })
  );

  return {
    species: data.species as BloomingSpecies[],
    trees,
  };
}

export type NearbyTree = {
  id: string;
  commonName: string | null;
  scientificName: string | null;
  latitude: number;
  longitude: number;
  precinct: string | null;
  distanceMetres: number;
};

export async function fetchNearbyTrees(
  scientificName: string,
  lat: number,
  lng: number,
  limit = 5
): Promise<NearbyTree[]> {
  const params = new URLSearchParams({
    lat: String(lat),
    lng: String(lng),
    limit: String(limit),
  });

  const response = await fetch(
    `${API_URL}/flowers/${encodeURIComponent(scientificName)}/nearby?${params.toString()}`
  );

  if (!response.ok) {
    throw new Error(
      `Nearby tree request failed with status ${response.status}`
    );
  }

  const data = await response.json();
  return data.trees as NearbyTree[];
}
