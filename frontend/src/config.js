// If there is no .env file, default to local server
// NOTE: A config file is probably an unnecessary layer in a simple app, but I still prefer it to relying solely on the .env file
const config = {
    backendUrl: process.env.BACKEND_URL || 'http://localhost:8000',
};

// Redundant but prevents setting BACKEND_URL in every component
export const BACKEND_URL = config.backendUrl;

export default config;