import React from 'react';
import { Search, Filter } from 'lucide-react';

const SearchFilter = ({ searchTerm, setSearchTerm, selectedCategory, setSelectedCategory, schemes }) => {
  const categories = ['All', ...new Set(schemes.map(scheme => scheme.category))];

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search schemes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="filter-select w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md appearance-none bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default SearchFilter;