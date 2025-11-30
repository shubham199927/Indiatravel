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
    return 'Hazardous';
  };

  useEffect(() => {
    const fetchAQI = async () => {
      // Create a copy of states to update
      const updatedStates = await Promise.all(
        states.map(async (state) => {
          if (!state.coordinates) return state;
          try {
            // Using Open-Meteo Air Quality API (Free, no key required)
            const response = await fetch(
              `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${state.coordinates.lat}&longitude=${state.coordinates.lng}&current=us_aqi`
            );
            const data = await response.json();
            const currentAqi = data.current?.us_aqi;
            
            if (currentAqi !== undefined && currentAqi !== null) {
              return {
                ...state,
                aqi: {
                  value: Math.round(currentAqi),
                  label: getAQILabel(currentAqi) as any
                }
              };
            }
            return state;
          } catch (error) {
            console.warn(`Failed to fetch AQI for ${state.name}, using static data.`, error);
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