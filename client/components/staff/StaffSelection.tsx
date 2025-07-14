import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  X,
  Star,
  Clock,
  User,
  Calendar,
  MapPin,
  Award,
  Heart,
  CheckCircle,
  ArrowLeft,
  Zap,
  TrendingUp,
  MessageCircle,
  Filter,
  Search,
  Languages,
  Scissors,
  Sparkles,
  Crown,
  Palette,
  Baby,
} from "lucide-react";

interface StaffMember {
  id: string;
  name: string;
  avatar: string;
  role: string;
  rating: number;
  reviewCount: number;
  experience: number;
  specialties: string[];
  languages: string[];
  availability: {
    date: string;
    timeSlots: string[];
  }[];
  location: string;
  bio: string;
  priceModifier: number; // 0 = standard, positive = premium
  isTopRated: boolean;
  isNewlyJoined: boolean;
  totalBookings: number;
  profileImages: string[];
  certifications: string[];
  workingSince: string;
  favoriteCount: number;
}

interface StaffSelectionProps {
  isOpen: boolean;
  onClose: () => void;
  onStaffSelect: (staff: StaffMember) => void;
  serviceType: string;
  selectedDate?: string;
  selectedTimeSlot?: string;
  salonLocation?: string;
}

const StaffSelection: React.FC<StaffSelectionProps> = ({
  isOpen,
  onClose,
  onStaffSelect,
  serviceType,
  selectedDate,
  selectedTimeSlot,
  salonLocation,
}) => {
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [filteredStaff, setFilteredStaff] = useState<StaffMember[]>([]);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    rating: 0,
    experience: 0,
    specialty: "",
    language: "",
    priceRange: "all",
    availability: "all",
  });

  useEffect(() => {
    if (isOpen) {
      loadStaffMembers();
    }
  }, [isOpen, serviceType, salonLocation]);

  useEffect(() => {
    applyFilters();
  }, [staffMembers, searchQuery, filters]);

  const loadStaffMembers = async () => {
    setIsLoading(true);
    try {
      // Mock data based on service type
      const mockStaff = generateMockStaff(serviceType);
      setStaffMembers(mockStaff);
    } catch (error) {
      console.error("Failed to load staff:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockStaff = (serviceType: string): StaffMember[] => {
    const serviceSpecialties: { [key: string]: string[] } = {
      "Hair Services": [
        "Hair Cutting",
        "Hair Coloring",
        "Hair Styling",
        "Hair Treatment",
      ],
      "Skin & Face Care": [
        "Facial Treatment",
        "Acne Treatment",
        "Anti-Aging",
        "Skin Analysis",
      ],
      "Body Treatments": [
        "Massage Therapy",
        "Body Spa",
        "Aromatherapy",
        "Body Scrub",
      ],
      "Nail Care": ["Manicure", "Pedicure", "Nail Art", "Gel Polish"],
      "Makeup & Grooming": [
        "Bridal Makeup",
        "Party Makeup",
        "Professional Makeup",
        "Grooming",
      ],
      "Men's Grooming": [
        "Men's Haircut",
        "Beard Styling",
        "Men's Facial",
        "Head Massage",
      ],
    };

    const baseStaff = [
      {
        id: "staff_1",
        name: "Priya Sharma",
        avatar: "👩‍🎨",
        role: "Senior Stylist",
        rating: 4.9,
        reviewCount: 234,
        experience: 8,
        languages: ["Hindi", "English", "Marathi"],
        location: "Bandra West",
        bio: "Passionate about creating stunning looks that boost confidence. Specialized in modern hair techniques and bridal styling.",
        priceModifier: 200,
        isTopRated: true,
        isNewlyJoined: false,
        totalBookings: 1250,
        profileImages: ["🌟", "💫", "✨"],
        certifications: ["L'Oreal Professional", "Schwarzkopf Certified"],
        workingSince: "2016",
        favoriteCount: 89,
      },
      {
        id: "staff_2",
        name: "Ravi Kumar",
        avatar: "👨‍💼",
        role: "Expert Therapist",
        rating: 4.7,
        reviewCount: 189,
        experience: 6,
        languages: ["Hindi", "English", "Tamil"],
        location: "Andheri East",
        bio: "Holistic approach to beauty and wellness. Expert in therapeutic treatments and relaxation techniques.",
        priceModifier: 150,
        isTopRated: false,
        isNewlyJoined: false,
        totalBookings: 890,
        profileImages: ["🧘‍♂️", "🌿", "💆‍♀️"],
        certifications: ["Spa Therapy Certified", "Ayurveda Practitioner"],
        workingSince: "2018",
        favoriteCount: 67,
      },
      {
        id: "staff_3",
        name: "Anjali Patel",
        avatar: "👩‍⚕️",
        role: "Beauty Specialist",
        rating: 4.8,
        reviewCount: 156,
        experience: 5,
        languages: ["Hindi", "English", "Gujarati"],
        location: "Juhu",
        bio: "Innovative techniques combined with traditional methods. Specialist in skin care and anti-aging treatments.",
        priceModifier: 100,
        isTopRated: true,
        isNewlyJoined: false,
        totalBookings: 670,
        profileImages: ["🌸", "🌺", "🌻"],
        certifications: ["Dermatology Certified", "Advanced Skincare"],
        workingSince: "2019",
        favoriteCount: 78,
      },
      {
        id: "staff_4",
        name: "Sophia Wilson",
        avatar: "👩‍🎭",
        role: "Makeup Artist",
        rating: 4.9,
        reviewCount: 278,
        experience: 10,
        languages: ["English", "Hindi"],
        location: "Bandra West",
        bio: "International makeup artist with expertise in bridal and fashion makeup. Trained in London and Paris.",
        priceModifier: 500,
        isTopRated: true,
        isNewlyJoined: false,
        totalBookings: 1580,
        profileImages: ["💄", "👑", "✨"],
        certifications: ["MAC Pro Certified", "International Makeup Academy"],
        workingSince: "2014",
        favoriteCount: 145,
      },
      {
        id: "staff_5",
        name: "Arjun Singh",
        avatar: "👨‍💇",
        role: "Hair Specialist",
        rating: 4.6,
        reviewCount: 134,
        experience: 4,
        languages: ["Hindi", "English", "Punjabi"],
        location: "Powai",
        bio: "Young and dynamic stylist with fresh ideas. Specialized in contemporary cuts and modern styling techniques.",
        priceModifier: 0,
        isTopRated: false,
        isNewlyJoined: true,
        totalBookings: 450,
        profileImages: ["✂️", "🎨", "🔥"],
        certifications: ["Wella Professional", "Hair Academy Graduate"],
        workingSince: "2021",
        favoriteCount: 34,
      },
      {
        id: "staff_6",
        name: "Meera Reddy",
        avatar: "👩‍🔬",
        role: "Nail Technician",
        rating: 4.8,
        reviewCount: 167,
        experience: 7,
        languages: ["Hindi", "English", "Telugu"],
        location: "Lower Parel",
        bio: "Creative nail artist with expertise in intricate designs and latest nail technologies.",
        priceModifier: 75,
        isTopRated: true,
        isNewlyJoined: false,
        totalBookings: 780,
        profileImages: ["💅", "🎨", "✨"],
        certifications: ["OPI Certified", "Nail Art Specialist"],
        workingSince: "2017",
        favoriteCount: 92,
      },
    ];

    // Assign relevant specialties based on service type
    return baseStaff.map((staff) => ({
      ...staff,
      specialties: serviceSpecialties[serviceType] || ["General Beauty"],
      availability: generateAvailability(),
    }));
  };

  const generateAvailability = () => {
    const availability = [];
    const today = new Date();

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      const timeSlots = [
        "9:00 AM",
        "10:00 AM",
        "11:00 AM",
        "12:00 PM",
        "2:00 PM",
        "3:00 PM",
        "4:00 PM",
        "5:00 PM",
        "6:00 PM",
      ].filter(() => Math.random() > 0.3); // Random availability

      availability.push({
        date: date.toISOString().split("T")[0],
        timeSlots,
      });
    }

    return availability;
  };

  const applyFilters = () => {
    let filtered = staffMembers;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (staff) =>
          staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          staff.specialties.some((s) =>
            s.toLowerCase().includes(searchQuery.toLowerCase()),
          ) ||
          staff.role.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Rating filter
    if (filters.rating > 0) {
      filtered = filtered.filter((staff) => staff.rating >= filters.rating);
    }

    // Experience filter
    if (filters.experience > 0) {
      filtered = filtered.filter(
        (staff) => staff.experience >= filters.experience,
      );
    }

    // Specialty filter
    if (filters.specialty) {
      filtered = filtered.filter((staff) =>
        staff.specialties.includes(filters.specialty),
      );
    }

    // Language filter
    if (filters.language) {
      filtered = filtered.filter((staff) =>
        staff.languages.includes(filters.language),
      );
    }

    // Price range filter
    if (filters.priceRange !== "all") {
      if (filters.priceRange === "budget") {
        filtered = filtered.filter((staff) => staff.priceModifier <= 100);
      } else if (filters.priceRange === "premium") {
        filtered = filtered.filter((staff) => staff.priceModifier > 200);
      }
    }

    // Availability filter
    if (filters.availability !== "all" && selectedDate) {
      filtered = filtered.filter((staff) => {
        const dayAvailability = staff.availability.find(
          (a) => a.date === selectedDate,
        );
        return dayAvailability && dayAvailability.timeSlots.length > 0;
      });
    }

    // Sort by rating and experience
    filtered.sort((a, b) => {
      if (a.isTopRated && !b.isTopRated) return -1;
      if (!a.isTopRated && b.isTopRated) return 1;
      if (b.rating !== a.rating) return b.rating - a.rating;
      return b.experience - a.experience;
    });

    setFilteredStaff(filtered);
  };

  const getServiceIcon = (specialty: string) => {
    const iconMap: { [key: string]: JSX.Element } = {
      "Hair Cutting": <Scissors className="h-4 w-4" />,
      "Hair Coloring": <Palette className="h-4 w-4" />,
      "Hair Styling": <Crown className="h-4 w-4" />,
      "Facial Treatment": <Sparkles className="h-4 w-4" />,
      "Massage Therapy": <User className="h-4 w-4" />,
      Manicure: <Star className="h-4 w-4" />,
      Makeup: <Crown className="h-4 w-4" />,
      "Kids Care": <Baby className="h-4 w-4" />,
    };
    return iconMap[specialty] || <Star className="h-4 w-4" />;
  };

  const isStaffAvailable = (
    staff: StaffMember,
    date?: string,
    timeSlot?: string,
  ) => {
    if (!date) return true;

    const dayAvailability = staff.availability.find((a) => a.date === date);
    if (!dayAvailability) return false;

    if (!timeSlot) return dayAvailability.timeSlots.length > 0;

    return dayAvailability.timeSlots.includes(timeSlot);
  };

  const handleStaffSelect = (staff: StaffMember) => {
    setSelectedStaff(staff);
  };

  const confirmSelection = () => {
    if (selectedStaff) {
      onStaffSelect(selectedStaff);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50">
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white p-4 border-b rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {selectedStaff && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedStaff(null)}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              )}
              <div>
                <h2 className="text-lg font-semibold">
                  {selectedStaff ? "Staff Profile" : "Choose Your Stylist"}
                </h2>
                <p className="text-sm text-gray-600">
                  {selectedStaff
                    ? selectedStaff.role
                    : `${serviceType} specialists`}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="p-4">
          {!selectedStaff ? (
            <>
              {/* Search and Filters */}
              <div className="space-y-4 mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search stylists by name or specialty..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex-shrink-0"
                  >
                    <Filter className="h-4 w-4 mr-1" />
                    Filters
                  </Button>

                  {/* Quick filter buttons */}
                  <div className="flex gap-2 overflow-x-auto">
                    <Button
                      variant={filters.rating >= 4.5 ? "default" : "outline"}
                      size="sm"
                      onClick={() =>
                        setFilters({
                          ...filters,
                          rating: filters.rating >= 4.5 ? 0 : 4.5,
                        })
                      }
                      className="flex-shrink-0"
                    >
                      <Star className="h-3 w-3 mr-1" />
                      Top Rated
                    </Button>
                    <Button
                      variant={filters.experience >= 5 ? "default" : "outline"}
                      size="sm"
                      onClick={() =>
                        setFilters({
                          ...filters,
                          experience: filters.experience >= 5 ? 0 : 5,
                        })
                      }
                      className="flex-shrink-0"
                    >
                      <Award className="h-3 w-3 mr-1" />
                      Expert
                    </Button>
                    <Button
                      variant={
                        filters.availability !== "all" ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() =>
                        setFilters({
                          ...filters,
                          availability:
                            filters.availability !== "all"
                              ? "all"
                              : "available",
                        })
                      }
                      className="flex-shrink-0"
                    >
                      <Calendar className="h-3 w-3 mr-1" />
                      Available
                    </Button>
                  </div>
                </div>

                {/* Extended Filters */}
                {showFilters && (
                  <Card>
                    <CardContent className="p-4 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700 block mb-2">
                            Language
                          </label>
                          <select
                            value={filters.language}
                            onChange={(e) =>
                              setFilters({
                                ...filters,
                                language: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          >
                            <option value="">All Languages</option>
                            <option value="English">English</option>
                            <option value="Hindi">Hindi</option>
                            <option value="Marathi">Marathi</option>
                            <option value="Tamil">Tamil</option>
                            <option value="Gujarati">Gujarati</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700 block mb-2">
                            Price Range
                          </label>
                          <select
                            value={filters.priceRange}
                            onChange={(e) =>
                              setFilters({
                                ...filters,
                                priceRange: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          >
                            <option value="all">All Prices</option>
                            <option value="budget">Budget Friendly</option>
                            <option value="premium">Premium</option>
                          </select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Staff List */}
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading stylists...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredStaff.map((staff) => (
                    <Card
                      key={staff.id}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        selectedStaff?.id === staff.id
                          ? "ring-2 ring-rose-500"
                          : ""
                      }`}
                      onClick={() => handleStaffSelect(staff)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="text-4xl">{staff.avatar}</div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="font-semibold text-gray-900">
                                    {staff.name}
                                  </h3>
                                  {staff.isTopRated && (
                                    <Badge className="bg-yellow-100 text-yellow-800">
                                      <Star className="h-3 w-3 mr-1" />
                                      Top Rated
                                    </Badge>
                                  )}
                                  {staff.isNewlyJoined && (
                                    <Badge className="bg-green-100 text-green-800">
                                      <Zap className="h-3 w-3 mr-1" />
                                      New
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-gray-600">
                                  {staff.role}
                                </p>
                                <div className="flex items-center gap-4 mt-2">
                                  <div className="flex items-center gap-1">
                                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                    <span className="text-sm font-medium">
                                      {staff.rating}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                      ({staff.reviewCount})
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-4 w-4 text-gray-400" />
                                    <span className="text-sm text-gray-600">
                                      {staff.experience}+ years
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <MapPin className="h-4 w-4 text-gray-400" />
                                    <span className="text-sm text-gray-600">
                                      {staff.location}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                {staff.priceModifier > 0 && (
                                  <div className="text-sm font-medium text-rose-600">
                                    +₹{staff.priceModifier}
                                  </div>
                                )}
                                {isStaffAvailable(
                                  staff,
                                  selectedDate,
                                  selectedTimeSlot,
                                ) ? (
                                  <Badge className="bg-green-100 text-green-700 mt-1">
                                    Available
                                  </Badge>
                                ) : selectedDate ? (
                                  <Badge variant="secondary" className="mt-1">
                                    Not Available
                                  </Badge>
                                ) : null}
                              </div>
                            </div>

                            {/* Specialties */}
                            <div className="flex gap-1 mt-3 flex-wrap">
                              {staff.specialties
                                .slice(0, 3)
                                .map((specialty) => (
                                  <Badge
                                    key={specialty}
                                    variant="outline"
                                    className="text-xs"
                                  >
                                    {getServiceIcon(specialty)}
                                    <span className="ml-1">{specialty}</span>
                                  </Badge>
                                ))}
                              {staff.specialties.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{staff.specialties.length - 3} more
                                </Badge>
                              )}
                            </div>

                            {/* Languages */}
                            <div className="flex items-center gap-2 mt-2">
                              <Languages className="h-3 w-3 text-gray-400" />
                              <span className="text-xs text-gray-600">
                                {staff.languages.join(", ")}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {filteredStaff.length === 0 && (
                    <div className="text-center py-8">
                      <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        No stylists found
                      </h3>
                      <p className="text-gray-600">
                        Try adjusting your filters or search criteria
                      </p>
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            /* Staff Detail View */
            <div className="space-y-6">
              {/* Staff Header */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="text-6xl">{selectedStaff.avatar}</div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <h2 className="text-xl font-bold">
                              {selectedStaff.name}
                            </h2>
                            {selectedStaff.isTopRated && (
                              <Badge className="bg-yellow-100 text-yellow-800">
                                <Star className="h-3 w-3 mr-1" />
                                Top Rated
                              </Badge>
                            )}
                          </div>
                          <p className="text-gray-600 font-medium">
                            {selectedStaff.role}
                          </p>
                          <div className="flex items-center gap-4 mt-3">
                            <div className="flex items-center gap-1">
                              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                              <span className="font-semibold">
                                {selectedStaff.rating}
                              </span>
                              <span className="text-gray-500">
                                ({selectedStaff.reviewCount} reviews)
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Heart className="h-4 w-4 text-red-500" />
                              <span className="text-sm text-gray-600">
                                {selectedStaff.favoriteCount} favorites
                              </span>
                            </div>
                          </div>
                        </div>
                        {selectedStaff.priceModifier > 0 && (
                          <div className="text-right">
                            <div className="text-lg font-semibold text-rose-600">
                              +₹{selectedStaff.priceModifier}
                            </div>
                            <div className="text-xs text-gray-500">
                              Premium pricing
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-700 mt-4">{selectedStaff.bio}</p>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Clock className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                  <div className="font-semibold text-blue-900">
                    {selectedStaff.experience}+ Years
                  </div>
                  <div className="text-xs text-blue-700">Experience</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-green-600 mx-auto mb-2" />
                  <div className="font-semibold text-green-900">
                    {selectedStaff.totalBookings}+
                  </div>
                  <div className="text-xs text-green-700">Bookings</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <Award className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                  <div className="font-semibold text-purple-900">
                    {selectedStaff.certifications.length}
                  </div>
                  <div className="text-xs text-purple-700">Certifications</div>
                </div>
              </div>

              {/* Specialties */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Specialties</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {selectedStaff.specialties.map((specialty) => (
                      <Badge
                        key={specialty}
                        variant="outline"
                        className="bg-rose-50 text-rose-700 border-rose-200"
                      >
                        {getServiceIcon(specialty)}
                        <span className="ml-1">{specialty}</span>
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Languages */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Languages</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    {selectedStaff.languages.map((language) => (
                      <Badge key={language} variant="secondary">
                        <Languages className="h-3 w-3 mr-1" />
                        {language}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Certifications */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Certifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {selectedStaff.certifications.map((cert) => (
                      <div key={cert} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm">{cert}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Availability */}
              {selectedDate && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">
                      Available Times -{" "}
                      {new Date(selectedDate).toLocaleDateString()}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-2">
                      {selectedStaff.availability
                        .find((a) => a.date === selectedDate)
                        ?.timeSlots.map((slot) => (
                          <Badge
                            key={slot}
                            variant={
                              selectedTimeSlot === slot ? "default" : "outline"
                            }
                            className="justify-center py-2 cursor-pointer"
                          >
                            {slot}
                          </Badge>
                        )) || (
                        <div className="col-span-3 text-center text-gray-500 py-4">
                          Not available on this date
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>

        {/* Bottom Action */}
        {selectedStaff && (
          <div className="sticky bottom-0 bg-white border-t p-4">
            <Button
              onClick={confirmSelection}
              className="w-full bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 h-12"
              disabled={
                selectedDate &&
                !isStaffAvailable(selectedStaff, selectedDate, selectedTimeSlot)
              }
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Book with {selectedStaff.name}
              {selectedStaff.priceModifier > 0 && (
                <span className="ml-2">(+₹{selectedStaff.priceModifier})</span>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffSelection;
