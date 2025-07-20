import React from 'react';
import { DollarSign, Calendar, MapPin, Tag, FileText } from 'lucide-react';

const SchemeCard = ({ scheme }) => {
  const getStatusChip = () => {
    switch (scheme.status) {
      case 'Active':
        return <div className="px-2.5 py-1 text-sm font-medium text-emerald-800 bg-emerald-100 rounded-full">{scheme.status}</div>;
      case 'Limited Slots':
        return <div className="px-2.5 py-1 text-sm font-medium text-amber-800 bg-amber-100 rounded-full">{scheme.status}</div>;
      default:
        return <div className="px-2.5 py-1 text-sm font-medium text-gray-800 bg-gray-100 rounded-full">{scheme.status}</div>;
    }
  };

  return (
    <div className="scheme-card bg-white rounded-lg shadow-sm border border-transparent hover:border-emerald-500 transition-all duration-300 overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-bold text-gray-800 mb-2">{scheme.name}</h3>
          {scheme.urgent && <span className="urgent-badge text-xs font-bold text-red-600 bg-red-100 px-2 py-1 rounded-full">URGENT</span>}
        </div>
        
        <div className="flex items-center text-emerald-600 font-semibold mb-4">
          <DollarSign className="w-4 h-4 mr-2" />
          <span>{scheme.benefit}</span>
        </div>

        <div className="space-y-3 text-gray-600 text-sm">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-3 text-gray-400" />
            <span>Deadline: {scheme.deadline}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-3 text-gray-400" />
            <span>{scheme.location}</span>
          </div>
        </div>

        <p className="mt-4 text-gray-600 text-sm line-clamp-3">{scheme.description}</p>
        
        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
          {getStatusChip()}
          <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-md">{scheme.category}</span>
        </div>
      </div>
      
      <div className="px-6 py-4 bg-gray-50">
        <div className="mb-3">
          <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
            <FileText className="w-4 h-4 mr-2 text-gray-400" />
            Required Documents
          </h4>
          <div className="flex flex-wrap gap-2">
            {scheme.documents.map((doc, index) => (
              <span key={index} className="px-2.5 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full">{doc}</span>
            ))}
          </div>
        </div>
        
        <div className="flex items-center gap-3 mt-4">
          <button className="flex-1 text-center bg-emerald-600 text-white font-bold py-2 px-4 rounded-md hover:bg-emerald-700 transition-colors">
            Apply Now
          </button>
          <button className="flex-1 text-center bg-white text-gray-700 font-bold py-2 px-4 rounded-md border border-gray-300 hover:bg-gray-100 transition-colors">
            Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default SchemeCard;