import React from "react";
import { Users, BarChart3, Shield } from "lucide-react";
import AnimationBackgroundElement from "./AnimationBackgroundElement";

const AboutSection = () => {
  return (
    <section id="about" className="py-20 px-6 relative bg-white">
      <AnimationBackgroundElement />
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              About AgriConnect
            </h2>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed text-justify">
              AgriConnect is a heartfelt initiative built to connect farmers, investors, and communities.
              We're more than just a platform — we're a growing movement dedicated to empowering those who feed the world.
              By understanding the unique needs of every farmer and bridging the gap with those who want to support them,
              we bring meaningful change to agriculture. Whether you're cultivating the land or investing in its future, 
              AgriConnect stands beside you every step of the way.
            </p>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed text-justify">
              Our comprehensive platform offers real-time weather and predictive crop analytics for farmers, 
              secure investment opportunities in agriculture for investors, and a seamless direct-to-consumer 
              eCommerce experience for end-users.
            </p>
            <div className="flex items-center space-x-40">
              <div className="text-center">
                <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <div className="text-sm text-gray-600 font-bold">Multi-Stakeholder</div>
              </div>
              <div className="text-center">
                <BarChart3 className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <div className="text-sm text-gray-600 font-bold">AI-Powered Analytics</div>
              </div>
              <div className="text-center">
                <Shield className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <div className="text-sm text-gray-600 font-bold">Secure Platform</div>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="w-full h-96 bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl shadow-2xl flex items-center justify-center z-10">
              <div className="text-center text-white p-8">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-white/20 rounded-lg p-4">
                    <div className="text-2xl font-bold">Weather Analytics</div>
                  </div>
                  <div className="bg-white/20 rounded-lg p-4">
                    <div className="text-2xl font-bold">Smart Contracts</div>
                  </div>
                  <div className="bg-white/20 rounded-lg p-4">
                    <div className="text-2xl font-bold">Market Trends</div>
                  </div>
                  <div className="bg-white/20 rounded-lg p-4">
                    <div className="text-2xl font-bold">AI Recommendations</div>
                  </div>
                </div>
                <div className="text-xl font-bold">Agri-Tech Platform</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
