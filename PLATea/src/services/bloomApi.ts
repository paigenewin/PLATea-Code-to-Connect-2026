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
