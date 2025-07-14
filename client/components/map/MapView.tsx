import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  X,
  MapPin,
  Navigation,
  Star,
  Clock,
  Phone,
  Navigation2 as Directions,
  Locate,
  Layers,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Filter,
  Search,
  Route,
  Car,
  PersonStanding as Walk,
  Bike,
  CheckCircle,
  AlertCircle,
  Wifi,
  Camera,
} from "lucide-react";

interface Salon {
  id: string;
  name: string;
  lat: number;
  lng: number;
  rating: number;
  reviews: number;
  distance: string;
  address: string;
  phone: string;
  image: string;
  services: string[];
  priceRange: string;
  openNow: boolean;
  nextAvailable: string;
}

interface MapViewProps {
  isOpen: boolean;
  onClose: () => void;
  salons: Salon[];
  userLocation?: { lat: number; lng: number };
  selectedSalon?: string;
  onSalonSelect: (salonId: string) => void;
  onBookNow: (salonId: string) => void;
}

const MapView: React.FC<MapViewProps> = ({
  isOpen,
  onClose,
  salons,
  userLocation,
  selectedSalon,
  onSalonSelect,
  onBookNow,
}) => {
  const [mapCenter, setMapCenter] = useState({
    lat: 19.076,
    lng: 72.8777, // Mumbai coordinates
  });
  const [zoom, setZoom] = useState(12);
  const [mapStyle, setMapStyle] = useState("standard");
  const [showDirections, setShowDirections] = useState<string | null>(null);
  const [userLocationFound, setUserLocationFound] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [travelMode, setTravelMode] = useState<
    "driving" | "walking" | "transit"
  >("driving");
  const [showFilters, setShowFilters] = useState(false);
  const [realTimeData, setRealTimeData] = useState<
    Record<string, { waitTime: number; available: boolean }>
  >({});
  const [routeInfo, setRouteInfo] = useState<{
    distance: string;
    duration: string;
  } | null>(null);

  // Real-time data simulation
  useEffect(() => {
    const interval = setInterval(() => {
      const newRealTimeData: Record<
        string,
        { waitTime: number; available: boolean }
      > = {};
      mockSalons.forEach((salon) => {
        newRealTimeData[salon.id] = {
          waitTime: Math.floor(Math.random() * 30) + 5,
          available: Math.random() > 0.2,
        };
      });
      setRealTimeData(newRealTimeData);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // Mock salon data with Mumbai locations
  const mockSalons: Salon[] = [
    {
      id: "1",
      name: "Glamour Studio",
      lat: 19.0596,
      lng: 72.8295,
      rating: 4.8,
      reviews: 1250,
      distance: "2.3 km",
      address: "123 Linking Road, Bandra West, Mumbai 400050",
      phone: "+91 98765 43210",
      image: "🏢",
      services: ["Bridal", "Hair Color", "Spa"],
      priceRange: "₹₹₹",
      openNow: true,
      nextAvailable: "Today 3:00 PM",
    },
    {
      id: "2",
      name: "Beauty Palace",
      lat: 19.1136,
      lng: 72.8697,
      rating: 4.6,
      reviews: 890,
      distance: "3.1 km",
      address: "456 SV Road, Andheri East, Mumbai 400069",
      phone: "+91 98765 43211",
      image: "🏛️",
      services: ["Spa", "Skincare", "Massage"],
      priceRange: "₹₹",
      openNow: false,
      nextAvailable: "Tomorrow 10:00 AM",
    },
    {
      id: "3",
      name: "Luxe Salon & Spa",
      lat: 19.099,
      lng: 72.8258,
      rating: 4.9,
      reviews: 2100,
      distance: "4.2 km",
      address: "789 Juhu Beach Road, Juhu, Mumbai 400049",
      phone: "+91 98765 43212",
      image: "✨",
      services: ["Premium", "Celebrity", "Bridal"],
      priceRange: "₹₹₹₹",
      openNow: true,
      nextAvailable: "Today 5:30 PM",
    },
    {
      id: "4",
      name: "Style Studio",
      lat: 19.0825,
      lng: 72.8428,
      rating: 4.4,
      reviews: 654,
      distance: "1.8 km",
      address: "321 Hill Road, Bandra West, Mumbai 400050",
      phone: "+91 98765 43213",
      image: "💇‍♀️",
      services: ["Hair", "Nails", "Makeup"],
      priceRange: "₹₹",
      openNow: true,
      nextAvailable: "Today 2:15 PM",
    },
    {
      id: "5",
      name: "Wellness Retreat",
      lat: 19.0176,
      lng: 72.8562,
      rating: 4.7,
      reviews: 1120,
      distance: "5.7 km",
      address: "654 Worli Sea Face, Worli, Mumbai 400018",
      phone: "+91 98765 43214",
      image: "🧘‍♀️",
      services: ["Spa", "Ayurveda", "Wellness"],
      priceRange: "₹₹₹",
      openNow: true,
      nextAvailable: "Today 4:00 PM",
    },
  ];

  const allSalons = salons.length > 0 ? salons : mockSalons;

  useEffect(() => {
    if (userLocation) {
      setMapCenter(userLocation);
      setUserLocationFound(true);
    }
  }, [userLocation]);

  if (!isOpen) return null;

  const findUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setMapCenter(location);
          setUserLocationFound(true);
        },
        (error) => {
          console.error("Error getting location:", error);
          // Fallback to Mumbai center
          setMapCenter({ lat: 19.076, lng: 72.8777 });
        },
      );
    }
  };

  const getDirections = (salon: Salon) => {
    const destination = `${salon.lat},${salon.lng}`;
    const origin = userLocation
      ? `${userLocation.lat},${userLocation.lng}`
      : "current+location";

    // Simulate route calculation
    const distance = Math.random() * 10 + 1;
    const baseTime =
      travelMode === "walking"
        ? distance * 12
        : travelMode === "transit"
          ? distance * 8
          : distance * 3;
    setRouteInfo({
      distance: `${distance.toFixed(1)} km`,
      duration: `${Math.round(baseTime)} min`,
    });

    // In a real app, this would open Google Maps or Apple Maps
    const googleMapsUrl = `https://www.google.com/maps/dir/${origin}/${destination}?travelmode=${travelMode === "driving" ? "driving" : travelMode === "walking" ? "walking" : "transit"}`;
    window.open(googleMapsUrl, "_blank");

    setShowDirections(salon.id);
  };

  const resetMap = () => {
    setMapCenter({ lat: 19.076, lng: 72.8777 });
    setZoom(12);
    setShowDirections(null);
  };

  const selectedSalonData = allSalons.find((s) => s.id === selectedSalon);

  const filteredSalons = allSalons.filter(
    (salon) =>
      salon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      salon.services.some((service) =>
        service.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
  );

  return (
    <div className="fixed inset-0 z-50 bg-white">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 p-4 z-10">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Nearby Salons</h2>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={findUserLocation}>
              <Locate className="h-4 w-4 mr-1" />
              My Location
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search salons, services..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        {/* Travel Mode Selector */}
        <div className="flex gap-1 mt-3">
          <Button
            variant={travelMode === "driving" ? "default" : "outline"}
            size="sm"
            onClick={() => setTravelMode("driving")}
            className="flex-1"
          >
            <Car className="h-3 w-3 mr-1" />
            Drive
          </Button>
          <Button
            variant={travelMode === "walking" ? "default" : "outline"}
            size="sm"
            onClick={() => setTravelMode("walking")}
            className="flex-1"
          >
            <Walk className="h-3 w-3 mr-1" />
            Walk
          </Button>
          <Button
            variant={travelMode === "transit" ? "default" : "outline"}
            size="sm"
            onClick={() => setTravelMode("transit")}
            className="flex-1"
          >
            <Route className="h-3 w-3 mr-1" />
            Transit
          </Button>
        </div>
      </div>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Map Area */}
        <div className="flex-1 relative bg-gradient-to-br from-blue-100 to-green-100">
          {/* Mock Map Interface */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">🗺️</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Interactive Map
              </h3>
              <p className="text-gray-600 mb-4">
                Showing {allSalons.length} salons near you
              </p>
              <div className="grid grid-cols-2 gap-4 max-w-md">
                {allSalons.slice(0, 4).map((salon) => (
                  <div
                    key={salon.id}
                    className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedSalon === salon.id
                        ? "border-rose-500 bg-rose-50"
                        : "border-gray-200 bg-white hover:border-rose-300"
                    }`}
                    onClick={() => onSalonSelect(salon.id)}
                  >
                    <div className="text-2xl mb-1">{salon.image}</div>
                    <div className="text-sm font-medium">{salon.name}</div>
                    <div className="text-xs text-gray-500">
                      {salon.distance}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Map Controls */}
          <div className="absolute top-4 right-4 space-y-2">
            <div className="bg-white rounded-lg shadow-lg p-2 space-y-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setZoom(zoom + 1)}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setZoom(zoom - 1)}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={resetMap}>
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  setMapStyle(
                    mapStyle === "standard" ? "satellite" : "standard",
                  )
                }
              >
                <Layers className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* User Location Indicator */}
          {userLocationFound && (
            <div className="absolute bottom-4 left-4">
              <div className="bg-blue-500 text-white px-3 py-2 rounded-full text-sm flex items-center gap-2">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                Your Location
              </div>
            </div>
          )}
        </div>

        {/* Salon List Sidebar */}
        <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">
                {filteredSalons.length} Salon
                {filteredSalons.length !== 1 ? "s" : ""} Found
              </h3>
              {userLocationFound && (
                <div className="flex items-center gap-1 text-xs text-green-600">
                  <Wifi className="h-3 w-3" />
                  Live
                </div>
              )}
            </div>

            <div className="space-y-4">
              {filteredSalons.map((salon) => (
                <Card
                  key={salon.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedSalon === salon.id
                      ? "ring-2 ring-rose-500 bg-rose-50"
                      : ""
                  }`}
                  onClick={() => onSalonSelect(salon.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">{salon.image}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 truncate">
                              {salon.name}
                            </h4>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex items-center gap-1">
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                <span className="text-xs text-gray-600">
                                  {salon.rating}
                                </span>
                              </div>
                              <span className="text-xs text-gray-400">
                                ({salon.reviews})
                              </span>
                              <span className="text-xs text-gray-600">
                                • {salon.distance}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs font-medium text-gray-900">
                              {salon.priceRange}
                            </div>
                            {salon.openNow ? (
                              <Badge className="bg-green-100 text-green-700 text-xs">
                                Open
                              </Badge>
                            ) : (
                              <Badge className="bg-red-100 text-red-700 text-xs">
                                Closed
                              </Badge>
                            )}
                          </div>
                        </div>

                        <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                          {salon.address}
                        </p>

                        <div className="flex gap-1 mt-2">
                          {salon.services.slice(0, 2).map((service) => (
                            <Badge
                              key={service}
                              variant="secondary"
                              className="text-xs px-2 py-0"
                            >
                              {service}
                            </Badge>
                          ))}
                        </div>

                        {/* Real-time status */}
                        {realTimeData[salon.id] && (
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-2">
                              {realTimeData[salon.id].available ? (
                                <div className="flex items-center gap-1 text-xs text-green-600">
                                  <CheckCircle className="h-3 w-3" />
                                  Available now
                                </div>
                              ) : (
                                <div className="flex items-center gap-1 text-xs text-orange-600">
                                  <AlertCircle className="h-3 w-3" />
                                  Wait ~{realTimeData[salon.id].waitTime}m
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-1 text-xs text-gray-600">
                            <Clock className="h-3 w-3" />
                            {salon.nextAvailable}
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                getDirections(salon);
                              }}
                              className="h-7 w-7 p-0"
                            >
                              <Directions className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(`tel:${salon.phone}`, "_self");
                              }}
                              className="h-7 w-7 p-0"
                            >
                              <Phone className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Selected Salon Details */}
      {selectedSalonData && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-96">
          <Card className="shadow-xl bg-white/95 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{selectedSalonData.image}</div>
                  <div>
                    <CardTitle className="text-lg">
                      {selectedSalonData.name}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm text-gray-600">
                        {selectedSalonData.rating} ({selectedSalonData.reviews}{" "}
                        reviews)
                      </span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onSalonSelect("")}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>{selectedSalonData.address}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>Next available: {selectedSalonData.nextAvailable}</span>
                </div>

                {/* Real-time availability */}
                {realTimeData[selectedSalonData.id] && (
                  <div className="flex items-center gap-2 text-sm">
                    {realTimeData[selectedSalonData.id].available ? (
                      <div className="flex items-center gap-1 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span>Available for walk-in</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-orange-600">
                        <AlertCircle className="h-4 w-4" />
                        <span>
                          Current wait: ~
                          {realTimeData[selectedSalonData.id].waitTime} min
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Route Info */}
                {routeInfo && showDirections === selectedSalonData.id && (
                  <div className="bg-blue-50 p-2 rounded text-sm">
                    <div className="flex items-center gap-2">
                      <Route className="h-4 w-4 text-blue-600" />
                      <span className="text-blue-800">
                        {routeInfo.distance} • {routeInfo.duration} by{" "}
                        {travelMode}
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex gap-2 mt-3">
                  <Button
                    variant="outline"
                    onClick={() => getDirections(selectedSalonData)}
                    className="flex-1"
                  >
                    <Navigation className="mr-2 h-4 w-4" />
                    Directions
                  </Button>
                  <Button
                    onClick={() => onBookNow(selectedSalonData.id)}
                    className="flex-1 bg-rose-500 hover:bg-rose-600"
                  >
                    Book Now
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default MapView;
