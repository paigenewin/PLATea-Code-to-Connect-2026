export function calculateDistance(
  userLat: number,
  userLng: number,
  treeLat: number,
  treeLng: number
): number {
  const earthRadius = 6371000;

  const radians = (degrees: number) =>
    degrees * (Math.PI / 180);

  const latDifference =
    radians(treeLat - userLat);

  const lngDifference =
    radians(treeLng - userLng);

  const a =
    Math.sin(latDifference / 2) ** 2 +
    Math.cos(radians(userLat)) *
      Math.cos(radians(treeLat)) *
    Math.sin(lngDifference / 2) ** 2;

  const c =
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    );

  return earthRadius * c;
}

export function formatDistance(
  metres: number
): string {
  if (metres < 1000) {
    return `${Math.round(metres)} m away`;
  }

  return `${(metres / 1000).toFixed(2)} km away`;
}