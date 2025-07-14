import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  X,
  Star,
  Clock,
  Calendar,
  Gift,
  Sparkles,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Users,
  Crown,
  Heart,
  Scissors,
  Palette,
  Baby,
  User,
  ShoppingBag,
  TrendingUp,
  Zap,
  Target,
  Award,
  Percent,
  Plus,
  Minus,
  Info,
} from "lucide-react";

interface ServiceItem {
  id: string;
  name: string;
  category: string;
  duration: number;
  originalPrice: number;
  icon: JSX.Element;
  description: string;
  isPopular?: boolean;
}

interface PackageDeal {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: string;
  services: ServiceItem[];
  originalPrice: number;
  discountedPrice: number;
  discountPercentage: number;
  duration: string;
  validUntil: string;
  isPopular: boolean;
  isFeatured: boolean;
  icon: JSX.Element;
  color: string;
  features: string[];
  termsAndConditions: string[];
  targetAudience: string[];
  occasionTags: string[];
  minBookingDays: number;
  maxValidityDays: number;
  includedAddOns: string[];
  customerReviews: {
    rating: number;
    reviewCount: number;
    highlights: string[];
  };
}

interface CustomPackage {
  selectedServices: ServiceItem[];
  estimatedDuration: number;
  originalTotal: number;
  discountApplied: number;
  finalPrice: number;
  autoDiscount: number;
}

interface PackageDealsProps {
  isOpen: boolean;
  onClose: () => void;
  onPackageSelect: (packageDeal: PackageDeal | CustomPackage) => void;
}

const PackageDeals: React.FC<PackageDealsProps> = ({
  isOpen,
  onClose,
  onPackageSelect,
}) => {
  const [activeTab, setActiveTab] = useState<
    "featured" | "categories" | "custom"
  >("featured");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [packageDeals, setPackageDeals] = useState<PackageDeal[]>([]);
  const [availableServices, setAvailableServices] = useState<ServiceItem[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<PackageDeal | null>(
    null,
  );
  const [customPackage, setCustomPackage] = useState<CustomPackage>({
    selectedServices: [],
    estimatedDuration: 0,
    originalTotal: 0,
    discountApplied: 0,
    finalPrice: 0,
    autoDiscount: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPackageDetails, setShowPackageDetails] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadPackageDeals();
      loadAvailableServices();
    }
  }, [isOpen]);

  useEffect(() => {
    calculateCustomPackage();
  }, [customPackage.selectedServices]);

  const loadPackageDeals = async () => {
    setIsLoading(true);
    try {
      const mockPackages = generateMockPackages();
      setPackageDeals(mockPackages);
    } catch (error) {
      console.error("Failed to load package deals:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadAvailableServices = async () => {
    try {
      const mockServices = generateMockServices();
      setAvailableServices(mockServices);
    } catch (error) {
      console.error("Failed to load services:", error);
    }
  };

  const generateMockServices = (): ServiceItem[] => [
    {
      id: "haircut",
      name: "Professional Haircut",
      category: "Hair Services",
      duration: 45,
      originalPrice: 800,
      icon: <Scissors className="h-4 w-4" />,
      description: "Expert styling and cutting",
      isPopular: true,
    },
    {
      id: "facial",
      name: "Deep Cleansing Facial",
      category: "Skin Care",
      duration: 60,
      originalPrice: 1500,
      icon: <Sparkles className="h-4 w-4" />,
      description: "Rejuvenating facial treatment",
      isPopular: true,
    },
    {
      id: "manicure",
      name: "Classic Manicure",
      category: "Nail Care",
      duration: 45,
      originalPrice: 600,
      icon: <Palette className="h-4 w-4" />,
      description: "Complete nail care and polish",
    },
    {
      id: "pedicure",
      name: "Luxury Pedicure",
      category: "Nail Care",
      duration: 60,
      originalPrice: 800,
      icon: <Palette className="h-4 w-4" />,
      description: "Foot spa and nail treatment",
    },
    {
      id: "massage",
      name: "Swedish Massage",
      category: "Body Treatments",
      duration: 90,
      originalPrice: 2500,
      icon: <Heart className="h-4 w-4" />,
      description: "Relaxing full body massage",
    },
    {
      id: "makeup",
      name: "Party Makeup",
      category: "Makeup",
      duration: 60,
      originalPrice: 2000,
      icon: <Crown className="h-4 w-4" />,
      description: "Professional party makeup",
    },
    {
      id: "hair_spa",
      name: "Hair Spa Treatment",
      category: "Hair Services",
      duration: 120,
      originalPrice: 1800,
      icon: <Scissors className="h-4 w-4" />,
      description: "Deep conditioning hair treatment",
    },
    {
      id: "eyebrow",
      name: "Eyebrow Threading",
      category: "Grooming",
      duration: 15,
      originalPrice: 200,
      icon: <User className="h-4 w-4" />,
      description: "Precise eyebrow shaping",
    },
  ];

  const generateMockPackages = (): PackageDeal[] => [
    {
      id: "bridal_deluxe",
      title: "Bridal Deluxe Package",
      subtitle: "Complete bridal transformation",
      description:
        "Everything you need for your perfect wedding day look, from hair to makeup to nail art.",
      category: "Bridal",
      services: [
        {
          id: "bridal_makeup",
          name: "Bridal Makeup",
          category: "Makeup",
          duration: 120,
          originalPrice: 8000,
          icon: <Crown className="h-4 w-4" />,
          description: "Complete bridal makeup with premium products",
        },
        {
          id: "bridal_hair",
          name: "Bridal Hair Styling",
          category: "Hair Services",
          duration: 90,
          originalPrice: 5000,
          icon: <Scissors className="h-4 w-4" />,
          description: "Traditional or contemporary bridal hairstyling",
        },
        {
          id: "nail_art",
          name: "Bridal Nail Art",
          category: "Nail Care",
          duration: 60,
          originalPrice: 2000,
          icon: <Palette className="h-4 w-4" />,
          description: "Custom bridal nail designs",
        },
        {
          id: "mehendi",
          name: "Mehendi Application",
          category: "Special",
          duration: 120,
          originalPrice: 3000,
          icon: <Gift className="h-4 w-4" />,
          description: "Traditional henna designs",
        },
      ],
      originalPrice: 18000,
      discountedPrice: 14500,
      discountPercentage: 19,
      duration: "6-7 hours",
      validUntil: "2024-12-31",
      isPopular: true,
      isFeatured: true,
      icon: <Crown className="h-6 w-6" />,
      color: "from-pink-500 to-rose-600",
      features: [
        "Pre-bridal consultation included",
        "Trial session available",
        "Premium product usage",
        "Professional photography assistance",
        "Touch-up kit provided",
      ],
      termsAndConditions: [
        "Advance booking required (minimum 2 weeks)",
        "Trial session to be booked separately",
        "Package valid for 6 months from purchase",
        "Cannot be combined with other offers",
      ],
      targetAudience: ["Brides", "Grooms", "Wedding Party"],
      occasionTags: ["Wedding", "Engagement", "Reception"],
      minBookingDays: 14,
      maxValidityDays: 180,
      includedAddOns: [
        "Saree draping",
        "Jewelry styling",
        "Photo-ready finish",
      ],
      customerReviews: {
        rating: 4.9,
        reviewCount: 127,
        highlights: [
          "Stunning bridal transformation",
          "Professional and punctual",
          "Exceeded expectations",
        ],
      },
    },
    {
      id: "monthly_glow",
      title: "Monthly Glow Package",
      subtitle: "Regular beauty maintenance",
      description:
        "Perfect for maintaining your beauty routine with regular facials, manicures, and treatments.",
      category: "Maintenance",
      services: [
        {
          id: "monthly_facial",
          name: "Hydrating Facial",
          category: "Skin Care",
          duration: 60,
          originalPrice: 1500,
          icon: <Sparkles className="h-4 w-4" />,
          description: "Deep cleansing and hydrating facial",
        },
        {
          id: "monthly_cleanup",
          name: "Skin Cleanup",
          category: "Skin Care",
          duration: 45,
          originalPrice: 800,
          icon: <Sparkles className="h-4 w-4" />,
          description: "Basic skin cleansing and toning",
        },
        {
          id: "monthly_manicure",
          name: "Express Manicure",
          category: "Nail Care",
          duration: 30,
          originalPrice: 500,
          icon: <Palette className="h-4 w-4" />,
          description: "Quick nail grooming and polish",
        },
        {
          id: "monthly_pedicure",
          name: "Basic Pedicure",
          category: "Nail Care",
          duration: 45,
          originalPrice: 700,
          icon: <Palette className="h-4 w-4" />,
          description: "Foot care and nail treatment",
        },
      ],
      originalPrice: 3500,
      discountedPrice: 2800,
      discountPercentage: 20,
      duration: "3 hours",
      validUntil: "2024-06-30",
      isPopular: true,
      isFeatured: false,
      icon: <Star className="h-6 w-6" />,
      color: "from-purple-500 to-indigo-600",
      features: [
        "Flexible scheduling",
        "Loyalty points included",
        "Complimentary skin consultation",
        "Product recommendations",
        "Home care tips",
      ],
      termsAndConditions: [
        "Valid for 4 visits within 30 days",
        "Bookings subject to availability",
        "48-hour cancellation policy",
        "Non-transferable",
      ],
      targetAudience: ["Working Professionals", "Beauty Enthusiasts"],
      occasionTags: ["Monthly Care", "Self Care", "Regular Maintenance"],
      minBookingDays: 1,
      maxValidityDays: 30,
      includedAddOns: ["Eyebrow shaping", "Relaxing head massage"],
      customerReviews: {
        rating: 4.7,
        reviewCount: 89,
        highlights: [
          "Great value for money",
          "Convenient scheduling",
          "Noticeable skin improvement",
        ],
      },
    },
    {
      id: "couple_spa",
      title: "Couple's Spa Retreat",
      subtitle: "Romantic spa experience for two",
      description:
        "Indulge in a relaxing spa day with your partner featuring massages, facials, and refreshments.",
      category: "Couple",
      services: [
        {
          id: "couple_massage",
          name: "Couple's Massage",
          category: "Body Treatments",
          duration: 60,
          originalPrice: 4000,
          icon: <Heart className="h-4 w-4" />,
          description: "Side-by-side relaxing massage",
        },
        {
          id: "couple_facial",
          name: "Rejuvenating Facial (2x)",
          category: "Skin Care",
          duration: 60,
          originalPrice: 3000,
          icon: <Sparkles className="h-4 w-4" />,
          description: "Customized facials for both partners",
        },
        {
          id: "aromatherapy",
          name: "Aromatherapy Session",
          category: "Wellness",
          duration: 30,
          originalPrice: 1000,
          icon: <Gift className="h-4 w-4" />,
          description: "Relaxing aromatherapy experience",
        },
      ],
      originalPrice: 8000,
      discountedPrice: 6400,
      discountPercentage: 20,
      duration: "3 hours",
      validUntil: "2024-08-31",
      isPopular: false,
      isFeatured: true,
      icon: <Heart className="h-6 w-6" />,
      color: "from-red-500 to-pink-600",
      features: [
        "Private couple's room",
        "Complimentary refreshments",
        "Relaxing ambiance",
        "Professional therapists",
        "Romantic setup available",
      ],
      termsAndConditions: [
        "Both partners must be present",
        "Advance booking required",
        "Special dietary requirements on request",
        "Photography allowed in designated areas",
      ],
      targetAudience: ["Couples", "Anniversary Celebrations"],
      occasionTags: ["Anniversary", "Date Night", "Valentine's Day"],
      minBookingDays: 3,
      maxValidityDays: 90,
      includedAddOns: [
        "Herbal tea service",
        "Relaxation music",
        "Towel service",
      ],
      customerReviews: {
        rating: 4.8,
        reviewCount: 64,
        highlights: [
          "Perfect romantic experience",
          "Excellent service quality",
          "Beautiful ambiance",
        ],
      },
    },
    {
      id: "teen_special",
      title: "Teen Beauty Special",
      subtitle: "Safe beauty treatments for teenagers",
      description:
        "Age-appropriate beauty services designed specifically for teenage skin and styling needs.",
      category: "Teen",
      services: [
        {
          id: "teen_facial",
          name: "Teen Acne Treatment",
          category: "Skin Care",
          duration: 45,
          originalPrice: 1000,
          icon: <Sparkles className="h-4 w-4" />,
          description: "Gentle acne-focused facial treatment",
        },
        {
          id: "teen_haircut",
          name: "Trendy Haircut",
          category: "Hair Services",
          duration: 30,
          originalPrice: 600,
          icon: <Scissors className="h-4 w-4" />,
          description: "Modern styling for teens",
        },
        {
          id: "teen_manicure",
          name: "Fun Nail Art",
          category: "Nail Care",
          duration: 30,
          originalPrice: 400,
          icon: <Palette className="h-4 w-4" />,
          description: "Creative and colorful nail designs",
        },
      ],
      originalPrice: 2000,
      discountedPrice: 1500,
      discountPercentage: 25,
      duration: "2 hours",
      validUntil: "2024-07-31",
      isPopular: false,
      isFeatured: false,
      icon: <Baby className="h-6 w-6" />,
      color: "from-cyan-500 to-blue-600",
      features: [
        "Age-appropriate products",
        "Gentle techniques",
        "Educational tips included",
        "Parent consultation available",
        "Safe and hygienic environment",
      ],
      termsAndConditions: [
        "Parental consent required for under 16",
        "Patch test recommended for sensitive skin",
        "Special pricing for students with ID",
        "Group discounts available",
      ],
      targetAudience: ["Teenagers", "Students", "Young Adults"],
      occasionTags: ["School Events", "Prom", "Birthday"],
      minBookingDays: 1,
      maxValidityDays: 60,
      includedAddOns: ["Skincare consultation", "Style recommendations"],
      customerReviews: {
        rating: 4.6,
        reviewCount: 42,
        highlights: [
          "Teen-friendly environment",
          "Great for first-time spa visitors",
          "Educational and fun",
        ],
      },
    },
  ];

  const calculateCustomPackage = () => {
    const services = customPackage.selectedServices;
    const originalTotal = services.reduce(
      (sum, service) => sum + service.originalPrice,
      0,
    );
    const estimatedDuration = services.reduce(
      (sum, service) => sum + service.duration,
      0,
    );

    // Calculate auto discount based on number of services
    let autoDiscount = 0;
    if (services.length >= 5) {
      autoDiscount = 0.25; // 25% for 5+ services
    } else if (services.length >= 3) {
      autoDiscount = 0.15; // 15% for 3-4 services
    } else if (services.length >= 2) {
      autoDiscount = 0.1; // 10% for 2 services
    }

    const discountAmount = originalTotal * autoDiscount;
    const finalPrice = originalTotal - discountAmount;

    setCustomPackage((prev) => ({
      ...prev,
      estimatedDuration,
      originalTotal,
      discountApplied: discountAmount,
      finalPrice,
      autoDiscount: autoDiscount * 100,
    }));
  };

  const toggleServiceInCustom = (service: ServiceItem) => {
    setCustomPackage((prev) => {
      const isSelected = prev.selectedServices.some((s) => s.id === service.id);
      const selectedServices = isSelected
        ? prev.selectedServices.filter((s) => s.id !== service.id)
        : [...prev.selectedServices, service];

      return {
        ...prev,
        selectedServices,
      };
    });
  };

  const handlePackageSelect = (packageDeal: PackageDeal) => {
    setSelectedPackage(packageDeal);
    setShowPackageDetails(true);
  };

  const confirmPackageSelection = () => {
    if (selectedPackage) {
      onPackageSelect(selectedPackage);
      onClose();
    }
  };

  const confirmCustomPackage = () => {
    if (customPackage.selectedServices.length >= 2) {
      onPackageSelect(customPackage);
      onClose();
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    }
    return `${mins}m`;
  };

  const getServiceIcon = (category: string) => {
    switch (category) {
      case "Hair Services":
        return <Scissors className="h-4 w-4" />;
      case "Skin Care":
        return <Sparkles className="h-4 w-4" />;
      case "Nail Care":
        return <Palette className="h-4 w-4" />;
      case "Body Treatments":
        return <Heart className="h-4 w-4" />;
      case "Makeup":
        return <Crown className="h-4 w-4" />;
      default:
        return <Star className="h-4 w-4" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50">
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white p-4 border-b rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {showPackageDetails && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowPackageDetails(false);
                    setSelectedPackage(null);
                  }}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              )}
              <div>
                <h2 className="text-lg font-semibold">
                  {showPackageDetails
                    ? "Package Details"
                    : "Package Deals & Bundles"}
                </h2>
                <p className="text-sm text-gray-600">
                  {showPackageDetails
                    ? selectedPackage?.subtitle
                    : "Save more with our curated service packages"}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="p-4">
          {!showPackageDetails ? (
            <>
              {/* Tab Navigation */}
              <div className="flex border-b mb-6 -mx-4 px-4">
                {[
                  {
                    id: "featured",
                    label: "Featured",
                    icon: <Star className="h-4 w-4" />,
                  },
                  {
                    id: "categories",
                    label: "All Packages",
                    icon: <ShoppingBag className="h-4 w-4" />,
                  },
                  {
                    id: "custom",
                    label: "Custom",
                    icon: <Plus className="h-4 w-4" />,
                  },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? "text-rose-600 border-b-2 border-rose-600"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Featured Tab */}
              {activeTab === "featured" && (
                <div className="space-y-6">
                  {/* Hero Package */}
                  {packageDeals
                    .filter((p) => p.isFeatured)
                    .map((pkg) => (
                      <Card
                        key={pkg.id}
                        className="relative overflow-hidden cursor-pointer transition-all hover:shadow-lg"
                        onClick={() => handlePackageSelect(pkg)}
                      >
                        <div
                          className={`absolute inset-0 bg-gradient-to-r ${pkg.color} opacity-10`}
                        ></div>
                        {pkg.isPopular && (
                          <Badge className="absolute top-4 right-4 bg-orange-500">
                            <Star className="h-3 w-3 mr-1" />
                            Most Popular
                          </Badge>
                        )}
                        <CardContent className="relative p-6">
                          <div className="flex items-start gap-4">
                            <div
                              className={`w-16 h-16 rounded-full bg-gradient-to-r ${pkg.color} flex items-center justify-center text-white text-xl`}
                            >
                              {pkg.icon}
                            </div>
                            <div className="flex-1">
                              <h3 className="text-xl font-bold text-gray-900 mb-1">
                                {pkg.title}
                              </h3>
                              <p className="text-gray-600 mb-3">
                                {pkg.description}
                              </p>
                              <div className="flex items-center gap-4 mb-4">
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4 text-gray-400" />
                                  <span className="text-sm text-gray-600">
                                    {pkg.duration}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                  <span className="text-sm font-medium">
                                    {pkg.customerReviews.rating}
                                  </span>
                                  <span className="text-sm text-gray-500">
                                    ({pkg.customerReviews.reviewCount})
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <span className="text-2xl font-bold text-gray-900">
                                    ₹{pkg.discountedPrice.toLocaleString()}
                                  </span>
                                  <span className="text-lg text-gray-500 line-through">
                                    ₹{pkg.originalPrice.toLocaleString()}
                                  </span>
                                  <Badge className="bg-green-100 text-green-800">
                                    {pkg.discountPercentage}% OFF
                                  </Badge>
                                </div>
                                <Button
                                  className={`bg-gradient-to-r ${pkg.color} hover:opacity-90`}
                                >
                                  <Gift className="h-4 w-4 mr-2" />
                                  Select Package
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}

                  {/* Popular Packages */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-rose-500" />
                      Popular Choices
                    </h3>
                    <div className="grid gap-4">
                      {packageDeals
                        .filter((p) => p.isPopular && !p.isFeatured)
                        .map((pkg) => (
                          <Card
                            key={pkg.id}
                            className="cursor-pointer transition-all hover:shadow-md"
                            onClick={() => handlePackageSelect(pkg)}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-center gap-4">
                                <div
                                  className={`w-12 h-12 rounded-lg bg-gradient-to-r ${pkg.color} flex items-center justify-center text-white`}
                                >
                                  {pkg.icon}
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-semibold text-gray-900">
                                    {pkg.title}
                                  </h4>
                                  <p className="text-sm text-gray-600 mt-1">
                                    {pkg.services.length} services •{" "}
                                    {pkg.duration}
                                  </p>
                                  <div className="flex items-center gap-2 mt-2">
                                    <span className="font-bold text-gray-900">
                                      ₹{pkg.discountedPrice.toLocaleString()}
                                    </span>
                                    <span className="text-sm text-gray-500 line-through">
                                      ₹{pkg.originalPrice.toLocaleString()}
                                    </span>
                                    <Badge
                                      variant="secondary"
                                      className="bg-green-100 text-green-800"
                                    >
                                      {pkg.discountPercentage}% OFF
                                    </Badge>
                                  </div>
                                </div>
                                <ArrowRight className="h-5 w-5 text-gray-400" />
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  </div>
                </div>
              )}

              {/* All Packages Tab */}
              {activeTab === "categories" && (
                <div className="space-y-4">
                  {/* Category Filter */}
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {["all", "Bridal", "Maintenance", "Couple", "Teen"].map(
                      (category) => (
                        <Button
                          key={category}
                          variant={
                            selectedCategory === category
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          onClick={() => setSelectedCategory(category)}
                          className="flex-shrink-0"
                        >
                          {category === "all" ? "All Categories" : category}
                        </Button>
                      ),
                    )}
                  </div>

                  {/* Package Grid */}
                  <div className="grid gap-4">
                    {packageDeals
                      .filter(
                        (pkg) =>
                          selectedCategory === "all" ||
                          pkg.category === selectedCategory,
                      )
                      .map((pkg) => (
                        <Card
                          key={pkg.id}
                          className="cursor-pointer transition-all hover:shadow-md"
                          onClick={() => handlePackageSelect(pkg)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start gap-4">
                              <div
                                className={`w-14 h-14 rounded-lg bg-gradient-to-r ${pkg.color} flex items-center justify-center text-white`}
                              >
                                {pkg.icon}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <h4 className="font-semibold text-gray-900">
                                      {pkg.title}
                                    </h4>
                                    <p className="text-sm text-gray-600 mt-1">
                                      {pkg.subtitle}
                                    </p>
                                    <div className="flex items-center gap-4 mt-2">
                                      <div className="flex items-center gap-1">
                                        <Clock className="h-3 w-3 text-gray-400" />
                                        <span className="text-xs text-gray-600">
                                          {pkg.duration}
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                        <span className="text-xs font-medium">
                                          {pkg.customerReviews.rating}
                                        </span>
                                      </div>
                                      <Badge
                                        variant="outline"
                                        className="text-xs"
                                      >
                                        {pkg.category}
                                      </Badge>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="font-bold text-gray-900">
                                      ₹{pkg.discountedPrice.toLocaleString()}
                                    </div>
                                    <div className="text-sm text-gray-500 line-through">
                                      ₹{pkg.originalPrice.toLocaleString()}
                                    </div>
                                    <Badge className="bg-green-100 text-green-800 mt-1">
                                      {pkg.discountPercentage}% OFF
                                    </Badge>
                                  </div>
                                </div>

                                {/* Service Preview */}
                                <div className="flex gap-1 mt-3 flex-wrap">
                                  {pkg.services.slice(0, 3).map((service) => (
                                    <Badge
                                      key={service.id}
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {service.icon}
                                      <span className="ml-1">
                                        {service.name}
                                      </span>
                                    </Badge>
                                  ))}
                                  {pkg.services.length > 3 && (
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      +{pkg.services.length - 3} more
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </div>
              )}

              {/* Custom Package Tab */}
              {activeTab === "custom" && (
                <div className="space-y-6">
                  {/* Custom Package Summary */}
                  {customPackage.selectedServices.length > 0 && (
                    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-3">
                          Your Custom Package
                        </h3>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>
                              Services ({customPackage.selectedServices.length}
                              ):
                            </span>
                            <span>
                              ₹{customPackage.originalTotal.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Duration:</span>
                            <span>
                              {formatDuration(customPackage.estimatedDuration)}
                            </span>
                          </div>
                          {customPackage.autoDiscount > 0 && (
                            <div className="flex justify-between text-sm text-green-600">
                              <span>
                                Auto Discount ({customPackage.autoDiscount}%):
                              </span>
                              <span>
                                -₹
                                {customPackage.discountApplied.toLocaleString()}
                              </span>
                            </div>
                          )}
                          <div className="border-t pt-2 flex justify-between font-semibold">
                            <span>Total:</span>
                            <span>
                              ₹{customPackage.finalPrice.toLocaleString()}
                            </span>
                          </div>
                        </div>
                        {customPackage.selectedServices.length >= 2 && (
                          <Button
                            onClick={confirmCustomPackage}
                            className="w-full mt-4 bg-gradient-to-r from-blue-500 to-indigo-600"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Book Custom Package
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {/* Discount Info */}
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <div className="flex items-start gap-2">
                      <Info className="h-4 w-4 text-yellow-600 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium text-yellow-900">
                          Automatic Discounts Available:
                        </p>
                        <ul className="text-yellow-800 mt-1 space-y-1">
                          <li>• 2 services: 10% discount</li>
                          <li>• 3-4 services: 15% discount</li>
                          <li>• 5+ services: 25% discount</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Service Selection */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">
                      Select Services to Create Your Package
                    </h3>
                    <div className="space-y-3">
                      {availableServices.map((service) => {
                        const isSelected = customPackage.selectedServices.some(
                          (s) => s.id === service.id,
                        );
                        return (
                          <Card
                            key={service.id}
                            className={`cursor-pointer transition-all ${
                              isSelected
                                ? "ring-2 ring-blue-500 bg-blue-50"
                                : "hover:shadow-md"
                            }`}
                            onClick={() => toggleServiceInCustom(service)}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="text-blue-500">
                                    {service.icon}
                                  </div>
                                  <div>
                                    <h4 className="font-medium text-gray-900">
                                      {service.name}
                                    </h4>
                                    <p className="text-sm text-gray-600">
                                      {service.description}
                                    </p>
                                    <div className="flex items-center gap-3 mt-1">
                                      <span className="text-sm text-gray-600">
                                        {formatDuration(service.duration)}
                                      </span>
                                      <Badge
                                        variant="outline"
                                        className="text-xs"
                                      >
                                        {service.category}
                                      </Badge>
                                      {service.isPopular && (
                                        <Badge className="bg-orange-100 text-orange-800 text-xs">
                                          Popular
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className="font-semibold">
                                    ₹{service.originalPrice.toLocaleString()}
                                  </span>
                                  <Button
                                    size="sm"
                                    variant={isSelected ? "default" : "outline"}
                                    className="min-w-[80px]"
                                  >
                                    {isSelected ? (
                                      <>
                                        <Minus className="h-3 w-3 mr-1" />
                                        Remove
                                      </>
                                    ) : (
                                      <>
                                        <Plus className="h-3 w-3 mr-1" />
                                        Add
                                      </>
                                    )}
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Package Details View */
            selectedPackage && (
              <div className="space-y-6">
                {/* Package Header */}
                <Card className="relative overflow-hidden">
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${selectedPackage.color} opacity-10`}
                  ></div>
                  <CardContent className="relative p-6">
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-20 h-20 rounded-full bg-gradient-to-r ${selectedPackage.color} flex items-center justify-center text-white text-2xl`}
                      >
                        {selectedPackage.icon}
                      </div>
                      <div className="flex-1">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                          {selectedPackage.title}
                        </h2>
                        <p className="text-gray-600 mb-4">
                          {selectedPackage.description}
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              {selectedPackage.duration}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">
                              {selectedPackage.customerReviews.rating} (
                              {selectedPackage.customerReviews.reviewCount}{" "}
                              reviews)
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              Valid until{" "}
                              {new Date(
                                selectedPackage.validUntil,
                              ).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              {selectedPackage.targetAudience.join(", ")}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Pricing */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-3xl font-bold text-gray-900">
                            ₹{selectedPackage.discountedPrice.toLocaleString()}
                          </span>
                          <span className="text-xl text-gray-500 line-through">
                            ₹{selectedPackage.originalPrice.toLocaleString()}
                          </span>
                        </div>
                        <Badge className="bg-green-100 text-green-800">
                          <Percent className="h-3 w-3 mr-1" />
                          Save {selectedPackage.discountPercentage}% (₹
                          {(
                            selectedPackage.originalPrice -
                            selectedPackage.discountedPrice
                          ).toLocaleString()}
                          )
                        </Badge>
                      </div>
                      <Button
                        onClick={confirmPackageSelection}
                        className={`bg-gradient-to-r ${selectedPackage.color} hover:opacity-90 px-8`}
                      >
                        <Gift className="h-4 w-4 mr-2" />
                        Book This Package
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Included Services */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      Included Services
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {selectedPackage.services.map((service) => (
                        <div
                          key={service.id}
                          className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="text-rose-500">{service.icon}</div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">
                              {service.name}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {service.description}
                            </p>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="text-xs text-gray-500">
                                {formatDuration(service.duration)}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {service.category}
                              </Badge>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium text-gray-900">
                              ₹{service.originalPrice.toLocaleString()}
                            </div>
                            <div className="text-xs text-gray-500">
                              Individual price
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Package Features */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-purple-600" />
                      Package Features
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-3">
                      {selectedPackage.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Add-ons */}
                {selectedPackage.includedAddOns.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Plus className="h-5 w-5 text-blue-600" />
                        Complimentary Add-ons
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {selectedPackage.includedAddOns.map((addon, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="bg-blue-50 text-blue-700 border-blue-200"
                          >
                            <Gift className="h-3 w-3 mr-1" />
                            {addon}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Customer Reviews */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="h-5 w-5 text-yellow-600" />
                      Customer Reviews
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="text-3xl font-bold text-gray-900">
                        {selectedPackage.customerReviews.rating}
                      </div>
                      <div>
                        <div className="flex items-center gap-1 mb-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                star <= selectedPackage.customerReviews.rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <div className="text-sm text-gray-600">
                          Based on {selectedPackage.customerReviews.reviewCount}{" "}
                          reviews
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {selectedPackage.customerReviews.highlights.map(
                        (highlight, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                            <span className="text-sm text-gray-700">
                              "{highlight}"
                            </span>
                          </div>
                        ),
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Terms & Conditions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Info className="h-5 w-5 text-gray-600" />
                      Terms & Conditions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {selectedPackage.termsAndConditions.map((term, index) => (
                        <li
                          key={index}
                          className="text-sm text-gray-600 flex items-start gap-2"
                        >
                          <div className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                          {term}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default PackageDeals;
