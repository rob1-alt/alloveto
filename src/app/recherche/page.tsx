"use client";

import { useEffect, useMemo } from "react";
import { MapContainer, Popup, TileLayer, CircleMarker, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Navbar from "@/components/Navbar";

// If we ever use Leaflet Marker, ensure default icons work in Next.js
const DefaultIcon = L.icon({
  iconUrl: typeof window !== "undefined" ? require("leaflet/dist/images/marker-icon.png") : "",
  iconRetinaUrl: typeof window !== "undefined" ? require("leaflet/dist/images/marker-icon-2x.png") : "",
  shadowUrl: typeof window !== "undefined" ? require("leaflet/dist/images/marker-shadow.png") : "",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = DefaultIcon as any;

type Result = {
  id: string;
  name: string;
  position: [number, number];
  address: string;
};

const PARIS_CENTER: [number, number] = [48.8566, 2.3522];

// Simple mock data around Paris
const MOCK_RESULTS: Result[] = [
  { id: "1", name: "Clinique Vétérinaire du Marais", position: [48.8575, 2.3622], address: "12 Rue du Marais, 75003 Paris" },
  { id: "2", name: "Véto Opéra", position: [48.8696, 2.3320], address: "8 Rue de l'Opéra, 75001 Paris" },
  { id: "3", name: "Cabinet Vétérinaire Montparnasse", position: [48.8422, 2.3211], address: "25 Bd du Montparnasse, 75006 Paris" },
  { id: "4", name: "Véto Bastille", position: [48.8530, 2.3690], address: "5 Pl. de la Bastille, 75011 Paris" },
  { id: "5", name: "Clinique Vétérinaire Belleville", position: [48.8746, 2.3808], address: "44 Rue de Belleville, 75020 Paris" },
];

export default function SearchPage({ searchParams }: { searchParams: { q?: string; loc?: string } }) {
  const query = searchParams?.q || "";
  const loc = searchParams?.loc || "Paris";

  // Center Paris; in a real app we'd geocode loc
  const center = PARIS_CENTER;

  // Pre-create markers for stable keys
  const markers = useMemo(() => MOCK_RESULTS, []);

  useEffect(() => {
    // No-op, but keeps the file as a client component and could handle side effects
  }, []);

  return (
    <div className="min-h-screen grid grid-rows-[auto_1fr] bg-[#e7f3ec]">
      <Navbar className="w-full" />
      <div className="flex items-center justify-between max-w-[1200px] mx-auto px-6">
        <h1 className="text-[#102a23] text-[24px] font-bold">Résultats</h1>
        <div className="text-[#0f8f70]">{loc}{query ? ` · ${query}` : ""}</div>
      </div>
      <main className="grid grid-cols-1 md:grid-cols-[380px_1fr] max-w-[1200px] mx-auto gap-4 px-6 pb-8 w-full">
        <aside className="bg-white rounded-2xl border border-[#dfe8e3] p-4 overflow-auto max-h-[70vh]">
          <ul className="space-y-3">
            {markers.map((m) => (
              <li key={m.id} className="p-3 rounded-xl border border-[#e6eee9] hover:bg-[#f7fbf9]">
                <div className="font-semibold text-[#102a23]">{m.name}</div>
                <div className="text-sm text-[#60756f]">{m.address}</div>
              </li>
            ))}
          </ul>
        </aside>
        <div className="h-[70vh] rounded-2xl overflow-hidden border border-[#dfe8e3] shadow-sm">
          <MapContainer center={center} zoom={13} style={{ height: "100%", width: "100%" }} scrollWheelZoom={true}>
            <TileLayer
              attribution='&copy; OpenStreetMap, © <a href="https://carto.com/attributions">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            />
            {/* Soft highlight around Paris center */}
            <Circle center={center} radius={3000} pathOptions={{ color: "#0f8f70", weight: 1, fillColor: "#0f8f70", fillOpacity: 0.08 }} />

            {/* Themed circle markers for each result */}
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

            {/* Fit to markers and add a metric scale */}
            <FitToMarkers items={markers} />
          </MapContainer>
        </div>
      </main>
    </div>
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


