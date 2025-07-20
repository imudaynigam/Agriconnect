//limited states i have added//

const cropData = [
  {
    name: "Basmati Rice",
    state: "Punjab",
    city: "Amritsar",
    season: "Kharif",
    soil: "Loamy",
    yield: "20–25 quintals/acre",
    price: "₹1800–₹2200/quintal",
    profit: "High"
  },
  {
    name: "Wheat",
    state: "Uttar Pradesh",
    city: "Lucknow",
    season: "Rabi",
    soil: "Clay",
    yield: "22–30 quintals/acre",
    price: "₹2100–₹2300/quintal",
    profit: "Moderate"
  },
  {
    name: "Maize",
    state: "Bihar",
    city: "Patna",
    season: "Kharif",
    soil: "Well-drained",
    yield: "18–22 quintals/acre",
    price: "₹1400–₹1600/quintal",
    profit: "Moderate"
  },
  {
    name: "Sugarcane",
    state: "Maharashtra",
    city: "Pune",
    season: "Annual",
    soil: "Alluvial",
    yield: "35–45 tons/acre",
    price: "₹3000–₹3500/ton",
    profit: "Very High"
  },
  {
    name: "Cotton",
    state: "Gujarat",
    city: "Rajkot",
    season: "Kharif",
    soil: "Black Soil",
    yield: "8–10 quintals/acre",
    price: "₹5000–₹6000/quintal",
    profit: "High"
  },
  {
    name: "Mustard",
    state: "Rajasthan",
    city: "Jaipur",
    season: "Rabi",
    soil: "Sandy Loam",
    yield: "10–15 quintals/acre",
    price: "₹5500–₹6000/quintal",
    profit: "High"
  },
  {
    name: "Paddy",
    state: "West Bengal",
    city: "Kolkata",
    season: "Kharif",
    soil: "Clayey",
    yield: "18–22 quintals/acre",
    price: "₹1800–₹2000/quintal",
    profit: "Moderate"
  },
  {
    name: "Groundnut",
    state: "Tamil Nadu",
    city: "Madurai",
    season: "Rabi",
    soil: "Red Loamy",
    yield: "14–18 quintals/acre",
    price: "₹5200–₹5800/quintal",
    profit: "High"
  },
  {
    name: "Jowar",
    state: "Karnataka",
    city: "Bangalore",
    season: "Kharif",
    soil: "Sandy",
    yield: "12–16 quintals/acre",
    price: "₹2200–₹2500/quintal",
    profit: "Moderate"
  },
  {
    name: "Moong (Green Gram)",
    state: "Andhra Pradesh",
    city: "Vijayawada",
    season: "Zaid",
    soil: "Sandy Loam",
    yield: "8–12 quintals/acre",
    price: "₹6000–₹7000/quintal",
    profit: "High"
  }
];

// src/data/cropData.js (add below existing cropData array)

export const locationOptions = {
  Punjab: ["Amritsar", "Ludhiana"],
  "Uttar Pradesh": ["Lucknow", "Kanpur"],
  Bihar: ["Patna", "Gaya"],
  Maharashtra: ["Pune", "Nagpur"],
  Gujarat: ["Rajkot", "Ahmedabad"],
  Rajasthan: ["Jaipur", "Jodhpur"],
  "West Bengal": ["Kolkata", "Howrah"],
  "Tamil Nadu": ["Madurai", "Chennai"],
  Karnataka: ["Bangalore", "Mysore"],
  "Andhra Pradesh": ["Vijayawada", "Visakhapatnam"]
};

export const seasonOptions = ["Kharif", "Rabi", "Zaid", "Annual"];

export default cropData;