import { useMemo, useCallback } from "react";
import { currentUser, type User } from "@/data/mockData";
import { calculatePointsEarned, calculatePointsToNextTier } from "@/lib/calculations";

/**
 * Membership tier configuration
 */
export interface TierConfig {
  name: User["membershipTier"];
  pointsRequired: number;
  benefits: string[];
  discount: number; // percentage
  pointsMultiplier: number;
  color: string;
}

/**
 * Tier configurations for all membership levels
 */
const TIER_CONFIGS: TierConfig[] = [
  {
    name: "Bronze",
    pointsRequired: 0,
    benefits: ["Earn 1 point per RM1", "Birthday voucher", "Email updates"],
    discount: 0,
    pointsMultiplier: 1,
    color: "from-amber-700 to-amber-900"
  },
  {
    name: "Silver",
    pointsRequired: 1000,
    benefits: ["Earn 1.25 points per RM1", "5% discount", "Priority booking", "Free popcorn on birthday"],
    discount: 5,
    pointsMultiplier: 1.25,
    color: "from-gray-400 to-gray-600"
  },
  {
    name: "Gold",
    pointsRequired: 3000,
    benefits: ["Earn 1.5 points per RM1", "10% discount", "Exclusive screenings", "Free combo on birthday"],
    discount: 10,
    pointsMultiplier: 1.5,
    color: "from-yellow-400 to-yellow-600"
  },
  {
    name: "Platinum",
    pointsRequired: 7000,
    benefits: ["Earn 2 points per RM1", "15% discount", "VIP lounge access", "Complimentary upgrades"],
    discount: 15,
    pointsMultiplier: 2,
    color: "from-purple-400 to-purple-600"
  }
];

/**
 * Custom hook for membership tier and rewards management
 * 
 * Features:
 * - Get current tier information
 * - Calculate progress to next tier
 * - Calculate points earned for purchases
 * - Apply tier discounts
 * - Check if user can redeem rewards
 * 
 * @param user User object (defaults to currentUser)
 * 
 * @example
 * const { currentTier, nextTier, progressToNext, canRedeem } = useMembership();
 */
export function useMembership(user: User = currentUser) {
  /**
   * Get current tier configuration
   */
  const currentTier = useMemo(() => {
    return TIER_CONFIGS.find(tier => tier.name === user.membershipTier) || TIER_CONFIGS[0];
  }, [user.membershipTier]);

  /**
   * Get next tier configuration (null if already at highest tier)
   */
  const nextTier = useMemo(() => {
    const currentIndex = TIER_CONFIGS.findIndex(tier => tier.name === user.membershipTier);
    if (currentIndex === -1 || currentIndex === TIER_CONFIGS.length - 1) {
      return null;
    }
    return TIER_CONFIGS[currentIndex + 1];
  }, [user.membershipTier]);

  /**
   * Calculate points needed to reach next tier
   */
  const pointsToNextTier = useMemo(() => {
    return calculatePointsToNextTier(user.pointsBalance, user.membershipTier);
  }, [user.pointsBalance, user.membershipTier]);

  /**
   * Calculate progress percentage to next tier (0-100)
   */
  const progressToNext = useMemo(() => {
    if (!nextTier) return 100; // Already at max tier

    const currentRequired = currentTier.pointsRequired;
    const nextRequired = nextTier.pointsRequired;
    const pointsInCurrentTier = user.pointsBalance - currentRequired;
    const pointsNeededForNextTier = nextRequired - currentRequired;

    const progress = (pointsInCurrentTier / pointsNeededForNextTier) * 100;
    return Math.min(Math.max(progress, 0), 100);
  }, [currentTier, nextTier, user.pointsBalance]);

  /**
   * Check if user is at maximum tier
   */
  const isMaxTier = useMemo(() => {
    return user.membershipTier === "Platinum";
  }, [user.membershipTier]);

  /**
   * Calculate points earned for a purchase amount
   */
  const calculatePoints = useCallback((amount: number): number => {
    return calculatePointsEarned(amount, user.membershipTier);
  }, [user.membershipTier]);

  /**
   * Calculate discounted price based on tier
   */
  const applyDiscount = useCallback((amount: number): number => {
    const discountAmount = amount * (currentTier.discount / 100);
    return amount - discountAmount;
  }, [currentTier.discount]);

  /**
   * Check if user can redeem a reward with given point cost
   */
  const canRedeem = useCallback((pointCost: number): boolean => {
    return user.pointsBalance >= pointCost;
  }, [user.pointsBalance]);

  /**
   * Get all tier configurations (useful for displaying tier comparison)
   */
  const getAllTiers = useCallback(() => {
    return TIER_CONFIGS;
  }, []);

  /**
   * Get tier by name
   */
  const getTierByName = useCallback((tierName: User["membershipTier"]): TierConfig | undefined => {
    return TIER_CONFIGS.find(tier => tier.name === tierName);
  }, []);

  /**
   * Calculate how many times user can redeem a reward
   */
  const getRedeemableCount = useCallback((pointCost: number): number => {
    return Math.floor(user.pointsBalance / pointCost);
  }, [user.pointsBalance]);

  /**
   * Format tier name with color/styling
   */
  const getTierColor = useCallback((tierName: User["membershipTier"]): string => {
    const tier = getTierByName(tierName);
    return tier?.color || "from-gray-400 to-gray-600";
  }, [getTierByName]);

  return {
    // Current tier info
    currentTier,
    nextTier,
    isMaxTier,
    
    // Progress
    pointsToNextTier,
    progressToNext,
    
    // User info
    pointsBalance: user.pointsBalance,
    tierName: user.membershipTier,
    
    // Calculations
    calculatePoints,
    applyDiscount,
    canRedeem,
    getRedeemableCount,
    
    // Utility
    getAllTiers,
    getTierByName,
    getTierColor,
  };
}
