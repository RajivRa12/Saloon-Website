import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Play,
  Heart,
  Share2,
  Download,
  ZoomIn,
  Filter,
  Grid3X3,
  Star,
  Eye,
} from "lucide-react";

interface ImageItem {
  id: string;
  url: string;
  thumbnail: string;
  title: string;
  category: "before-after" | "salon-interior" | "services" | "team";
  tags: string[];
  likes: number;
  views: number;
  beforeAfter?: {
    before: string;
    after: string;
    treatment: string;
    duration: string;
  };
  description?: string;
  salon?: {
    name: string;
    location: string;
  };
}

interface ImageGalleryProps {
  isOpen: boolean;
  onClose: () => void;
  initialCategory?: string;
  salonId?: string;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({
  isOpen,
  onClose,
  initialCategory = "all",
  salonId,
}) => {
  const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [showBeforeAfter, setShowBeforeAfter] = useState<"before" | "after">(
    "before",
  );
  const [likedImages, setLikedImages] = useState<Set<string>>(new Set());

  // Mock gallery data
  const galleryImages: ImageItem[] = [
    {
      id: "1",
      url: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800",
      thumbnail:
        "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=300",
      title: "Bridal Makeup Transformation",
      category: "before-after",
      tags: ["bridal", "makeup", "transformation"],
      likes: 234,
      views: 1892,
      beforeAfter: {
        before:
          "https://images.unsplash.com/photo-1594736797933-d0601ba2fe65?w=400",
        after:
          "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400",
        treatment: "Complete Bridal Makeup",
        duration: "3 hours",
      },
      description: "Beautiful bridal transformation with natural glam look",
      salon: { name: "Glamour Studio", location: "Bandra West" },
    },
    {
      id: "2",
      url: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=800",
      thumbnail:
        "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=300",
      title: "Luxury Salon Interior",
      category: "salon-interior",
      tags: ["interior", "luxury", "ambiance"],
      likes: 89,
      views: 543,
      description: "Our luxurious salon interior with modern amenities",
      salon: { name: "Luxe Salon & Spa", location: "Juhu" },
    },
    {
      id: "3",
      url: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800",
      thumbnail:
        "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300",
      title: "Hair Color Transformation",
      category: "before-after",
      tags: ["hair", "color", "highlights"],
      likes: 156,
      views: 1234,
      beforeAfter: {
        before:
          "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=400",
        after:
          "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400",
        treatment: "Balayage Highlights",
        duration: "4 hours",
      },
      description:
        "Stunning balayage transformation for natural sun-kissed look",
      salon: { name: "Beauty Palace", location: "Andheri East" },
    },
    {
      id: "4",
      url: "https://images.unsplash.com/photo-1487412912776-0fcf2055264c?w=800",
      thumbnail:
        "https://images.unsplash.com/photo-1487412912776-0fcf2055264c?w=300",
      title: "Spa Treatment Room",
      category: "salon-interior",
      tags: ["spa", "relaxation", "treatment"],
      likes: 67,
      views: 423,
      description: "Peaceful spa treatment room for ultimate relaxation",
      salon: { name: "Wellness Retreat", location: "Worli" },
    },
    {
      id: "5",
      url: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800",
      thumbnail:
        "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=300",
      title: "Nail Art Services",
      category: "services",
      tags: ["nails", "art", "manicure"],
      likes: 98,
      views: 765,
      description: "Professional nail art and manicure services",
      salon: { name: "Style Studio", location: "Bandra West" },
    },
    {
      id: "6",
      url: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800",
      thumbnail:
        "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=300",
      title: "Facial Treatment Process",
      category: "services",
      tags: ["facial", "skincare", "treatment"],
      likes: 134,
      views: 987,
      description: "Rejuvenating facial treatment for glowing skin",
      salon: { name: "Glamour Studio", location: "Bandra West" },
    },
    {
      id: "7",
      url: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=800",
      thumbnail:
        "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=300",
      title: "Professional Team",
      category: "team",
      tags: ["team", "professionals", "experts"],
      likes: 78,
      views: 456,
      description: "Our team of experienced beauty professionals",
      salon: { name: "Beauty Palace", location: "Andheri East" },
    },
    {
      id: "8",
      url: "https://images.unsplash.com/photo-1559599101-f09722fb4948?w=800",
      thumbnail:
        "https://images.unsplash.com/photo-1559599101-f09722fb4948?w=300",
      title: "Skincare Transformation",
      category: "before-after",
      tags: ["skincare", "acne", "treatment"],
      likes: 289,
      views: 2143,
      beforeAfter: {
        before:
          "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400",
        after:
          "https://images.unsplash.com/photo-1559599101-f09722fb4948?w=400",
        treatment: "Anti-Acne Treatment",
        duration: "6 weeks",
      },
      description: "Dramatic skin improvement with our specialized treatment",
      salon: { name: "Wellness Retreat", location: "Worli" },
    },
  ];

  if (!isOpen) return null;

  const categories = [
    { id: "all", name: "All", count: galleryImages.length },
    {
      id: "before-after",
      name: "Before & After",
      count: galleryImages.filter((img) => img.category === "before-after")
        .length,
    },
    {
      id: "salon-interior",
      name: "Salon Interior",
      count: galleryImages.filter((img) => img.category === "salon-interior")
        .length,
    },
    {
      id: "services",
      name: "Services",
      count: galleryImages.filter((img) => img.category === "services").length,
    },
    {
      id: "team",
      name: "Our Team",
      count: galleryImages.filter((img) => img.category === "team").length,
    },
  ];

  const filteredImages =
    selectedCategory === "all"
      ? galleryImages
      : galleryImages.filter((img) => img.category === selectedCategory);

  const toggleLike = (imageId: string) => {
    setLikedImages((prev) => {
      const newLiked = new Set(prev);
      if (newLiked.has(imageId)) {
        newLiked.delete(imageId);
      } else {
        newLiked.add(imageId);
      }
      return newLiked;
    });
  };

  const nextImage = () => {
    if (!selectedImage) return;
    const currentIndex = filteredImages.findIndex(
      (img) => img.id === selectedImage.id,
    );
    const nextIndex = (currentIndex + 1) % filteredImages.length;
    setSelectedImage(filteredImages[nextIndex]);
  };

  const prevImage = () => {
    if (!selectedImage) return;
    const currentIndex = filteredImages.findIndex(
      (img) => img.id === selectedImage.id,
    );
    const prevIndex =
      currentIndex === 0 ? filteredImages.length - 1 : currentIndex - 1;
    setSelectedImage(filteredImages[prevIndex]);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 bg-black/80 backdrop-blur-sm p-4 z-10">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Beauty Gallery</h2>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
            >
              <Grid3X3 className="h-4 w-4 mr-2" />
              Grid View
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 mt-4 overflow-x-auto">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "ghost"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className={`whitespace-nowrap ${
                selectedCategory === category.id
                  ? "bg-rose-500 hover:bg-rose-600"
                  : "text-white hover:bg-white/20"
              }`}
            >
              {category.name} ({category.count})
            </Button>
          ))}
        </div>
      </div>

      {/* Gallery Grid */}
      {!selectedImage && (
        <div className="pt-32 pb-8 px-4 h-full overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredImages.map((image) => (
                <Card
                  key={image.id}
                  className="group cursor-pointer overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105"
                  onClick={() => setSelectedImage(image)}
                >
                  <div className="relative aspect-square">
                    <img
                      src={image.thumbnail}
                      alt={image.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <ZoomIn className="h-8 w-8 text-white" />
                    </div>

                    {/* Category Badge */}
                    <Badge className="absolute top-2 left-2 bg-black/60 text-white text-xs">
                      {image.category.replace("-", " ")}
                    </Badge>

                    {/* Stats */}
                    <div className="absolute bottom-2 right-2 flex gap-1">
                      <div className="bg-black/60 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                        <Heart className="h-3 w-3" />
                        {image.likes}
                      </div>
                      <div className="bg-black/60 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {image.views}
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-3">
                    <h3 className="font-medium text-sm line-clamp-1">
                      {image.title}
                    </h3>
                    {image.salon && (
                      <p className="text-xs text-gray-500 mt-1">
                        {image.salon.name} • {image.salon.location}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Image Viewer */}
      {selectedImage && (
        <div className="relative h-full flex items-center justify-center p-4 pt-24">
          {/* Navigation Arrows */}
          <Button
            variant="ghost"
            size="sm"
            onClick={prevImage}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20 h-12 w-12 p-0 z-10"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={nextImage}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20 h-12 w-12 p-0 z-10"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>

          {/* Image Container */}
          <div className="relative max-w-4xl max-h-full">
            {selectedImage.beforeAfter ? (
              // Before/After View
              <div className="relative">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <img
                        src={selectedImage.beforeAfter.before}
                        alt="Before"
                        className="w-full h-auto max-h-[70vh] object-contain rounded-lg"
                      />
                      <Badge className="absolute top-2 left-2 bg-red-500">
                        Before
                      </Badge>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="relative">
                      <img
                        src={selectedImage.beforeAfter.after}
                        alt="After"
                        className="w-full h-auto max-h-[70vh] object-contain rounded-lg"
                      />
                      <Badge className="absolute top-2 left-2 bg-green-500">
                        After
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Before/After Info */}
                <div className="mt-4 bg-black/60 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-white">
                    <h3 className="text-xl font-semibold mb-2">
                      {selectedImage.title}
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-300">Treatment:</span>
                        <span className="ml-2">
                          {selectedImage.beforeAfter.treatment}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-300">Duration:</span>
                        <span className="ml-2">
                          {selectedImage.beforeAfter.duration}
                        </span>
                      </div>
                    </div>
                    {selectedImage.description && (
                      <p className="text-gray-300 mt-2">
                        {selectedImage.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              // Regular Image View
              <div className="relative">
                <img
                  src={selectedImage.url}
                  alt={selectedImage.title}
                  className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
                />
              </div>
            )}
          </div>

          {/* Image Info */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-black/60 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center justify-between text-white">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">
                    {selectedImage.title}
                  </h3>
                  {selectedImage.salon && (
                    <p className="text-gray-300 text-sm">
                      {selectedImage.salon.name} •{" "}
                      {selectedImage.salon.location}
                    </p>
                  )}
                  {selectedImage.description && (
                    <p className="text-gray-300 text-sm mt-1">
                      {selectedImage.description}
                    </p>
                  )}
                  <div className="flex gap-2 mt-2">
                    {selectedImage.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleLike(selectedImage.id)}
                    className={`text-white hover:bg-white/20 ${
                      likedImages.has(selectedImage.id) ? "text-red-400" : ""
                    }`}
                  >
                    <Heart
                      className={`h-4 w-4 mr-1 ${
                        likedImages.has(selectedImage.id) ? "fill-current" : ""
                      }`}
                    />
                    {selectedImage.likes}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedImage(null)}
                    className="text-white hover:bg-white/20"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
