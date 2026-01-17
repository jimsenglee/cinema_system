import { User, Shield, Copy, Check } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

/**
 * Demo account credentials
 */
export interface DemoAccount {
  role: "customer" | "admin" | "staff";
  email: string;
  password: string;
  name: string;
  description: string;
}

const demoAccounts: DemoAccount[] = [
  {
    role: "customer",
    email: "alex.chen@email.com",
    password: "password123",
    name: "Alex Chen",
    description: "Regular customer account with Gold membership"
  },
  {
    role: "admin",
    email: "admin@galaxycinema.com",
    password: "admin123",
    name: "Admin User",
    description: "Full system access with all permissions"
  },
  {
    role: "staff",
    email: "staff@galaxycinema.com",
    password: "staff123",
    name: "Staff Member",
    description: "Staff account for operational tasks"
  }
];

interface DemoAccountsDisplayProps {
  onAccountSelect?: (email: string, password: string) => void;
  className?: string;
}

/**
 * Demo Accounts Display Component
 * 
 * Shows demo account credentials for testing purposes
 * Allows one-click copy and auto-fill functionality
 * 
 * @example
 * <DemoAccountsDisplay onAccountSelect={(email, password) => {
 *   setEmail(email);
 *   setPassword(password);
 * }} />
 */
export function DemoAccountsDisplay({ onAccountSelect, className }: DemoAccountsDisplayProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return Shield;
      case "staff":
        return User;
      default:
        return User;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-500/10 text-red-400 border-red-500/20";
      case "staff":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      default:
        return "bg-green-500/10 text-green-400 border-green-500/20";
    }
  };

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center gap-2 mb-3">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <p className="text-xs text-white/60 uppercase tracking-wider">Demo Accounts</p>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </div>

      {demoAccounts.map((account, idx) => {
        const Icon = getRoleIcon(account.role);
        
        return (
          <div
            key={idx}
            className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-all"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center",
                  getRoleColor(account.role)
                )}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-white">{account.name}</p>
                  <Badge variant="outline" className={cn("mt-1", getRoleColor(account.role))}>
                    {account.role.charAt(0).toUpperCase() + account.role.slice(1)}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs text-white/60 mb-3">{account.description}</p>

            {/* Credentials */}
            <div className="space-y-2">
              {/* Email */}
              <div className="flex items-center gap-2">
                <div className="flex-1 px-3 py-2 rounded-lg bg-zinc-800/50 border border-zinc-700">
                  <p className="text-xs text-white/40 mb-0.5">Email</p>
                  <p className="text-sm text-white font-mono">{account.email}</p>
                </div>
                <button
                  onClick={() => copyToClipboard(account.email, `email-${idx}`)}
                  className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors"
                  title="Copy email"
                >
                  {copiedField === `email-${idx}` ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-white/60" />
                  )}
                </button>
              </div>

              {/* Password */}
              <div className="flex items-center gap-2">
                <div className="flex-1 px-3 py-2 rounded-lg bg-zinc-800/50 border border-zinc-700">
                  <p className="text-xs text-white/40 mb-0.5">Password</p>
                  <p className="text-sm text-white font-mono">{account.password}</p>
                </div>
                <button
                  onClick={() => copyToClipboard(account.password, `password-${idx}`)}
                  className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors"
                  title="Copy password"
                >
                  {copiedField === `password-${idx}` ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-white/60" />
                  )}
                </button>
              </div>
            </div>

            {/* Quick Login Button */}
            {onAccountSelect && (
              <button
                onClick={() => onAccountSelect(account.email, account.password)}
                className="w-full mt-3 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500/10 to-blue-600/10 border border-cyan-500/20 hover:border-cyan-500/40 text-cyan-400 text-sm font-medium transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Quick Login
              </button>
            )}
          </div>
        );
      })}

      {/* Note */}
      <p className="text-xs text-white/40 text-center pt-2">
        💡 These are demo accounts for testing purposes only
      </p>
    </div>
  );
}
