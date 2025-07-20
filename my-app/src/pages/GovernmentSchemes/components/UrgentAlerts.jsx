import React from 'react';
import { AlertTriangle, Clock } from 'lucide-react';

const UrgentAlerts = ({ urgentSchemes }) => {
  if (urgentSchemes.length === 0) {
    return null;
  }

  return (
    <div className="bg-red-50 border border-red-200 p-6 rounded-lg shadow-sm">
      <div className="flex items-center mb-4">
        <AlertTriangle className="w-6 h-6 text-red-600" />
        <h2 className="text-xl font-semibold text-red-800 ml-3">Urgent Deadlines</h2>
      </div>
      <div className="space-y-4">
        {urgentSchemes.map((scheme) => (
          <div key={scheme.id} className="bg-white p-4 rounded-md border border-red-100">
            <h3 className="font-semibold text-gray-800">{scheme.name}</h3>
            <p className="text-sm text-gray-500 mt-1">Deadline: {scheme.deadline}</p>
            <p className="text-sm font-semibold text-red-600 mt-2">{scheme.benefit}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UrgentAlerts;