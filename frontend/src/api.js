// Central API base URL.
// In development this falls back to localhost:5000.
// In production, set the VITE_API_URL environment variable to your deployed backend URL.
// e.g.  VITE_API_URL=https://dwani-backend.onrender.com
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default API_BASE;
