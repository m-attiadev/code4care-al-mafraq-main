import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import Index from "./pages/Index";
import Hospitals from "./pages/Hospitals";
import HealthAI from "./pages/HealthAI";
import Nutrition from "./pages/Nutrition";
import LabAnalysis from "./pages/LabAnalysis";
import BloodDonation from "./pages/BloodDonation";
import Telehealth from "./pages/Telehealth";
import MentalHealth from "./pages/MentalHealth";
import Fitness from "./pages/Fitness";
import Diseases from "./pages/Diseases";
import Doctors from "./pages/Doctors";
import Government from "./pages/Government";
import Blog from "./pages/Blog";
import Reviews from "./pages/Reviews";
import Jobs from "./pages/Jobs";
import NotFound from "./pages/NotFound";
import ScrollToHash from "./components/ScrollToHash";
import { useEffect } from "react";

const RTLSetter = () => {
  useEffect(() => {
    document.documentElement.dir = "rtl";
    document.documentElement.lang = "ar";
  }, []);
  return null;
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <RTLSetter />
          <ScrollToHash />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/hospitals" element={<Hospitals />} />
            <Route path="/health-ai" element={<HealthAI />} />
            <Route path="/nutrition" element={<Nutrition />} />
            <Route path="/lab-analysis" element={<LabAnalysis />} />
            <Route path="/blood-donation" element={<BloodDonation />} />
            <Route path="/telehealth" element={<Telehealth />} />
            <Route path="/mental-health" element={<MentalHealth />} />
            <Route path="/fitness" element={<Fitness />} />
            <Route path="/diseases" element={<Diseases />} />
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/government" element={<Government />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/jobs" element={<Jobs />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
