import React, { useState, useEffect, useRef } from 'react';
import {
  Leaf, Menu, Bell, MessageCircle, CloudSun, DollarSign,
  FlaskConical, BarChart2, Sprout, AlarmClock, ShieldAlert, Landmark, Droplets
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import FooterSection from '../../nondashboard/Landing/FooterSection';
import AnimationBackgroundElement from '../../nondashboard/Landing/AnimationBackgroundElement';
import Lottie from 'lottie-react';
import plantGrow from '../../assets/plant-grow.json';

const tips = [
  {
    icon: <Droplets className="w-4 h-4 text-green-700 mr-2" />, text: "Tip: Monitor soil moisture before irrigation"
  },
  {
    icon: <FlaskConical className="w-4 h-4 text-green-700 mr-2" />, text: "Tip: Use recommended fertilizers for your crop type"
  },
  {
    icon: <Sprout className="w-4 h-4 text-green-700 mr-2" />, text: "Tip: Rotate crops to maintain soil health"
  },
  {
    icon: <CloudSun className="w-4 h-4 text-green-700 mr-2" />, text: "Tip: Check local weather before spraying pesticides"
  }
];

function DashboardCard({ title, description, icon, bgColor, textColor }) {
  return (
    <div
      className={`relative bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-transform cursor-pointer`}
    >
      <div
        className="absolute -top-5 left-5 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center shadow"
      >
        {icon}
      </div>
      <div className="pt-6">
        <h3 className="text-gray-800 text-lg font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
    </div>
  );
}

export default function FarmerDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [messageOpen, setMessageOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  const profileRef = useRef(null);
  const messageRef = useRef(null);
  const notifRef = useRef(null);
  const navigate = useNavigate();

  const user = { name: "Farmer", email: "john@farmer.com" };
  const firstLetter = user?.name ? user.name.charAt(0).toUpperCase() : "F";

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        profileRef.current && !profileRef.current.contains(e.target) &&
        messageRef.current && !messageRef.current.contains(e.target) &&
        notifRef.current && !notifRef.current.contains(e.target)
      ) {
        setDropdownOpen(false);
        setMessageOpen(false);
        setNotificationOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("agri-user");
    navigate("/Login");
  };

  const dashboardItems = [
    {
      to: '/WeatherForecast',
      title: 'Live Weather Forecasting',
      description: 'Get real-time weather updates to make better agricultural decisions.',
      icon: <CloudSun className="w-6 h-6 text-blue-600" />,
    },
    {
      to: '/CropPricePredictor',
      title: 'Crop Price Prediction',
      description: 'Predict future crop prices using AI for smarter selling decisions.',
      icon: <DollarSign className="w-6 h-6 text-yellow-600" />,
    },
    {
      to: '/YieldPrediction',
      title: 'Yield Prediction',
      description: 'Estimate potential crop yield based on field conditions and data.',
      icon: <BarChart2 className="w-6 h-6 text-purple-600" />,
    },
    {
      to: '/CropRecommendation',
      title: 'Best Crop Recommendations',
      description: 'Discover crops best suited to your soil and region.',
      icon: <Sprout className="w-6 h-6 text-green-600" />,
    },
    {
      to: '/HarvestAlert',
      title: 'Harvest Timing Alerts',
      description: 'Timely alerts to optimize harvesting schedules.',
      icon: <AlarmClock className="w-6 h-6 text-pink-600" />,
    },
    {
      to: '/CropDiseaseAlerts',
      title: 'Crop Care & Disease Alerts',
      description: 'Stay protected with disease alerts and crop care tips.',
      icon: <ShieldAlert className="w-6 h-6 text-red-600" />,
    },
    {
      to: '/SoilHealthAnalyzer',
      title: 'Soil Health Analysis Integration',
      description: 'Analyze and visualize your soil health data for planning.',
      icon: <FlaskConical className="w-6 h-6 text-indigo-600" />,
    },
    {
      to: '/GovernmentSchemes',
      title: 'Government Scheme & Subsidy Alerts',
      description: 'Stay updated on policies and schemes.',
      icon: <Landmark className="w-6 h-6 text-teal-600" />,
    }
  ];

  const randomTip = tips[Math.floor(Math.random() * tips.length)];

  return (
    <div className="relative bg-white">
      <AnimationBackgroundElement />

      <header className="flex items-center justify-between px-6 py-4 bg-white shadow-md fixed top-0 left-0 right-0 z-50 h-16">
        <div className="flex items-center space-x-4">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg hover:bg-green-100">
            <Menu className="text-black" size={30} />
          </button>
          <Leaf className="text-green-700" />
          <span className="font-bold text-xl text-black">AgriConnect</span>
        </div>

        <div className="absolute left-1/2 transform -translate-x-[48%]">
          <h1 className="text-2xl font-extrabold bg-gradient-to-r from-green-600 via-black to-green-600 bg-clip-text text-transparent">
            Growing the Future
          </h1>
        </div>

        <div className="flex items-center space-x-4 relative" ref={profileRef}>
          <div ref={messageRef} className="relative">
            <button onClick={() => {
              setMessageOpen(!messageOpen);
              setDropdownOpen(false);
              setNotificationOpen(false);
            }}>
              <MessageCircle className="w-6 h-6 text-gray-700 hover:text-green-600 transition" />
              <span className="absolute -top-1 -right-1 bg-red-600 rounded-full w-2 h-2" />
            </button>
            {messageOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg border z-50">
                <div className="p-4 text-sm text-gray-700">
                  <p><strong>New:</strong> Price updates available 📈</p>
                  <hr className="my-2" />
                  <p><strong>Support:</strong> We’ve received your issue ✅</p>
                </div>
              </div>
            )}
          </div>

          <div ref={notifRef} className="relative">
            <button onClick={() => {
              setNotificationOpen(!notificationOpen);
              setDropdownOpen(false);
              setMessageOpen(false);
            }}>
              <Bell className="w-6 h-6 text-gray-700 hover:text-green-600 transition" />
              <span className="absolute -top-1 -right-1 bg-red-600 rounded-full w-2 h-2" />
            </button>
            {notificationOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg border z-50">
                <div className="p-4 text-sm text-gray-700">
                  <p><strong>Alert:</strong> Rain in your region 🌧️</p>
                  <hr className="my-2" />
                  <p><strong>Reminder:</strong> Fertilize today 🧪</p>
                </div>
              </div>
            )}
          </div>

          <div className="relative mt-[-6px]">
            <div
              className="bg-gray-800 text-white w-8 h-8 flex items-center justify-center rounded-full cursor-pointer hover:bg-green-600 transition"
              onClick={() => {
                setDropdownOpen(!dropdownOpen);
                setNotificationOpen(false);
                setMessageOpen(false);
              }}
            >
              {firstLetter}
            </div>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-40  bg-white border rounded-md shadow-md z-50 ">
                <ul className="py-2 text-sm text-gray-700">
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => navigate("/profile")}>Profile</li>
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => navigate("/newfarmerdashboard")}>Dashboard</li>
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={handleLogout}>Logout</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </header>

      {sidebarOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setSidebarOpen(false)} />
          <div className="fixed top-16 left-0 h-[calc(100%-4rem)] w-64 bg-white shadow-lg z-50 transition-transform duration-300 transform translate-x-0">
            <div className="p-6 space-y-6">
              <Link to="/Farmer/new-farmer-dashboard" className="block hover:text-green-700">Home</Link>
              <Link to="/analytics" className="block hover:text-green-700">Analytics</Link>
              <Link
                to="/AddProductForm"
                className="block text-green hover:text-green-700"
              >
                Sell Products
              </Link>
            </div>
          </div>
        </>
      )}

      <main className="pt-20 p-10">
        <div className="text-center my-6">
          <h2 className="text-4xl font-bold text-gray-800">Explore Your Farming Tools</h2>
          <div className="mt-2 flex justify-center">
            <div className="w-32 h-32">
              <Lottie animationData={plantGrow} loop autoplay />
            </div>
          </div>

          <p className="text-black text-sm mt-2 flex items-center justify-center">
            {randomTip.icon}
            {randomTip.text}
          </p>
        </div>

        <br></br>
        <br></br>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {dashboardItems.map((item, index) => (
            <Link to={item.to} key={index}>
              <DashboardCard
                title={item.title}
                description={item.description}
                icon={item.icon}
              />
            </Link>
          ))}
        </div>
      </main>

      <br></br>

      <FooterSection />
    </div>
  );
}