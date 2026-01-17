import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/FormInput";
import { AnimatedBackground } from "@/components/ui/AnimatedBackground";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { useFormValidation } from "@/hooks/useFormValidation";
import { validateEmail } from "@/lib/validators";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const { forgotPassword } = useAuth();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { values, errors, handleChange, handleBlur, handleSubmit } = useFormValidation({
    email: [
      { required: true, message: "Email is required" },
      { custom: (value) => validateEmail(value).isValid, message: "Please enter a valid email" }
    ]
  });

  const onSubmit = async () => {
    const result = await forgotPassword(values.email);
    
    if (result.success) {
      setIsSubmitted(true);
    } else {
      toast.error(result.error || "Failed to send reset email");
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <AnimatedBackground variant="centered" />

        {/* Header */}
        <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border/40">
          <div className="px-4 py-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/auth/login")}
                className="p-2 -ml-2 rounded-xl hover:bg-secondary/50 transition-colors active:scale-95"
              >
                <ArrowLeft className="w-5 h-5 text-foreground" />
              </button>
              <div className="flex-1">
                <h1 className="font-display text-xl font-bold text-foreground">
                  Check Your Email
                </h1>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 flex flex-col items-center justify-center px-6 relative z-10">
          <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-6">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2 text-center">Email Sent!</h2>
          <p className="text-muted-foreground text-center max-w-sm">
            We've sent a password reset link to <span className="text-foreground font-medium">{values.email}</span>. 
            Please check your inbox and follow the instructions.
          </p>
          <Button
            variant="outline"
            size="lg"
            className="mt-8"
            onClick={() => navigate("/auth/login")}
          >
            Back to Login
          </Button>
        </div>
      </div>
    );
  }

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
                Forgot Password
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Form */}
      <div className="flex-1 px-6 py-12 relative z-10">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-6 mx-auto">
            <Mail className="w-8 h-8 text-primary" />
          </div>
          
          <h2 className="text-2xl font-bold text-foreground mb-2 text-center">
            Reset Your Password
          </h2>
          <p className="text-muted-foreground text-center mb-8">
            Enter your email address and we'll send you a link to reset your password.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <FormInput
              label="Email Address"
              type="email"
              placeholder="Enter your email"
              icon={Mail}
              value={values.email}
              onChange={handleChange("email")}
              onBlur={handleBlur("email")}
              error={errors.email}
              autoComplete="email"
            />

            <Button
              type="submit"
              variant="cinema"
              size="xl"
              className="w-full h-14"
            >
              Send Reset Link
            </Button>
          </form>

          <p className="text-center mt-8 text-muted-foreground">
            Remember your password?{" "}
            <Link to="/auth/login" className="text-primary font-semibold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
