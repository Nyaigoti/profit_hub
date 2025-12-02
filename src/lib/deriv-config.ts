/**
 * Deriv API Configuration
 *
 * Official Deriv GitHub Repositories:
 * - Main Deriv App (DTrader, Cashier, Account, Bot Web UI): https://github.com/deriv-com/deriv-app
 * - SmartTrader Platform: https://github.com/deriv-com/deriv-smarttrader
 * - Deriv API (WebSocket): https://github.com/deriv-com/deriv-api
 * - Deriv Copy Trading: https://github.com/deriv-com/copy-trading
 * - DBot: https://github.com/deriv-com/deriv-bot
 * - Derivatives Base (optional): https://github.com/deriv-com/derivatives
 */

export const DERIV_APP_ID = parseInt(process.env.VITE_DERIV_APP_ID || '113960', 10);
export const DERIV_REDIRECT_URL = process.env.VITE_DERIV_REDIRECT_URL;

export const DERIV_CONFIG = {
    APP_ID: DERIV_APP_ID,
    REDIRECT_URL: DERIV_REDIRECT_URL,
} as const;

// Official Deriv API Endpoints
export const DERIV_API = {
    WEBSOCKET: 'wss://ws.derivws.com/websockets/v3',
    OAUTH: 'https://oauth.deriv.com/oauth2/authorize',
} as const;


