import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import SignUp from "./auth/SignUp";
import Login from "./auth/Login";
import FarmerDashboard from "./dashboard/Farmer/FarmerDashboard";
import NewFarmerDashboard from "./dashboard/Farmer/NewFarmerDashboard";
import FarmerHeroSection from "./dashboard/Farmer/FarmerHeroSection";
import FarmerNavigation from "./dashboard/Farmer/FarmerNavigation";
import InvestorLandingPage from "./dashboard/Investor/InvestorLandingPage";
import InvestorProfile from "./dashboard/Investor/InvestorProfile";
import CustomerDashboard from "./dashboard/Customer/CustomerDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./nondashboard/Landing/page";
import InvestorDashboardPage from "./dashboard/Investor/InvestorDashboardPage";
import MonthlyInstallments from "./dashboard/Investor/MonthlyInstallments";
import ROI from "./dashboard/Investor/ROI";
import InvestmentDetails from "./dashboard/Investor/InvestmentDetails";
import AddProductForm from "./pages/AddProductForm";
import CropPricePredictor from "./pages/CropPricePredictor";
import SoilHealthAnalyzer from "./pages/SoilHealthAnalyzer";
import YieldPrediction from "./pages/YieldPrediction";
import CropRecommendationPage from "./pages/CropRecommendation";
import CropDiseaseAlerts from "./pages/CropDiseaseAlerts";
import WeatherForecast from "./pages/WeatherForecast";
import GovernmentSchemesPage from "./pages/GovernmentSchemes";
import HarvestAlertPage from "./pages/HarvestAlert/HarvestAlertPage";
import ProfilePage from "./pages/ProfilePage";
import Cart from "./dashboard/Customer/Cart";

function App() {
  const location = useLocation();
  const hideNavbar = location.pathname.toLowerCase().includes('dashboard') || location.pathname === '/' || location.pathname.toLowerCase() === '/login' || location.pathname.toLowerCase() === '/signup' || location.pathname.toLowerCase() === '/investor/profile';

  // Get user from localStorage for hero section
  const user = JSON.parse(localStorage.getItem("agri-user")) || { name: "Farmer" };

  return (
    <>
      {!hideNavbar}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Farmer/farmer-dashboard" element={<FarmerDashboard />} />
        <Route path="/Farmer/new-farmer-dashboard" element={<NewFarmerDashboard />} />
        <Route path="/Farmer/hero-section" element={<FarmerHeroSection user={user} />} />
        <Route path="/Farmer/navigation" element={<FarmerNavigation />} />
        <Route path="/Investor/investor-dashboard" element={<InvestorLandingPage />} />
        <Route path="/Investor/profile" element={<InvestorProfile />} />
        <Route path="/Customer/customer-dashboard" element={<CustomerDashboard />} />
        <Route path="/Investor/dashboard" element={<InvestorDashboardPage />} />
        <Route path="/Investor/monthlyinstallments" element={<MonthlyInstallments />} />
        <Route path="/Investor/roi" element={<ROI />} />
        <Route path="/Investor/investment/:id" element={<InvestmentDetails />} />
        <Route path="/protected" element={<ProtectedRoute />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/WeatherForecast" element={<WeatherForecast />} />
        <Route path="/CropPricePredictor" element={<CropPricePredictor />} />
        <Route path="/YieldPrediction" element={<YieldPrediction />} />
        <Route path="/CropRecommendation" element={<CropRecommendationPage />} />
        <Route path="/HarvestAlert" element={<HarvestAlertPage />} />
        <Route path="/CropDiseaseAlerts" element={<CropDiseaseAlerts />} />
        <Route path="/SoilHealthAnalyzer" element={<SoilHealthAnalyzer />} />
        <Route path="/GovernmentSchemes" element={<GovernmentSchemesPage />} />
        <Route path="/AddProductForm" element={<AddProductForm />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
    </>
  );
}

export default function AppWithRouter() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}