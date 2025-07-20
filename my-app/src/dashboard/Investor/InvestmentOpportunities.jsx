import React, { useState } from 'react'

const InvestmentOpportunities = () => {
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [fundedFarmers, setFundedFarmers] = useState(new Set())
  
  // Sample farmer investment opportunities data
  const farmersData = [
    {
      id: 'FARM001',
      name: 'Rajesh Kumar',
      location: 'Punjab',
      crop: 'Wheat',
      landSize: '15 acres',
      fundingRequired: 120000,
      expectedROI: '24%',
      riskLevel: 'Low',
      duration: '12 months',
      description: 'Organic wheat farming with modern irrigation system',
      experience: '8 years',
      previousHarvest: 'Good',
      status: 'seeking'
    },
    {
      id: 'FARM002', 
      name: 'Priya Sharma',
      location: 'Haryana',
      crop: 'Rice',
      landSize: '12 acres',
      fundingRequired: 80000,
      expectedROI: '28%',
      riskLevel: 'Medium',
      duration: '10 months',
      description: 'Basmati rice cultivation with organic practices',
      experience: '5 years',
      previousHarvest: 'Excellent',
      status: 'seeking'
    },
    {
      id: 'FARM003',
      name: 'Amit Patel',
      location: 'Gujarat',
      crop: 'Cotton',
      landSize: '20 acres',
      fundingRequired: 150000,
      expectedROI: '32%',
      riskLevel: 'Medium',
      duration: '14 months',
      description: 'BT cotton farming with drip irrigation',
      experience: '12 years',
      previousHarvest: 'Good',
      status: 'seeking'
    },
    {
      id: 'FARM004',
      name: 'Sunita Devi',
      location: 'Bihar',
      crop: 'Sugarcane',
      landSize: '8 acres',
      fundingRequired: 90000,
      expectedROI: '26%',
      riskLevel: 'Low',
      duration: '18 months',
      description: 'Sugarcane farming with organic fertilizers',
      experience: '6 years',
      previousHarvest: 'Average',
      status: 'seeking'
    },
    {
      id: 'FARM005',
      name: 'Kiran Singh',
      location: 'Uttar Pradesh',
      crop: 'Potato',
      landSize: '10 acres',
      fundingRequired: 110000,
      expectedROI: '30%',
      riskLevel: 'High',
      duration: '8 months',
      description: 'Potato farming with cold storage facility',
      experience: '10 years',
      previousHarvest: 'Excellent',
      status: 'seeking'
    },
    {
      id: 'FARM006',
      name: 'Meera Joshi',
      location: 'Maharashtra',
      crop: 'Soybean',
      landSize: '18 acres',
      fundingRequired: 130000,
      expectedROI: '22%',
      riskLevel: 'Low',
      duration: '12 months',
      description: 'Soybean cultivation with crop rotation',
      experience: '7 years',
      previousHarvest: 'Good',
      status: 'seeking'
    }
  ]

  const getFilteredFarmers = () => {
    if (selectedFilter === 'all') return farmersData
    return farmersData.filter(farmer => farmer.riskLevel.toLowerCase() === selectedFilter)
  }

  const getRiskColor = (riskLevel) => {
    switch(riskLevel.toLowerCase()) {
      case 'low': return '#4caf4c'
      case 'medium': return '#ff9800'
      case 'high': return '#f44336'
      default: return '#757575'
    }
  }

  const getRiskBadge = (riskLevel) => {
    const colors = {
      low: { bg: '#e8f5e8', text: '#2e7d2e' },
      medium: { bg: '#fff3e0', text: '#f57c00' },
      high: { bg: '#ffebee', text: '#d32f2f' }
    }
    return colors[riskLevel.toLowerCase()] || { bg: '#f5f5f5', text: '#757575' }
  }

  const getCropIcon = (crop) => {
    return ''
  }

  const getLocationIcon = (location) => {
    return ''
  }

  const handleFundFarmer = (farmerId) => {
    setFundedFarmers(prev => new Set([...prev, farmerId]))
    // Here you would typically make an API call to fund the farmer
    alert(`Funding request sent for ${farmerId}!`)
  }

  const totalFarmers = farmersData.length
  const lowRiskFarmers = farmersData.filter(f => f.riskLevel.toLowerCase() === 'low').length
  const mediumRiskFarmers = farmersData.filter(f => f.riskLevel.toLowerCase() === 'medium').length
  const highRiskFarmers = farmersData.filter(f => f.riskLevel.toLowerCase() === 'high').length
  const totalFundingRequired = farmersData.reduce((sum, farmer) => sum + farmer.fundingRequired, 0)
  const averageROI = (farmersData.reduce((sum, farmer) => sum + parseFloat(farmer.expectedROI), 0) / farmersData.length).toFixed(1)

  return (
    <>
      <div className="max-w-7xl mx-auto px-4" style={{marginTop: '80px'}}>
        <div className="opportunities-card">
          <p className="text-lg text-green-600 mb-6 text-center font-bold">Discover promising agricultural investment opportunities and support farmers with transparent funding options</p>
          
          <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
            <div className="stat-card text-green-700 text-center font-bold" style={{ background: '#e8f5e8', padding: '20px', borderRadius: '12px', border: '2px solid #4caf4c' }}>
              <div className="text-3xl mb-2">{totalFarmers}</div>
              <div className="text-lg">Farmers Seeking</div>
            </div>
            <div className="stat-card text-green-700 text-center font-bold" style={{ background: '#e8f5e8', padding: '20px', borderRadius: '12px', border: '2px solid #4caf4c' }}>
              <div className="text-2xl mb-2">₹{totalFundingRequired.toLocaleString()}</div>
              <div className="text-lg">Total Funding</div>
            </div>
            <div className="stat-card text-green-700 text-center font-bold" style={{ background: '#e8f5e8', padding: '20px', borderRadius: '12px', border: '2px solid #4caf4c' }}>
              <div className="text-3xl mb-2">{averageROI}%</div>
              <div className="text-lg">Avg. ROI</div>
            </div>
            <div className="stat-card text-green-700 text-center font-bold" style={{ background: '#e8f5e8', padding: '20px', borderRadius: '12px', border: '2px solid #4caf4c' }}>
              <div className="text-3xl mb-2">6</div>
              <div className="text-lg">Crop Types</div>
            </div>
            <div className="stat-card text-green-700 text-center font-bold" style={{ background: '#e8f5e8', padding: '20px', borderRadius: '12px', border: '2px solid #4caf4c' }}>
              <div className="text-3xl mb-2">{lowRiskFarmers}</div>
              <div className="text-lg">Low Risk</div>
            </div>
          </div>

          {/* Filter Buttons */}
          <div style={{ marginBottom: '25px', display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '18px', marginRight: '10px' }}>Filter by Risk:</span>
            {['all', 'low', 'medium', 'high'].map(filter => {
              const filterIcons = {
                all: '',
                low: '',
                medium: '',
                high: ''
              }
              const isSelected = selectedFilter === filter;
              return (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter)}
                  style={{
                    padding: '8px 16px',
                    border: isSelected ? '2px solid #15803d' : '2px solid #ddd',
                    background: isSelected ? '#15803d' : 'white',
                    color: isSelected ? 'white' : '#333',
                    borderRadius: '20px',
                    cursor: 'pointer',
                    fontWeight: '500',
                    textTransform: 'capitalize',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'background 0.2s, color 0.2s',
                  }}
                  onMouseOver={e => {
                    if (!isSelected) {
                      e.currentTarget.style.background = '#166534';
                      e.currentTarget.style.color = 'white';
                    }
                  }}
                  onMouseOut={e => {
                    if (!isSelected) {
                      e.currentTarget.style.background = 'white';
                      e.currentTarget.style.color = '#333';
                    }
                  }}
                >
                  <span>{filterIcons[filter]}</span>
                  {filter} ({filter === 'all' ? totalFarmers : 
                    filter === 'low' ? lowRiskFarmers :
                    filter === 'medium' ? mediumRiskFarmers : highRiskFarmers})
                </button>
              )
            })}
          </div>

          {/* Farmers Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
            {getFilteredFarmers().map((farmer, index) => {
              const riskBadge = getRiskBadge(farmer.riskLevel)
              const isFunded = fundedFarmers.has(farmer.id)
              
              return (
                <div key={farmer.id} style={{ 
                  background: 'white', 
                  borderRadius: '12px', 
                  padding: '20px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  border: '2px solid #f0f0f0',
                  transition: 'transform 0.2s, box-shadow 0.2s'
                }}
                onMouseOver={e => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.15)'
                }}
                onMouseOut={e => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                    <div>
                      <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#2e7d2e', marginBottom: '5px' }}>
                        {farmer.name}
                      </h3>
                      <p style={{ color: '#666', fontSize: '14px' }}>
                        {farmer.location}
                      </p>
                    </div>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '10px',
                      fontWeight: '600',
                      background: riskBadge.bg,
                      color: riskBadge.text,
                      textTransform: 'uppercase'
                    }}>
                      {farmer.riskLevel} Risk
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                    <div>
                      <p style={{ fontSize: '12px', color: '#666', marginBottom: '2px' }}>Crop</p>
                      <p style={{ fontSize: '14px', fontWeight: '500' }}>
                        {farmer.crop}
                      </p>
                    </div>
                    <div>
                      <p style={{ fontSize: '12px', color: '#666', marginBottom: '2px' }}>Land Size</p>
                      <p style={{ fontSize: '14px', fontWeight: '500' }}>{farmer.landSize}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '12px', color: '#666', marginBottom: '2px' }}>Funding Required</p>
                      <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#2e7d2e' }}>
                        ₹{farmer.fundingRequired.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p style={{ fontSize: '12px', color: '#666', marginBottom: '2px' }}>Expected ROI</p>
                      <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#1976d2' }}>
                        {farmer.expectedROI}
                      </p>
                    </div>
                    <div>
                      <p style={{ fontSize: '12px', color: '#666', marginBottom: '2px' }}>Duration</p>
                      <p style={{ fontSize: '14px', fontWeight: '500' }}>{farmer.duration}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '12px', color: '#666', marginBottom: '2px' }}>Experience</p>
                      <p style={{ fontSize: '14px', fontWeight: '500' }}>{farmer.experience}</p>
                    </div>
                  </div>

                  <div style={{ marginBottom: '15px' }}>
                    <p style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>Project Description</p>
                    <p style={{ fontSize: '13px', color: '#333', lineHeight: '1.4' }}>
                      {farmer.description}
                    </p>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p style={{ fontSize: '12px', color: '#666', marginBottom: '2px' }}>Previous Harvest</p>
                      <p style={{ fontSize: '13px', fontWeight: '500' }}>{farmer.previousHarvest}</p>
                    </div>
                    <button
                      onClick={() => handleFundFarmer(farmer.id)}
                      disabled={isFunded}
                      style={{
                        padding: '10px 20px',
                        borderRadius: '8px',
                        fontWeight: 'bold',
                        fontSize: '14px',
                        border: 'none',
                        cursor: isFunded ? 'not-allowed' : 'pointer',
                        transition: 'background 0.2s',
                        background: isFunded ? '#4caf4c' : '#15803d',
                        color: 'white',
                        opacity: isFunded ? 0.7 : 1
                      }}
                      onMouseOver={e => {
                        if (!isFunded) {
                          e.currentTarget.style.background = '#166534'
                        }
                      }}
                      onMouseOut={e => {
                        if (!isFunded) {
                          e.currentTarget.style.background = '#15803d'
                        }
                      }}
                    >
                      {isFunded ? 'Funded ✓' : 'Fund This Farmer'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          <div style={{ textAlign: 'center', marginTop: '30px' }}>
            <button 
              className="cta-button"
              style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '10px', 
                background: '#15803d',
                color: 'white',
                padding: '12px 28px',
                borderRadius: '8px',
                fontWeight: 'bold',
                fontSize: '1.1rem',
                border: 'none',
                boxShadow: '0 2px 8px rgba(34,197,94,0.08)',
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}
              onMouseOver={e => e.currentTarget.style.background = '#166534'}
              onMouseOut={e => e.currentTarget.style.background = '#15803d'}
            >
              View All Opportunities
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default InvestmentOpportunities 