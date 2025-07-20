import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, Area, AreaChart } from 'recharts';
import { TrendingUp, Calendar, Banknote, Sprout, Target, Activity } from 'lucide-react';
const Return = () => {
  const [animatedValues, setAnimatedValues] = useState({
    investment: 0,
    revenue: 0,
    profit: 0
  });
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedValues({
        investment: 100000,
        revenue: 180000,
        profit: 48000
      });
    }, 500);
    return () => clearTimeout(timer);
  }, []);
  const monthlyData = [
    { month: 'Jan', investment: 20000, revenue: 0, profit: -20000 },
    { month: 'Feb', investment: 40000, revenue: 0, profit: -40000 },
    { month: 'Mar', investment: 60000, revenue: 0, profit: -60000 },
    { month: 'Apr', investment: 80000, revenue: 0, profit: -80000 },
    { month: 'May', investment: 100000, revenue: 120000, profit: 20000 },
    { month: 'Jun', investment: 100000, revenue: 180000, profit: 48000 }
  ];
  const cropStages = [
    { stage: 'Preparation', completion: 100, color: '#10b981' },
    { stage: 'Sowing', completion: 100, color: '#3b82f6' },
    { stage: 'Growing', completion: 85, color: '#f59e0b' },
    { stage: 'Harvesting', completion: 75, color: '#ef4444' },
    { stage: 'Marketing', completion: 60, color: '#8b5cf6' }
  ];

  const expenseBreakdown = [
    { name: 'Seeds & Planting', value: 25000, color: '#10b981' },
    { name: 'Fertilizers', value: 30000, color: '#3b82f6' },
    { name: 'Equipment', value: 20000, color: '#f59e0b' },
    { name: 'Labor', value: 15000, color: '#ef4444' },
    { name: 'Irrigation', value: 10000, color: '#8b5cf6' }
  ];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(value);
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f0fdf4 0%, #eff6ff 50%, #faf5ff 100%)',
      padding: '24px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start'
    },
    maxWidth: {
      width: '100%',
      maxWidth: '1400px',
      margin: '0 auto'
    },
    header: {
      textAlign: 'center',
      marginBottom: '40px'
    },
    headerTitle: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '16px'
    },
    headerIcon: {
      padding: '12px',
      background: 'linear-gradient(135deg, #10b981, #3b82f6)',
      borderRadius: '16px',
      marginRight: '16px',
      display: 'flex',
      alignItems: 'center'
    },
    title: {
      fontSize: '48px',
      fontWeight: 'bold',
      background: 'linear-gradient(135deg, #059669, #2563eb)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      margin: 0
    },
    subtitle: {
      color: '#6b7280',
      fontSize: '18px',
      margin: 0
    },
    grid: {
      display: 'grid',
      gap: '24px',
      marginBottom: '32px',
      width: '100%'
    },
    grid3: {
      gridTemplateColumns: 'repeat(3, 1fr)',
      '@media (max-width: 1024px)': {
        gridTemplateColumns: 'repeat(2, 1fr)'
      },
      '@media (max-width: 768px)': {
        gridTemplateColumns: '1fr'
      }
    },
    grid2: {
      gridTemplateColumns: 'repeat(2, 1fr)',
      '@media (max-width: 768px)': {
        gridTemplateColumns: '1fr'
      }
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '20px',
      padding: '24px',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
      border: '1px solid #f3f4f6',
      transition: 'all 0.3s ease',
      position: 'relative',
      width: '100%'
    },
    cardHover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)'
    },
    cardHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '20px'
    },
    iconBox: {
      padding: '16px',
      borderRadius: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    statTitle: {
      color: '#6b7280',
      fontSize: '14px',
      fontWeight: '500',
      marginBottom: '8px'
    },
    statValue: {
      fontSize: '32px',
      fontWeight: 'bold',
      color: '#111827',
      marginBottom: '4px'
    },
    statSubtitle: {
      color: '#9ca3af',
      fontSize: '14px'
    },
    trend: {
      display: 'flex',
      alignItems: 'center',
      color: '#059669',
      fontSize: '14px',
      fontWeight: '600',
      backgroundColor: '#ecfdf5',
      padding: '6px 12px',
      borderRadius: '20px'
    },
    chartTitle: {
      fontSize: '20px',
      fontWeight: 'bold',
      color: '#111827',
      marginBottom: '20px',
      display: 'flex',
      alignItems: 'center'
    },
    timelineItem: {
      display: 'flex',
      alignItems: 'center',
      padding: '16px',
      borderRadius: '12px',
      backgroundColor: '#f9fafb',
      marginBottom: '12px',
      transition: 'all 0.2s ease'
    },
    timelineIcon: {
      fontSize: '24px',
      marginRight: '16px'
    },
    timelineContent: {
      flex: 1
    },
    timelineTitle: {
      fontWeight: '600',
      color: '#111827',
      marginBottom: '4px'
    },
    timelineDate: {
      color: '#6b7280',
      fontSize: '14px'
    },
    timelineStatus: {
      padding: '4px 12px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '500'
    },
    progressContainer: {
      padding: '16px',
      borderRadius: '12px',
      backgroundColor: '#f9fafb',
      marginBottom: '12px'
    },
    progressHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '8px'
    },
    progressLabel: {
      fontWeight: '500',
      color: '#111827'
    },
    progressPercent: {
      fontSize: '14px',
      fontWeight: '600'
    },
    progressBar: {
      width: '100%',
      height: '8px',
      backgroundColor: '#e5e7eb',
      borderRadius: '4px',
      overflow: 'hidden'
    },
    progressFill: {
      height: '100%',
      borderRadius: '4px',
      transition: 'width 1s ease-out'
    },
    legendGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '8px',
      marginTop: '16px'
    },
    legendItem: {
      display: 'flex',
      alignItems: 'center'
    },
    legendColor: {
      width: '12px',
      height: '12px',
      borderRadius: '50%',
      marginRight: '8px'
    },
    legendText: {
      fontSize: '14px',
      color: '#6b7280'
    },
    summaryCard: {
      marginTop: '32px',
      background: 'linear-gradient(135deg, #059669, #10b981)',
      borderRadius: '20px',
      padding: '32px',
      color: 'white',
      textAlign: 'center',
      width: '100%'
    },
    summaryTitle: {
      fontSize: '28px',
      fontWeight: 'bold',
      marginBottom: '8px'
    },
    summarySubtitle: {
      color: 'rgba(255, 255, 255, 0.8)',
      marginBottom: '24px',
      fontSize: '16px'
    },
    summaryGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '16px',
      '@media (max-width: 768px)': {
        gridTemplateColumns: 'repeat(2, 1fr)'
      }
    },
    summaryItem: {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      borderRadius: '12px',
      padding: '20px'
    },
    summaryItemTitle: {
      fontSize: '16px',
      fontWeight: '600',
      marginBottom: '8px'
    },
    summaryItemValue: {
      fontSize: '24px',
      fontWeight: 'bold'
    }
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, gradient, trend }) => (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <div style={{...styles.iconBox, background: gradient}}>
          <Icon color="white" size={24} />
        </div>
        {trend && (
          <div style={styles.trend}>
            <TrendingUp size={16} style={{marginRight: '4px'}} />
            {trend}
          </div>
        )}
      </div>
      <div>
        <h3 style={styles.statTitle}>{title}</h3>
        <p style={styles.statValue}>{value}</p>
        {subtitle && <p style={styles.statSubtitle}>{subtitle}</p>}
      </div>
    </div>
  );

  return (
    <div style={{ position: 'relative', minHeight: '100vh', width: '100%' }}>
      <div style={{ position: 'relative', zIndex: 1, ...styles.maxWidth }}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerTitle}>
            {/* Removed the icon below the heading */}
          </div>
          <p className="text-lg text-green-600 mb-6 text-center font-bold">Track your farming investment performance and crop lifecycle</p>
        </div>

        {/* Main Stats */}
        <div style={{...styles.grid, ...styles.grid3}}>
          <StatCard
            icon={Banknote}
            title="Total Investment"
            value={formatCurrency(animatedValues.investment)}
            gradient="linear-gradient(135deg, #3b82f6, #1d4ed8)"
            trend="+15%"
          />
          <StatCard
            icon={TrendingUp}
            title="Sales Revenue"
            value={formatCurrency(animatedValues.revenue)}
            gradient="linear-gradient(135deg, #10b981, #047857)"
            trend="+80%"
          />
          <StatCard
            icon={Target}
            title="Your Profit (48%)"
            value={formatCurrency(animatedValues.profit)}
            subtitle="ROI: 48% in 5 months"
            gradient="linear-gradient(135deg, #8b5cf6, #7c3aed)"
            trend="+48%"
          />
        </div>

        {/* Charts Section */}
        <div style={{...styles.grid, ...styles.grid2}}>
          {/* Revenue Trend Chart */}
          <div style={styles.card}>
            <h3 style={styles.chartTitle}>
              
              <Activity color="#3b82f6" size={24} style={{marginRight: '8px'}} />
              Investment vs Revenue Trend
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#666" />
                <YAxis stroke="#666" tickFormatter={(value) => `₹${value/1000}K`} />
                <Tooltip formatter={(value) => [formatCurrency(value), '']} />
                <Area
                  type="monotone"
                  dataKey="investment"
                  stackId="1"
                  stroke="#3b82f6"
                  fill="url(#investmentGradient)"
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stackId="2"
                  stroke="#10b981"
                  fill="url(#revenueGradient)"
                />
                <defs>
                  <linearGradient id="investmentGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Expense Breakdown */}
          <div style={styles.card}>
            <h3 style={styles.chartTitle}>
              <Banknote color="#8b5cf6" size={24} style={{marginRight: '8px'}} />
              Investment Breakdown
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={expenseBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {expenseBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
            <div style={styles.legendGrid}>
              {expenseBreakdown.map((item, index) => (
                <div key={index} style={styles.legendItem}>
                  <div style={{...styles.legendColor, backgroundColor: item.color}}></div>
                  <span style={styles.legendText}>{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Crop Timeline and Progress */}
        <div style={{...styles.grid, ...styles.grid2}}>
          {/* Crop Timeline */}
          <div style={styles.card}>
            <h3 style={styles.chartTitle}>
              <Calendar color="#10b981" size={24} style={{marginRight: '8px'}} />
              Crop Timeline
            </h3>
            <div>
              {[
                { date: 'Jan 15, 2025', event: 'Sown On', status: 'completed', icon: '🌱' },
                { date: 'May 10, 2025', event: 'Harvest Date', status: 'completed', icon: '🌾' },
                { date: 'June 1, 2025', event: 'Sale Date', status: 'completed', icon: '💰' },
                { date: 'June 21, 2025', event: 'Today', status: 'current', icon: '📅' }
              ].map((item, index) => (
                <div key={index} style={styles.timelineItem}>
                  <div style={styles.timelineIcon}>{item.icon}</div>
                  <div style={styles.timelineContent}>
                    <div style={styles.timelineTitle}>{item.event}</div>
                    <div style={styles.timelineDate}>{item.date}</div>
                  </div>
                  <div style={{
                    ...styles.timelineStatus,
                    backgroundColor: item.status === 'completed' ? '#ecfdf5' : '#dbeafe',
                    color: item.status === 'completed' ? '#065f46' : '#1e40af'
                  }}>
                    {item.status === 'completed' ? 'Completed' : 'Current'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Crop Progress */}
          <div style={styles.card}>
            <h3 style={styles.chartTitle}>
              <Activity color="#f59e0b" size={24} style={{marginRight: '8px'}} />
              Crop Stage Progress
            </h3>
            <div>
              {cropStages.map((stage, index) => (
                <div key={index} style={styles.progressContainer}>
                  <div style={styles.progressHeader}>
                    <span style={styles.progressLabel}>{stage.stage}</span>
                    <span style={{...styles.progressPercent, color: stage.color}}>
                      {stage.completion}%
                    </span>
                  </div>
                  <div style={styles.progressBar}>
                    <div
                      style={{
                        ...styles.progressFill,
                        width: `${stage.completion}%`,
                        backgroundColor: stage.color
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ROI Summary */}
        <div style={styles.summaryCard}>
          <h3 style={styles.summaryTitle}>Return on Investment Summary</h3>
          <p style={styles.summarySubtitle}>Your agricultural investment has generated excellent returns!</p>
          <div style={styles.summaryGrid}>
            <div style={styles.summaryItem}>
              <div style={styles.summaryItemTitle}>Time Period</div>
              <div style={styles.summaryItemValue}>5 Months</div>
            </div>
            <div style={styles.summaryItem}>
              <div style={styles.summaryItemTitle}>ROI Rate</div>
              <div style={styles.summaryItemValue}>48%</div>
            </div>
            <div style={styles.summaryItem}>
              <div style={styles.summaryItemTitle}>Net Profit</div>
              <div style={styles.summaryItemValue}>₹48,000</div>
            </div>
            <div style={styles.summaryItem}>
              <div style={styles.summaryItemTitle}>Profit Margin</div>
              <div style={styles.summaryItemValue}>26.7%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Return;