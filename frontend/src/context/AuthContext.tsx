import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { User, mockUsers, currentUser } from "@/data/mockData";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; user?: User }>;
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (token: string, password: string) => Promise<{ success: boolean; error?: string }>;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for saved session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("cinema_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem("cinema_user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock authentication
    const foundUser = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!foundUser) {
      setIsLoading(false);
      return { success: false, error: "No account found with this email" };
    }
    
    // In real app, validate password hash
    if (password.length < 6) {
      setIsLoading(false);
      return { success: false, error: "Invalid password" };
    }

    if (foundUser.status === "locked") {
      setIsLoading(false);
      return { success: false, error: "Account is locked. Please contact support." };
    }
    
    setUser(foundUser);
    localStorage.setItem("cinema_user", JSON.stringify(foundUser));
    setIsLoading(false);
    
    return { success: true, user: foundUser };
  };

  const register = async (data: RegisterData) => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if email already exists
    const existingUser = mockUsers.find(u => u.email.toLowerCase() === data.email.toLowerCase());
    if (existingUser) {
      setIsLoading(false);
      return { success: false, error: "An account with this email already exists" };
    }
    
    // Create new user
    const newUser: User = {
      id: `u${Date.now()}`,
      name: data.name,
      email: data.email,
      phone: data.phone || "",
      membershipTier: "Bronze",
      pointsBalance: 0,
      memberSince: new Date().toISOString().split("T")[0],
      qrCode: `MEMBER-BRONZE-${Date.now()}`,
      role: "customer",
      status: "active"
    };
    
    // In real app, this would be saved to database
    mockUsers.push(newUser);
    
    setUser(newUser);
    localStorage.setItem("cinema_user", JSON.stringify(newUser));
    setIsLoading(false);
    
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("cinema_user");
  };

  const forgotPassword = async (email: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!foundUser) {
      return { success: false, error: "No account found with this email" };
    }
    
    // In real app, send reset email
    return { success: true };
  };

  const resetPassword = async (token: string, password: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In real app, validate token and update password
    if (password.length < 6) {
      return { success: false, error: "Password must be at least 6 characters" };
    }
    
    return { success: true };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        forgotPassword,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
