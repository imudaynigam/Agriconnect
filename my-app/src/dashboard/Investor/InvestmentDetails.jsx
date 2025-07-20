import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import supabase from '../../supabaseClient';
import InvestorNavbar from './InvestorNavbar';

const InvestmentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [investment, setInvestment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [investorName, setInvestorName] = useState('Investor');

  useEffect(() => {
    const fetchInvestment = async () => {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('investments')
        .select('*')
        .eq('id', id)
        .single();
      if (error || !data) {
        setError('Investment not found.');
        setInvestment(null);
      } else {
        setInvestment(data);
      }
      setLoading(false);
    };
    fetchInvestment();
    // Fetch real user name
    const fetchUserName = async () => {
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
      if (authError || !authUser) return;
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', authUser.id)
        .single();
      if (profile && profile.full_name) {
        setInvestorName(profile.full_name);
      } else if (authUser.user_metadata && authUser.user_metadata.fullName) {
        setInvestorName(authUser.user_metadata.fullName);
      }
    };
    fetchUserName();
  }, [id]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-[40vh]">Loading...</div>;
  }
  if (error) {
    return <div className="text-center text-red-600 py-12">{error}</div>;
  }
  if (!investment) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <InvestorNavbar investorName={investorName} hideSidebarToggle={true} hideProfileMenu={true} />
      <div className="flex flex-col items-center justify-center flex-grow py-12 px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-xl w-full border border-gray-200">
          <button onClick={() => navigate(-1)} className="mb-6 text-green-800 hover:underline">← Back</button>
          <h2 className="text-2xl font-bold text-green-800 mb-4">Investment Details</h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="font-semibold text-gray-700">Project Name:</span>
              <span className="text-gray-900">{investment.project_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-gray-700">Farmer Name:</span>
              <span className="text-gray-900">{investment.farmer_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-gray-700">Amount:</span>
              <span className="text-green-700 font-bold">₹{Number(investment.amount).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-gray-700">Date of Investment:</span>
              <span className="text-gray-900">{investment.date}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-gray-700">Status:</span>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                investment.status === 'Active' ? 'bg-green-100 text-green-800' :
                investment.status === 'Completed' ? 'bg-blue-100 text-blue-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {investment.status}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-gray-700">ROI:</span>
              <span className="text-green-700">{investment.roi ? investment.roi + '%' : '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-gray-700">Location:</span>
              <span className="text-gray-900">{investment.location}</span>
            </div>
            {investment.purpose && (
              <div className="flex justify-between">
                <span className="font-semibold text-gray-700">Purpose:</span>
                <span className="text-gray-900">{investment.purpose}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestmentDetails; 