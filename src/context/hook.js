import { useState, useCallback } from "react";

export const useConfig = () => {
  const [options, setOptions] = useState({
    year: 2018,
    month: [3, 3],
    selectedPoint: 1,
    selectedDay: "2018-03-01",
    selectedMcc: "GROCERY",
    city: "Reading",
    timeMode: "year",
    indicator: "weather",
    mcc: "travel",
    weather: "temperature",
  });
  const setCurrentOption = useCallback((c) => {
    console.log("up", c);
    setOptions(c);
  }, []);
  return {
    options,
    setCurrentOption,
  };
};
