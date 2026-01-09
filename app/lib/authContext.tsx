"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  email: string;
  name: string;
  token: string;
  createdAt: string;
}

interface UserWithPassword extends User {
  password: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface SignupCredentials {
  email: string;
  password: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (
    credentials: LoginCredentials
  ) => Promise<{ success: boolean; message?: string }>;
  signup: (
    credentials: SignupCredentials
  ) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

const mockDatabase = {
  init: () => {
    if (typeof window === "undefined") return;

    if (!window.localStorage.getItem("mock_users_db")) {
      const defaultUsers: UserWithPassword[] = [
        {
          id: "1",
          email: "test@example.com",
          name: "Test User",
          password: "password123",
          token: "mock-token-1",
          createdAt: new Date().toISOString(),
        },
        {
          id: "2",
          email: "admin@example.com",
          name: "Admin User",
          password: "admin123",
          token: "mock-token-2",
          createdAt: new Date().toISOString(),
        },
      ];
      window.localStorage.setItem(
        "mock_users_db",
        JSON.stringify(defaultUsers)
      );
    }
  },

  getUsers: (): UserWithPassword[] => {
    if (typeof window === "undefined") return [];
    try {
      const users = window.localStorage.getItem("mock_users_db");
      return users ? JSON.parse(users) : [];
    } catch (error) {
      console.error("Failed to parse users database:", error);
      return [];
    }
  },

  findUserByEmail: (email: string): UserWithPassword | undefined => {
    const users = mockDatabase.getUsers();
    return users.find(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );
  },

  findUserById: (id: string): UserWithPassword | undefined => {
    const users = mockDatabase.getUsers();
    return users.find((user) => user.id === id);
  },

  createUser: (
    userData: Omit<UserWithPassword, "id" | "token" | "createdAt">
  ): UserWithPassword => {
    const users = mockDatabase.getUsers();

    const existingUser = mockDatabase.findUserByEmail(userData.email);
    if (existingUser) {
      throw new Error("An account with this email already exists");
    }

    const newUser: UserWithPassword = {
      id: Date.now().toString(),
      token: `mock-token-${Date.now()}`,
      createdAt: new Date().toISOString(),
      ...userData,
    };

    users.push(newUser);

    if (typeof window !== "undefined") {
      window.localStorage.setItem("mock_users_db", JSON.stringify(users));
    }

    return newUser;
  },

  validateCredentials: (
    email: string,
    password: string
  ): UserWithPassword | null => {
    const user = mockDatabase.findUserByEmail(email);
    if (user && user.password === password) {
      return user;
    }
    return null;
  },

  // Helper to remove password from user object
  sanitizeUser: (user: UserWithPassword): User => {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => ({ success: false }),
  signup: async () => ({ success: false }),
  logout: () => {},
  isLoading: false,
  error: null,
  clearError: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRouterReady, setIsRouterReady] = useState(false);
  const router = useRouter();

  // Initialize database and check for existing session
  useEffect(() => {
    // Initialize mock database
    mockDatabase.init();

    // Mark router as ready
    setIsRouterReady(true);

    // Check for existing session
    if (typeof window !== "undefined") {
      const storedUser = window.localStorage.getItem("current_user");

      if (storedUser) {
        try {
          const parsed: User = JSON.parse(storedUser);

          // Verify user still exists in database
          const dbUser = mockDatabase.findUserById(parsed.id);

          if (dbUser) {
            // User exists, restore session
            setUser(mockDatabase.sanitizeUser(dbUser));
          } else {
            // User no longer exists in database, clear invalid session
            console.warn("Stored user not found in database, clearing session");
            window.localStorage.removeItem("current_user");
          }
        } catch (err) {
          console.error("Failed to parse stored user:", err);
          window.localStorage.removeItem("current_user");
        }
      }
    }

    setIsLoading(false);
  }, []);

  // ===== LOGIN =====
  const login = async (
    credentials: LoginCredentials
  ): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true);
    setError(null);

    try {
      // Validate inputs
      if (!credentials.email?.trim()) {
        throw new Error("Email is required");
      }

      if (!credentials.password?.trim()) {
        throw new Error("Password is required");
      }

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Validate credentials
      const validUser = mockDatabase.validateCredentials(
        credentials.email,
        credentials.password
      );

      if (!validUser) {
        throw new Error("Invalid email or password");
      }

      // Remove password before storing
      const userWithoutPassword = mockDatabase.sanitizeUser(validUser);

      // Store in localStorage
      if (typeof window !== "undefined") {
        window.localStorage.setItem(
          "current_user",
          JSON.stringify(userWithoutPassword)
        );
      }

      setUser(userWithoutPassword);

      // Navigate to dashboard (only if router is ready)
      if (isRouterReady) {
        router.push("/dashboard");
      }

      return { success: true };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Login failed. Please try again.";
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  // ===== SIGNUP =====
  const signup = async (
    credentials: SignupCredentials
  ): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true);
    setError(null);

    try {
      // Validate all fields are present
      if (!credentials.name?.trim()) {
        throw new Error("Name is required");
      }

      if (!credentials.email?.trim()) {
        throw new Error("Email is required");
      }

      if (!credentials.password?.trim()) {
        throw new Error("Password is required");
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(credentials.email)) {
        throw new Error("Please enter a valid email address");
      }

      // Password strength validation
      if (credentials.password.length < 8) {
        throw new Error("Password must be at least 8 characters long");
      }

      // Check for at least one number and one letter (basic strength check)
      const hasNumber = /\d/.test(credentials.password);
      const hasLetter = /[a-zA-Z]/.test(credentials.password);

      if (!hasNumber || !hasLetter) {
        throw new Error("Password must contain both letters and numbers");
      }

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Create user in database
      const newUser = mockDatabase.createUser({
        email: credentials.email.trim(),
        password: credentials.password,
        name: credentials.name.trim(),
      });

      // Remove password before storing in session
      const userWithoutPassword = mockDatabase.sanitizeUser(newUser);

      // Auto-login after signup
      if (typeof window !== "undefined") {
        window.localStorage.setItem(
          "current_user",
          JSON.stringify(userWithoutPassword)
        );
      }

      setUser(userWithoutPassword);

      // Navigate to dashboard (only if router is ready)
      if (isRouterReady) {
        router.push("/dashboard");
      }

      return { success: true };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Signup failed. Please try again.";
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("current_user");
    }
    setUser(null);
    setError(null);

    if (isRouterReady) {
      router.push("/login");
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        isLoading,
        error,
        clearError,
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
