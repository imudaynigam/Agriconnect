import React from "react";

export default function CustomerHeroSection() {
  const handleShopNow = () => {
    const section = document.getElementById('best-selling-section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };
  return (
    <section className="bg-green-50 py-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-8 md:px-16">
        {/* Left: Text */}
        <div className="flex-1 mb-10 md:mb-0">
          <p className="text-green-700 font-medium mb-2">Welcome to a Culinary Paradise</p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Indulge in Exquisite<br />
            Flavors with <span className="text-green-700">AgriConnect</span>
          </h1>
          <p className="text-gray-600">
            Discover a world of exceptional tastes curated just for you.
          </p>
          <p className="text-gray-600 mb-6">
            From farm-fresh produce to gourmet delicacies, our handpicked selection awaits.
          </p>
          <button
            className="bg-green-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-green-700 transition flex items-center gap-2"
            onClick={handleShopNow}
          >
            Shop Now
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L21 12m0 0l-3.75 5.25M21 12H3" />
            </svg>
          </button>
        </div>
        {/* Right: Image in circle */}
        <div className="flex-shrink-0 flex justify-center">
          <div className="relative">
            <div className="w-72 h-72 bg-green-200 rounded-full flex items-center justify-center">
              <img
                src="https://cdn.pixabay.com/photo/2019/09/10/12/13/working-4465967_960_720.jpg"
                alt="Customer working with groceries"
                className="w-60 h-60 object-cover object-center rounded-full shadow-lg border-4 border-white transition-all duration-300 transform hover:scale-105 hover:shadow-2xl cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 