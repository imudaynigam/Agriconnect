import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const socialLinks = [
  { name: "GitHub", href: "https://github.com/", icon: (
    <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5"><path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.091-.647.35-1.088.636-1.339-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.987 1.029-2.687-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.748-1.025 2.748-1.025.546 1.378.202 2.397.1 2.65.64.7 1.028 1.594 1.028 2.687 0 3.847-2.338 4.695-4.566 4.944.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.749 0 .267.18.579.688.481C19.138 20.203 22 16.447 22 12.021 22 6.484 17.523 2 12 2Z" /></svg>
  ) },
  { name: "Twitter", href: "https://twitter.com/", icon: (
    <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5"><path d="M19.633 7.997c.013.176.013.353.013.53 0 5.386-4.099 11.6-11.6 11.6-2.307 0-4.453-.676-6.26-1.84.324.038.636.05.972.05 1.92 0 3.684-.655 5.09-1.757-1.8-.037-3.322-1.22-3.843-2.85.252.037.504.063.77.063.37 0 .74-.05 1.084-.143-1.87-.377-3.28-2.03-3.28-4.017v-.05c.548.304 1.18.487 1.85.508A4.07 4.07 0 0 1 2.8 6.575c0-.75.202-1.45.553-2.05C6.29 6.86 10.07 8.89 14.29 9.13c-.07-.3-.11-.61-.11-.93 0-2.25 1.83-4.08 4.08-4.08 1.18 0 2.25.5 3 1.3.93-.18 1.8-.52 2.58-.99-.3.93-.93 1.7-1.75 2.19.83-.1 1.62-.32 2.36-.65-.55.82-1.25 1.54-2.06 2.12Z" /></svg>
  ) },
  { name: "Instagram", href: "https://instagram.com/", icon: (
    <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5"><path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5A4.25 4.25 0 0 0 20.5 16.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5Zm4.25 2.25A6.25 6.25 0 1 1 5.75 12 6.25 6.25 0 0 1 12 5.75Zm0 1.5A4.75 4.75 0 1 0 16.75 12 4.75 4.75 0 0 0 12 7.25Zm6.25-.5a1 1 0 1 1-1 1 1 1 0 0 1 1-1Z" /></svg>
  ) },
  { name: "LinkedIn", href: "https://linkedin.com/", icon: (
    <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5"><path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.28c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.79 1.75 1.75-.78 1.75-1.75 1.75zm13.5 11.28h-3v-5.6c0-1.34-.03-3.07-1.87-3.07-1.87 0-2.16 1.46-2.16 2.97v5.7h-3v-10h2.88v1.36h.04c.4-.75 1.38-1.54 2.84-1.54 3.04 0 3.6 2 3.6 4.59v5.59z" /></svg>
  ) },
];

const categories = [
  "Grains",
  "Pulses",
  "Fruits",
  "Vegetables",
  "Dairy",
  "Spices",
];

export default function CustomerFooter() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const year = new Date().getFullYear();

  // Handle logo click to redirect to home page
  const handleLogoClick = () => {
    navigate("/");
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    // You can add your newsletter logic here
    setEmail("");
    alert("Thank you for subscribing!");
  };

  return (
    <footer className="bg-white pt-16 pb-8 w-full border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-10">
          {/* Logo and description */}
          <div className="flex-1 min-w-[180px] mb-8 md:mb-0 flex flex-col items-start justify-start">
            <div className="flex items-center mb-2 cursor-pointer hover:opacity-80 transition-opacity" onClick={handleLogoClick}>
              <span className="text-2xl font-bold text-gray-800">AGRI<span className="text-green-700">CONNECT</span></span>
            </div>
            <p className="text-gray-500 text-sm max-w-xs">
              Discover a world of exceptional tastes curated just for you. From farm-fresh produce to gourmet delicacies, our handpicked selection of premium ingredients elevates every meal.
            </p>
            {/* Social links */}
            <div className="flex gap-3 mt-4" aria-label="Social media">
              {socialLinks.map(link => (
                <a key={link.name} href={link.href} target="_blank" rel="noopener noreferrer" aria-label={link.name} className="text-gray-400 hover:text-green-700 transition">
                  {link.icon}
                </a>
              ))}
            </div>
          </div>
          {/* Links columns */}
          <div className="flex flex-1 justify-between flex-wrap gap-8 items-start">
            <div className="flex flex-col items-start">
              <div className="font-semibold mb-2">Subscription & Combo Offers</div>
              <ul className="text-gray-500 text-sm space-y-1">
                <li>
                  <button
                    className="hover:text-green-700 transition cursor-pointer bg-transparent border-none p-0 m-0 text-left"
                    style={{ background: 'none' }}
                    onClick={() => window.dispatchEvent(new CustomEvent('open-subscription-modal', { detail: 'weekly' }))}
                  >
                    Weekly
                  </button>
                </li>
                <li>
                  <button
                    className="hover:text-green-700 transition cursor-pointer bg-transparent border-none p-0 m-0 text-left"
                    style={{ background: 'none' }}
                    onClick={() => window.dispatchEvent(new CustomEvent('open-subscription-modal', { detail: 'monthly' }))}
                  >
                    Monthly
                  </button>
                </li>
                <li>
                  <button
                    className="hover:text-green-700 transition cursor-pointer bg-transparent border-none p-0 m-0 text-left"
                    style={{ background: 'none' }}
                    onClick={() => window.dispatchEvent(new CustomEvent('open-subscription-modal', { detail: 'Fruits' }))}
                  >
                    Fruits Combo
                  </button>
                </li>
                <li>
                  <button
                    className="hover:text-green-700 transition cursor-pointer bg-transparent border-none p-0 m-0 text-left"
                    style={{ background: 'none' }}
                    onClick={() => window.dispatchEvent(new CustomEvent('open-subscription-modal', { detail: 'Vegetables' }))}
                  >
                    Vegetables Combo
                  </button>
                </li>
                <li>
                  <button
                    className="hover:text-green-700 transition cursor-pointer bg-transparent border-none p-0 m-0 text-left"
                    style={{ background: 'none' }}
                    onClick={() => window.dispatchEvent(new CustomEvent('open-subscription-modal', { detail: 'Dairy' }))}
                  >
                    Dairy Combo
                  </button>
                </li>
              </ul>
            </div>
            <div className="flex flex-col items-start">
              <div className="font-semibold mb-2">Categories</div>
              <ul className="text-gray-500 text-sm space-y-1">
                {categories.map(cat => (
                  <li key={cat}>
                    <a
                      href="#best-selling-section"
                      className="hover:text-green-700 transition cursor-pointer"
                      onClick={e => {
                        e.preventDefault();
                        window.dispatchEvent(new CustomEvent('select-category', { detail: cat }));
                        const section = document.getElementById('best-selling-section');
                        if (section) section.scrollIntoView({ behavior: 'smooth' });
                      }}
                    >
                      {cat}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col items-start">
              <div className="font-semibold mb-2">Quick Access</div>
              <ul className="text-gray-500 text-sm space-y-1">
                <li><Link to="/profile" className="hover:text-green-700 transition">Profile</Link></li>
                <li><Link to="/cart" className="hover:text-green-700 transition">Cart</Link></li>
              </ul>
            </div>
          </div>
        </div>
        {/* Divider */}
        <div className="border-t border-gray-200 my-8" />
        {/* Bottom row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <div className="text-center">
            ©{year} <span className="cursor-pointer hover:opacity-80 transition-opacity" onClick={handleLogoClick}>Agriconnect</span>. All rights reserved.
          </div>
          <div className="flex gap-3 items-center">
            {/* Payment icons (SVG placeholders) */}
            <span className="inline-block"><img src="https://cdn.iconscout.com/icon/free/png-512/free-upi-logo-icon-download-in-svg-png-gif-file-formats--unified-payments-interface-payment-money-transfer-logos-icons-1747946.png?f=webp&w=256" alt="UPI" className="h-7" /></span>
            <span className="inline-block"><img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png" alt="Mastercard" className="h-5" /></span>
            <span className="inline-block"><img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-5" /></span>
            <span className="inline-block"><img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" alt="Visa" className="h-5" /></span>
          </div>
        </div>
      </div>
    </footer>
  );
} 