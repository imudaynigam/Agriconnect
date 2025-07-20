import React, { useEffect, useState } from 'react';
import supabase from '../../supabaseClient';

const InvestmentTracker = () => {
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInvestments = async () => {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('investments')
        .select('*')
        .order('date', { ascending: false });
      if (error) {
        setError('Failed to fetch investments.');
        setInvestments([]);
      } else {
        setInvestments(data || []);
      }
      setLoading(false);
    };
    fetchInvestments();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4" style={{ marginTop: '80px' }}>
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-700"></div>
        </div>
      ) : error ? (
        <div className="text-red-600 text-center py-8">{error}</div>
      ) : investments.length === 0 ? (
        <div className="text-gray-500 text-center py-8">No investments found.</div>
      ) : (
        <div className="overflow-x-auto rounded-xl shadow border border-gray-200 bg-white">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-green-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-green-800 uppercase tracking-wider">Farmer</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-green-800 uppercase tracking-wider">Project</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-green-800 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-green-800 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-green-800 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-green-800 uppercase tracking-wider">ROI</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-green-800 uppercase tracking-wider">Location</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {investments.map((inv) => (
                <tr key={inv.id}>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-800">{inv.farmer_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">{inv.project_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-green-700 font-bold">₹{Number(inv.amount).toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">{inv.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      inv.status === 'Active' ? 'bg-green-100 text-green-800' :
                      inv.status === 'Completed' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-green-700 font-medium">{inv.roi ? inv.roi + '%' : '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">{inv.location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default InvestmentTracker; 