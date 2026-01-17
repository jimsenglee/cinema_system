import { Bell, Globe, Shield, Palette, Database, CreditCard, Mail, Save, Info } from "lucide-react";
import { AdminLayout } from "./AdminLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface SettingSection {
  icon: typeof Bell;
  title: string;
  description: string;
  settings: {
    key: string;
    label: string;
    description: string;
    type: "toggle" | "select" | "input";
    value?: boolean | string;
  }[];
}

const settingSections: SettingSection[] = [
  {
    icon: Bell,
    title: "Notifications",
    description: "Configure how you receive alerts and updates",
    settings: [
      { key: "email_notifications", label: "Email Notifications", description: "Receive booking confirmations via email", type: "toggle", value: true },
      { key: "push_notifications", label: "Push Notifications", description: "Get real-time alerts on your device", type: "toggle", value: true },
      { key: "sms_notifications", label: "SMS Notifications", description: "Receive important updates via SMS", type: "toggle", value: false },
    ]
  },
  {
    icon: Globe,
    title: "Localization",
    description: "Language and regional preferences",
    settings: [
      { key: "language", label: "Language", description: "Display language for the admin portal", type: "select", value: "English" },
      { key: "timezone", label: "Timezone", description: "Your local timezone for scheduling", type: "select", value: "Asia/Kuala_Lumpur" },
      { key: "currency", label: "Currency", description: "Default currency for pricing", type: "select", value: "MYR" },
    ]
  },
  {
    icon: Shield,
    title: "Security",
    description: "Protect your account and data",
    settings: [
      { key: "two_factor", label: "Two-Factor Authentication", description: "Add an extra layer of security", type: "toggle", value: false },
      { key: "session_timeout", label: "Auto Session Timeout", description: "Automatically log out after inactivity", type: "toggle", value: true },
    ]
  },
  {
    icon: CreditCard,
    title: "Payment",
    description: "Payment gateway settings",
    settings: [
      { key: "stripe", label: "Stripe Integration", description: "Accept credit card payments", type: "toggle", value: true },
      { key: "grabpay", label: "GrabPay", description: "Accept GrabPay wallet payments", type: "toggle", value: true },
      { key: "tng", label: "Touch 'n Go", description: "Accept TnG eWallet payments", type: "toggle", value: true },
    ]
  },
];

const AdminSettings = () => {
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    email_notifications: true,
    push_notifications: true,
    sms_notifications: false,
    two_factor: false,
    session_timeout: true,
    stripe: true,
    grabpay: true,
    tng: true,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [showClearDialog, setShowClearDialog] = useState(false);

  const handleToggle = (key: string) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    toast.success("Settings saved successfully!");
    setIsSaving(false);
  };

  const handleClearData = async () => {
    setIsClearing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    toast.success("All data cleared successfully!");
    setShowClearDialog(false);
    setIsClearing(false);
  };

  return (
    <AdminLayout title="Settings" subtitle="Manage your admin portal preferences">
      <div className="max-w-3xl space-y-4 sm:space-y-6">
        {settingSections.map((section) => (
          <GlassCard key={section.title} className="p-3 sm:p-4">
            <div className="flex items-start gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <section.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-sm sm:text-base text-foreground">{section.title}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">{section.description}</p>
              </div>
            </div>

            <div className="space-y-2 sm:space-y-4">
              {section.settings.map((setting) => (
                <div key={setting.key} className="flex items-center justify-between p-3 sm:p-4 rounded-xl bg-secondary/30 gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <p className="font-medium text-xs sm:text-sm text-foreground">{setting.label}</p>
                      <Tooltip delayDuration={300}>
                        <TooltipTrigger asChild>
                          <Info className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-muted-foreground cursor-help flex-shrink-0" />
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-[200px]">
                          <p className="text-xs">{setting.description}</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <p className="text-[10px] sm:text-xs text-muted-foreground line-clamp-1 sm:line-clamp-none">{setting.description}</p>
                  </div>
                  {setting.type === "toggle" && (
                    <Switch
                      checked={toggles[setting.key]}
                      onCheckedChange={() => handleToggle(setting.key)}
                      className="flex-shrink-0"
                    />
                  )}
                  {setting.type === "select" && (
                    <select className="bg-card border border-border rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-foreground flex-shrink-0 max-w-[120px] sm:max-w-none">
                      <option>{setting.value}</option>
                    </select>
                  )}
                </div>
              ))}
            </div>
          </GlassCard>
        ))}

        {/* Danger Zone */}
        <GlassCard className="border-destructive/30 p-3 sm:p-4">
          <div className="flex items-start gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-destructive/10 flex items-center justify-center flex-shrink-0">
              <Database className="w-5 h-5 sm:w-6 sm:h-6 text-destructive" />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-sm sm:text-base text-destructive">Danger Zone</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">Irreversible actions</p>
            </div>
          </div>

          <div className="space-y-2 sm:space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 rounded-xl bg-destructive/10 border border-destructive/20 gap-3">
              <div className="min-w-0">
                <p className="font-medium text-xs sm:text-sm text-foreground">Clear All Data</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground">Permanently delete all bookings and user data</p>
              </div>
              <Tooltip delayDuration={300}>
                <TooltipTrigger asChild>
                  <Button variant="destructive" size="sm" className="text-xs h-8 w-full sm:w-auto" onClick={() => setShowClearDialog(true)}>Clear Data</Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>⚠️ This action cannot be undone</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </GlassCard>

        <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3">
          <Tooltip delayDuration={300}>
            <TooltipTrigger asChild>
              <Button variant="outline" className="text-xs sm:text-sm" onClick={() => toast.info("Changes discarded")}>Cancel</Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Discard all unsaved changes</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip delayDuration={300}>
            <TooltipTrigger asChild>
              <Button variant="cinema" className="gap-2 text-xs sm:text-sm" onClick={handleSave} disabled={isSaving}>
                <Save className="w-3 h-3 sm:w-4 sm:h-4" />
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Save all settings to server</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Clear Data Confirmation */}
      <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive">⚠️ Clear All Data?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete all bookings, user data, and transaction history from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isClearing}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleClearData}
              disabled={isClearing}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isClearing ? "Clearing..." : "Yes, Clear All Data"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default AdminSettings;
