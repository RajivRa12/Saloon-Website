import { DemoResponse } from "@shared/api";
import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  Star,
  Scissors,
  Sparkles,
  Heart,
  Palette,
  Crown,
  Clock,
  MapPin,
  Phone,
  Mail,
  Calendar,
  User,
  Users,
  Baby,
  Home,
  Gift,
  ChevronRight,
  Search,
  Filter,
  X,
  ArrowLeft,
  ArrowRight,
  CreditCard,
  Smartphone,
  Shield,
  Zap,
  Award,
  MessageCircle,
  Camera,
  ThumbsUp,
  TrendingUp,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import AuthButton from "@/components/auth/AuthButton";
import AdvancedFilters from "@/components/filters/AdvancedFilters";
import MapView from "@/components/map/MapView";
import { ChatWidget } from "@/components/chat/LiveChatSupport";
import ImageGallery from "@/components/gallery/ImageGallery";

export default function Index() {
  const { user, isAuthenticated } = useAuth();
  const [exampleFromServer, setExampleFromServer] = useState("");
  const [isVisible, setIsVisible] = useState<Record<string, boolean>>({});
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    fetchDemo();

    // Setup intersection observer for scroll animations
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.getAttribute("data-animate");
          if (id) {
            setIsVisible((prev) => ({
              ...prev,
              [id]: entry.isIntersecting,
            }));
          }
        });
      },
      { threshold: 0.1, rootMargin: "50px" },
    );

    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  const animateRef = (id: string) => (el: HTMLElement | null) => {
    if (el && observerRef.current) {
      el.setAttribute("data-animate", id);
      observerRef.current.observe(el);
    }
  };

  const fetchDemo = async () => {
    try {
      const response = await fetch("/api/demo");
      const data = (await response.json()) as DemoResponse;
      setExampleFromServer(data.message);
    } catch (error) {
      console.error("Error fetching demo:", error);
    }
  };

  const [selectedService, setSelectedService] = useState<any>(null);
  const [showBooking, setShowBooking] = useState(false);
  const [showAllServices, setShowAllServices] = useState(false);
  const [bookingStep, setBookingStep] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<any>(null);
  const [selectedSalonForMap, setSelectedSalonForMap] = useState<string>("");
  const [bookingData, setBookingData] = useState({
    personalInfo: { name: "", phone: "", email: "" },
    serviceDetails: { service: "", location: "salon", date: "", time: "" },
    payment: { method: "card", amount: 0 },
  });

  const services = [
    {
      id: "hair",
      icon: <Scissors className="h-6 w-6" />,
      title: "Hair Services",
      description: "Complete hair care solutions",
      color: "from-pink-500 to-rose-500",
      services: [
        { name: "Haircut", price: 500, duration: "45 min", popular: true },
        {
          name: "Hair wash & blow-dry",
          price: 800,
          duration: "60 min",
          popular: false,
        },
        {
          name: "Hair styling",
          price: 1200,
          duration: "90 min",
          popular: true,
        },
        { name: "Hair spa", price: 2000, duration: "120 min", popular: false },
        {
          name: "Hair coloring & highlights",
          price: 3500,
          duration: "180 min",
          popular: true,
        },
        {
          name: "Hair smoothening/keratin",
          price: 8000,
          duration: "240 min",
          popular: false,
        },
      ],
    },
    {
      id: "skincare",
      icon: <Sparkles className="h-6 w-6" />,
      title: "Skin & Face Care",
      description: "Professional skincare treatments",
      color: "from-purple-500 to-indigo-500",
      services: [
        {
          name: "Basic Facial",
          price: 1500,
          duration: "60 min",
          popular: true,
        },
        {
          name: "Deep cleansing facial",
          price: 2500,
          duration: "90 min",
          popular: true,
        },
        {
          name: "Anti-acne treatment",
          price: 2000,
          duration: "75 min",
          popular: false,
        },
        {
          name: "Skin polishing",
          price: 3000,
          duration: "120 min",
          popular: false,
        },
        { name: "Tan removal", price: 2200, duration: "90 min", popular: true },
        {
          name: "Hydration therapy",
          price: 3500,
          duration: "105 min",
          popular: false,
        },
      ],
    },
    {
      id: "body",
      icon: <Heart className="h-6 w-6" />,
      title: "Body Treatments",
      description: "Relaxing body therapies",
      color: "from-emerald-500 to-teal-500",
      services: [
        {
          name: "Swedish Massage",
          price: 2500,
          duration: "60 min",
          popular: true,
        },
        {
          name: "Thai Massage",
          price: 3000,
          duration: "90 min",
          popular: false,
        },
        {
          name: "Deep Tissue Massage",
          price: 3500,
          duration: "75 min",
          popular: true,
        },
        { name: "Body scrub", price: 2000, duration: "45 min", popular: false },
        {
          name: "Aromatherapy",
          price: 4000,
          duration: "120 min",
          popular: true,
        },
        {
          name: "Full body polishing",
          price: 5000,
          duration: "150 min",
          popular: false,
        },
      ],
    },
    {
      id: "nails",
      icon: <Palette className="h-6 w-6" />,
      title: "Nail Care",
      description: "Beautiful nail treatments",
      color: "from-orange-500 to-red-500",
      services: [
        { name: "Manicure", price: 800, duration: "45 min", popular: true },
        { name: "Pedicure", price: 1000, duration: "60 min", popular: true },
        { name: "Gel nails", price: 1500, duration: "75 min", popular: false },
        { name: "Nail art", price: 1200, duration: "90 min", popular: true },
        {
          name: "Nail extensions",
          price: 2500,
          duration: "120 min",
          popular: false,
        },
        { name: "Foot spa", price: 1800, duration: "90 min", popular: false },
      ],
    },
    {
      id: "waxing",
      icon: <Star className="h-6 w-6" />,
      title: "Waxing & Hair Removal",
      description: "Smooth skin solutions",
      color: "from-yellow-500 to-orange-500",
      services: [
        {
          name: "Full body waxing",
          price: 2500,
          duration: "120 min",
          popular: true,
        },
        {
          name: "Half body waxing",
          price: 1500,
          duration: "75 min",
          popular: true,
        },
        {
          name: "Bikini waxing",
          price: 1200,
          duration: "45 min",
          popular: false,
        },
        { name: "Threading", price: 200, duration: "15 min", popular: true },
        {
          name: "Laser hair removal",
          price: 5000,
          duration: "60 min",
          popular: false,
        },
      ],
    },
    {
      id: "makeup",
      icon: <Crown className="h-6 w-6" />,
      title: "Makeup & Grooming",
      description: "Special occasion beauty",
      color: "from-violet-500 to-purple-500",
      services: [
        {
          name: "Party makeup",
          price: 2500,
          duration: "90 min",
          popular: true,
        },
        {
          name: "Bridal makeup",
          price: 8000,
          duration: "180 min",
          popular: true,
        },
        {
          name: "Saree draping",
          price: 1500,
          duration: "45 min",
          popular: false,
        },
        {
          name: "Mehendi application",
          price: 2000,
          duration: "120 min",
          popular: true,
        },
        {
          name: "Hairdo styling",
          price: 3000,
          duration: "90 min",
          popular: false,
        },
      ],
    },
    {
      id: "mens",
      icon: <User className="h-6 w-6" />,
      title: "Men's Grooming",
      description: "Specialized men's services",
      color: "from-slate-500 to-gray-600",
      services: [
        { name: "Haircut", price: 400, duration: "30 min", popular: true },
        {
          name: "Beard trimming",
          price: 300,
          duration: "20 min",
          popular: true,
        },
        {
          name: "Men's facial",
          price: 1200,
          duration: "60 min",
          popular: false,
        },
        { name: "Head massage", price: 800, duration: "45 min", popular: true },
        {
          name: "D-tan treatment",
          price: 1500,
          duration: "75 min",
          popular: false,
        },
      ],
    },
    {
      id: "packages",
      icon: <Gift className="h-6 w-6" />,
      title: "Packages",
      description: "Complete beauty packages",
      color: "from-pink-500 to-violet-500",
      services: [
        {
          name: "Pre-bridal package",
          price: 15000,
          duration: "6 hours",
          popular: true,
        },
        {
          name: "Groom package",
          price: 8000,
          duration: "4 hours",
          popular: false,
        },
        {
          name: "Couple spa package",
          price: 12000,
          duration: "3 hours",
          popular: true,
        },
        {
          name: "Monthly grooming",
          price: 5000,
          duration: "Multiple visits",
          popular: true,
        },
      ],
    },
    {
      id: "kids",
      icon: <Baby className="h-6 w-6" />,
      title: "Kids & Teens",
      description: "Gentle care for young ones",
      color: "from-cyan-500 to-blue-500",
      services: [
        { name: "Kids haircut", price: 300, duration: "20 min", popular: true },
        { name: "Teen facial", price: 800, duration: "45 min", popular: false },
        {
          name: "Gentle mani-pedi",
          price: 600,
          duration: "40 min",
          popular: true,
        },
      ],
    },
    {
      id: "special",
      icon: <Home className="h-6 w-6" />,
      title: "Special Services",
      description: "Premium and convenience services",
      color: "from-rose-500 to-pink-500",
      services: [
        {
          name: "Home service",
          price: 0,
          duration: "Travel + Service",
          popular: true,
        },
        {
          name: "Ayurvedic spa",
          price: 4500,
          duration: "150 min",
          popular: false,
        },
        {
          name: "Slimming therapy",
          price: 3500,
          duration: "120 min",
          popular: false,
        },
        {
          name: "Dermat consultation",
          price: 1000,
          duration: "30 min",
          popular: true,
        },
      ],
    },
  ];

  const popularSalons = [
    {
      id: 1,
      name: "Glamour Studio",
      rating: 4.8,
      reviews: 1250,
      image: "🏢",
      location: "Bandra West",
      distance: "2.3 km",
      specialties: ["Bridal", "Hair Color"],
      priceRange: "₹₹₹",
    },
    {
      id: 2,
      name: "Beauty Palace",
      rating: 4.6,
      reviews: 890,
      image: "🏛️",
      location: "Andheri East",
      distance: "3.1 km",
      specialties: ["Spa", "Skincare"],
      priceRange: "₹₹",
    },
    {
      id: 3,
      name: "Luxe Salon & Spa",
      rating: 4.9,
      reviews: 2100,
      image: "✨",
      location: "Juhu",
      distance: "4.2 km",
      specialties: ["Premium", "Celebrity"],
      priceRange: "₹₹₹₹",
    },
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      service: "Bridal Package",
      content:
        "Absolutely stunning bridal makeup and hair! The team made me feel like a princess on my special day. Every detail was perfect.",
      rating: 5,
      image: "👰",
    },
    {
      name: "Rajesh Kumar",
      service: "Men's Grooming",
      content:
        "Best men's salon experience! Professional beard styling and relaxing facial. The atmosphere is so welcoming.",
      rating: 5,
      image: "🧔",
    },
    {
      name: "Anita Patel",
      service: "Skin Treatment",
      content:
        "My skin has never looked better! The anti-acne treatment and facials have completely transformed my complexion.",
      rating: 5,
      image: "💆‍♀️",
    },
    {
      name: "Meera Singh",
      service: "Hair Spa",
      content:
        "The hair spa treatment was incredibly relaxing. My hair feels so soft and healthy now. Highly recommend!",
      rating: 5,
      image: "💇‍♀️",
    },
  ];

  const packages = [
    {
      name: "Bridal Glow",
      price: "₹25,000",
      originalPrice: "₹35,000",
      description: "Complete bridal transformation package",
      duration: "3 sessions",
      features: [
        "Pre-bridal facial treatment",
        "Hair spa & styling",
        "Professional makeup",
        "Mehendi application",
        "Saree draping",
        "Nail art & extensions",
      ],
      popular: true,
    },
    {
      name: "Monthly Glow",
      price: "₹8,999",
      originalPrice: "₹12,000",
      description: "Monthly beauty maintenance",
      duration: "4 visits/month",
      features: [
        "2 Facials per month",
        "1 Hair spa session",
        "Manicure & pedicure",
        "Eyebrow threading",
        "Basic waxing services",
        "Skin consultation",
      ],
    },
    {
      name: "Couple Spa",
      price: "₹6,500",
      originalPrice: "₹9,000",
      description: "Relaxing spa experience for two",
      duration: "2 hours",
      features: [
        "Swedish massage for two",
        "Aromatherapy session",
        "Body scrub treatment",
        "Relaxing foot spa",
        "Herbal tea & refreshments",
        "Private spa room",
      ],
    },
  ];

  const [filteredServices, setFilteredServices] = useState(services);
  const [filteredSalons, setFilteredSalons] = useState(popularSalons);

  const startBooking = (service?: any) => {
    setSelectedService(service);
    setShowBooking(true);
    setBookingStep(1);
  };

  const closeBooking = () => {
    setShowBooking(false);
    setBookingStep(1);
    setSelectedService(null);
  };

  const handleFiltersApply = (filters: any) => {
    setAppliedFilters(filters);

    // Filter services based on applied filters
    let filtered = services;
    if (filters.serviceTypes && filters.serviceTypes.length > 0) {
      filtered = services.filter((service) =>
        filters.serviceTypes.includes(service.title),
      );
    }
    setFilteredServices(filtered);

    // Filter salons based on location and rating
    let filteredSalonList = popularSalons;
    if (filters.location && filters.location.areas.length > 0) {
      filteredSalonList = popularSalons.filter((salon) =>
        filters.location.areas.some((area: string) =>
          salon.location.toLowerCase().includes(area.toLowerCase()),
        ),
      );
    }
    if (filters.ratings > 0) {
      filteredSalonList = filteredSalonList.filter(
        (salon) => salon.rating >= filters.ratings,
      );
    }
    setFilteredSalons(filteredSalonList);
  };

  const handleSalonSelect = (salonId: string) => {
    setSelectedSalonForMap(salonId);
  };

  const handleBookFromMap = (salonId: string) => {
    setShowMap(false);
    startBooking();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile App Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-rose-500" />
            <span className="text-lg font-bold text-gray-900">BeautyBook</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Search className="h-4 w-4" />
            </Button>
            <AuthButton />
          </div>
        </div>
      </header>

      {/* Mobile Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-rose-500 via-pink-500 to-purple-600 text-white">
        <div className="relative px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">
              Book Your Beauty
              <br />
              <span className="text-rose-100">Appointment</span>
            </h1>
            <p className="text-rose-100 text-sm mb-6 max-w-sm mx-auto">
              Discover nearby salons, compare prices, and book instantly.
              Premium beauty services at your fingertips.
            </p>

            <Button
              onClick={() => startBooking()}
              className="bg-white text-rose-600 hover:bg-rose-50 font-semibold px-8 py-3 rounded-full shadow-lg"
            >
              <Calendar className="mr-2 h-4 w-4" />
              Book Now
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mt-8 text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <div className="text-xl font-bold">500+</div>
              <div className="text-xs text-rose-100">Salons</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <div className="text-xl font-bold">50K+</div>
              <div className="text-xs text-rose-100">Bookings</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <div className="text-xl font-bold">4.8★</div>
              <div className="text-xs text-rose-100">Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Categories */}
      <section className="px-4 py-6 -mt-4 relative z-10">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Services</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilters(true)}
            >
              <Filter className="h-4 w-4 mr-1" />
              {appliedFilters ? "Filtered" : "Filter"}
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {services.map((service, index) => (
              <Card
                key={service.id}
                className={`cursor-pointer transition-all duration-300 hover:scale-105 border-0 bg-gradient-to-br ${service.color} text-white shadow-lg`}
                onClick={() => setSelectedService(service)}
              >
                <CardContent className="p-4 text-center">
                  <div className="mb-2">{service.icon}</div>
                  <h3 className="font-medium text-sm mb-1">{service.title}</h3>
                  <p className="text-xs opacity-90">
                    {service.services.length} services
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* View All Services Button */}
          <div className="mt-6 text-center">
            <Button
              variant="outline"
              onClick={() => setShowAllServices(true)}
              className="px-8 border-rose-200 text-rose-700 hover:bg-rose-50"
            >
              View All Services
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Popular Salons */}
      <section className="px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Popular Salons
          </h2>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-rose-600"
              onClick={() => setShowMap(true)}
            >
              <MapPin className="h-4 w-4 mr-1" />
              Map
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-rose-600"
              onClick={() => setShowGallery(true)}
            >
              <Camera className="h-4 w-4 mr-1" />
              Gallery
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {popularSalons.map((salon) => (
            <Card key={salon.id} className="shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">{salon.image}</div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {salon.name}
                        </h3>
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
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-600">
                            {salon.distance}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {salon.location}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-medium text-gray-900">
                          {salon.priceRange}
                        </div>
                        <Button
                          size="sm"
                          className="mt-2 bg-rose-500 hover:bg-rose-600 text-xs px-3 py-1"
                        >
                          Book
                        </Button>
                      </div>
                    </div>
                    <div className="flex gap-1 mt-2">
                      {salon.specialties.map((specialty) => (
                        <Badge
                          key={specialty}
                          variant="secondary"
                          className="text-xs px-2 py-0"
                        >
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* All Services View */}
      {showAllServices && (
        <div className="fixed inset-0 z-50 bg-white">
          {/* Header */}
          <header className="sticky top-0 bg-white border-b border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAllServices(false)}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-lg font-semibold">Services</h1>
              <Button variant="ghost" size="sm">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </header>

          {/* Services List */}
          <div className="p-4 space-y-3">
            {services.map((service, index) => (
              <Card
                key={service.id}
                className="cursor-pointer transition-all duration-300 hover:shadow-md"
                onClick={() => {
                  setSelectedService(service);
                  setShowAllServices(false);
                }}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div
                      className={`h-12 w-12 rounded-lg bg-gradient-to-br ${service.color} flex items-center justify-center text-white`}
                    >
                      {service.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">
                        {service.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {service.services.length} services
                      </p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Service Details Modal */}
      {selectedService && !showBooking && !showAllServices && (
        <div
          className="fixed inset-0 z-50 bg-black/50"
          onClick={() => setSelectedService(null)}
        >
          <div
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white p-4 border-b flex items-center justify-between">
              <h2 className="text-lg font-semibold">{selectedService.title}</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedService(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="p-4">
              <p className="text-gray-600 text-sm mb-4">
                {selectedService.description}
              </p>

              <div className="space-y-3">
                {selectedService.services.map((item: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-gray-900">
                          {item.name}
                        </h4>
                        {item.popular && (
                          <Badge className="bg-rose-100 text-rose-700 text-xs">
                            Popular
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-rose-600 font-semibold">
                          ₹{item.price}
                        </span>
                        <span className="text-gray-500 text-sm">
                          {item.duration}
                        </span>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => startBooking(item)}
                      className="bg-rose-500 hover:bg-rose-600"
                    >
                      Book
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3-Step Booking Modal */}
      {showBooking && (
        <div className="fixed inset-0 z-50 bg-black/50">
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[90vh] overflow-y-auto">
            {/* Booking Header */}
            <div className="sticky top-0 bg-white p-4 border-b">
              <div className="flex items-center justify-between">
                <Button variant="ghost" size="sm" onClick={closeBooking}>
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <h2 className="text-lg font-semibold">Book Appointment</h2>
                <Button variant="ghost" size="sm" onClick={closeBooking}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Step Indicator */}
              <div className="flex items-center gap-2 mt-4">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex items-center gap-2">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        step <= bookingStep
                          ? "bg-rose-500 text-white"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {step}
                    </div>
                    {step < 3 && (
                      <div
                        className={`w-8 h-0.5 ${step < bookingStep ? "bg-rose-500" : "bg-gray-200"}`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Booking Content */}
            <div className="p-4">
              {/* Step 1: Personal Info */}
              {bookingStep === 1 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold mb-4">
                    Personal Information
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      defaultValue={user?.name || ""}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      defaultValue={user?.phone || ""}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                      placeholder="+91 98765 43210"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email (Optional)
                    </label>
                    <input
                      type="email"
                      defaultValue={user?.email || ""}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                      placeholder="your@email.com"
                    />
                  </div>

                  <Button
                    className="w-full bg-rose-500 hover:bg-rose-600 mt-6"
                    onClick={() => setBookingStep(2)}
                  >
                    Continue
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              )}

              {/* Step 2: Date, Time & Location */}
              {bookingStep === 2 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold mb-4">
                    Appointment Details
                  </h3>

                  {selectedService && (
                    <div className="bg-rose-50 p-3 rounded-lg mb-4">
                      <h4 className="font-medium text-rose-900">
                        {selectedService.name || selectedService.title}
                      </h4>
                      {selectedService.price && (
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-rose-600 font-semibold">
                            ₹{selectedService.price}
                          </span>
                          <span className="text-rose-700 text-sm">
                            {selectedService.duration}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Location Choice */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        variant={
                          bookingData.serviceDetails.location === "salon"
                            ? "default"
                            : "outline"
                        }
                        className="justify-start"
                        onClick={() =>
                          setBookingData((prev) => ({
                            ...prev,
                            serviceDetails: {
                              ...prev.serviceDetails,
                              location: "salon",
                            },
                          }))
                        }
                      >
                        <MapPin className="mr-2 h-4 w-4" />
                        At Salon
                      </Button>
                      <Button
                        variant={
                          bookingData.serviceDetails.location === "home"
                            ? "default"
                            : "outline"
                        }
                        className="justify-start"
                        onClick={() =>
                          setBookingData((prev) => ({
                            ...prev,
                            serviceDetails: {
                              ...prev.serviceDetails,
                              location: "home",
                            },
                          }))
                        }
                      >
                        <Home className="mr-2 h-4 w-4" />
                        Home Service
                      </Button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Date
                    </label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Time
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        "10:00 AM",
                        "12:00 PM",
                        "2:00 PM",
                        "4:00 PM",
                        "6:00 PM",
                        "8:00 PM",
                      ].map((time) => (
                        <Button
                          key={time}
                          variant="outline"
                          size="sm"
                          className="text-xs"
                        >
                          {time}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setBookingStep(1)}
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    <Button
                      className="flex-1 bg-rose-500 hover:bg-rose-600"
                      onClick={() => setBookingStep(3)}
                    >
                      Continue
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Payment */}
              {bookingStep === 3 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold mb-4">
                    Payment & Confirmation
                  </h3>

                  {/* Booking Summary */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">
                      Booking Summary
                    </h4>
                    {selectedService && (
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Service:</span>
                          <span>
                            {selectedService.name || selectedService.title}
                          </span>
                        </div>
                        {selectedService.price && (
                          <div className="flex justify-between">
                            <span>Price:</span>
                            <span className="font-semibold">
                              ₹{selectedService.price}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span>Location:</span>
                          <span className="capitalize">
                            {bookingData.serviceDetails.location}
                          </span>
                        </div>
                        {bookingData.serviceDetails.location === "home" && (
                          <div className="flex justify-between">
                            <span>Home Service Fee:</span>
                            <span>₹200</span>
                          </div>
                        )}
                        <hr className="my-2" />
                        <div className="flex justify-between font-semibold">
                          <span>Total:</span>
                          <span>
                            ₹
                            {(selectedService.price || 0) +
                              (bookingData.serviceDetails.location === "home"
                                ? 200
                                : 0)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Payment Methods */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Payment Method
                    </label>
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() =>
                          setBookingData((prev) => ({
                            ...prev,
                            payment: { ...prev.payment, method: "card" },
                          }))
                        }
                      >
                        <CreditCard className="mr-2 h-4 w-4" />
                        Credit/Debit Card
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() =>
                          setBookingData((prev) => ({
                            ...prev,
                            payment: { ...prev.payment, method: "upi" },
                          }))
                        }
                      >
                        <Smartphone className="mr-2 h-4 w-4" />
                        UPI / Digital Wallet
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() =>
                          setBookingData((prev) => ({
                            ...prev,
                            payment: { ...prev.payment, method: "pay_later" },
                          }))
                        }
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        Pay at Salon
                      </Button>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setBookingStep(2)}
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    <Button
                      className="flex-1 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600"
                      onClick={() => {
                        // Handle booking confirmation
                        alert(
                          "Booking confirmed! You will receive a confirmation SMS shortly.",
                        );
                        closeBooking();
                      }}
                    >
                      <Shield className="mr-2 h-4 w-4" />
                      Confirm Booking
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 safe-area-pb">
        <div className="flex items-center justify-around">
          <Button
            variant="ghost"
            size="sm"
            className="flex-col gap-1 h-auto py-2"
          >
            <Home className="h-4 w-4" />
            <span className="text-xs">Home</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex-col gap-1 h-auto py-2"
          >
            <Calendar className="h-4 w-4" />
            <span className="text-xs">Bookings</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex-col gap-1 h-auto py-2"
          >
            <Heart className="h-4 w-4" />
            <span className="text-xs">Favorites</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex-col gap-1 h-auto py-2"
          >
            <User className="h-4 w-4" />
            <span className="text-xs">Profile</span>
          </Button>
        </div>
      </div>

      {/* Add bottom padding to account for fixed navigation */}
      <div className="h-20"></div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
        <div className="absolute inset-0 bg-grid-rose-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]"></div>
        <div className="relative mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:px-8 lg:pt-16">
          <div className="mx-auto max-w-3xl text-center">
            <div className="animate-in fade-in duration-1000 slide-in-from-bottom-4">
              <Badge
                variant="secondary"
                className="mb-4 bg-rose-100 text-rose-800 border-rose-200"
              >
                <Sparkles className="mr-1 h-3 w-3" />
                Premium Beauty & Wellness
              </Badge>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl animate-in fade-in duration-1000 slide-in-from-bottom-8 delay-200">
              Discover Your
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-purple-600">
                {" "}
                Natural Beauty
              </span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-600 animate-in fade-in duration-1000 slide-in-from-bottom-8 delay-300">
              Experience premium beauty and wellness services in our luxurious
              salon and spa. From hair styling to rejuvenating treatments, we
              bring out your best self with expert care and attention.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-x-6 animate-in fade-in duration-1000 slide-in-from-bottom-8 delay-500">
              <Button
                size="lg"
                className="bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 transition-all duration-300 hover:scale-105 hover:shadow-lg w-full sm:w-auto"
              >
                <Calendar className="mr-2 h-4 w-4" />
                Book Appointment
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="transition-all duration-300 hover:scale-105 border-rose-200 text-rose-700 hover:bg-rose-50 w-full sm:w-auto"
              >
                <Phone className="mr-2 h-4 w-4" />
                Call Now
              </Button>
            </div>

            {/* Quick Info Bar */}
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 animate-in fade-in duration-1000 delay-700">
              <div className="flex items-center justify-center gap-2 text-sm text-slate-600">
                <Clock className="h-4 w-4 text-rose-500" />
                <span>Mon-Sun: 9AM-9PM</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-slate-600">
                <MapPin className="h-4 w-4 text-rose-500" />
                <span>Multiple Locations</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-slate-600">
                <Home className="h-4 w-4 text-rose-500" />
                <span>Home Service Available</span>
              </div>
            </div>

            {exampleFromServer && (
              <p className="mt-6 text-sm text-slate-500 animate-in fade-in duration-1000 delay-700">
                System status: {exampleFromServer}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 sm:py-32 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div
            ref={animateRef("services-header")}
            className={`mx-auto max-w-2xl text-center transition-all duration-1000 ${
              isVisible["services-header"]
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Complete Beauty & Wellness Services
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Professional treatments and care for every beauty need, from head
              to toe
            </p>
          </div>

          <div className="mx-auto mt-16 max-w-7xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <Card
                  key={index}
                  ref={animateRef(`service-${index}`)}
                  className={`group transition-all duration-700 hover:scale-105 hover:shadow-xl border-rose-100 ${
                    isVisible[`service-${index}`]
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-8"
                  }`}
                  style={{ transitionDelay: `${index * 80}ms` }}
                >
                  <CardHeader className="text-center pb-4">
                    <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-gradient-to-br from-rose-100 to-purple-100 text-rose-600 transition-all duration-300 group-hover:from-rose-200 group-hover:to-purple-200 group-hover:scale-110">
                      {service.icon}
                    </div>
                    <CardTitle className="text-xl font-semibold text-slate-900 mt-4">
                      {service.title}
                    </CardTitle>
                    <CardDescription className="text-slate-600">
                      {service.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {service.services.slice(0, 4).map((item, itemIndex) => (
                        <li
                          key={itemIndex}
                          className="flex items-start gap-2 text-sm text-slate-600"
                        >
                          <CheckCircle className="h-4 w-4 text-rose-500 mt-0.5 flex-shrink-0" />
                          <span>
                            {typeof item === "string" ? item : item.name}
                          </span>
                        </li>
                      ))}
                      {service.services.length > 4 && (
                        <li className="text-sm text-rose-600 font-medium pt-1">
                          +{service.services.length - 4} more services
                        </li>
                      )}
                    </ul>
                    <Button
                      variant="outline"
                      className="w-full mt-6 border-rose-200 text-rose-700 hover:bg-rose-50 transition-all duration-300 group-hover:scale-105"
                      onClick={() => setShowAllServices(true)}
                    >
                      View All Services
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-gradient-to-br from-rose-50 to-purple-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div
            ref={animateRef("testimonials-header")}
            className={`mx-auto max-w-2xl text-center transition-all duration-1000 ${
              isVisible["testimonials-header"]
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Trusted by Beautiful Clients
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              See what our valued clients say about their transformative
              experience
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-2 xl:grid-cols-4">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                ref={animateRef(`testimonial-${index}`)}
                className={`transition-all duration-700 hover:scale-105 hover:shadow-xl bg-white/70 backdrop-blur-sm border-rose-100 ${
                  isVisible[`testimonial-${index}`]
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <CardContent className="pt-6">
                  <div className="text-center mb-4">
                    <div className="text-4xl mb-3">{testimonial.image}</div>
                    <div className="flex justify-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 fill-rose-400 text-rose-400"
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-slate-600 mb-4 text-sm leading-relaxed">
                    "{testimonial.content}"
                  </p>
                  <div className="text-center">
                    <p className="font-semibold text-slate-900">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-rose-600 font-medium">
                      {testimonial.service}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section className="py-24 sm:py-32 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div
            ref={animateRef("packages-header")}
            className={`mx-auto max-w-2xl text-center transition-all duration-1000 ${
              isVisible["packages-header"]
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Special Beauty Packages
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Complete beauty solutions designed for every occasion and budget
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {packages.map((pkg, index) => (
              <Card
                key={index}
                ref={animateRef(`package-${index}`)}
                className={`relative transition-all duration-700 hover:scale-105 hover:shadow-xl border-rose-100 ${
                  pkg.popular
                    ? "ring-2 ring-rose-300 shadow-lg bg-gradient-to-br from-rose-50 to-purple-50"
                    : "bg-white"
                } ${
                  isVisible[`package-${index}`]
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {pkg.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-rose-500 to-purple-600 animate-pulse">
                    Most Popular
                  </Badge>
                )}
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-slate-900">
                    {pkg.name}
                  </CardTitle>
                  <CardDescription className="text-slate-600">
                    {pkg.description}
                  </CardDescription>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-slate-900">
                      {pkg.price}
                    </span>
                    {pkg.originalPrice && (
                      <span className="text-lg text-slate-500 line-through">
                        {pkg.originalPrice}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-rose-600 font-medium">
                    {pkg.duration}
                  </p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {pkg.features.map((feature, featureIndex) => (
                      <li
                        key={featureIndex}
                        className="flex items-start gap-3 group"
                      >
                        <CheckCircle className="h-4 w-4 text-rose-500 mt-0.5 transition-transform duration-300 group-hover:scale-110 flex-shrink-0" />
                        <span className="text-slate-600 text-sm">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full mt-6 transition-all duration-300 hover:scale-105 ${
                      pkg.popular
                        ? "bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white"
                        : "border-rose-200 text-rose-700 hover:bg-rose-50"
                    }`}
                    variant={pkg.popular ? "default" : "outline"}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    Book This Package
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Special Offers Banner */}
          <div
            ref={animateRef("offers-banner")}
            className={`mt-16 mx-auto max-w-4xl transition-all duration-1000 ${
              isVisible["offers-banner"]
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <Card className="bg-gradient-to-r from-rose-500 to-purple-600 border-0 text-white">
              <CardContent className="pt-6 text-center">
                <h3 className="text-2xl font-bold mb-2">Limited Time Offer!</h3>
                <p className="text-rose-100 mb-4">
                  Book any package this month and get 20% off on your next
                  visit. Plus, refer a friend and both get additional 10%
                  discount!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    variant="secondary"
                    className="bg-white text-rose-600 hover:bg-rose-50"
                  >
                    <Gift className="mr-2 h-4 w-4" />
                    Claim Offer
                  </Button>
                  <Button
                    variant="outline"
                    className="border-white text-white hover:bg-white hover:text-rose-600"
                  >
                    <Users className="mr-2 h-4 w-4" />
                    Refer a Friend
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Booking & Contact Section */}
      <section className="py-24 sm:py-32 bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div
            ref={animateRef("booking-header")}
            className={`mx-auto max-w-2xl text-center transition-all duration-1000 ${
              isVisible["booking-header"]
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to Transform Your Look?
            </h2>
            <p className="mt-4 text-lg text-slate-300">
              Book your appointment today and experience the difference of
              premium beauty care
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-6xl grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Booking Form */}
            <Card
              ref={animateRef("booking-form")}
              className={`transition-all duration-1000 ${
                isVisible["booking-form"]
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              <CardHeader>
                <CardTitle className="text-xl text-slate-900 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-rose-500" />
                  Book Your Appointment
                </CardTitle>
                <CardDescription>
                  Fill out the form below and we'll confirm your appointment
                  within 24 hours
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700 block mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 block mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    placeholder="+91 98765 43210"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-2">
                    Service Required
                  </label>
                  <select className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent">
                    <option>Select a service</option>
                    <option>Hair Services</option>
                    <option>Skin & Face Care</option>
                    <option>Body Treatments</option>
                    <option>Nail Care</option>
                    <option>Makeup & Grooming</option>
                    <option>Bridal Package</option>
                    <option>Men's Grooming</option>
                    <option>Complete Package</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-2">
                    Preferred Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-2">
                    Special Requests
                  </label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    placeholder="Any special requests or notes..."
                  ></textarea>
                </div>
                <Button className="w-full bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700">
                  <Calendar className="mr-2 h-4 w-4" />
                  Book Appointment
                </Button>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div
              ref={animateRef("contact-info")}
              className={`space-y-8 transition-all duration-1000 delay-200 ${
                isVisible["contact-info"]
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              <div>
                <h3 className="text-2xl font-bold text-white mb-6">
                  Get in Touch
                </h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 bg-rose-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white">
                        Call Us
                      </h4>
                      <p className="text-slate-300">+91 98765 43210</p>
                      <p className="text-slate-300">+91 87654 32109</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 bg-rose-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white">
                        Visit Us
                      </h4>
                      <p className="text-slate-300">
                        123 Beauty Street, Fashion District
                      </p>
                      <p className="text-slate-300">
                        Mumbai, Maharashtra 400001
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 bg-rose-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white">
                        Email Us
                      </h4>
                      <p className="text-slate-300">booking@beautysalon.com</p>
                      <p className="text-slate-300">info@beautysalon.com</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 bg-rose-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white">
                        Opening Hours
                      </h4>
                      <p className="text-slate-300">
                        Monday - Sunday: 9:00 AM - 9:00 PM
                      </p>
                      <p className="text-slate-300">
                        No holidays • Always open for you
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <h4 className="text-lg font-semibold text-white mb-4">
                  Why Choose Us?
                </h4>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-slate-300">
                    <CheckCircle className="h-5 w-5 text-rose-400 flex-shrink-0" />
                    Expert beauticians with 10+ years experience
                  </li>
                  <li className="flex items-center gap-3 text-slate-300">
                    <CheckCircle className="h-5 w-5 text-rose-400 flex-shrink-0" />
                    Premium international beauty products
                  </li>
                  <li className="flex items-center gap-3 text-slate-300">
                    <CheckCircle className="h-5 w-5 text-rose-400 flex-shrink-0" />
                    Hygienic and luxurious environment
                  </li>
                  <li className="flex items-center gap-3 text-slate-300">
                    <CheckCircle className="h-5 w-5 text-rose-400 flex-shrink-0" />
                    Home service available across the city
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <div className="xl:grid xl:grid-cols-4 xl:gap-8">
            <div className="space-y-8 xl:col-span-1">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Sparkles className="h-6 w-6 text-rose-400" />
                  Glamour Beauty Salon
                </h3>
                <p className="mt-3 text-sm text-slate-400 leading-relaxed">
                  Your premier destination for luxury beauty and wellness
                  services. Transforming lives through expert care and premium
                  treatments.
                </p>
                <div className="mt-6 flex space-x-4">
                  <a
                    href="#"
                    className="text-slate-400 hover:text-rose-400 transition-colors"
                  >
                    <span className="sr-only">Facebook</span>
                    <svg
                      className="h-6 w-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                    </svg>
                  </a>
                  <a
                    href="#"
                    className="text-slate-400 hover:text-rose-400 transition-colors"
                  >
                    <span className="sr-only">Instagram</span>
                    <svg
                      className="h-6 w-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987c6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297L3.182 17.635l1.955-1.955c.808.864 1.959 1.297 3.312 1.297 2.14 0 3.934-1.446 3.934-3.235 0-1.789-1.794-3.235-3.934-3.235s-3.934 1.446-3.934 3.235c0 .5.108.976.297 1.419l-1.955 1.955 1.944 1.944c.376-.808.864-1.5 1.419-2.055.555.555 1.043 1.247 1.419 2.055l1.944-1.944-1.955-1.955c.189-.443.297-.919.297-1.419 0-1.789 1.794-3.235 3.934-3.235s3.934 1.446 3.934 3.235c0 1.789-1.794 3.235-3.934 3.235z" />
                    </svg>
                  </a>
                  <a
                    href="#"
                    className="text-slate-400 hover:text-rose-400 transition-colors"
                  >
                    <span className="sr-only">WhatsApp</span>
                    <svg
                      className="h-6 w-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.569-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
            <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-3 xl:mt-0">
              <div>
                <h3 className="text-sm font-semibold text-white">
                  Quick Links
                </h3>
                <ul className="mt-6 space-y-4">
                  <li>
                    <a
                      href="#services"
                      className="text-sm text-slate-400 hover:text-white transition-colors"
                    >
                      Our Services
                    </a>
                  </li>
                  <li>
                    <a
                      href="#packages"
                      className="text-sm text-slate-400 hover:text-white transition-colors"
                    >
                      Beauty Packages
                    </a>
                  </li>
                  <li>
                    <a
                      href="#testimonials"
                      className="text-sm text-slate-400 hover:text-white transition-colors"
                    >
                      Client Reviews
                    </a>
                  </li>
                  <li>
                    <a
                      href="#booking"
                      className="text-sm text-slate-400 hover:text-white transition-colors"
                    >
                      Book Appointment
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Services</h3>
                <ul className="mt-6 space-y-4">
                  <li>
                    <a
                      href="#"
                      className="text-sm text-slate-400 hover:text-white transition-colors"
                    >
                      Hair Services
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-sm text-slate-400 hover:text-white transition-colors"
                    >
                      Bridal Makeup
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-sm text-slate-400 hover:text-white transition-colors"
                    >
                      Spa Treatments
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-sm text-slate-400 hover:text-white transition-colors"
                    >
                      Men's Grooming
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">
                  Contact Info
                </h3>
                <ul className="mt-6 space-y-4">
                  <li className="flex items-center gap-2 text-sm text-slate-400">
                    <Phone className="h-4 w-4 text-rose-400" />
                    +91 98765 43210
                  </li>
                  <li className="flex items-center gap-2 text-sm text-slate-400">
                    <Mail className="h-4 w-4 text-rose-400" />
                    info@glamourbeauty.com
                  </li>
                  <li className="flex items-start gap-2 text-sm text-slate-400">
                    <MapPin className="h-4 w-4 text-rose-400 mt-0.5 flex-shrink-0" />
                    123 Beauty Street, Fashion District, Mumbai 400001
                  </li>
                  <li className="flex items-center gap-2 text-sm text-slate-400">
                    <Clock className="h-4 w-4 text-rose-400" />
                    Mon-Sun: 9AM-9PM
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">
                  Special Services
                </h3>
                <ul className="mt-6 space-y-4">
                  <li>
                    <a
                      href="#"
                      className="text-sm text-slate-400 hover:text-white transition-colors"
                    >
                      Home Service
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-sm text-slate-400 hover:text-white transition-colors"
                    >
                      Group Bookings
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-sm text-slate-400 hover:text-white transition-colors"
                    >
                      Gift Vouchers
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-sm text-slate-400 hover:text-white transition-colors"
                    >
                      Monthly Packages
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-12 border-t border-slate-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-xs text-slate-400">
                © 2024 Glamour Beauty Salon. All rights reserved. Designed with
                care for your beauty.
              </p>
              <div className="mt-4 md:mt-0 flex space-x-6">
                <a
                  href="#"
                  className="text-xs text-slate-400 hover:text-white transition-colors"
                >
                  Privacy Policy
                </a>
                <a
                  href="#"
                  className="text-xs text-slate-400 hover:text-white transition-colors"
                >
                  Terms & Conditions
                </a>
                <a
                  href="#"
                  className="text-xs text-slate-400 hover:text-white transition-colors"
                >
                  Cancellation Policy
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Advanced Filters Modal */}
      {showFilters && (
        <AdvancedFilters
          isOpen={showFilters}
          onClose={() => setShowFilters(false)}
          onApplyFilters={handleFiltersApply}
          initialFilters={appliedFilters}
        />
      )}

      {/* Map View Modal */}
      {showMap && (
        <MapView
          isOpen={showMap}
          onClose={() => setShowMap(false)}
          salons={filteredSalons.map((salon) => ({
            id: salon.id.toString(),
            name: salon.name,
            lat: 19.076 + (Math.random() - 0.5) * 0.1,
            lng: 72.8777 + (Math.random() - 0.5) * 0.1,
            rating: salon.rating,
            reviews: salon.reviews,
            distance: salon.distance,
            address: `${salon.location}, Mumbai`,
            phone: "+91 98765 43210",
            image: salon.image,
            services: salon.specialties,
            priceRange: salon.priceRange,
            openNow: Math.random() > 0.3,
            nextAvailable: "Today 3:00 PM",
          }))}
          selectedSalon={selectedSalonForMap}
          onSalonSelect={handleSalonSelect}
          onBookNow={handleBookFromMap}
        />
      )}

      {/* Image Gallery Modal */}
      {showGallery && (
        <ImageGallery
          isOpen={showGallery}
          onClose={() => setShowGallery(false)}
        />
      )}

      {/* Live Chat Widget */}
      <ChatWidget />
    </div>
  );
}
