export interface Observation {
  id: number;
  scientificName: string | null;
  commonName: string | null;
  observedOn: string | null;
  latitude: number | null;
  longitude: number | null;
  photoUrl: string | null;
  hasFlowers: boolean;
}