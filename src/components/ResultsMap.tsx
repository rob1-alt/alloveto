"use client";

import { useEffect, useMemo, useState } from "react";
import { MapContainer, Popup, TileLayer, CircleMarker, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { PARIS_CENTER } from "@/lib/mockResults";
import { parseVetsMarkdown, arrondissementFromAddress } from "@/lib/chatUtils";

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


type ResultsMapProps = {
  query: string; // currently unused, kept for future filtering
  loc: string; // currently unused, kept for future geocoding
};

export default function ResultsMap({ query: _query, loc: _loc }: ResultsMapProps) {
  const center = PARIS_CENTER;
  const [markers, setMarkers] = useState<{ id: string; name: string; position: [number, number]; address: string }[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/veto-cabinet.md");
        if (!res.ok) return;
        const md = await res.text();
        const vets = parseVetsMarkdown(md);
        const in15 = vets.filter((v) => arrondissementFromAddress(v.address) === 15);
        const parsed = in15
          .map((v, idx) => {
            const coords = extractLatLngFromMapsUrl(v.mapsUrl);
            if (!coords) return null;
            return { id: String(idx), name: v.name, position: coords, address: v.address } as const;
          })
          .filter(Boolean) as { id: string; name: string; position: [number, number]; address: string }[];
        if (!cancelled) setMarkers(parsed);
      } catch {
        // ignore
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <MapContainer center={center} zoom={13} style={{ height: "100%", width: "100%" }} scrollWheelZoom={true}>
      <TileLayer
        attribution='&copy; OpenStreetMap, © <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />
      <Circle center={center} radius={2000} pathOptions={{ color: "#0f8f70", weight: 1, fillColor: "#0f8f70", fillOpacity: 0.08 }} />
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
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${m.position[0]},${m.position[1]}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-2 text-[#0f8f70] text-sm font-medium"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M12 22s7-6.16 7-12a7 7 0 1 0-14 0c0 5.84 7 12 7 12Zm0-9a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z" fill="currentColor"/>
              </svg>
              Ouvrir dans Google Maps
            </a>
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
    map.fitBounds(bounds, { padding: [30, 30], maxZoom: 15, animate: true });
    L.control.scale({ metric: true, imperial: false, position: "bottomleft" }).addTo(map);
  }, [items, map]);
  return null;
}


function extractLatLngFromMapsUrl(url: string): [number, number] | null {
  try {
    const u = new URL(url);
    const q = u.searchParams.get("query");
    if (!q) return null;
    const [latStr, lngStr] = decodeURIComponent(q).split(",");
    const lat = parseFloat(latStr);
    const lng = parseFloat(lngStr);
    if (Number.isFinite(lat) && Number.isFinite(lng)) return [lat, lng];
    return null;
  } catch {
    return null;
  }
}


