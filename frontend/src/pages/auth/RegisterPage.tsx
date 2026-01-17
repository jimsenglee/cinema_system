import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, User, Phone, ArrowLeft, Sparkles, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/FormInput";
import { AnimatedBackground } from "@/components/ui/AnimatedBackground";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useFormValidation } from "@/hooks/useFormValidation";
import { validateEmail, validatePassword, validateMatch, validatePhone, checkPasswordStrength } from "@/lib/validators";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, isLoading } = useAuth();
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const { values, errors, handleChange, handleBlur, handleSubmit, setCustomError } = useFormValidation({
    name: [
      { required: true, message: "Name is required" },
      { minLength: 2, message: "Name must be at least 2 characters" }
    ],
    email: [
      { required: true, message: "Email is required" },
      { custom: (value) => validateEmail(value).isValid, message: "Please enter a valid email" }
    ],
    phone: [],
    password: [
      { required: true, message: "Password is required" },
      { custom: (value) => validatePassword(value).isValid, message: "Password must be at least 6 characters" }
    ],
    confirmPassword: [
      { required: true, message: "Please confirm your password" }
    ]
  });

  const onSubmit = async () => {
    // Validate password match
    const matchValidation = validateMatch(values.password, values.confirmPassword);
    if (!matchValidation.isValid) {
      setCustomError("confirmPassword", matchValidation.errors[0]);
      return;
    }

    // Validate terms agreement
    if (!agreedToTerms) {
      toast.error("You must agree to the terms");
      return;
    }

    const result = await register({
      name: values.name,
      email: values.email,
      password: values.password,
      phone: values.phone,
    });
    
    if (result.success) {
      toast.success("Account created successfully!");
      navigate("/");
    } else {
      toast.error(result.error || "Registration failed");
    }
  };

  const passwordStrength = checkPasswordStrength(values.password);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AnimatedBackground variant="centered" />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border/40">
        <div className="px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 -ml-2 rounded-xl hover:bg-secondary/50 transition-colors active:scale-95"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            <div className="flex-1">
              <h1 className="font-display text-xl font-bold text-foreground">
                Create Account
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Form */}
      <div className="flex-1 px-6 py-6 relative z-10">
        <div className="max-w-md mx-auto">
          <p className="text-muted-foreground mb-8">
            Join Galaxy Cinema and enjoy exclusive member benefits
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <FormInput
              label="Full Name"
              type="text"
              placeholder="Enter your full name"
              icon={User}
              value={values.name}
              onChange={handleChange("name")}
              onBlur={handleBlur("name")}
              error={errors.name}
              autoComplete="name"
            />

            <FormInput
              label="Email"
              type="email"
              placeholder="Enter your email"
              icon={Mail}
              value={values.email}
              onChange={handleChange("email")}
              onBlur={handleBlur("email")}
              error={errors.email}
              autoComplete="email"
            />

            <FormInput
              label="Phone (Optional)"
              type="tel"
              placeholder="+60 12-345 6789"
              icon={Phone}
              value={values.phone}
              onChange={handleChange("phone")}
              onBlur={handleBlur("phone")}
              autoComplete="tel"
            />

            <div className="space-y-2">
              <FormInput
                label="Password"
                type="password"
                placeholder="Create a password"
                icon={Lock}
                value={values.password}
                onChange={handleChange("password")}
                onBlur={handleBlur("password")}
                error={errors.password}
                autoComplete="new-password"
              />
              {values.password && (
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(level => (
                    <div
                      key={level}
                      className={cn(
                        "h-1 flex-1 rounded-full transition-colors",
                        passwordStrength >= level
                          ? level <= 2
                            ? "bg-destructive"
                            : level <= 3
                            ? "bg-accent"
                            : "bg-green-500"
                          : "bg-border"
                      )}
                    />
                  ))}
                </div>
              )}
            </div>

            <FormInput
              label="Confirm Password"
              type="password"
              placeholder="Confirm your password"
              icon={Lock}
              value={values.confirmPassword}
              onChange={handleChange("confirmPassword")}
              onBlur={handleBlur("confirmPassword")}
              error={errors.confirmPassword}
              autoComplete="new-password"
            />

            {/* Terms Checkbox */}
            <div className="flex items-start gap-3">
              <button
                type="button"
                onClick={() => setAgreedToTerms(!agreedToTerms)}
                className={cn(
                  "w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all flex-shrink-0 mt-0.5",
                  agreedToTerms
                    ? "bg-primary border-primary"
                    : "border-border/50 hover:border-primary/50"
                )}
              >
                {agreedToTerms && <Check className="w-4 h-4 text-primary-foreground" />}
              </button>
              <p className="text-sm text-muted-foreground">
                I agree to the{" "}
                <Link to="/terms" className="text-primary hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
              </p>
            </div>
            {errors.terms && (
              <p className="text-sm text-destructive -mt-3">{errors.terms}</p>
            )}

            <Button
              type="submit"
              variant="cinema"
              size="xl"
              className="w-full h-14"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-3">
                  <span className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          {/* Sign In Link */}
          <p className="text-center mt-8 text-muted-foreground">
            Already have an account?{" "}
            <Link to="/auth/login" className="text-primary font-semibold hover:underline">
              Sign In
            </Link>
          </p>

          {/* Member Benefits */}
          <div className="mt-8 p-4 rounded-xl bg-accent/10 border border-accent/20">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-accent" />
              <p className="font-medium text-foreground">Member Benefits</p>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-accent" /> Earn points on every purchase
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-accent" /> Exclusive member discounts
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-accent" /> Priority booking access
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-accent" /> Birthday rewards
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
