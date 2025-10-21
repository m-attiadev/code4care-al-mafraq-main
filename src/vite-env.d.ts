/// <reference types="vite/client" />

declare namespace google.maps {
  // تعريفات Google Maps API
  interface MapOptions {
    center: google.maps.LatLngLiteral;
    zoom: number;
  }
  class Map {
    constructor(element: HTMLElement, options: MapOptions);
  }
  interface LatLngLiteral {
    lat: number;
    lng: number;
  }
}
