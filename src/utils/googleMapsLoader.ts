// Google Maps API Loader
let isLoaded = false;
let isLoading = false;
const callbacks: Array<() => void> = [];

export const loadGoogleMapsScript = (apiKey?: string): Promise<void> => {
  // Use environment variable or provided key
  const key = apiKey || process.env.REACT_APP_GOOGLE_MAPS_API_KEY || 'AIzaSyB0hpIISaS2GuVcSLeME0vSvqLvtB38jJ8';
  
  return new Promise((resolve, reject) => {
    // If already loaded, resolve immediately
    if (isLoaded && typeof (window as any).google !== 'undefined' && (window as any).google.maps) {
      resolve();
      return;
    }

    // If currently loading, add to callback queue
    if (isLoading) {
      callbacks.push(resolve);
      return;
    }

    // Check if Google Maps is already loaded by another script
    if (typeof (window as any).google !== 'undefined' && (window as any).google.maps) {
      isLoaded = true;
      resolve();
      return;
    }

    // Start loading
    isLoading = true;

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=geometry,places&callback=initMap`;
    script.async = true;
    script.defer = true;

    // Define callback function
    (window as any).initMap = () => {
      setTimeout(() => {
        if (typeof (window as any).google !== 'undefined' && (window as any).google.maps) {
          isLoaded = true;
          isLoading = false;
          resolve();
          // Execute all queued callbacks
          callbacks.forEach(callback => callback());
          callbacks.length = 0;
        } else {
          isLoading = false;
          reject(new Error('Google Maps loaded but google.maps is not available'));
        }
      }, 100);
    };

    script.onerror = (error) => {
      isLoading = false;
      reject(new Error('Failed to load Google Maps script. Please check your API key and internet connection.'));
    };

    document.head.appendChild(script);
  });
};
