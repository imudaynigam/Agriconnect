import React from "react";
import { TruckIcon, CreditCardIcon, CurrencyRupeeIcon, TagIcon } from "@heroicons/react/24/outline";

const features = [
  {
    icon: <TruckIcon className="w-8 h-8 mb-2 text-white" />,
    title: "Free Delivery",
    desc: "Get free delivery for orders over ₹500.",
  },
  {
    icon: <CreditCardIcon className="w-8 h-8 mb-2 text-white" />,
    title: "Safe Payment",
    desc: "Payment system is very safe and secure.",
  },
  {
    icon: <CurrencyRupeeIcon className="w-8 h-8 mb-2 text-white" />,
    title: "Money Back",
    desc: "Very easy to make your money back option.",
  },
  {
    icon: <TagIcon className="w-8 h-8 mb-2 text-white" />,
    title: "Best Prices and Offers",
    desc: "Cashback offers to top it off. Get best prices & offers.",
  },
];

export default function CustomerFeaturesBar() {
  return (
    <section className="py-0 w-full">
      <div className="bg-green-700 rounded flex flex-col md:flex-row items-center justify-between px-4 md:px-12 py-8 w-full">
        {features.map((f, i) => (
          <div key={f.title} className="flex flex-col items-center text-center text-white flex-1 px-2 md:px-6 mb-6 md:mb-0">
            {f.icon}
            <div className="font-bold text-lg mb-1">{f.title}</div>
            <div className="text-sm opacity-80">{f.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
} 