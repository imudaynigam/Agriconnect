import React from "react";
import { useNavigate } from "react-router-dom";

const menuItems = [
  { id: 'dashboard', label: 'Dashboard Overview', route: '/Investor/dashboard' },
  { id: 'opportunities', label: 'Investment Opportunities', route: '/Investor/opportunities' },
  { id: 'disbursals', label: 'Monthly Disbursals', route: '/Investor/monthlyinstallments' },
  { id: 'roi', label: 'Return on Investment', route: '/Investor/roi' },
  { id: 'risk-grading', label: 'Risk Grading System', route: '/Investor/risk-grading' },
  { id: 'tracker', label: 'Investment Tracker', route: '/Investor/tracker' },
  { id: 'smart-contracts', label: 'Smart Contracts', route: '/Investor/smart-contracts' },
];

export default function InvestorSidebar({ onClose, onSectionSelect }) {
  const navigate = useNavigate();

  const handleNavigate = (item) => {
    if (onSectionSelect && (item.id === 'dashboard' || item.id === 'disbursals' || item.id === 'roi' || item.id === 'risk-grading' || item.id === 'opportunities' || item.id === 'tracker')) {
      onSectionSelect(item.id);
      if (onClose) onClose();
    } else {
      navigate(item.route);
      if (onClose) onClose();
    }
  };

  return (
    <div className="fixed left-0 top-20 z-50 w-64 bg-white shadow-xl border-r border-gray-200 h-[calc(100vh-80px)]">
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800 w-full text-center">Investor Portal</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 text-2xl bg-transparent border p-1 flex items-center justify-center"
          aria-label="Close sidebar"
        >
          &times;
        </button>
      </div>
      <nav className="p-4 text-center">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNavigate(item)}
            className="w-full text-center p-3 rounded-lg mb-2 transition-colors flex flex-col items-center justify-center bg-green-700 text-white hover:bg-green-800 hover:text-white"
          >
            <span className="text-lg">{item.icon}</span>
            <span className="text-sm font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
} 