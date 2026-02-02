/**
 * Configuration for different environments
 * Change this based on your deployment
 */

const config = {
  development: {
    API_BASE_URL: 'http://localhost:5000/api',
  },
  production: {
    API_BASE_URL: 'https://your-backend-url.com/api', // Change this when deploying
  }
};

// Auto-detect environment or set manually
const ENV = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'development'
  : 'production';

// Export the appropriate configuration
const currentConfig = config[ENV];

// Override for easy manual configuration
// Uncomment and set your backend URL if auto-detection doesn't work
// currentConfig.API_BASE_URL = 'https://your-backend-url.com/api';

console.log('Environment:', ENV);
console.log('API URL:', currentConfig.API_BASE_URL);
