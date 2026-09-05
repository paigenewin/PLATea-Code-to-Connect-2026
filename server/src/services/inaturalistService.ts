import type { Observation } from "../types/observation";

const BASE_URL = "https://api.inaturalist.org/v1/observations";

interface INaturalistPhoto {
  url?: string;
}

interface INaturalistTaxon {
  name?: string;
  preferred_common_name?: string;
}

interface INaturalistAnnotationValue {
  id?: number;
}

interface INaturalistAnnotation {
  controlled_attribute_id?: number;
  controlled_value_id?: number;
  controlled_value?: INaturalistAnnotationValue;
}

interface INaturalistRecord {
  id: number;
  observed_on?: string;
  geojson?: {
    coordinates?: [number, number];
  };
  taxon?: INaturalistTaxon;
  photos?: INaturalistPhoto[];
  annotations?: INaturalistAnnotation[];
}

interface INaturalistResponse {
  results: INaturalistRecord[];
}

export async function fetchRecentObservations(
  scientificName: string,
  daysBack: number = 14
): Promise<Observation[]> {
  const today = new Date();

  const startDate = new Date();
  startDate.setDate(today.getDate() - daysBack);

  const params = new URLSearchParams({
    taxon_name: scientificName,
    lat: "-37.8136",
    lng: "144.9631",
    radius: "30",
    d1: startDate.toISOString().split("T")[0],
    d2: today.toISOString().split("T")[0],
    per_page: "100",
    order_by: "observed_on",
    order: "desc",
  });

  const response = await fetch(`${BASE_URL}?${params.toString()}`);

  if (!response.ok) {
    throw new Error(`iNaturalist API error: ${response.status}`);
  }

  const data: INaturalistResponse = await response.json();

  return data.results.map((record) => {
    const coordinates = record.geojson?.coordinates;

    const hasFlowers =
      record.annotations?.some(
        (annotation) =>
          annotation.controlled_attribute_id === 12 &&
          (annotation.controlled_value_id === 13 ||
            annotation.controlled_value?.id === 13)
      ) ?? false;

    return {
      id: record.id,
      scientificName: record.taxon?.name ?? null,
      commonName: record.taxon?.preferred_common_name ?? null,
      observedOn: record.observed_on ?? null,
      latitude: coordinates?.[1] ?? null,
      longitude: coordinates?.[0] ?? null,
      photoUrl: record.photos?.[0]?.url ?? null,
      hasFlowers,
    };
  });
}