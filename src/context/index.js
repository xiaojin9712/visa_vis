import React from "react";

const optionsContext = {
  options: {
    year: 2018,
    month: [3, 3],
    selectedPoint: 1,
    selectedDay: "2018-03-01",
    selectedMcc: "a",
  },
  setCurrentOption: () => {},
};

export const OptionContext = React.createContext(optionsContext);
