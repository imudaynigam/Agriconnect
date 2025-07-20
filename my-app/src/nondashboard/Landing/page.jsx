import React from "react";
import Navigation from "./Navigation";
import HeroSection from "./HeroSection";
import AboutSection from "./AboutSection";
import FeaturesSection from "./FeaturesSection";
import KeyFeaturesSection from "./KeyFeaturesSection";
import ContactSection from "./ContactSection";
import FooterSection from "./FooterSection";
import FarmerHeroSection from "../../dashboard/Farmer/FarmerHeroSection";

const Landing = ({ showNav = true, showFooter = true, showContactSection = true, isFarmer = false, user }) => {
  return (
    <>
      {showNav && <Navigation />}
      {isFarmer ? <FarmerHeroSection user={user} /> : <HeroSection />}
      <AboutSection />
      <FeaturesSection />
      <KeyFeaturesSection />
      {showContactSection && <ContactSection />}
      {showFooter && <FooterSection />}
    </>
  );
};

export default Landing;
