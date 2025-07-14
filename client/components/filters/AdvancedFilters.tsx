import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  X,
  Filter,
  MapPin,
  Clock,
  Star,
  DollarSign,
  Calendar,
  Users,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Search,
  Sparkles,
  Zap,
  Target,
} from "lucide-react";

interface FilterOptions {
  priceRange: [number, number];
  duration: string[];
  location: {
    distance: number;
    areas: string[];
  };
  ratings: number;
  serviceTypes: string[];
  availability: {
    date: string;
    timeSlots: string[];
  };
  specialOffers: string[];
}

interface AdvancedFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: FilterOptions) => void;
  initialFilters?: Partial<FilterOptions>;
}

const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  isOpen,
  onClose,
  onApplyFilters,
  initialFilters = {},
}) => {
  const [filters, setFilters] = useState<FilterOptions>({
    priceRange: initialFilters.priceRange || [0, 10000],
    duration: initialFilters.duration || [],
    location: initialFilters.location || { distance: 10, areas: [] },
    ratings: initialFilters.ratings || 0,
    serviceTypes: initialFilters.serviceTypes || [],
    availability: initialFilters.availability || { date: "", timeSlots: [] },
    specialOffers: initialFilters.specialOffers || [],
  });

  const [quickSearch, setQuickSearch] = useState("");
  const [savedFilters, setSavedFilters] = useState<FilterOptions[]>([]);
  const [filterName, setFilterName] = useState("");

  const [expandedSections, setExpandedSections] = useState({
    price: true,
    duration: false,
    location: false,
    ratings: false,
    services: false,
    availability: false,
    offers: false,
  });

  if (!isOpen) return null;

  const serviceTypes = [
    "Hair Services",
    "Skin & Face Care",
    "Body Treatments",
    "Nail Care",
    "Waxing & Hair Removal",
    "Makeup & Grooming",
    "Men's Grooming",
    "Bridal Services",
    "Kids & Teens",
    "Special Services",
  ];

  const durationOptions = [
    "Quick (< 30 min)",
    "Short (30-60 min)",
    "Medium (1-2 hours)",
    "Long (2-4 hours)",
    "Extended (4+ hours)",
  ];

  const locationAreas = [
    "Bandra",
    "Andheri",
    "Juhu",
    "Powai",
    "Lower Parel",
    "Worli",
    "Malad",
    "Borivali",
    "Thane",
    "Navi Mumbai",
  ];

  const timeSlots = [
    "Morning (9-12 AM)",
    "Afternoon (12-4 PM)",
    "Evening (4-7 PM)",
    "Night (7-9 PM)",
  ];

  const specialOffers = [
    "First Time Discount",
    "Group Booking",
    "Package Deals",
    "Student Discount",
    "Senior Citizen",
    "Weekend Special",
    "Loyalty Rewards",
  ];

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const updateFilter = (key: keyof FilterOptions, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      priceRange: [0, 10000],
      duration: [],
      location: { distance: 10, areas: [] },
      ratings: 0,
      serviceTypes: [],
      availability: { date: "", timeSlots: [] },
      specialOffers: [],
    });
  };

  const handleApply = () => {
    onApplyFilters(filters);
    onClose();
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 10000) count++;
    if (filters.duration.length > 0) count++;
    if (filters.location.areas.length > 0) count++;
    if (filters.ratings > 0) count++;
    if (filters.serviceTypes.length > 0) count++;
    if (filters.availability.timeSlots.length > 0) count++;
    if (filters.specialOffers.length > 0) count++;
    return count;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50">
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold">Filters</h2>
              {getActiveFiltersCount() > 0 && (
                <Badge className="bg-rose-500">
                  {getActiveFiltersCount()} active
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <RotateCcw className="h-4 w-4 mr-1" />
                Clear
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Quick Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={quickSearch}
              onChange={(e) => setQuickSearch(e.target.value)}
              placeholder="Quick search services, salons..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm"
            />
          </div>

          {/* Saved Filters */}
          {savedFilters.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Saved Filters
              </h3>
              <div className="flex flex-wrap gap-2">
                {savedFilters.map((savedFilter, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => setFilters(savedFilter)}
                    className="text-xs"
                  >
                    <Target className="h-3 w-3 mr-1" />
                    Filter {index + 1}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Quick Filters */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              Quick Filters
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  updateFilter("specialOffers", ["First Time Discount"])
                }
                className="text-xs justify-start"
              >
                <Sparkles className="h-3 w-3 mr-1" />
                First Time
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateFilter("ratings", 4)}
                className="text-xs justify-start"
              >
                <Star className="h-3 w-3 mr-1" />
                High Rated
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateFilter("duration", ["Quick (< 30 min)"])}
                className="text-xs justify-start"
              >
                <Zap className="h-3 w-3 mr-1" />
                Quick Service
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateFilter("priceRange", [0, 2000])}
                className="text-xs justify-start"
              >
                <DollarSign className="h-3 w-3 mr-1" />
                Budget
              </Button>
            </div>
          </div>

          {/* Price Range */}
          <Card>
            <CardHeader
              className="pb-3 cursor-pointer"
              onClick={() => toggleSection("price")}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <CardTitle className="text-sm">Price Range</CardTitle>
                </div>
                {expandedSections.price ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </div>
            </CardHeader>
            {expandedSections.price && (
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <label className="text-xs text-gray-600">Min</label>
                      <input
                        type="number"
                        value={filters.priceRange[0]}
                        onChange={(e) =>
                          updateFilter("priceRange", [
                            parseInt(e.target.value) || 0,
                            filters.priceRange[1],
                          ])
                        }
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        placeholder="₹0"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-xs text-gray-600">Max</label>
                      <input
                        type="number"
                        value={filters.priceRange[1]}
                        onChange={(e) =>
                          updateFilter("priceRange", [
                            filters.priceRange[0],
                            parseInt(e.target.value) || 10000,
                          ])
                        }
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        placeholder="₹10000"
                      />
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 text-center">
                    ₹{filters.priceRange[0]} - ₹{filters.priceRange[1]}
                  </div>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Duration */}
          <Card>
            <CardHeader
              className="pb-3 cursor-pointer"
              onClick={() => toggleSection("duration")}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <CardTitle className="text-sm">Duration</CardTitle>
                </div>
                {expandedSections.duration ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </div>
            </CardHeader>
            {expandedSections.duration && (
              <CardContent>
                <div className="space-y-2">
                  {durationOptions.map((duration) => (
                    <label
                      key={duration}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={filters.duration.includes(duration)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            updateFilter("duration", [
                              ...filters.duration,
                              duration,
                            ]);
                          } else {
                            updateFilter(
                              "duration",
                              filters.duration.filter((d) => d !== duration),
                            );
                          }
                        }}
                        className="h-4 w-4 text-rose-600 rounded"
                      />
                      <span className="text-sm">{duration}</span>
                    </label>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>

          {/* Location */}
          <Card>
            <CardHeader
              className="pb-3 cursor-pointer"
              onClick={() => toggleSection("location")}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-red-600" />
                  <CardTitle className="text-sm">Location</CardTitle>
                </div>
                {expandedSections.location ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </div>
            </CardHeader>
            {expandedSections.location && (
              <CardContent className="space-y-4">
                <div>
                  <label className="text-xs text-gray-600 block mb-2">
                    Distance (km)
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={filters.location.distance}
                    onChange={(e) =>
                      updateFilter("location", {
                        ...filters.location,
                        distance: parseInt(e.target.value),
                      })
                    }
                    className="w-full"
                  />
                  <div className="text-xs text-gray-500 text-center">
                    {filters.location.distance} km
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-600 block mb-2">
                    Areas
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {locationAreas.map((area) => (
                      <label
                        key={area}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={filters.location.areas.includes(area)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              updateFilter("location", {
                                ...filters.location,
                                areas: [...filters.location.areas, area],
                              });
                            } else {
                              updateFilter("location", {
                                ...filters.location,
                                areas: filters.location.areas.filter(
                                  (a) => a !== area,
                                ),
                              });
                            }
                          }}
                          className="h-4 w-4 text-rose-600 rounded"
                        />
                        <span className="text-xs">{area}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Ratings */}
          <Card>
            <CardHeader
              className="pb-3 cursor-pointer"
              onClick={() => toggleSection("ratings")}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-600" />
                  <CardTitle className="text-sm">Minimum Rating</CardTitle>
                </div>
                {expandedSections.ratings ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </div>
            </CardHeader>
            {expandedSections.ratings && (
              <CardContent>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <Button
                      key={rating}
                      variant={
                        filters.ratings >= rating ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => updateFilter("ratings", rating)}
                      className="flex-1"
                    >
                      {rating}★
                    </Button>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>

          {/* Service Types */}
          <Card>
            <CardHeader
              className="pb-3 cursor-pointer"
              onClick={() => toggleSection("services")}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-purple-600" />
                  <CardTitle className="text-sm">Service Types</CardTitle>
                </div>
                {expandedSections.services ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </div>
            </CardHeader>
            {expandedSections.services && (
              <CardContent>
                <div className="space-y-2">
                  {serviceTypes.map((service) => (
                    <label
                      key={service}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={filters.serviceTypes.includes(service)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            updateFilter("serviceTypes", [
                              ...filters.serviceTypes,
                              service,
                            ]);
                          } else {
                            updateFilter(
                              "serviceTypes",
                              filters.serviceTypes.filter((s) => s !== service),
                            );
                          }
                        }}
                        className="h-4 w-4 text-rose-600 rounded"
                      />
                      <span className="text-sm">{service}</span>
                    </label>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>

          {/* Availability */}
          <Card>
            <CardHeader
              className="pb-3 cursor-pointer"
              onClick={() => toggleSection("availability")}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-indigo-600" />
                  <CardTitle className="text-sm">Availability</CardTitle>
                </div>
                {expandedSections.availability ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </div>
            </CardHeader>
            {expandedSections.availability && (
              <CardContent className="space-y-4">
                <div>
                  <label className="text-xs text-gray-600 block mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={filters.availability.date}
                    onChange={(e) =>
                      updateFilter("availability", {
                        ...filters.availability,
                        date: e.target.value,
                      })
                    }
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600 block mb-2">
                    Time Slots
                  </label>
                  <div className="space-y-2">
                    {timeSlots.map((slot) => (
                      <label
                        key={slot}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={filters.availability.timeSlots.includes(
                            slot,
                          )}
                          onChange={(e) => {
                            if (e.target.checked) {
                              updateFilter("availability", {
                                ...filters.availability,
                                timeSlots: [
                                  ...filters.availability.timeSlots,
                                  slot,
                                ],
                              });
                            } else {
                              updateFilter("availability", {
                                ...filters.availability,
                                timeSlots:
                                  filters.availability.timeSlots.filter(
                                    (s) => s !== slot,
                                  ),
                              });
                            }
                          }}
                          className="h-4 w-4 text-rose-600 rounded"
                        />
                        <span className="text-sm">{slot}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Special Offers */}
          <Card>
            <CardHeader
              className="pb-3 cursor-pointer"
              onClick={() => toggleSection("offers")}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge className="h-4 w-4 bg-orange-500" />
                  <CardTitle className="text-sm">Special Offers</CardTitle>
                </div>
                {expandedSections.offers ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </div>
            </CardHeader>
            {expandedSections.offers && (
              <CardContent>
                <div className="space-y-2">
                  {specialOffers.map((offer) => (
                    <label
                      key={offer}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={filters.specialOffers.includes(offer)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            updateFilter("specialOffers", [
                              ...filters.specialOffers,
                              offer,
                            ]);
                          } else {
                            updateFilter(
                              "specialOffers",
                              filters.specialOffers.filter((o) => o !== offer),
                            );
                          }
                        }}
                        className="h-4 w-4 text-rose-600 rounded"
                      />
                      <span className="text-sm">{offer}</span>
                    </label>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        </div>

        {/* Save Filters Option */}
        {getActiveFiltersCount() > 2 && (
          <div className="p-4 border-t border-gray-100">
            <div className="flex gap-2">
              <input
                type="text"
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
                placeholder="Name this filter set..."
                className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (filterName.trim()) {
                    setSavedFilters((prev) => [...prev, { ...filters }]);
                    setFilterName("");
                  }
                }}
                disabled={!filterName.trim()}
              >
                Save
              </Button>
            </div>
          </div>
        )}

        {/* Apply Button */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handleApply}
              className="flex-1 bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700"
            >
              <Filter className="mr-2 h-4 w-4" />
              Apply Filters ({getActiveFiltersCount()})
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedFilters;
