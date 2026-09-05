export interface FlowerProfile {
  id: string;
  displayName: string;

  genus?: string;
  scientificNames: string[];

  floweringStartMonth: number;
  floweringEndMonth: number;

  sourceName: string;
  sourceUrl: string;
}