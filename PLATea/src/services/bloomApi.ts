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
