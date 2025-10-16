import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

import Navigation from "./components/Navigation";
import Home from "./pages/Home";
import ReportForm from "./pages/ReportForm";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import LoginPrompt from "./pages/LoginPrompt";
import ResetPassword from "./pages/ResetPassword";
import ForgotPassword from "./pages/ForgotPassword";

import "./i18n";

const queryClient = new QueryClient();

interface LoginPromptProps {
  setUserEmail: (email: string | null) => void;
}

const App = () => {
  // Store logged-in user's email
  const [userEmail, setUserEmail] = useState<string | null>(
    localStorage.getItem("userEmail")
  );

  // React to storage changes (like logout from another tab)
  useEffect(() => {
    const handleStorageChange = () => {
      setUserEmail(localStorage.getItem("userEmail"));
    };
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-background">
            <Navigation />
            <Routes>
              {/* Root redirects to Home or Login */}
              <Route
                path="/"
                element={userEmail ? <Home /> : <Navigate to="/login" replace />}
              />

              {/* Login Page */}
              <Route
                path="/login"
                element={<LoginPrompt setUserEmail={setUserEmail} />}
              />

              {/* Forgot Password Page */}
              <Route path="/forgot-password" element={<ForgotPassword />} />

              {/* Reset Password Page */}
              <Route path="/reset-password/:token" element={<ResetPassword />} />

              {/* Report Form (protected) */}
              <Route
                path="/report"
                element={
                  userEmail ? <ReportForm /> : <Navigate to="/login" replace />
                }
              />

              {/* Dashboard Page */}
              <Route path="/dashboard" element={<Dashboard />} />

              {/* Catch-all 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;