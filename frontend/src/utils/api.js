import axios from "axios";

const API_BASE = "https://caring-charm-production-41d0.up.railway.app";

export const analyzeText = async (text) => {
  const response = await axios.post(`${API_BASE}/api/analyze`, { text });
  return response.data;
};
# Railway redeploy
