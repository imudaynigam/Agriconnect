import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import InvestorSidebar from './InvestorSidebar';
import InvestorNavbar from './InvestorNavbar';
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';
import MonthlyInstallments from './MonthlyInstallments';
import ROI from './ROI';
import RiskGrading from './RiskGrading';
import InvestmentOpportunities from './InvestmentOpportunities';
import InvestmentTracker from './InvestmentTracker';
import FooterSection from '../../nondashboard/Landing/FooterSection';
import LandingPageCircles from '../../nondashboard/Landing/LandingPageCircles';
import supabase from '../../supabaseClient';

export default function InvestorDashboardPage() {
  const navigate = useNavigate();
  const [isProfileMenuOpen, setProfileMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState('dashboard');

  const roiData = [
    { month: 'Jan', roi: 12, disbursement: 15000 },
    { month: 'Feb', roi: 15, disbursement: 22000 },
    { month: 'Mar', roi: 18, disbursement: 18000 },
    { month: 'Apr', roi: 22, disbursement: 25000 },
    { month: 'May', roi: 25, disbursement: 30000 },
    { month: 'Jun', roi: 28, disbursement: 35000 }
  ];

  const cropData = [
    { name: 'Wheat', value: 30, color: '#2e7d32' },
    { name: 'Corn', value: 20, color: '#1565c0' },
    { name: 'Rice', value: 25, color: '#00897b' },
    { name: 'Soybean', value: 15, color: '#bfa600' },
    { name: 'Others', value: 10, color: '#6a1b9a' }, 
  ];

  const [investmentData, setInvestmentData] = useState([]);
  const [loadingInvestments, setLoadingInvestments] = useState(true);
  const [investmentError, setInvestmentError] = useState(null);

  useEffect(() => {
    const fetchInvestments = async () => {
      setLoadingInvestments(true);
      setInvestmentError(null);
      const { data, error } = await supabase
        .from('investments')
        .select('*')
        .order('date', { ascending: false });
      if (error) {
        setInvestmentError('Failed to fetch investments.');
        setInvestmentData([]);
      } else {
        setInvestmentData(data || []);
      }
      setLoadingInvestments(false);
    };
    fetchInvestments();
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selectedSection]);

  // Helper functions for date and state calculations
  function getMonthYear(dateStr) {
    const d = new Date(dateStr);
    return d.getFullYear() + '-' + (d.getMonth() + 1);
  }
  function getQuarter(dateStr) {
    const d = new Date(dateStr);
    return d.getFullYear() + '-Q' + (Math.floor(d.getMonth() / 3) + 1);
  }
  function getState(location) {
    if (!location) return '';
    const parts = location.split(',');
    return parts.length > 1 ? parts[parts.length - 1].trim() : location.trim();
  }

  // Dates for calculations
  const now = new Date();
  const thisMonth = now.getMonth() + 1;
  const thisYear = now.getFullYear();
  const lastMonth = thisMonth === 1 ? 12 : thisMonth - 1;
  const lastMonthYear = thisMonth === 1 ? thisYear - 1 : thisYear;
  const thisQuarter = Math.floor(now.getMonth() / 3) + 1;
  const lastQuarter = thisQuarter === 1 ? 4 : thisQuarter - 1;
  const lastQuarterYear = thisQuarter === 1 ? thisYear - 1 : thisYear;

  // All-time values for main numbers
  const totalInvestment = investmentData.reduce((sum, inv) => sum + (Number(inv.amount) || 0), 0);
  const activeProjects = investmentData.filter(inv => inv.status === 'Active').length;
  const averageROI = investmentData.length
    ? (investmentData.reduce((sum, inv) => sum + (Number(inv.roi) || 0), 0) / investmentData.length).toFixed(2)
    : 0;
  const farmersSupported = new Set(investmentData.map(inv => inv.farmer_name)).size;

  // Subtext calculations (time-based)
  // 1. Total Investment: % change from last month
  const totalInvestmentThisMonth = investmentData
    .filter(inv => {
      const d = new Date(inv.date);
      return d.getFullYear() === thisYear && d.getMonth() + 1 === thisMonth;
    })
    .reduce((sum, inv) => sum + (Number(inv.amount) || 0), 0);
  const totalInvestmentLastMonth = investmentData
    .filter(inv => {
      const d = new Date(inv.date);
      return d.getFullYear() === lastMonthYear && d.getMonth() + 1 === lastMonth;
    })
    .reduce((sum, inv) => sum + (Number(inv.amount) || 0), 0);
  const totalInvestmentChange = totalInvestmentLastMonth === 0 ? 0 : (((totalInvestmentThisMonth - totalInvestmentLastMonth) / totalInvestmentLastMonth) * 100).toFixed(1);

  // 2. Active Projects: new this month
  const newActiveProjectsThisMonth = investmentData.filter(inv => {
    const d = new Date(inv.date);
    return inv.status === 'Active' && d.getFullYear() === thisYear && d.getMonth() + 1 === thisMonth;
  }).length;

  // 3. Average ROI: change from last quarter
  const roiThisQuarter = investmentData.filter(inv => {
    const d = new Date(inv.date);
    return d.getFullYear() === thisYear && Math.floor(d.getMonth() / 3) + 1 === thisQuarter;
  });
  const roiLastQuarter = investmentData.filter(inv => {
    const d = new Date(inv.date);
    return d.getFullYear() === lastQuarterYear && Math.floor(d.getMonth() / 3) + 1 === lastQuarter;
  });
  const avgROIThisQuarter = roiThisQuarter.length ? (roiThisQuarter.reduce((sum, inv) => sum + (Number(inv.roi) || 0), 0) / roiThisQuarter.length) : 0;
  const avgROILastQuarter = roiLastQuarter.length ? (roiLastQuarter.reduce((sum, inv) => sum + (Number(inv.roi) || 0), 0) / roiLastQuarter.length) : 0;
  const roiChange = avgROILastQuarter === 0 ? 0 : (avgROIThisQuarter - avgROILastQuarter).toFixed(2);

  // 4. Unique states for subtext
  const uniqueStates = new Set(investmentData.map(inv => getState(inv.location))).size;

  // Helper: Group investmentData by month and calculate average ROI
  function getMonthlyROIData(data) {
    const monthMap = {};
    data.forEach(inv => {
      if (!inv.date || inv.roi === undefined || inv.roi === null) return;
      const d = new Date(inv.date);
      const month = d.toLocaleString('default', { month: 'short' });
      const year = d.getFullYear();
      const key = `${year}-${month}`;
      if (!monthMap[key]) monthMap[key] = { month: `${month} ${year}`, roiSum: 0, count: 0 };
      monthMap[key].roiSum += Number(inv.roi) || 0;
      monthMap[key].count += 1;
    });
    // Sort by year and month
    return Object.values(monthMap)
      .sort((a, b) => new Date(a.month) - new Date(b.month))
      .map(item => ({ month: item.month, roi: (item.roiSum / item.count).toFixed(2) }));
  }
  const roiDataDynamic = getMonthlyROIData(investmentData);

  const renderDashboardOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div style={{ background: '#e8f5e8', border: '2px solid #4caf4c', borderRadius: '12px', padding: '24px' }}>
          <div className="flex items-center justify-between">
            <div>
              <p style={{ color: '#15803d' }} className="text-sm font-medium">Total Investment</p>
              <p style={{ color: '#15803d' }} className="text-2xl font-bold">₹{totalInvestment.toLocaleString()}</p>
              <p style={{ color: '#15803d' }} className="text-xs mt-1">
                {totalInvestmentLastMonth === 0 ? 'No data for last month' : `${totalInvestmentChange > 0 ? '↗' : totalInvestmentChange < 0 ? '↘' : '→'} ${Math.abs(totalInvestmentChange)}% from last month`}
              </p>
            </div>
          </div>
        </div>
        <div style={{ background: '#e8f5e8', border: '2px solid #4caf4c', borderRadius: '12px', padding: '24px' }}>
          <div className="flex items-center justify-between">
            <div>
              <p style={{ color: '#15803d' }} className="text-sm font-medium">Active Projects</p>
              <p style={{ color: '#15803d' }} className="text-2xl font-bold">{activeProjects}</p>
              <p style={{ color: '#15803d' }} className="text-xs mt-1">
                {newActiveProjectsThisMonth} new this month
              </p>
            </div>
          </div>
        </div>
        <div style={{ background: '#e8f5e8', border: '2px solid #4caf4c', borderRadius: '12px', padding: '24px' }}>
          <div className="flex items-center justify-between">
            <div>
              <p style={{ color: '#15803d' }} className="text-sm font-medium">Average ROI</p>
              <p style={{ color: '#15803d' }} className="text-2xl font-bold">{averageROI}%</p>
              <p style={{ color: '#15803d' }} className="text-xs mt-1">
                {avgROILastQuarter === 0 ? 'No data for last quarter' : `${roiChange > 0 ? '↗' : roiChange < 0 ? '↘' : '→'} ${Math.abs(roiChange)}% this quarter`}
              </p>
            </div>
          </div>
        </div>
        <div style={{ background: '#e8f5e8', border: '2px solid #4caf4c', borderRadius: '12px', padding: '24px' }}>
          <div className="flex items-center justify-between">
            <div>
              <p style={{ color: '#15803d' }} className="text-sm font-medium">Farmers Supported</p>
              <p style={{ color: '#15803d' }} className="text-2xl font-bold">{farmersSupported}</p>
              <p style={{ color: '#15803d' }} className="text-xs mt-1">
                {uniqueStates > 0 ? `Across ${uniqueStates} state${uniqueStates > 1 ? 's' : ''}` : 'No state data'}
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-green-800">ROI Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={roiDataDynamic.length ? roiDataDynamic : roiData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip />
              <Line type="monotone" dataKey="roi" stroke="#10B981" strokeWidth={3} dot={{ fill: '#10B981' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-green-800">Crop Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={cropData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
              >
                {cropData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* Recent Investments Table */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-green-800">Recent Investments</h3>
          <button className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2 rounded transition-colors duration-200">View All →</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-gray-600 font-medium">Project & Farmer</th>
                <th className="text-left py-3 px-4 text-gray-600 font-medium">Location</th>
                <th className="text-left py-3 px-4 text-gray-600 font-medium">Amount</th>
                <th className="text-left py-3 px-4 text-gray-600 font-medium">ROI</th>
                <th className="text-left py-3 px-4 text-gray-600 font-medium">Status</th>
                <th className="text-left py-3 px-4 text-gray-600 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {loadingInvestments ? (
                <tr><td colSpan="6" className="text-center py-8">Loading investments...</td></tr>
              ) : investmentError ? (
                <tr><td colSpan="6" className="text-center text-red-600 py-8">{investmentError}</td></tr>
              ) : investmentData.length === 0 ? (
                <tr><td colSpan="6" className="text-center text-gray-500 py-8">No investments found.</td></tr>
              ) : (
                investmentData.map((investment, index) => (
                  <tr key={investment.id || index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium text-gray-800">{investment.project_name}</div>
                        <div className="text-sm text-gray-600">{investment.farmer_name}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{investment.location}</td>
                    <td className="py-3 px-4 text-gray-800 font-medium">₹{Number(investment.amount).toLocaleString()}</td>
                    <td className="py-3 px-4 text-green-600 font-medium">{investment.roi ? investment.roi + '%' : '-'}</td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        investment.status === 'Active' ? 'bg-green-100 text-green-800' :
                        investment.status === 'Completed' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {investment.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2 rounded transition-colors duration-200"
                        onClick={() => navigate(`/Investor/investment/${investment.id}`)}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative min-h-screen w-full">
      <InvestorNavbar hideProfileMenu={true} onSidebarToggle={() => setSidebarOpen(!sidebarOpen)} />
      {sidebarOpen && <InvestorSidebar onClose={() => setSidebarOpen(false)} onSectionSelect={setSelectedSection} />}
      <div className={`${sidebarOpen ? 'ml-64' : ''} pt-36 transition-all duration-300 relative z-10`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-8 flex justify-center items-center">
            <h1 className="text-3xl font-bold text-green-800 text-center w-full">
              {selectedSection === 'disbursals' ? 'Monthly Disbursals'
                : selectedSection === 'roi' ? 'Return on Investment'
                : selectedSection === 'risk-grading' ? 'Risk Grading System'
                : selectedSection === 'opportunities' ? 'Investment Opportunities'
                : selectedSection === 'tracker' ? 'Investment Tracker'
                : 'Dashboard'}
            </h1>
          </div>
          {selectedSection === 'disbursals' ? (
            <MonthlyInstallments />
          ) : selectedSection === 'roi' ? (
            <ROI />
          ) : selectedSection === 'risk-grading' ? (
            <RiskGrading />
          ) : selectedSection === 'opportunities' ? (
            <InvestmentOpportunities />
          ) : selectedSection === 'tracker' ? (
            <InvestmentTracker />
          ) : (
            renderDashboardOverview()
          )}
        </div>
      </div>
      <div className={`mt-12${sidebarOpen ? ' ml-64' : ''}`}>
        <FooterSection />
      </div>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          top: '80px', 
          pointerEvents: 'none'
        }}
      >
        <LandingPageCircles />
      </div>
    </div>
  );
} 