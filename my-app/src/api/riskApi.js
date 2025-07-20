// API service for risk prediction
const API_BASE_URL = 'http://localhost:8000'; // FastAPI server URL

export const riskApi = {
  // Predict risk and revenue based on input parameters
  predictRisk: async (data) => {
    try {
      const response = await fetch(`${API_BASE_URL}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Crop_Name: data.cropName,
          Year: parseInt(data.year),
          State: data.state,
          Market_Demand_Index: parseFloat(data.marketDemandIndex)
        })
      });

      if (!response.ok) {
        throw new Error('Failed to predict risk');
      }

      return await response.json();
    } catch (error) {
      console.error('Error predicting risk:', error);
      // Return mock data for development
      return {
        Estimated_Revenue: Math.floor(Math.random() * 50000) + 20000,
        Risk_Index: Math.random() * 0.8 + 0.2
      };
    }
  },

  // Get risk statistics
  getRiskStats: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/stats`);
      if (!response.ok) {
        throw new Error('Failed to fetch risk stats');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching risk stats:', error);
      // Return mock data
      return {
        totalInvestments: 24500000,
        averageRiskIndex: 0.45,
        riskDistribution: {
          low: 45,
          medium: 35,
          high: 20
        }
      };
    }
  }
}; 