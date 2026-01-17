import { PageContainer } from "@/components/layouts/PageContainer";
import { Search, ChevronRight, HelpCircle, MessageCircle, Phone, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const helpTopics = [
  { 
    id: "bookings", 
    title: "Bookings & Tickets", 
    icon: HelpCircle,
    description: "How to book, cancel, or modify tickets"
  },
  { 
    id: "payments", 
    title: "Payments & Refunds", 
    icon: HelpCircle,
    description: "Payment methods and refund policies"
  },
  { 
    id: "account", 
    title: "Account & Membership", 
    icon: HelpCircle,
    description: "Managing your account and rewards"
  },
  { 
    id: "cinema", 
    title: "Cinema Information", 
    icon: HelpCircle,
    description: "Locations, facilities, and amenities"
  },
  { 
    id: "technical", 
    title: "Technical Issues", 
    icon: HelpCircle,
    description: "App problems and troubleshooting"
  }
];

const contactMethods = [
  {
    icon: MessageCircle,
    title: "Live Chat",
    description: "Chat with our support team",
    action: "Start Chat",
    available: true,
    onClick: () => toast.info("Live chat is connecting... Please wait")
  },
  {
    icon: Phone,
    title: "Phone Support",
    description: "+60 3-1234 5678",
    action: "Call Now",
    available: true,
    onClick: () => window.open("tel:+60312345678")
  },
  {
    icon: Mail,
    title: "Email Support",
    description: "support@cineversehub.com",
    action: "Send Email",
    available: true,
    onClick: () => window.open("mailto:support@cineversehub.com")
  }
];

const HelpPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  return (
    <PageContainer title="Help & Support">
      <div className="space-y-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search for help..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Help Topics */}
        <section>
          <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">
            Help Topics
          </h3>
          <div className="space-y-2">
            {helpTopics.map((topic) => (
              <button
                key={topic.id}
                onClick={() => navigate(`/profile/help/${topic.id}`)}
                className="w-full flex items-center gap-3 p-4 rounded-2xl bg-card/50 border border-border/50 hover:bg-card/80 transition-colors active:scale-[0.98]"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <topic.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 text-left min-w-0">
                  <p className="font-medium text-foreground">{topic.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{topic.description}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
              </button>
            ))}
          </div>
        </section>

        {/* FAQ Link */}
        <Button
          variant="outline"
          className="w-full"
          onClick={() => navigate('/profile/help/faq')}
        >
          Browse Frequently Asked Questions
        </Button>

        {/* Contact Methods */}
        <section>
          <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">
            Contact Us
          </h3>
          <div className="grid gap-3">
            {contactMethods.map((method, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-4 rounded-2xl bg-card/50 border border-border/50"
              >
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <method.icon className="w-6 h-6 text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground">{method.title}</p>
                  <p className="text-xs text-muted-foreground">{method.description}</p>
                </div>
                <Button size="sm" variant="cinema" className="text-xs flex-shrink-0" onClick={method.onClick}>
                  {method.action}
                </Button>
              </div>
            ))}
          </div>
        </section>

        {/* Support Hours */}
        <div className="p-4 rounded-xl bg-secondary/30 text-center">
          <p className="text-sm text-muted-foreground">
            Support Hours: Mon-Sun, 9:00 AM - 11:00 PM
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Average response time: 5 minutes
          </p>
        </div>
      </div>
    </PageContainer>
  );
};

export default HelpPage;
