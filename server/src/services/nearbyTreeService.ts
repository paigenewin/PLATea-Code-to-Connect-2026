const BASE_URL =
  "https://data.melbourne.vic.gov.au/api/explore/v2.1/catalog/datasets/trees-with-species-and-dimensions-urban-forest/records";

interface MelbourneTreeRecord {
  com_id: string;
  common_name: string | null;
  scientific_name: string | null;
  latitude: number | null;
  longitude: number | null;
  precinct: string | null;
}

interface MelbourneTreeResponse {
  results?: MelbourneTreeRecord[];
}

export interface NearbyTree {
  id: string;
  commonName: string | null;
  scientificName: string | null;
  latitude: number;
  longitude: number;
  precinct: string | null;
  distanceMetres: number;
}

function calculateDistanceMetres(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const earthRadius = 6371000;

  const toRadians = (degrees: number) =>
    (degrees * Math.PI) / 180;

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) ** 2;

  const c =
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    );

  return earthRadius * c;
}

export async function findNearbyTrees(
  scientificName: string,
  userLat: number,
  userLng: number,
  limit = 5
): Promise<NearbyTree[]> {
  const safeScientificName =
    scientificName.replace(/"/g, '\\"');

  const distanceExpression =
    `distance(coordinatelocation, geom'POINT(${userLng} ${userLat})')`;

  const params = new URLSearchParams({
    select:
      "com_id, common_name, scientific_name, latitude, longitude, precinct",

    where:
      `scientific_name = "${safeScientificName}"`,

    order_by:
      `${distanceExpression} asc`,

    limit: String(limit),
  });

  const response = await fetch(
    `${BASE_URL}?${params.toString()}`
  );

  if (!response.ok) {
    const errorText = await response.text();

    console.error(
      "City of Melbourne nearby tree error:",
      errorText
    );

    throw new Error(
      `City of Melbourne API error: ${response.status}`
    );
  }

  const data: MelbourneTreeResponse =
    await response.json();

  const trees = (data.results ?? [])
    .filter(
      (
        tree
      ): tree is MelbourneTreeRecord & {
        latitude: number;
        longitude: number;
      } =>
        typeof tree.latitude === "number" &&
        typeof tree.longitude === "number"
    )
    .map((tree) => ({
      id: tree.com_id,
      commonName: tree.common_name,
      scientificName: tree.scientific_name,
      latitude: tree.latitude,
      longitude: tree.longitude,
      precinct: tree.precinct,

      distanceMetres: Math.round(
        calculateDistanceMetres(
          userLat,
          userLng,
          tree.latitude,
          tree.longitude
        )
      ),
    }));

  return trees;
}