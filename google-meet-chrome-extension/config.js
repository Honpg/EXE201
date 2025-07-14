// Configuration for different environments
const CONFIG = {
  development: {
    API_BASE_URL: 'http://localhost:3000'
  },
  production: {
    API_BASE_URL: 'https://oceanai.azurewebsites.net'
  }
};

// Auto detect environment (production extensions don't have a 'key' in manifest)
const isProduction = !chrome.runtime.getManifest().key;
const currentConfig = isProduction ? CONFIG.production : CONFIG.development;

// Export configuration
window.OCEAN_AI_CONFIG = currentConfig;
