// ============================================================
// ✅ GoogleMapsProvider.jsx — single shared Maps API loader (optimized)
// ============================================================

import { createContext, useContext } from "react";
import { useJsApiLoader } from "@react-google-maps/api";

const GOOGLE_MAPS_API_KEY = "AIzaSyDa4qZIS5TXZ0_7zUYeNRvmjzF0g6lcJ-Q";

// ✅ Make this a static constant to prevent re-renders
const MAP_LIBRARIES = ["places"];

const GoogleMapsContext = createContext();

export function GoogleMapsProvider({ children }) {
  const loader = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: MAP_LIBRARIES, // use static array here ✅
  });

  return (
    <GoogleMapsContext.Provider value={loader}>
      {children}
    </GoogleMapsContext.Provider>
  );
}

export function useGoogleMaps() {
  return useContext(GoogleMapsContext);
}
