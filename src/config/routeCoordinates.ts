// Route Coordinates Configuration
// Shared between Driver Dashboard and Student Dashboard
// Accurate real-world GPS coordinates in Andhra Pradesh, India

export interface RouteCoordinate {
  lat: number;
  lng: number;
  name: string;
}

export const routeCoordinates: { [key: string]: RouteCoordinate[] } = {
  'Tenali - MG Road - College': [
    { lat: 16.2441, lng: 80.6442, name: 'Tenali Bus Stand' },
    { lat: 16.2395, lng: 80.6493, name: 'MG Road Junction' },
    { lat: 16.2373, lng: 80.6473, name: 'Kothapet' },
    { lat: 16.2334, lng: 80.5509, name: "Vignan's Foundation for Science, Technology & Research, Vadlamudi" },
  ],
  'Tenali - Bus Stand - College': [
    { lat: 16.2441, lng: 80.6442, name: 'Tenali Bus Stand Main' },
    { lat: 16.2420, lng: 80.6430, name: 'Old Bus Stand' },
    { lat: 16.2380, lng: 80.6400, name: 'Kolluru Road' },
    { lat: 16.2334, lng: 80.5509, name: "Vignan's Foundation for Science, Technology & Research, Vadlamudi" },
  ],
  'Guntur - Arundalpet - College': [
    { lat: 16.3098, lng: 80.4365, name: 'Arundalpet Bus Stop' },
    { lat: 16.3050, lng: 80.4450, name: 'Lakshmipuram Junction' },
    { lat: 16.2958, lng: 80.4564, name: 'Guntur Railway Station' },
    { lat: 16.2800, lng: 80.4750, name: 'Kothapeta Center' },
    { lat: 16.2334, lng: 80.5509, name: "Vignan's Foundation for Science, Technology & Research, Vadlamudi" },
  ],
  'Guntur - Brodipet - College': [
    { lat: 16.3120, lng: 80.4520, name: 'Brodipet Main Road' },
    { lat: 16.3050, lng: 80.4600, name: 'Nagarampalem' },
    { lat: 16.2900, lng: 80.4800, name: 'Amaravathi Road' },
    { lat: 16.2334, lng: 80.5509, name: "Vignan's Foundation for Science, Technology & Research, Vadlamudi" },
  ],
  'Guntur - Pattabhipuram - College': [
    { lat: 16.3200, lng: 80.4300, name: 'Pattabhipuram Circle' },
    { lat: 16.3100, lng: 80.4450, name: 'Vasavi College Road' },
    { lat: 16.2950, lng: 80.4650, name: 'Syamala Nagar' },
    { lat: 16.2334, lng: 80.5509, name: "Vignan's Foundation for Science, Technology & Research, Vadlamudi" },
  ],
  'Guntur - Mangalagiri - College': [
    { lat: 16.2958, lng: 80.4564, name: 'Guntur Bus Stand' },
    { lat: 16.4346, lng: 80.5679, name: 'Mangalagiri' },
    { lat: 16.481112, lng: 80.617958, name: 'Tadepalli Circle' },
    { lat: 16.2334, lng: 80.5509, name: "Vignan's Foundation for Science, Technology & Research, Vadlamudi" },
  ],
  'Vijayawada - Benz Circle - College': [
    { lat: 16.5187, lng: 80.6200, name: 'Vijayawada Railway Station' },
    { lat: 16.4957, lng: 80.6542, name: 'Benz Circle' },
    { lat: 16.481112, lng: 80.617958, name: 'Tadepalli Junction' },
    { lat: 16.2334, lng: 80.5509, name: "Vignan's Foundation for Science, Technology & Research, Vadlamudi" },
  ],
  'Vijayawada - Governorpet - College': [
    { lat: 16.5062, lng: 80.6480, name: 'Governorpet Center' },
    { lat: 16.4900, lng: 80.6350, name: 'Eluru Road' },
    { lat: 16.4750, lng: 80.6200, name: 'Gunadala' },
    { lat: 16.2334, lng: 80.5509, name: "Vignan's Foundation for Science, Technology & Research, Vadlamudi" },
  ],
  'Vijayawada - Auto Nagar - College': [
    { lat: 16.5300, lng: 80.6100, name: 'Auto Nagar Main' },
    { lat: 16.5150, lng: 80.6250, name: 'Kanuru' },
    { lat: 16.5000, lng: 80.6400, name: 'Vijayawada Junction' },
    { lat: 16.2334, lng: 80.5509, name: "Vignan's Foundation for Science, Technology & Research, Vadlamudi" },
  ],
  'Vijayawada - Patamata - College': [
    { lat: 16.5100, lng: 80.6700, name: 'Patamata Bus Stop' },
    { lat: 16.4950, lng: 80.6550, name: 'Krishna Lanka' },
    { lat: 16.4800, lng: 80.6300, name: 'Ibrahimpatnam Road' },
    { lat: 16.2334, lng: 80.5509, name: "Vignan's Foundation for Science, Technology & Research, Vadlamudi" },
  ],
  'Tenali - Guntur - Mangalagiri - College': [
    { lat: 16.2441, lng: 80.6442, name: 'Tenali Bypass' },
    { lat: 16.2958, lng: 80.4564, name: 'Guntur Collectorate' },
    { lat: 16.4346, lng: 80.5679, name: 'Mangalagiri Town' },
    { lat: 16.4400, lng: 80.5750, name: 'Mangalagiri Bus Stand' },
    { lat: 16.2334, lng: 80.5509, name: "Vignan's Foundation for Science, Technology & Research, Vadlamudi" },
  ],
  'Namburu - Pedakakani - College': [
    { lat: 16.3589, lng: 80.5288, name: 'Namburu' },
    { lat: 16.3398, lng: 80.4912, name: 'Pedakakani' },
    { lat: 16.3091, lng: 80.4637, name: 'Mangalagiri Road' },
    { lat: 16.2334, lng: 80.5511, name: "Vignan's Foundation for Science, Technology & Research, Vadlamudi" },
  ],
};

// Helper function to get coordinates for a specific route
export const getRouteCoordinates = (routeName: string): RouteCoordinate[] => {
  return routeCoordinates[routeName] || [];
};

// Get default center point (Guntur)
export const getDefaultCenter = () => {
  return { lat: 16.3067, lng: 80.4365 };
};
