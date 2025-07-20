import React, { useState } from 'react'

const MonthlyInstallments = () => {
  const [selectedFilter, setSelectedFilter] = useState('all')
  // Add state for month and year selection
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  
  // Sample farmer installment data
  const farmersData = [
    {
      id: 'AGR001',
      name: 'Rajesh Kumar',
      totalAmount: 120000,
      monthlyAmount: 10000,
      installmentsPaid: 8,
      totalInstallments: 12,
      status: 'active',
      nextDue: '2025-07-15',
      location: 'Punjab'
    },
    {
      id: 'AGR002', 
      name: 'Priya Sharma',
      totalAmount: 80000,
      monthlyAmount: 6667,
      installmentsPaid: 12,
      totalInstallments: 12,
      status: 'completed',
      nextDue: null,
      location: 'Haryana'
    },
    {
      id: 'AGR003',
      name: 'Amit Patel',
      totalAmount: 150000,
      monthlyAmount: 12500,
      installmentsPaid: 3,
      totalInstallments: 12,
      status: 'active',
      nextDue: '2024-07-20',
      location: 'Gujarat'
    },
    {
      id: 'AGR004',
      name: 'Sunita Devi',
      totalAmount: 90000,
      monthlyAmount: 7500,
      installmentsPaid: 5,
      totalInstallments: 12,
      status: 'pending',
      nextDue: '2024-06-28',
      location: 'Bihar'
    },
    {
      id: 'AGR005',
      name: 'Kiran Singh',
      totalAmount: 200000,
      monthlyAmount: 16667,
      installmentsPaid: 12,
      totalInstallments: 12,
      status: 'completed',
      nextDue: null,
      location: 'Uttar Pradesh'
    },
    {
      id: 'AGR006',
      name: 'Meera Joshi',
      totalAmount: 110000,
      monthlyAmount: 9167,
      installmentsPaid: 6,
      totalInstallments: 12,
      status: 'active',
      nextDue: '2024-07-10',
      location: 'Maharashtra'
    }
  ]

  // Get all years from farmersData nextDue
  const yearsSet = new Set();
  farmersData.forEach(farmer => {
    if (farmer.nextDue) {
      yearsSet.add(new Date(farmer.nextDue).getFullYear());
    }
  });
  const yearsArray = Array.from(yearsSet).sort((a, b) => a - b);

  const getFilteredFarmers = () => {
    if (selectedFilter === 'all') return farmersData
    return farmersData.filter(farmer => farmer.status === selectedFilter)
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return '#4caf4c'
      case 'completed': return '#2196f3'
      case 'pending': return '#ff9800'
      default: return '#757575'
    }
  }

  const getStatusBadge = (status) => {
    const colors = {
      active: { bg: '#e8f5e8', text: '#2e7d2e' },
      completed: { bg: '#e3f2fd', text: '#1976d2' },
      pending: { bg: '#fff3e0', text: '#f57c00' }
    }
    return colors[status] || { bg: '#f5f5f5', text: '#757575' }
  }

  const getStatusIcon = (status) => {
    switch(status) {
      case 'active': return ''
      case 'completed': return ''
      case 'pending': return ''
      default: return ''
    }
  }

  const getLocationIcon = (location) => {
    const locationIcons = {
      'Punjab': '',
      'Haryana': '',
      'Gujarat': '',
      'Bihar': '',
      'Uttar Pradesh': '',
      'Maharashtra': ''
    }
    return locationIcons[location]
  }

  const totalFarmers = farmersData.length
  const activeFarmers = farmersData.filter(f => f.status === 'active').length
  const completedFarmers = farmersData.filter(f => f.status === 'completed').length
  const pendingFarmers = farmersData.filter(f => f.status === 'pending').length
  const totalAmountDisbursed = farmersData.reduce((sum, farmer) => sum + (farmer.monthlyAmount * farmer.installmentsPaid), 0)

  // CSV download function (updated to use selectedMonth/selectedYear)
  const downloadMonthlyReport = () => {
    const monthlyData = farmersData.filter(farmer => {
      if (!farmer.nextDue) return false;
      const dueDate = new Date(farmer.nextDue);
      return dueDate.getMonth() + 1 === Number(selectedMonth) && dueDate.getFullYear() === Number(selectedYear);
    });

    // Prepare CSV header
    const header = ['ID', 'Name', 'Total Amount', 'Monthly Amount', 'Installments Paid', 'Total Installments', 'Status', 'Next Due', 'Location'];
    const rows = monthlyData.map(farmer => [
      farmer.id,
      farmer.name,
      farmer.totalAmount,
      farmer.monthlyAmount,
      farmer.installmentsPaid,
      farmer.totalInstallments,
      farmer.status,
      farmer.nextDue,
      farmer.location
    ]);

    // Convert to CSV string
    const csvContent = [header, ...rows]
      .map(e => e.map(field => `"${field}"`).join(','))
      .join('\n');

    // Trigger download
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `monthly_installments_report_${selectedYear}_${selectedMonth}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      {/* <InvestorNavbar hideProfileMenu={true} /> */}
      <div className="max-w-7xl mx-auto px-4" style={{marginTop: '80px'}}>
        <div className="installments-card">
          <p className="text-lg text-green-600 mb-6 text-center font-bold">Track monthly installments, monitor farmer progress, and manage agricultural investments with real-time data</p>
          
          <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
            <div className="stat-card" style={{ background: '#e8f5e8', padding: '20px', borderRadius: '12px', textAlign: 'center', border: '2px solid #4caf4c' }}>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#15803d', marginBottom: '8px' }}>{totalFarmers}</div>
              <div style={{ color: '#15803d', fontWeight: '500' }}>Total Farmers</div>
            </div>
            <div className="stat-card" style={{ background: '#e8f5e8', padding: '20px', borderRadius: '12px', textAlign: 'center', border: '2px solid #4caf4c' }}>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#15803d', marginBottom: '8px' }}>{activeFarmers}</div>
              <div style={{ color: '#15803d', fontWeight: '500' }}>Active</div>
            </div>
            <div className="stat-card" style={{ background: '#e8f5e8', padding: '20px', borderRadius: '12px', textAlign: 'center', border: '2px solid #4caf4c' }}>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#15803d', marginBottom: '8px' }}>{completedFarmers}</div>
              <div style={{ color: '#15803d', fontWeight: '500' }}>Completed</div>
            </div>
            <div className="stat-card" style={{ background: '#e8f5e8', padding: '20px', borderRadius: '12px', textAlign: 'center', border: '2px solid #4caf4c' }}>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#15803d', marginBottom: '8px' }}>{pendingFarmers}</div>
              <div style={{ color: '#15803d', fontWeight: '500' }}>Pending</div>
            </div>
            <div className="stat-card" style={{ background: '#e8f5e8', padding: '20px', borderRadius: '12px', textAlign: 'center', border: '2px solid #4caf4c' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#15803d', marginBottom: '8px' }}>₹{totalAmountDisbursed.toLocaleString()}</div>
              <div style={{ color: '#15803d', fontWeight: '500' }}>Total Disbursed</div>
            </div>
          </div>

          {/* Filter Buttons */}
          <div style={{ marginBottom: '25px', display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '18px', marginRight: '10px' }}>Filter by:</span>
            {['all', 'active', 'completed', 'pending'].map(filter => {
              const filterIcons = {
                all: '',
                active: '',
                completed: '',
                pending: ''
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
                    filter === 'active' ? activeFarmers :
                    filter === 'completed' ? completedFarmers : pendingFarmers})
                </button>
              )
            })}
          </div>

          {/* Farmers Table */}
          <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#15803d', color: 'white' }}>
                  <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      Farmer ID
                    </span>
                  </th>
                  <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      Name
                    </span>
                  </th>
                  <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      Location
                    </span>
                  </th>
                  <th style={{ padding: '15px', textAlign: 'right', fontWeight: '600' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-end' }}>
                      Monthly Amount
                    </span>
                  </th>
                  <th style={{ padding: '15px', textAlign: 'center', fontWeight: '600' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                      Progress
                    </span>
                  </th>
                  <th style={{ padding: '15px', textAlign: 'center', fontWeight: '600' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                      Status
                    </span>
                  </th>
                  <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      Next Due
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {getFilteredFarmers().map((farmer, index) => {
                  const badge = getStatusBadge(farmer.status)
                  const progress = (farmer.installmentsPaid / farmer.totalInstallments) * 100
                  
                  return (
                    <tr key={farmer.id} style={{ borderBottom: '1px solid #f0f0f0', background: index % 2 === 0 ? '#fafafa' : 'white' }}>
                      <td style={{ padding: '15px', fontWeight: '600', color: '#2e7d2e' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {farmer.id}
                        </span>
                      </td>
                      <td style={{ padding: '15px', fontWeight: '500' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {farmer.name}
                        </span>
                      </td>
                      <td style={{ padding: '15px', color: '#666' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {getLocationIcon(farmer.location)} {farmer.location}
                        </span>
                      </td>
                      <td style={{ padding: '15px', textAlign: 'right', fontWeight: '600' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-end' }}>
                          ₹{farmer.monthlyAmount.toLocaleString()}
                        </span>
                      </td>
                      <td style={{ padding: '15px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
                            <span style={{ fontSize: '14px' }}></span>
                            <div style={{ width: '80px', height: '8px', background: '#e0e0e0', borderRadius: '4px' }}>
                              <div style={{ width: `${progress}%`, height: '100%', background: '#4caf4c', borderRadius: '4px' }}></div>
                            </div>
                          </div>
                          <span style={{ fontSize: '12px', color: '#666' }}>{farmer.installmentsPaid}/{farmer.totalInstallments}</span>
                        </div>
                      </td>
                      <td style={{ padding: '15px', textAlign: 'center' }}>
                        <span style={{
                          padding: '6px 12px',
                          borderRadius: '15px',
                          fontSize: '12px',
                          fontWeight: '600',
                          background: badge.bg,
                          color: badge.text,
                          textTransform: 'uppercase',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          {getStatusIcon(farmer.status)} {farmer.status}
                        </span>
                      </td>
                      <td style={{ padding: '15px', color: farmer.status === 'pending' ? '#f57c00' : '#666' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {farmer.nextDue ? '' : ''} {farmer.nextDue || 'N/A'}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          {/* Add gap after the farmer table */}
          <div style={{ marginBottom: '32px' }}></div>

          {/* Monthly Report Generator Section */}
          <div className="max-w-7xl mx-auto px-4" style={{
            marginBottom: '32px',
            width: '100%',
            background: '#ffffff',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            padding: '32px 24px',
            border: '1.5px solid #d1fae5',
            textAlign: 'center',
            boxSizing: 'border-box'
          }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#15803d', marginBottom: '48px' }}>Monthly Report</h2>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '70px', width: '100%', marginBottom: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <label style={{ fontWeight: 'bold' }}>Select Month:</label>
                <select value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)} style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #ccc' }}>
                  {[...Array(12)].map((_, i) => (
                    <option key={i+1} value={i+1}>{new Date(0, i).toLocaleString('default', { month: 'long' })}</option>
                  ))}
                </select>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <label style={{ fontWeight: 'bold' }}>Select Year:</label>
                <select value={selectedYear} onChange={e => setSelectedYear(e.target.value)} style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #ccc' }}>
                  {yearsArray.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
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
                onClick={downloadMonthlyReport}
              >
                Download
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default MonthlyInstallments