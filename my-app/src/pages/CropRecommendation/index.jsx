// src/components/CropRecommendationPage.jsx
import React from 'react';
import CropDashboard from './CropDashboard';
import Header from './Header';
import Footer from './Footer';

const CropRecommendationPage = () => {
  return (
    <div className="app-container">
      <Header />
      <main className="crop-page">
        <CropDashboard />
      </main>
      <Footer />
    </div>
  );
};

export default CropRecommendationPage;