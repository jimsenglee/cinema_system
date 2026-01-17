import { User } from "@/data/mockData";
import { Crown, Star, Gift, Zap, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface MembershipCardProps {
  user: User;
}

export const MembershipCard = ({ user }: MembershipCardProps) => {
  const getTierConfig = (tier: User["membershipTier"]) => {
    switch (tier) {
      case "Platinum":
        return {
          gradient: "from-slate-200 via-white to-slate-300",
          textColor: "text-slate-800",
          accentColor: "text-slate-600",
          icon: Zap,
          glow: "shadow-[0_0_30px_rgba(148,163,184,0.3)]"
        };
      case "Gold":
        return {
          gradient: "from-amber-300 via-yellow-200 to-amber-400",
          textColor: "text-amber-900",
          accentColor: "text-amber-700",
          icon: Crown,
          glow: "shadow-[0_0_30px_rgba(245,158,11,0.3)]"
        };
      case "Silver":
        return {
          gradient: "from-gray-200 via-gray-100 to-gray-300",
          textColor: "text-gray-800",
          accentColor: "text-gray-600",
          icon: Star,
          glow: "shadow-[0_0_30px_rgba(156,163,175,0.3)]"
        };
      default:
        return {
          gradient: "from-amber-600 via-amber-500 to-amber-700",
          textColor: "text-amber-50",
          accentColor: "text-amber-200",
          icon: Gift,
          glow: "shadow-[0_0_30px_rgba(180,83,9,0.3)]"
        };
    }
  };

  const config = getTierConfig(user.membershipTier);
  const TierIcon = config.icon;

  return (
    <div className={cn(
      "relative w-full aspect-[1.7] rounded-2xl overflow-hidden",
      config.glow
    )}>
      {/* Card Background */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-br",
        config.gradient
      )} />

      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-white/20 blur-2xl" />
        <div className="absolute -bottom-20 -left-20 w-48 h-48 rounded-full bg-black/5 blur-xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-tr from-transparent via-white/10 to-transparent" />
      </div>

      {/* Shimmer Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_3s_infinite]" />
      
      {/* Content */}
      <div className={cn("relative h-full p-5 flex flex-col justify-between", config.textColor)}>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <Sparkles className={cn("w-4 h-4", config.accentColor)} />
              <p className={cn("text-xs font-semibold tracking-widest uppercase", config.accentColor)}>
                Galaxy Cinemas
              </p>
            </div>
            <h3 className="font-display text-2xl font-bold mt-1 tracking-wide">
              {user.membershipTier}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-white/30 backdrop-blur-sm flex items-center justify-center">
            <TierIcon className="w-7 h-7" />
          </div>
        </div>
        
        <div>
          <p className="font-display text-lg font-semibold tracking-wide mb-3">
            {user.name}
          </p>
          <div className="flex items-end justify-between">
            <div>
              <p className={cn("text-xs uppercase tracking-wider", config.accentColor)}>Member Since</p>
              <p className="text-sm font-semibold">
                {new Date(user.memberSince).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
              </p>
            </div>
            <div className="text-right">
              <p className={cn("text-xs uppercase tracking-wider", config.accentColor)}>Points</p>
              <p className="font-display text-3xl font-bold tracking-tight">
                {user.pointsBalance.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
