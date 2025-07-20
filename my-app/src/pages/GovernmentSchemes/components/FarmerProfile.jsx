import React from 'react';
import { User, MapPin, Minimize2 } from 'lucide-react';

const FarmerProfile = ({ profile }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center mb-4">
        <div className="bg-blue-100 p-2 rounded-full">
          <User className="w-6 h-6 text-blue-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-800 ml-4">Farmer Profile</h2>
      </div>
      <div className="space-y-3 text-gray-600">
        <div className="flex items-center">
          <User className="w-4 h-4 mr-3 text-gray-400" />
          <span>{profile.name}</span>
        </div>
        <div className="flex items-center">
          <MapPin className="w-4 h-4 mr-3 text-gray-400" />
          <span>{profile.location}</span>
        </div>
        <div className="flex items-center">
          <Minimize2 className="w-4 h-4 mr-3 text-gray-400" />
          <span>{profile.farmSize}</span>
        </div>
      </div>
    </div>
  );
};

export default FarmerProfile;