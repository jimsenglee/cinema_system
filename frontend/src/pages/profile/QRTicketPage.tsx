import { PageContainer } from "@/components/layouts/PageContainer";
import { currentUser } from "@/data/mockData";
import { Download, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const QRTicketPage = () => {
  return (
    <PageContainer title="Your QR Code">
      <div className="space-y-6">
        {/* Instructions */}
        <div className="p-4 rounded-xl bg-primary/10 border border-primary/30">
          <p className="text-sm text-foreground">
            Show this QR code at the cinema gate for quick entry and ticket validation.
          </p>
        </div>

        {/* QR Code Card */}
        <div className="flex flex-col items-center p-8 rounded-2xl bg-card/50 border border-border/50 shadow-lg">
          <div className="relative p-6 bg-white rounded-2xl shadow-2xl">
            {/* QR Code Pattern */}
            <div className="w-48 h-48 grid grid-cols-12 gap-0.5">
              {Array.from({ length: 144 }).map((_, i) => {
                const row = Math.floor(i / 12);
                const col = i % 12;
                const isCorner = (row < 3 && col < 3) || (row < 3 && col > 8) || (row > 8 && col < 3);
                const isFilled = isCorner || Math.random() > 0.5;
                
                return (
                  <div
                    key={i}
                    className={cn(
                      "rounded-sm",
                      isFilled ? 'bg-background' : 'bg-white'
                    )}
                  />
                );
              })}
            </div>
            
            {/* Center Logo */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
                <span className="font-display text-sm font-bold text-white">CH</span>
              </div>
            </div>
          </div>

          {/* User Info */}
          <div className="mt-6 text-center space-y-2">
            <p className="font-display text-xl font-bold text-foreground">{currentUser.name}</p>
            <p className="font-mono text-lg text-muted-foreground tracking-wider">
              {currentUser.qrCode}
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 text-accent text-sm font-semibold border border-accent/30">
              {currentUser.membershipTier} Member
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Download
          </Button>
          <Button variant="outline" className="gap-2">
            <Share2 className="w-4 h-4" />
            Share
          </Button>
        </div>

        {/* Tips */}
        <div className="p-4 rounded-xl bg-secondary/30 space-y-2">
          <h3 className="font-semibold text-foreground">Tips:</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Increase your screen brightness for easier scanning</li>
            <li>• Have your QR code ready before reaching the gate</li>
            <li>• This QR code is unique to your account</li>
          </ul>
        </div>
      </div>
    </PageContainer>
  );
};

export default QRTicketPage;
