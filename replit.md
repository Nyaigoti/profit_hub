# Derivatives Bot - Replit Setup

## Overview

A comprehensive platform for automated derivatives trading that provides users with powerful tools to create, test, and deploy trading bots without requiring programming knowledge. Built with React 18, TypeScript, and RSBuild.

## Project Architecture

### Frontend Stack

- **Framework**: React 18 with TypeScript
- **Build System**: RSBuild (fast alternative to webpack)
- **State Management**: MobX for reactive state management
- **Routing**: React Router v6
- **Styling**: Sass with component-scoped styles
- **UI Libraries**:
    - Blockly for visual bot building
    - @deriv-com/ui for design system components
    - @deriv-com/derivatives-charts for trading charts

### Key Features

- Visual Bot Builder using Blockly
- Real-time Dashboard for bot management
- Integrated TradingView charts
- **Market Analysis Tool** with real-time statistical analysis, AI predictions, and trading signals
- Interactive tutorials
- Responsive design for mobile and desktop
- Analytics integration (RudderStack, GTM)

## Development Setup

### Configuration Changes for Replit

1. **Port Configuration**: Changed from 8443 to 5000
2. **Host Configuration**: Set to 0.0.0.0 to allow Replit proxy
3. **SSL Removed**: Removed pluginBasicSsl as Replit handles HTTPS at proxy level
4. **Host Validation**: Added `allowedHosts: 'all'` to support Replit's iframe proxy
5. **Config Structure**: Moved alias configuration from `source.alias` to `resolve.alias` (fixing deprecation warning)

### Current Workflow

- **Server**: `npm start` - Runs RSBuild dev server on port 5000
    - Hot module replacement enabled
    - WebSocket for live reloading
    - Serves at http://0.0.0.0:5000

### Deployment Configuration

- **Type**: Autoscale (stateless frontend)
- **Build**: `npm run build`
- **Run**: `http-server dist -p 5000 -a 0.0.0.0`

## Environment Variables

The application expects several optional environment variables for external services:

- `TRACKJS_TOKEN` - Error tracking (warnings shown if not set, but app works)
- `DATADOG_*` - Monitoring configuration
- `RUDDERSTACK_KEY` - Analytics
- `GROWTHBOOK_*` - Feature flags
- `REMOTE_CONFIG_URL` - Remote configuration

These are all optional for development. The app will run without them.

## File Structure

```
src/
├── components/       # Reusable UI components
├── pages/           # Main application pages
│   ├── dashboard/   # Bot management
│   ├── bot-builder/ # Visual bot building
│   ├── chart/       # Trading charts
│   ├── tutorials/   # Learning modules
│   └── analysis/    # Market analysis with AI predictions
├── lib/             # Core libraries
│   ├── analysis-engine.ts  # Statistical analysis engine
│   ├── deriv-websocket.ts  # WebSocket client for Deriv API
│   └── ai-predictor.ts     # AI prediction engine
├── stores/          # MobX state stores
├── hooks/           # Custom React hooks
│   └── use-deriv-analysis.ts  # Analysis state management
├── analytics/       # Analytics utilities
├── external/        # External integrations
└── styles/          # Global styles
```

## Recent Changes

- **2025-10-27**: Integrated Market Analysis Tool
    - Added comprehensive analysis features: real-time statistical analysis, AI predictions, trading signals
    - Installed recharts and lightweight-charts dependencies for data visualization
    - Created analysis engine with digit frequency tracking, even/odd analysis, entropy calculation
    - Implemented WebSocket client for real-time Deriv market data
    - Built AI predictor using pattern recognition and frequency analysis
    - Added Analysis tab to main navigation (5th tab after Dashboard, Bot Builder, Charts, Tutorials)
    - Created custom React hook (use-deriv-analysis) for analysis state management
    - Designed Analysis page matching existing dbot UI patterns and Sass styling conventions
    - Added 9 additional pre-built bot strategy XML files for users

- **2025-10-27**: Initial Replit setup
    - Installed dependencies with `npm install --ignore-scripts` to avoid git hook conflicts
    - Configured RSBuild for Replit environment (port 5000, host 0.0.0.0)
    - Removed SSL plugin (Replit handles HTTPS)
    - Set up deployment configuration for autoscale
    - Verified app loads successfully with WebSocket connection

## Notes

- Dependencies installed with `--ignore-scripts` flag due to husky git hook conflicts
- The app shows "Initializing Deriv Bot account..." on first load, which is expected behavior
- Some browser console warnings about missing tokens are expected in development without API keys
