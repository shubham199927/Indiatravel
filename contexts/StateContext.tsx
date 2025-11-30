import React, { createContext, useContext, useState, useEffect } from 'react';
import { statesData as initialData } from '../data/states';
import { StateProfile } from '../types';

interface StateContextType {
  states: StateProfile[];
  loading: boolean;
}

const StateContext = createContext<StateContextType>({ states: [], loading: true });

export const useStates = () => useContext(StateContext);

export const StateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [states, setStates] = useState<StateProfile[]>(initialData);
  const [loading, setLoading] = useState(true);

  const getAQILabel = (aqi: number) => {
    if (aqi <= 50) return 'Good';
    if (aqi <= 100) return 'Moderate';
    if (aqi <= 200) return 'Poor';
    if (aqi <= 300) return 'Very Poor';
    return 'Hazardous';
  };

  useEffect(() => {
    const fetchAQI = async () => {
      // Create a copy of states to update
      const updatedStates = await Promise.all(
        states.map(async (state) => {
          if (!state.coordinates) return state;
          try {
            // Using Open-Meteo Air Quality API (Free)
            // Added european AQI indices to request
            const response = await fetch(
              `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${state.coordinates.lat}&longitude=${state.coordinates.lng}&current=us_aqi,european_aqi_pm2_5,european_aqi_pm10,european_aqi_no2,european_aqi_o3,european_aqi_so2&timezone=auto`
            );
            
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            const current = data.current;
            
            if (current) {
              return {
                ...state,
                isRealtime: true,
                aqi: {
                  value: Math.round(current.us_aqi || state.aqi.value),
                  label: getAQILabel(current.us_aqi || state.aqi.value) as any
                },
                europeanAqi: {
                  pm2_5: current.european_aqi_pm2_5 || 0,
                  pm10: current.european_aqi_pm10 || 0,
                  no2: current.european_aqi_no2 || 0,
                  o3: current.european_aqi_o3 || 0,
                  so2: current.european_aqi_so2 || 0
                }
              };
            }
            return state;
          } catch (error) {
            // Silently fail and use default/mock data if API limits are hit or network fails
            console.warn(`AQI fetch failed for ${state.name}:`, error);
            return state;
          }
        })
      );
      setStates(updatedStates);
      setLoading(false);
    };

    fetchAQI();
  }, []); // Run once on mount

  return (
    <StateContext.Provider value={{ states, loading }}>
      {children}
    </StateContext.Provider>
  );
};