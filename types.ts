export interface Activity {
  name: string;
  city: string;
  type: 'Adventure' | 'Spiritual' | 'Cultural' | 'Food' | 'Nature' | 'Heritage';
  shortDescription: string;
  suggestedDuration: string;
}

export interface StateProfile {
  id: string;
  name: string;
  capital: string;
  description: string;
  bestTimeToVisit: string;
  tagline: string;
  imageUrl: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  
  // New Fields
  languages: string[];
  safetyDescription: string; // Summary based on past news/reports (e.g. NCRB data context)
  civicSenseDescription: string; // Summary based on cleanliness surveys (Swachh Survekshan) and traffic reports
  funnyStereotype: string; // Internet meme based stereotype
  isRealtime?: boolean; // Flag to indicate if data is from live API
  
  // Metrics
  aqi: {
    value: number;
    label: 'Good' | 'Moderate' | 'Poor' | 'Very Poor' | 'Hazardous';
  };
  // Detailed European AQI Metrics (0-100 Index)
  europeanAqi?: {
    pm2_5: number;
    pm10: number;
    no2: number;
    o3: number;
    so2: number;
  };

  crimeStatus: 'Low' | 'Medium' | 'High';
  hospitalityScore: number; // 0-10
  infrastructureScore: number; // 0-10
  culturalRichnessScore: number; // 0-10
  womenSafetyScore: number; // 0-10
  civicSenseScore: number; // 0-10
  
  activities: Activity[];
}

export type SortOption = 'name' | 'aqi' | 'safety' | 'culture' | 'infrastructure';