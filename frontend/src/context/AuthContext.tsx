import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

type Role = "EMPLOYEE" | "MANAGER" | "HR" | null;

interface AuthContextType {
  user: string | null;
  role: Role;
  isAuthenticated: boolean;
  login: (email: string, password: string, navigate: (path: string) => void) => void;
  logout: (navigate: (path: string) => void) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<string | null>(null);
  const [role, setRole] = useState<Role>(null);

  // Load from localStorage on refresh
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedRole = localStorage.getItem("role") as Role;
    if (savedUser && savedRole) {
      setUser(savedUser);
      setRole(savedRole);
    }
  }, []);

  const login = (email: string, password: string, navigate: (path: string) => void) => {
    // Hardcoded users (for testing, replace with API later)
    const users = [
      { email: "employee@example.com", password: "123456", role: "EMPLOYEE" },
      { email: "manager@example.com", password: "123456", role: "MANAGER" },
      { email: "admin@example.com", password: "123456", role: "HR" },
    ];

    const matchedUser = users.find(
      (u) => u.email === email && u.password === password
    );

    if (!matchedUser) {
      alert("Invalid credentials");
      return;
    }

    setUser(matchedUser.email);
    setRole(matchedUser.role as Role);
    localStorage.setItem("user", matchedUser.email);
    localStorage.setItem("role", matchedUser.role);

    // Redirect after login
    if (matchedUser.role === "EMPLOYEE") navigate("/employee");
    else if (matchedUser.role === "MANAGER") navigate("/manager");
    else if (matchedUser.role === "HR") navigate("/admin");
  };

  const logout = (navigate: (path: string) => void) => {
    setUser(null);
    setRole(null);
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{ user, role, isAuthenticated: !!user, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};
