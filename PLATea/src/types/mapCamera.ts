// Camera-control shape shared by native (react-native-maps MapView)
// and web (maplibre) map refs, so hooks like useSelectedTree and
// useTreeTracking don't have to import react-native-maps directly -
// that import has no web implementation and breaks web bundling.

export type MapRegion = {
  latitude: number;
  longitude: number;
  latitudeDelta?: number;
  longitudeDelta?: number;
};

export type MapCameraUpdate = {
  center?: { latitude: number; longitude: number };
  zoom?: number;
  heading?: number;
};

export interface MapCameraController {
  animateToRegion(region: MapRegion, duration?: number): void;
  animateCamera(camera: MapCameraUpdate, opts?: { duration?: number }): void;
}
