import { PageContainer } from "@/components/layouts/PageContainer";
import { currentUser } from "@/data/mockData";
import { Gift, TrendingUp, Clock, ArrowRight, Star, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

// Mock rewards data
const availableRewards = [
  {
    id: "R001",
    name: "Free Medium Popcorn",
    points: 500,
    category: "concessions",
    description: "Redeem for a free medium popcorn",
    imageUrl: "/placeholder.svg"
  },
  {
    id: "R002",
    name: "RM 10 Discount Voucher",
    points: 800,
    category: "vouchers",
    description: "Get RM 10 off your next booking",
    imageUrl: "/placeholder.svg"
  },
  {
    id: "R003",
    name: "Free Ticket Upgrade",
    points: 1200,
    category: "tickets",
    description: "Upgrade to VIP seat for free",
    imageUrl: "/placeholder.svg"
  },
  {
    id: "R004",
    name: "Combo Meal Deal",
    points: 1000,
    category: "concessions",
    description: "Large popcorn + 2 drinks",
    imageUrl: "/placeholder.svg"
  }
];

const pointsHistory = [
  { date: "2026-01-15", description: "Booking - Dune: Part Two", points: 45, type: "earned" },
  { date: "2026-01-10", description: "Redeemed: Free Popcorn", points: -500, type: "redeemed" },
  { date: "2026-01-05", description: "Booking - Oppenheimer", points: 30, type: "earned" },
  { date: "2025-12-25", description: "Holiday Bonus", points: 100, type: "bonus" }
];

const RewardsPage = () => {
  const pointsToNextTier = 2000 - currentUser.pointsBalance;
  const progressPercent = (currentUser.pointsBalance / 2000) * 100;
  const [selectedReward, setSelectedReward] = useState<typeof availableRewards[0] | null>(null);
  const [showRedeemDialog, setShowRedeemDialog] = useState(false);
  const [isRedeeming, setIsRedeeming] = useState(false);

  const handleRedeem = (reward: typeof availableRewards[0]) => {
    if (currentUser.pointsBalance < reward.points) {
      toast.error("Not enough points!");
      return;
    }
    setSelectedReward(reward);
    setShowRedeemDialog(true);
  };

  const confirmRedeem = async () => {
    setIsRedeeming(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    toast.success(`Redeemed "${selectedReward?.name}" successfully!`);
    setShowRedeemDialog(false);
    setIsRedeeming(false);
  };

  return (
    <PageContainer 
      title="My Rewards"
      headerAction={
        <Button variant="ghost" size="sm" className="text-xs">
          Redeem History
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Points Card */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-accent/20 border border-primary/30">
          <div className="text-center mb-4">
            <p className="text-sm text-muted-foreground mb-1">Your Points Balance</p>
            <p className="font-display text-5xl font-bold text-foreground">
              {currentUser.pointsBalance.toLocaleString()}
            </p>
            <Badge className="mt-3 bg-accent/20 text-accent border-accent/30">
              {currentUser.membershipTier} Member
            </Badge>
          </div>

          {/* Progress to Next Tier */}
          <div className="mt-6">
            <div className="flex justify-between text-xs text-muted-foreground mb-2">
              <span>Progress to Gold</span>
              <span>{pointsToNextTier} points needed</span>
            </div>
            <Progress value={progressPercent} className="h-2" />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-card/50 border border-border/50 text-center">
            <TrendingUp className="w-5 h-5 text-primary mx-auto mb-1" />
            <p className="text-lg font-bold text-foreground">245</p>
            <p className="text-xs text-muted-foreground">Earned</p>
          </div>
          <div className="p-3 rounded-xl bg-card/50 border border-border/50 text-center">
            <Gift className="w-5 h-5 text-accent mx-auto mb-1" />
            <p className="text-lg font-bold text-foreground">8</p>
            <p className="text-xs text-muted-foreground">Redeemed</p>
          </div>
          <div className="p-3 rounded-xl bg-card/50 border border-border/50 text-center">
            <Clock className="w-5 h-5 text-primary mx-auto mb-1" />
            <p className="text-lg font-bold text-foreground">30d</p>
            <p className="text-xs text-muted-foreground">Expires</p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="rewards" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-secondary/30">
            <TabsTrigger value="rewards">Available Rewards</TabsTrigger>
            <TabsTrigger value="history">Points History</TabsTrigger>
          </TabsList>

          {/* Available Rewards */}
          <TabsContent value="rewards" className="space-y-3 mt-4">
            {availableRewards.map((reward) => (
              <div 
                key={reward.id}
                className="flex gap-3 p-4 rounded-2xl bg-card/50 border border-border/50 hover:bg-card/80 transition-colors"
              >
                <div className="w-16 h-16 rounded-lg bg-secondary flex-shrink-0 overflow-hidden">
                  <img 
                    src={reward.imageUrl} 
                    alt={reward.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground truncate mb-1">
                    {reward.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-2">
                    {reward.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-primary">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="font-semibold text-sm">{reward.points} pts</span>
                    </div>
                    <Button 
                      size="sm" 
                      variant="cinema"
                      disabled={currentUser.pointsBalance < reward.points}
                      className="text-xs"
                      onClick={() => handleRedeem(reward)}
                    >
                      Redeem
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>

          {/* Points History */}
          <TabsContent value="history" className="space-y-3 mt-4">
            {pointsHistory.map((entry, index) => {
              const isPositive = entry.points > 0;
              return (
                <div 
                  key={index}
                  className="flex items-center gap-3 p-4 rounded-xl bg-card/50 border border-border/50"
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isPositive ? 'bg-primary/20' : 'bg-accent/20'
                  }`}>
                    {isPositive ? (
                      <TrendingUp className="w-5 h-5 text-primary" />
                    ) : (
                      <Gift className="w-5 h-5 text-accent" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground text-sm truncate">
                      {entry.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(entry.date).toLocaleDateString()}
                    </p>
                  </div>
                  <p className={`font-bold ${
                    isPositive ? 'text-primary' : 'text-accent'
                  }`}>
                    {isPositive ? '+' : ''}{entry.points}
                  </p>
                </div>
              );
            })}
          </TabsContent>
        </Tabs>

        {/* How to Earn */}
        <div className="p-4 rounded-2xl bg-secondary/30 space-y-3">
          <h3 className="font-semibold text-foreground">How to Earn Points</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Ticket className="w-4 h-4 text-primary" />
              <span className="text-muted-foreground">RM 1 spent = 1 point</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-primary" />
              <span className="text-muted-foreground">Write reviews = 10 points</span>
            </div>
            <div className="flex items-center gap-2">
              <Gift className="w-4 h-4 text-primary" />
              <span className="text-muted-foreground">Birthday bonus = 100 points</span>
            </div>
          </div>
        </div>
      </div>

      {/* Redeem Confirmation Dialog */}
      <AlertDialog open={showRedeemDialog} onOpenChange={setShowRedeemDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Redeem Reward?</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to redeem <span className="font-semibold text-foreground">{selectedReward?.name}</span> for <span className="font-semibold text-primary">{selectedReward?.points} points</span>.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isRedeeming}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmRedeem}
              disabled={isRedeeming}
              className="bg-primary"
            >
              {isRedeeming ? "Redeeming..." : "Confirm Redeem"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageContainer>
  );
};

export default RewardsPage;
