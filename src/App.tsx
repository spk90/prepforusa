import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import Appointments from "./pages/Appointments";
import Preparation from "./pages/Preparation";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import MockInterviews from "./pages/MockInterviews";
import Community from "./pages/Community";
import VisaExperience from "./pages/VisaExperience";
import Payment from "./pages/Payment";
import AIMockInterview from "./pages/AIMockInterview";
import I20Details from "./pages/I20Details";
import { useEffect } from "react";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Add Google AdSense meta tag only once
    const metaId = "google-adsense-account-meta";
    if (!document.head.querySelector(`#${metaId}`)) {
      const meta = document.createElement("meta");
      meta.id = metaId;
      meta.name = "google-adsense-account";
      meta.content = "ca-pub-1446474252906589";
      document.head.appendChild(meta);
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-grow">
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/signin" element={<SignIn />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route
                      path="/dashboard"
                      element={
                        <ProtectedRoute>
                          <Dashboard />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/appointments"
                      element={
                        <ProtectedRoute>
                          <Appointments />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/preparation"
                      element={
                        <ProtectedRoute>
                          <Preparation />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/mock-interviews"
                      element={
                        <ProtectedRoute>
                          <MockInterviews />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/ai-mock-interview"
                      element={
                        <ProtectedRoute>
                          <AIMockInterview />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/community"
                      element={
                        <ProtectedRoute>
                          <Community />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/visa-experience"
                      element={<VisaExperience />}
                    />
                    <Route
                      path="/payment"
                      element={
                        <ProtectedRoute>
                          <Payment />
                        </ProtectedRoute>
                      }
                    />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/i20-details" element={<I20Details />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
