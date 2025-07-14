import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  X,
  Star,
  Gift,
  Crown,
  Zap,
  TrendingUp,
  Calendar,
  Award,
  Clock,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Heart,
  Users,
  ShoppingBag,
  Target,
  Coins,
  Trophy,
  Flame,
  Diamond,
  Copy,
  Share2,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface LoyaltyTier {
  id: string;
  name: string;
  icon: JSX.Element;
  color: string;
  minPoints: number;
  benefits: string[];
  pointsMultiplier: number;
  exclusiveRewards: string[];
}

interface LoyaltyReward {
  id: string;
  title: string;
  description: string;
  pointsCost: number;
  type: "discount" | "service" | "product" | "experience";
  category: string;
  icon: JSX.Element;
  validUntil: string;
  termsAndConditions: string[];
  isPopular: boolean;
  isLimited: boolean;
  remainingStock?: number;
  imageUrl?: string;
}

interface UserLoyalty {
  currentPoints: number;
  totalEarned: number;
  currentTier: string;
  nextTier?: string;
  pointsToNextTier: number;
  memberSince: string;
  totalRedemptions: number;
  favoriteCategories: string[];
  streak: number;
  lastActivity: string;
}

interface PointsTransaction {
  id: string;
  type: "earned" | "redeemed" | "expired";
  points: number;
  description: string;
  date: string;
  orderId?: string;
  category: string;
}

interface LoyaltyProgramProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoyaltyProgram: React.FC<LoyaltyProgramProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<
    "overview" | "rewards" | "history" | "tiers"
  >("overview");
  const [userLoyalty, setUserLoyalty] = useState<UserLoyalty | null>(null);
  const [loyaltyTiers, setLoyaltyTiers] = useState<LoyaltyTier[]>([]);
  const [availableRewards, setAvailableRewards] = useState<LoyaltyReward[]>([]);
  const [pointsHistory, setPointsHistory] = useState<PointsTransaction[]>([]);
  const [selectedReward, setSelectedReward] = useState<LoyaltyReward | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [showRedeemConfirm, setShowRedeemConfirm] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadLoyaltyData();
    }
  }, [isOpen]);

  const loadLoyaltyData = async () => {
    setIsLoading(true);
    try {
      // Mock data loading
      setLoyaltyTiers(generateLoyaltyTiers());
      setUserLoyalty(generateUserLoyalty());
      setAvailableRewards(generateAvailableRewards());
      setPointsHistory(generatePointsHistory());
    } catch (error) {
      console.error("Failed to load loyalty data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateLoyaltyTiers = (): LoyaltyTier[] => [
    {
      id: "bronze",
      name: "Bronze Beauty",
      icon: <Award className="h-5 w-5" />,
      color: "from-amber-600 to-amber-800",
      minPoints: 0,
      pointsMultiplier: 1,
      benefits: [
        "Earn 1 point per ₹10 spent",
        "Birthday month 10% discount",
        "Early access to sale notifications",
        "Free beauty tips newsletter",
      ],
      exclusiveRewards: ["Bronze Welcome Kit", "Birthday Special"],
    },
    {
      id: "silver",
      name: "Silver Glamour",
      icon: <Star className="h-5 w-5" />,
      color: "from-gray-400 to-gray-600",
      minPoints: 1000,
      pointsMultiplier: 1.25,
      benefits: [
        "Earn 1.25 points per ₹10 spent",
        "Priority booking slots",
        "15% birthday month discount",
        "Complimentary consultation",
        "Free home service once per quarter",
      ],
      exclusiveRewards: [
        "Silver Premium Kit",
        "Quarterly Free Service",
        "VIP Consultation",
      ],
    },
    {
      id: "gold",
      name: "Gold Elite",
      icon: <Crown className="h-5 w-5" />,
      color: "from-yellow-400 to-yellow-600",
      minPoints: 2500,
      pointsMultiplier: 1.5,
      benefits: [
        "Earn 1.5 points per ₹10 spent",
        "Guaranteed booking within 24hrs",
        "20% birthday month discount",
        "Free premium product trials",
        "Exclusive Gold events access",
        "Personal beauty advisor",
      ],
      exclusiveRewards: [
        "Gold Luxury Collection",
        "VIP Event Access",
        "Personal Advisor Sessions",
      ],
    },
    {
      id: "platinum",
      name: "Platinum Prestige",
      icon: <Diamond className="h-5 w-5" />,
      color: "from-purple-400 to-purple-600",
      minPoints: 5000,
      pointsMultiplier: 2,
      benefits: [
        "Earn 2 points per ₹10 spent",
        "Instant booking guarantee",
        "25% birthday month discount",
        "Complimentary luxury treatments",
        "First access to new services",
        "Annual beauty assessment",
        "Celebrity stylist sessions",
      ],
      exclusiveRewards: [
        "Platinum Elite Package",
        "Celebrity Stylist Access",
        "Annual Beauty Retreat",
      ],
    },
  ];

  const generateUserLoyalty = (): UserLoyalty => ({
    currentPoints: 1850,
    totalEarned: 3200,
    currentTier: "silver",
    nextTier: "gold",
    pointsToNextTier: 650,
    memberSince: "2022-03-15",
    totalRedemptions: 12,
    favoriteCategories: ["Hair Services", "Skin Care", "Makeup"],
    streak: 3,
    lastActivity: "2024-01-20",
  });

  const generateAvailableRewards = (): LoyaltyReward[] => [
    {
      id: "discount_10",
      title: "10% Off Next Service",
      description: "Get 10% discount on any beauty service",
      pointsCost: 200,
      type: "discount",
      category: "Discounts",
      icon: <Gift className="h-5 w-5" />,
      validUntil: "2024-03-31",
      termsAndConditions: [
        "Valid for 30 days from redemption",
        "Cannot be combined with other offers",
        "Minimum booking value ₹1000",
      ],
      isPopular: true,
      isLimited: false,
    },
    {
      id: "free_facial",
      title: "Complimentary Basic Facial",
      description: "Free 60-minute basic facial treatment",
      pointsCost: 800,
      type: "service",
      category: "Skin Care",
      icon: <Sparkles className="h-5 w-5" />,
      validUntil: "2024-04-30",
      termsAndConditions: [
        "Valid for 45 days from redemption",
        "Advance booking required",
        "Subject to availability",
      ],
      isPopular: true,
      isLimited: true,
      remainingStock: 25,
    },
    {
      id: "premium_kit",
      title: "Premium Beauty Kit",
      description: "Curated collection of premium beauty products",
      pointsCost: 1200,
      type: "product",
      category: "Products",
      icon: <ShoppingBag className="h-5 w-5" />,
      validUntil: "2024-06-30",
      termsAndConditions: [
        "Home delivery included",
        "Products worth ₹3000+",
        "Non-refundable",
      ],
      isPopular: false,
      isLimited: true,
      remainingStock: 10,
    },
    {
      id: "vip_consultation",
      title: "VIP Beauty Consultation",
      description: "90-minute consultation with senior beauty expert",
      pointsCost: 600,
      type: "experience",
      category: "Consultation",
      icon: <Award className="h-5 w-5" />,
      validUntil: "2024-05-31",
      termsAndConditions: [
        "Valid for 60 days from redemption",
        "Includes personalized beauty plan",
        "Senior expert consultation",
      ],
      isPopular: false,
      isLimited: false,
    },
    {
      id: "birthday_special",
      title: "Birthday Month Special",
      description: "25% off + complimentary add-on service",
      pointsCost: 500,
      type: "discount",
      category: "Special Offers",
      icon: <Heart className="h-5 w-5" />,
      validUntil: "2024-12-31",
      termsAndConditions: [
        "Valid during birthday month only",
        "ID verification required",
        "Cannot be combined with other discounts",
      ],
      isPopular: true,
      isLimited: false,
    },
    {
      id: "group_discount",
      title: "Group Booking Discount",
      description: "15% off when booking for 3+ people",
      pointsCost: 300,
      type: "discount",
      category: "Group Offers",
      icon: <Users className="h-5 w-5" />,
      validUntil: "2024-04-15",
      termsAndConditions: [
        "Minimum 3 people required",
        "Same service type for all",
        "Advance booking mandatory",
      ],
      isPopular: false,
      isLimited: false,
    },
  ];

  const generatePointsHistory = (): PointsTransaction[] => [
    {
      id: "txn_1",
      type: "earned",
      points: 150,
      description: "Hair styling service booking",
      date: "2024-01-20",
      orderId: "ORD_001",
      category: "Service Booking",
    },
    {
      id: "txn_2",
      type: "redeemed",
      points: 200,
      description: "10% discount coupon",
      date: "2024-01-18",
      category: "Reward Redemption",
    },
    {
      id: "txn_3",
      type: "earned",
      points: 200,
      description: "Referral bonus - friend joined",
      date: "2024-01-15",
      category: "Referral",
    },
    {
      id: "txn_4",
      type: "earned",
      points: 100,
      description: "Birthday bonus points",
      date: "2024-01-10",
      category: "Birthday Bonus",
    },
    {
      id: "txn_5",
      type: "earned",
      points: 300,
      description: "Facial treatment booking",
      date: "2024-01-08",
      orderId: "ORD_002",
      category: "Service Booking",
    },
  ];

  const getCurrentTier = () => {
    if (!userLoyalty) return loyaltyTiers[0];
    return (
      loyaltyTiers.find((tier) => tier.id === userLoyalty.currentTier) ||
      loyaltyTiers[0]
    );
  };

  const getNextTier = () => {
    if (!userLoyalty?.nextTier) return null;
    return loyaltyTiers.find((tier) => tier.id === userLoyalty.nextTier);
  };

  const getProgressToNextTier = () => {
    const currentTier = getCurrentTier();
    const nextTier = getNextTier();
    if (!nextTier || !userLoyalty) return 100;

    const currentProgress = userLoyalty.currentPoints - currentTier.minPoints;
    const totalRequired = nextTier.minPoints - currentTier.minPoints;
    return (currentProgress / totalRequired) * 100;
  };

  const filteredRewards = availableRewards.filter((reward) => {
    if (filterCategory === "all") return true;
    return reward.category === filterCategory;
  });

  const canAffordReward = (reward: LoyaltyReward) => {
    return userLoyalty ? userLoyalty.currentPoints >= reward.pointsCost : false;
  };

  const handleRedeemReward = async (reward: LoyaltyReward) => {
    if (!canAffordReward(reward)) return;

    setSelectedReward(reward);
    setShowRedeemConfirm(true);
  };

  const confirmRedemption = async () => {
    if (!selectedReward || !userLoyalty) return;

    setIsLoading(true);
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Update points
      setUserLoyalty({
        ...userLoyalty,
        currentPoints: userLoyalty.currentPoints - selectedReward.pointsCost,
        totalRedemptions: userLoyalty.totalRedemptions + 1,
      });

      // Add to history
      const newTransaction: PointsTransaction = {
        id: `txn_${Date.now()}`,
        type: "redeemed",
        points: selectedReward.pointsCost,
        description: selectedReward.title,
        date: new Date().toISOString().split("T")[0],
        category: "Reward Redemption",
      };
      setPointsHistory([newTransaction, ...pointsHistory]);

      setShowRedeemConfirm(false);
      setSelectedReward(null);
    } catch (error) {
      console.error("Redemption failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRewardIcon = (type: string) => {
    switch (type) {
      case "discount":
        return <Gift className="h-5 w-5" />;
      case "service":
        return <Sparkles className="h-5 w-5" />;
      case "product":
        return <ShoppingBag className="h-5 w-5" />;
      case "experience":
        return <Award className="h-5 w-5" />;
      default:
        return <Gift className="h-5 w-5" />;
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
              <div className="text-2xl">💎</div>
              <div>
                <h2 className="text-lg font-semibold">Beauty Rewards</h2>
                <p className="text-sm text-gray-600">
                  {userLoyalty?.currentPoints.toLocaleString()} points available
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b bg-white sticky top-[73px] z-10">
          {[
            {
              id: "overview",
              label: "Overview",
              icon: <TrendingUp className="h-4 w-4" />,
            },
            {
              id: "rewards",
              label: "Rewards",
              icon: <Gift className="h-4 w-4" />,
            },
            {
              id: "history",
              label: "History",
              icon: <Clock className="h-4 w-4" />,
            },
            {
              id: "tiers",
              label: "Tiers",
              icon: <Crown className="h-4 w-4" />,
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

        <div className="p-4">
          {/* Overview Tab */}
          {activeTab === "overview" && userLoyalty && (
            <div className="space-y-6">
              {/* Current Status */}
              <Card
                className={`bg-gradient-to-r ${getCurrentTier().color} text-white`}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{getCurrentTier().icon}</div>
                      <div>
                        <h3 className="text-xl font-bold">
                          {getCurrentTier().name}
                        </h3>
                        <p className="text-white/80">Current Tier</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">
                        {userLoyalty.currentPoints.toLocaleString()}
                      </div>
                      <div className="text-sm text-white/80">points</div>
                    </div>
                  </div>

                  {getNextTier() && (
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-white/80">
                          Progress to {getNextTier()?.name}
                        </span>
                        <span className="text-sm text-white/80">
                          {userLoyalty.pointsToNextTier} points to go
                        </span>
                      </div>
                      <Progress
                        value={getProgressToNextTier()}
                        className="h-2 bg-white/20"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">
                      {userLoyalty.totalEarned.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">
                      Total Points Earned
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Gift className="h-8 w-8 text-rose-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">
                      {userLoyalty.totalRedemptions}
                    </div>
                    <div className="text-sm text-gray-600">
                      Rewards Redeemed
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Current Benefits */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-rose-500" />
                    Your Current Benefits
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {getCurrentTier().benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                        <span className="text-sm">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Popular Rewards */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Flame className="h-5 w-5 text-orange-500" />
                    Popular Rewards
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {availableRewards
                      .filter((r) => r.isPopular)
                      .slice(0, 3)
                      .map((reward) => (
                        <div
                          key={reward.id}
                          className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <div className="text-rose-500">{reward.icon}</div>
                            <div>
                              <h4 className="font-medium text-sm">
                                {reward.title}
                              </h4>
                              <p className="text-xs text-gray-600">
                                {reward.pointsCost} points
                              </p>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            disabled={!canAffordReward(reward)}
                            onClick={() => handleRedeemReward(reward)}
                            className="bg-rose-500 hover:bg-rose-600"
                          >
                            <Coins className="h-3 w-3 mr-1" />
                            Redeem
                          </Button>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-blue-500" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {pointsHistory.slice(0, 3).map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              transaction.type === "earned"
                                ? "bg-green-500"
                                : transaction.type === "redeemed"
                                  ? "bg-red-500"
                                  : "bg-gray-400"
                            }`}
                          ></div>
                          <div>
                            <p className="text-sm font-medium">
                              {transaction.description}
                            </p>
                            <p className="text-xs text-gray-600">
                              {new Date(transaction.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div
                          className={`text-sm font-medium ${
                            transaction.type === "earned"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {transaction.type === "earned" ? "+" : "-"}
                          {transaction.points}
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    className="w-full mt-4"
                    onClick={() => setActiveTab("history")}
                  >
                    View All Activity
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Rewards Tab */}
          {activeTab === "rewards" && (
            <div className="space-y-4">
              {/* Filter Categories */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {[
                  "all",
                  "Discounts",
                  "Skin Care",
                  "Products",
                  "Special Offers",
                ].map((category) => (
                  <Button
                    key={category}
                    variant={
                      filterCategory === category ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => setFilterCategory(category)}
                    className="flex-shrink-0"
                  >
                    {category === "all" ? "All Rewards" : category}
                  </Button>
                ))}
              </div>

              {/* Rewards List */}
              <div className="space-y-4">
                {filteredRewards.map((reward) => (
                  <Card key={reward.id} className="relative overflow-hidden">
                    {reward.isPopular && (
                      <Badge className="absolute top-2 right-2 bg-orange-500">
                        <Flame className="h-3 w-3 mr-1" />
                        Popular
                      </Badge>
                    )}
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="text-2xl text-rose-500">
                          {reward.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold text-gray-900">
                                {reward.title}
                              </h3>
                              <p className="text-sm text-gray-600 mt-1">
                                {reward.description}
                              </p>
                              <div className="flex items-center gap-4 mt-2">
                                <div className="flex items-center gap-1">
                                  <Coins className="h-4 w-4 text-yellow-500" />
                                  <span className="text-sm font-medium">
                                    {reward.pointsCost} points
                                  </span>
                                </div>
                                <Badge variant="outline" className="text-xs">
                                  {reward.category}
                                </Badge>
                                {reward.isLimited && (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    Limited: {reward.remainingStock} left
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <Button
                              size="sm"
                              disabled={!canAffordReward(reward)}
                              onClick={() => handleRedeemReward(reward)}
                              className={
                                canAffordReward(reward)
                                  ? "bg-rose-500 hover:bg-rose-600"
                                  : ""
                              }
                            >
                              {canAffordReward(reward)
                                ? "Redeem"
                                : "Not Enough Points"}
                            </Button>
                          </div>
                          <div className="mt-3 text-xs text-gray-500">
                            Valid until{" "}
                            {new Date(reward.validUntil).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* History Tab */}
          {activeTab === "history" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Points History</h3>
                <Badge variant="outline">
                  {userLoyalty?.currentPoints.toLocaleString()} current points
                </Badge>
              </div>

              <div className="space-y-3">
                {pointsHistory.map((transaction) => (
                  <Card key={transaction.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              transaction.type === "earned"
                                ? "bg-green-500"
                                : transaction.type === "redeemed"
                                  ? "bg-red-500"
                                  : "bg-gray-400"
                            }`}
                          ></div>
                          <div>
                            <p className="font-medium">
                              {transaction.description}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <p className="text-sm text-gray-600">
                                {new Date(
                                  transaction.date,
                                ).toLocaleDateString()}
                              </p>
                              <Badge variant="outline" className="text-xs">
                                {transaction.category}
                              </Badge>
                              {transaction.orderId && (
                                <Badge variant="secondary" className="text-xs">
                                  {transaction.orderId}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div
                          className={`text-lg font-bold ${
                            transaction.type === "earned"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {transaction.type === "earned" ? "+" : "-"}
                          {transaction.points}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Tiers Tab */}
          {activeTab === "tiers" && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold mb-2">Loyalty Tiers</h3>
                <p className="text-sm text-gray-600">
                  Unlock more benefits as you earn points
                </p>
              </div>

              <div className="space-y-4">
                {loyaltyTiers.map((tier, index) => {
                  const isCurrentTier = tier.id === userLoyalty?.currentTier;
                  const isUnlocked = userLoyalty
                    ? userLoyalty.currentPoints >= tier.minPoints
                    : false;

                  return (
                    <Card
                      key={tier.id}
                      className={`relative overflow-hidden ${
                        isCurrentTier ? "ring-2 ring-rose-500" : ""
                      }`}
                    >
                      {isCurrentTier && (
                        <Badge className="absolute top-2 right-2 bg-rose-500">
                          Current Tier
                        </Badge>
                      )}
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div
                            className={`w-12 h-12 rounded-full bg-gradient-to-r ${tier.color} flex items-center justify-center text-white text-lg`}
                          >
                            {tier.icon}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900">
                              {tier.name}
                            </h3>
                            <p className="text-sm text-gray-600 mb-3">
                              {tier.minPoints === 0
                                ? "Starting tier"
                                : `${tier.minPoints.toLocaleString()}+ points`}
                            </p>

                            <div className="space-y-2">
                              <h4 className="font-medium text-sm">Benefits:</h4>
                              {tier.benefits.map((benefit, benefitIndex) => (
                                <div
                                  key={benefitIndex}
                                  className="flex items-center gap-2"
                                >
                                  <CheckCircle
                                    className={`h-4 w-4 ${
                                      isUnlocked
                                        ? "text-green-600"
                                        : "text-gray-400"
                                    }`}
                                  />
                                  <span
                                    className={`text-sm ${
                                      isUnlocked
                                        ? "text-gray-900"
                                        : "text-gray-500"
                                    }`}
                                  >
                                    {benefit}
                                  </span>
                                </div>
                              ))}
                            </div>

                            {tier.exclusiveRewards.length > 0 && (
                              <div className="mt-4">
                                <h4 className="font-medium text-sm mb-2">
                                  Exclusive Rewards:
                                </h4>
                                <div className="flex flex-wrap gap-1">
                                  {tier.exclusiveRewards.map(
                                    (reward, rewardIndex) => (
                                      <Badge
                                        key={rewardIndex}
                                        variant="outline"
                                        className="text-xs"
                                      >
                                        {reward}
                                      </Badge>
                                    ),
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Redeem Confirmation Modal */}
        {showRedeemConfirm && selectedReward && (
          <div className="fixed inset-0 z-60 bg-black/50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="h-5 w-5 text-rose-500" />
                  Confirm Redemption
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl mb-2">{selectedReward.icon}</div>
                  <h3 className="font-semibold">{selectedReward.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedReward.description}
                  </p>
                  <div className="flex items-center justify-center gap-2 mt-3">
                    <Coins className="h-4 w-4 text-yellow-500" />
                    <span className="font-medium">
                      {selectedReward.pointsCost} points
                    </span>
                  </div>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg">
                  <h4 className="font-medium text-sm mb-2">
                    Terms & Conditions:
                  </h4>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {selectedReward.termsAndConditions.map((term, index) => (
                      <li key={index}>• {term}</li>
                    ))}
                  </ul>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowRedeemConfirm(false);
                      setSelectedReward(null);
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={confirmRedemption}
                    disabled={isLoading}
                    className="flex-1 bg-rose-500 hover:bg-rose-600"
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    ) : (
                      <CheckCircle className="h-4 w-4 mr-2" />
                    )}
                    Confirm
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoyaltyProgram;
