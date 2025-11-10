# Google Maps Integration Setup

## Overview
The Driver Dashboard now includes live GPS tracking with Google Maps integration to visualize assigned routes and track bus location in real-time.

## Features
- **Route Visualization**: Displays all stops with numbered markers
- **Route Path**: Shows the complete route with a colored polyline
- **Live Tracking**: Simulates real-time bus movement when trip is started
- **Interactive Markers**: Click markers to see stop information
- **Multiple Routes**: Supports different routes for different drivers

## Setup Instructions

### 1. Get Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - Maps JavaScript API
   - Geocoding API (optional, for future features)
   - Directions API (optional, for route optimization)
4. Go to **Credentials** → **Create Credentials** → **API Key**
5. Copy your API key

### 2. Configure API Key (Optional - Using Default Demo Key)

The application currently uses a demo API key for development. For production:

1. Create a `.env` file in the `transport_system` folder:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your API key:
   ```
   REACT_APP_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
   ```

3. Update `src/utils/googleMapsLoader.ts` to use environment variable:
   ```typescript
   const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || 'fallback_key';
   ```

### 3. Restrict API Key (Recommended for Production)

1. In Google Cloud Console, click on your API key
2. Under **Application restrictions**, select **HTTP referrers**
3. Add your domains:
   - `http://localhost:3000/*` (for development)
   - `https://yourdomain.com/*` (for production)
4. Under **API restrictions**, select **Restrict key** and choose:
   - Maps JavaScript API

## Route Configuration

Routes are currently configured in `DriverDashboard.tsx`. Each driver account is assigned a specific route with coordinates:

```typescript
const routeCoordinates = {
  'Tenali - MG Road - College': [
    { lat: 16.2379, lng: 80.6480, name: 'Tenali Bus Stand' },
    { lat: 16.2450, lng: 80.6520, name: 'MG Road Junction' },
    // ... more stops
  ],
  // ... more routes
};
```

### To Add New Routes:

1. Open `src/pages/DriverDashboard.tsx`
2. Find the `routeCoordinates` object
3. Add your route with coordinates:
   ```typescript
   'Route Name': [
     { lat: latitude, lng: longitude, name: 'Stop Name' },
     // ... more stops
   ]
   ```

## How It Works

1. **Map Loading**: Google Maps script is loaded dynamically when the Trip Tracking tab is opened
2. **Route Display**: Shows all stops with color-coded markers:
   - Green: Starting point
   - Blue: Intermediate stops
   - Red: Final destination (College)
3. **Trip Simulation**: When "Start Trip" is toggled:
   - A bus marker appears at the first stop
   - Moves through each stop every 5 seconds (demo)
   - Updates current location display

## Future Enhancements

1. **Real GPS Integration**: Replace simulation with actual GPS coordinates from driver's device
2. **Live Updates**: Use WebSocket or polling to update bus location in real-time
3. **Student Notifications**: Alert students when bus is approaching their stop
4. **Traffic Integration**: Show real-time traffic conditions
5. **ETA Calculation**: Calculate and display estimated arrival times
6. **Historical Routes**: Track and display past trip data

## Troubleshooting

### Map Not Loading
- Check browser console for API errors
- Verify API key is valid and has Maps JavaScript API enabled
- Check network tab to ensure script is loading

### Markers Not Showing
- Verify route coordinates are correct
- Check that the route name matches the driver's assigned route

### "For development purposes only" watermark
- This appears when using a restricted API key without billing enabled
- Enable billing in Google Cloud Console to remove it

## Cost Considerations

Google Maps API has free tier limits:
- $200 free credit per month
- Maps JavaScript API: $7 per 1,000 loads
- Most college applications will stay within free tier

Monitor usage in Google Cloud Console → **APIs & Services** → **Dashboard**
