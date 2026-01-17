import { PageContainer } from "@/components/layouts/PageContainer";
import { 
  Bell, 
  Moon, 
  Globe, 
  Lock, 
  Smartphone, 
  Trash2,
  ChevronRight 
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/context/AuthContext";

const SettingsPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    promotions: true,
    darkMode: false,
  });
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showLanguageDialog, setShowLanguageDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleToggle = (key: string) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
    toast.success("Setting updated!");
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    toast.success("Account deleted successfully");
    setShowDeleteDialog(false);
    logout();
    navigate("/auth/login");
  };

  const settingsSections = [
    {
      title: "Notifications",
      items: [
        {
          icon: Bell,
          label: "Email Notifications",
          description: "Receive booking confirmations via email",
          value: settings.emailNotifications,
          key: "emailNotifications"
        },
        {
          icon: Smartphone,
          label: "Push Notifications",
          description: "Get alerts for bookings and promotions",
          value: settings.pushNotifications,
          key: "pushNotifications"
        },
        {
          icon: Bell,
          label: "SMS Notifications",
          description: "Receive SMS for important updates",
          value: settings.smsNotifications,
          key: "smsNotifications"
        },
        {
          icon: Bell,
          label: "Promotional Offers",
          description: "Get notified about deals and discounts",
          value: settings.promotions,
          key: "promotions"
        }
      ]
    },
    {
      title: "Appearance",
      items: [
        {
          icon: Moon,
          label: "Dark Mode",
          description: "Switch to dark theme",
          value: settings.darkMode,
          key: "darkMode"
        }
      ]
    }
  ];

  const accountSettings = [
    {
      icon: Globe,
      label: "Language",
      description: "English",
      action: () => setShowLanguageDialog(true)
    },
    {
      icon: Lock,
      label: "Privacy & Security",
      description: "Manage your data and privacy",
      action: () => toast.info("Privacy settings coming soon!")
    },
    {
      icon: Smartphone,
      label: "Linked Devices",
      description: "Manage devices with access to your account",
      action: () => toast.info("Device management coming soon!")
    }
  ];

  return (
    <PageContainer title="Settings">
      <div className="space-y-6">
        {/* Settings with Toggles */}
        {settingsSections.map((section) => (
          <section key={section.title}>
            <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">
              {section.title}
            </h3>
            <div className="space-y-2">
              {section.items.map((item) => (
                <div
                  key={item.key}
                  className="flex items-center gap-3 p-4 rounded-2xl bg-card/50 border border-border/50"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                  <Switch
                    checked={item.value}
                    onCheckedChange={() => handleToggle(item.key)}
                  />
                </div>
              ))}
            </div>
          </section>
        ))}

        {/* Account Settings (Clickable) */}
        <section>
          <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">
            Account
          </h3>
          <div className="space-y-2">
            {accountSettings.map((item, index) => (
              <button
                key={index}
                onClick={item.action}
                className="w-full flex items-center gap-3 p-4 rounded-2xl bg-card/50 border border-border/50 hover:bg-card/80 transition-colors active:scale-[0.98]"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 text-left min-w-0">
                  <p className="font-medium text-foreground">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
              </button>
            ))}
          </div>
        </section>

        {/* Danger Zone */}
        <section>
          <h3 className="text-sm font-medium text-destructive mb-3 uppercase tracking-wider">
            Danger Zone
          </h3>
          <button 
            onClick={() => setShowDeleteDialog(true)}
            className="w-full flex items-center gap-3 p-4 rounded-2xl bg-destructive/10 border border-destructive/30 hover:bg-destructive/20 transition-colors active:scale-[0.98]"
          >
            <div className="w-10 h-10 rounded-xl bg-destructive/20 flex items-center justify-center flex-shrink-0">
              <Trash2 className="w-5 h-5 text-destructive" />
            </div>
            <div className="flex-1 text-left min-w-0">
              <p className="font-medium text-destructive">Delete Account</p>
              <p className="text-xs text-destructive/70">Permanently delete your account and data</p>
            </div>
          </button>
        </section>

        {/* App Info */}
        <div className="p-4 rounded-xl bg-secondary/30 text-center space-y-1">
          <p className="text-sm text-foreground font-medium">CineverseHub</p>
          <p className="text-xs text-muted-foreground">Version 1.0.0</p>
          <div className="flex justify-center gap-4 mt-3 text-xs text-muted-foreground">
            <button onClick={() => toast.info("Terms of Service")} className="hover:text-foreground transition-colors">Terms</button>
            <span>•</span>
            <button onClick={() => toast.info("Privacy Policy")} className="hover:text-foreground transition-colors">Privacy</button>
            <span>•</span>
            <button onClick={() => toast.info("About CineverseHub v1.0.0")} className="hover:text-foreground transition-colors">About</button>
          </div>
        </div>
      </div>

      {/* Delete Account Confirmation */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive">Delete Account?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your account, all your bookings, rewards points, and personal data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete Account"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Language Dialog */}
      <Dialog open={showLanguageDialog} onOpenChange={setShowLanguageDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select Language</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 mt-4">
            {["English", "Bahasa Malaysia", "中文", "日本語"].map((lang) => (
              <button
                key={lang}
                onClick={() => {
                  toast.success(`Language changed to ${lang}`);
                  setShowLanguageDialog(false);
                }}
                className="w-full p-3 rounded-xl text-left hover:bg-secondary/50 transition-colors"
              >
                {lang}
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
};

export default SettingsPage;
