"use client";

import { useEffect, useMemo } from "react";
import { MapContainer, Popup, TileLayer, CircleMarker, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Ensure Leaflet default marker icons work if used elsewhere
if (typeof window !== "undefined") {
  const iconUrl = new URL("../../node_modules/leaflet/dist/images/marker-icon.png", import.meta.url).toString();
  const iconRetinaUrl = new URL("../../node_modules/leaflet/dist/images/marker-icon-2x.png", import.meta.url).toString();
  const shadowUrl = new URL("../../node_modules/leaflet/dist/images/marker-shadow.png", import.meta.url).toString();
  const DefaultIcon = L.icon({
    iconUrl,
    iconRetinaUrl,
    shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (L.Marker.prototype.options as any).icon = DefaultIcon;
}

export type Result = {
  id: string;
  name: string;
  position: [number, number];
  address: string;
};

const PARIS_CENTER: [number, number] = [48.8566, 2.3522];

export const MOCK_RESULTS: Result[] = [
  { id: "1", name: "Clinique Vétérinaire du Marais", position: [48.8575, 2.3622], address: "12 Rue du Marais, 75003 Paris" },
  { id: "2", name: "Véto Opéra", position: [48.8696, 2.3320], address: "8 Rue de l'Opéra, 75001 Paris" },
  { id: "3", name: "Cabinet Vétérinaire Montparnasse", position: [48.8422, 2.3211], address: "25 Bd du Montparnasse, 75006 Paris" },
  { id: "4", name: "Véto Bastille", position: [48.853, 2.369], address: "5 Pl. de la Bastille, 75011 Paris" },
  { id: "5", name: "Clinique Vétérinaire Belleville", position: [48.8746, 2.3808], address: "44 Rue de Belleville, 75020 Paris" },
];

type ResultsMapProps = {
  query: string; // currently unused, kept for future filtering
  loc: string; // currently unused, kept for future geocoding
};

export default function ResultsMap({ query, loc }: ResultsMapProps) {
  const center = PARIS_CENTER;
  const markers = useMemo(() => MOCK_RESULTS, []);

  return (
    <MapContainer center={center} zoom={13} style={{ height: "100%", width: "100%" }} scrollWheelZoom={true}>
      <TileLayer
        attribution='&copy; OpenStreetMap, © <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />
      <Circle center={center} radius={3000} pathOptions={{ color: "#0f8f70", weight: 1, fillColor: "#0f8f70", fillOpacity: 0.08 }} />
      {markers.map((m) => (
        <CircleMarker
          key={m.id}
          center={m.position}
          radius={9}
          pathOptions={{ color: "#0f8f70", weight: 2, fillColor: "#12a282", fillOpacity: 0.9 }}
        >
          <Popup>
            <div className="font-semibold">{m.name}</div>
            <div className="text-sm">{m.address}</div>
          </Popup>
        </CircleMarker>
      ))}
      <FitToMarkers items={markers} />
    </MapContainer>
  );
}

function FitToMarkers({ items }: { items: { position: [number, number] }[] }) {
  const map = useMap();
  useEffect(() => {
    if (!items || items.length === 0) return;
    const bounds = L.latLngBounds(items.map((i) => L.latLng(i.position[0], i.position[1])));
    map.fitBounds(bounds, { padding: [30, 30], maxZoom: 14, animate: true });
    L.control.scale({ metric: true, imperial: false, position: "bottomleft" }).addTo(map);
  }, [items, map]);
  return null;
}


