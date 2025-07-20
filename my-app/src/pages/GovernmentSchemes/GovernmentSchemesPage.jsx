import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import FarmerProfile from "./components/FarmerProfile";
import UrgentAlerts from "./components/UrgentAlerts";
import SearchFilter from "./components/SearchFilter";
import SchemeCard from "./components/SchemeCard";
import { governmentSchemes } from "./components/data/schemesData";
import FooterSection from "../../nondashboard/Landing/FooterSection";
import FarmerNavigation from '../../dashboard/Farmer/FarmerNavigation';

/* ---- data & helpers ---- */
import { filterSchemes } from "./components/data/utils/helpers";

/* ---- scoped stylesheet ---- */
import "./components/data/utils/styles/GovernmentSchemes.css";

const GovernmentSchemesPage = () => {
  const [farmerProfile, setFarmerProfile] = useState({
    name: 'Rajesh Kumar',
    location: 'Punjab, India',
    farmSize: '5 acres',
    cropType: 'Wheat & Rice',
    category: 'Small Farmer'
  });

  const [schemes, setSchemes] = useState([]);
  const [filteredSchemes, setFilteredSchemes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setSchemes(governmentSchemes);
    setFilteredSchemes(governmentSchemes);
  }, []);

  useEffect(() => {
    const filtered = filterSchemes(schemes, selectedCategory, searchTerm);
    setFilteredSchemes(filtered);
  }, [selectedCategory, searchTerm, schemes]);

  const urgentSchemes = filteredSchemes.filter(scheme => scheme.urgent);

  return (
    <div className="schemes-container bg-white font-sans min-h-screen">
      <FarmerNavigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="flex items-center justify-between mb-8">
          <div>
            <br />
            <br />
            <h1 className="text-3xl font-bold text-gray-800">Government Schemes & Subsidies</h1>
            <p className="text-gray-500">Personalized alerts based on your profile and location</p>
          </div>
          <div className="relative"></div>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <aside className="lg:col-span-1 space-y-8">
            <FarmerProfile profile={farmerProfile} />
            <UrgentAlerts urgentSchemes={urgentSchemes} />
          </aside>

          <div className="lg:col-span-2">
            <SearchFilter
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              schemes={schemes}
            />

            {filteredSchemes.length > 0 ? (
              <div className="space-y-6">
                {filteredSchemes.map((scheme) => (
                  <SchemeCard key={scheme.id} scheme={scheme} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-lg shadow-sm">
                <div className="text-5xl mb-4">
                  <Bell className="inline w-8 h-8 text-red-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">No matching schemes found</h3>
                <p className="text-gray-500 mt-2">Try adjusting your search or filter criteria.</p>
              </div>
            )}
          </div>
        </main>
      </div>
      <FooterSection />
    </div>
  );
};

export default GovernmentSchemesPage;