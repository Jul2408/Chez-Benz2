'use client';

import { useEffect } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface SellerLocationMapProps {
    latitude: number;
    longitude: number;
    sellerName: string;
    city?: string;
}

export function SellerLocationMap({ latitude, longitude, sellerName, city }: SellerLocationMapProps) {
    return (
        <div className="relative w-full h-[300px] rounded-xl overflow-hidden border shadow-md">
            <MapContainer
                center={[latitude, longitude]}
                zoom={13}
                scrollWheelZoom={false}
                className="h-full w-full z-0"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[latitude, longitude]}>
                    <Popup>
                        <div className="text-center">
                            <p className="font-bold">{sellerName}</p>
                            {city && <p className="text-sm text-muted-foreground">{city}</p>}
                        </div>
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    );
}
