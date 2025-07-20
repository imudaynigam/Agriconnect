import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { User, Settings, LayoutDashboard, LogOut, Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';
import InvestorHeroSection from "./InvestorHeroSection.jsx";
import AboutSection from "../../nondashboard/Landing/AboutSection";
import FeaturesSection from "../../nondashboard/Landing/FeaturesSection";
import KeyFeaturesSection from "../../nondashboard/Landing/KeyFeaturesSection";
import ContactSection from "../../nondashboard/Landing/ContactSection";
import FooterSection from "../../nondashboard/Landing/FooterSection";
import InvestorNavbar from "./InvestorNavbar";
import supabase from "../../supabaseClient";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A020F0"];

export default function InvestorDashboard() {
  const [isProfileMenuOpen, setProfileMenuOpen] = useState(false);
  const [investorName, setInvestorName] = useState("Investor");

  useEffect(() => {
    const fetchUserName = async () => {
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
      if (authError || !authUser) return;
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', authUser.id)
        .single();
      if (profile && profile.full_name) {
        setInvestorName(profile.full_name);
      } else if (authUser.user_metadata && authUser.user_metadata.fullName) {
        setInvestorName(authUser.user_metadata.fullName);
      }
    };
    fetchUserName();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <InvestorNavbar 
        investorName={investorName}
        isProfileMenuOpen={isProfileMenuOpen}
        setProfileMenuOpen={setProfileMenuOpen}
        handleLogout={handleLogout}
        hideSidebarToggle={true}
      />
      <InvestorHeroSection />
      <main className="p-8 flex-grow">
        <AboutSection />
        <FeaturesSection />
        <KeyFeaturesSection />
        <ContactSection />
      </main>
      <FooterSection />
    </div>
  );
}