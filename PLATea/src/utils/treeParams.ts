export type TreeRouteParams = {
  id?: string;
  commonName?: string;
  scientificName?: string;
  genus?: string;
  family?: string;
  precinct?: string;
  locationType?: string;
  datePlanted?: string;
  ageDescription?: string;
  dbh?: string;
  latitude?: string;
  longitude?: string;
};

/*
 * Serializes a tree's fields into the shape
 * expo-router expects for search params,
 * shared between the Map -> Tree Details
 * and Tree Details -> Map navigations.
 */
export function treeToRouteParams(tree: TreeRouteParams) {
  return {
    id: tree.id ?? '',
    commonName: tree.commonName ?? '',
    scientificName: tree.scientificName ?? '',
    genus: tree.genus ?? '',
    family: tree.family ?? '',
    precinct: tree.precinct ?? '',
    locationType: tree.locationType ?? '',
    datePlanted: tree.datePlanted ?? '',
    ageDescription: tree.ageDescription ?? '',
    dbh: tree.dbh ?? '',
    latitude: tree.latitude ?? '',
    longitude: tree.longitude ?? '',
  };
}
