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
  safetyDescription: string; // Summary based on past news/reports
  civicSenseDescription: string; // Summary based on cleanliness/traffic reports
  
  // Metrics
  aqi: {
    value: number;
    label: 'Good' | 'Moderate' | 'Poor' | 'Hazardous';
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