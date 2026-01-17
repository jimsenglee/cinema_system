/**
 * Calculation utilities following DRY principles
 * Centralized location for all calculation logic
 */

export interface TicketPrice {
  seatType: 'standard' | 'vip' | 'couple' | 'wheelchair';
  ticketType: 'adult' | 'child' | 'student' | 'senior';
  basePrice: number;
}

export interface PriceBreakdown {
  subtotal: number;
  ticketTotal: number;
  concessionTotal: number;
  discounts: number;
  tax: number;
  total: number;
}

/**
 * Calculate ticket price based on seat type and ticket type
 * @param basePrice - Base price for standard seat
 * @param seatType - Type of seat
 * @param ticketType - Type of ticket
 */
export const calculateTicketPrice = (
  basePrice: number,
  seatType: 'standard' | 'vip' | 'couple' | 'wheelchair',
  ticketType: 'adult' | 'child' | 'student' | 'senior'
): number => {
  // Seat type multipliers
  const seatMultipliers = {
    standard: 1.0,
    vip: 1.5,
    couple: 2.5,
    wheelchair: 1.0
  };
  
  // Ticket type multipliers
  const ticketMultipliers = {
    adult: 1.0,
    child: 0.7,
    student: 0.8,
    senior: 0.75
  };
  
  return basePrice * seatMultipliers[seatType] * ticketMultipliers[ticketType];
};

/**
 * Calculate booking total with all fees
 * @param tickets - Array of ticket prices
 * @param concessions - Array of concession prices
 * @param discount - Discount amount (optional)
 * @param taxRate - Tax rate (default 6% for Malaysia)
 */
export const calculateBookingTotal = (
  tickets: number[],
  concessions: number[] = [],
  discount: number = 0,
  taxRate: number = 0.06
): PriceBreakdown => {
  const ticketTotal = tickets.reduce((sum, price) => sum + price, 0);
  const concessionTotal = concessions.reduce((sum, price) => sum + price, 0);
  const subtotal = ticketTotal + concessionTotal;
  const discountedSubtotal = Math.max(0, subtotal - discount);
  const tax = discountedSubtotal * taxRate;
  const total = discountedSubtotal + tax;
  
  return {
    subtotal,
    ticketTotal,
    concessionTotal,
    discounts: discount,
    tax,
    total
  };
};

/**
 * Calculate discount based on promo code
 * @param subtotal - Subtotal before discount
 * @param promoCode - Promo code
 */
export const calculateDiscount = (subtotal: number, promoCode: string): number => {
  // Mock promo codes
  const promoCodes: Record<string, { type: 'percentage' | 'fixed'; value: number }> = {
    'WELCOME10': { type: 'percentage', value: 0.10 },
    'SAVE20': { type: 'fixed', value: 20 },
    'STUDENT': { type: 'percentage', value: 0.15 },
    'FIRSTBOOKING': { type: 'percentage', value: 0.20 }
  };
  
  const promo = promoCodes[promoCode.toUpperCase()];
  if (!promo) return 0;
  
  if (promo.type === 'percentage') {
    return subtotal * promo.value;
  } else {
    return Math.min(promo.value, subtotal); // Don't exceed subtotal
  }
};

/**
 * Calculate points earned from booking
 * @param amount - Total booking amount
 * @param membershipTier - User's membership tier
 */
export const calculatePointsEarned = (
  amount: number,
  membershipTier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' = 'Bronze'
): number => {
  // Base: 1 point per RM 1
  const basePoints = Math.floor(amount);
  
  // Tier multipliers
  const multipliers = {
    Bronze: 1.0,
    Silver: 1.2,
    Gold: 1.5,
    Platinum: 2.0
  };
  
  return Math.floor(basePoints * multipliers[membershipTier]);
};

/**
 * Calculate points required for next tier
 * @param currentPoints - Current points balance
 * @param currentTier - Current membership tier
 */
export const calculatePointsToNextTier = (
  currentPoints: number,
  currentTier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum'
): { pointsNeeded: number; nextTier: string; progress: number } => {
  const tiers = {
    Bronze: { next: 'Silver', threshold: 1000 },
    Silver: { next: 'Gold', threshold: 2500 },
    Gold: { next: 'Platinum', threshold: 5000 },
    Platinum: { next: 'Platinum', threshold: 0 }
  };
  
  const tierInfo = tiers[currentTier];
  
  if (currentTier === 'Platinum') {
    return { pointsNeeded: 0, nextTier: 'Platinum', progress: 100 };
  }
  
  const pointsNeeded = Math.max(0, tierInfo.threshold - currentPoints);
  const progress = Math.min(100, (currentPoints / tierInfo.threshold) * 100);
  
  return {
    pointsNeeded,
    nextTier: tierInfo.next,
    progress
  };
};

/**
 * Calculate seat occupancy percentage
 * @param totalSeats - Total seats in hall
 * @param bookedSeats - Number of booked seats
 */
export const calculateOccupancy = (totalSeats: number, bookedSeats: number): number => {
  if (totalSeats === 0) return 0;
  return (bookedSeats / totalSeats) * 100;
};

/**
 * Calculate average rating
 * @param ratings - Array of rating values
 */
export const calculateAverageRating = (ratings: number[]): number => {
  if (ratings.length === 0) return 0;
  const sum = ratings.reduce((acc, rating) => acc + rating, 0);
  return parseFloat((sum / ratings.length).toFixed(1));
};

/**
 * Calculate time until showtime
 * @param showtimeDate - Showtime date/time
 */
export const calculateTimeUntilShowtime = (showtimeDate: Date): {
  days: number;
  hours: number;
  minutes: number;
  isToday: boolean;
  isPast: boolean;
} => {
  const now = new Date();
  const diff = showtimeDate.getTime() - now.getTime();
  
  if (diff < 0) {
    return { days: 0, hours: 0, minutes: 0, isToday: false, isPast: true };
  }
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  const isToday = days === 0;
  
  return { days, hours, minutes, isToday, isPast: false };
};

/**
 * Calculate refund amount based on time before showtime
 * @param originalAmount - Original booking amount
 * @param hoursBeforeShowtime - Hours before showtime
 */
export const calculateRefund = (
  originalAmount: number,
  hoursBeforeShowtime: number
): { refundAmount: number; refundPercentage: number; canRefund: boolean } => {
  // Refund policy:
  // > 24 hours: 100%
  // 12-24 hours: 75%
  // 6-12 hours: 50%
  // < 6 hours: No refund
  
  let refundPercentage = 0;
  let canRefund = true;
  
  if (hoursBeforeShowtime > 24) {
    refundPercentage = 1.0;
  } else if (hoursBeforeShowtime > 12) {
    refundPercentage = 0.75;
  } else if (hoursBeforeShowtime > 6) {
    refundPercentage = 0.50;
  } else {
    refundPercentage = 0;
    canRefund = false;
  }
  
  const refundAmount = originalAmount * refundPercentage;
  
  return {
    refundAmount,
    refundPercentage: refundPercentage * 100,
    canRefund
  };
};
