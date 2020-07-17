import React, { useState, useContext, useEffect } from "react";
import { ThemeProvider } from "@material-ui/core/styles";
import theme from "./theme";

import TimeCurve from "./components/timeCurve";
import Timeline from "./components/timeline";
import Line from "./components/smallMultiplesLayout";
import Lines from "./components/lineLayout";
import Panel from "./components/panels";
import TimeCurveSmallLayout from "./components/smalTimeCurveLayout";
import TimeCurveViewPanel from "./components/overviewPanel";

import Configuration from "./components/configurationPanel";

import { OptionContext } from "./context/index";
import { useConfig } from "./context/hook";
import style from "./style.module.css";

function App() {
  const color = useConfig();
  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <OptionContext.Provider value={color}>
          <div className={style.container}>
            <div className={style.configuration}>
              <Configuration />
              <Timeline />
            </div>
            <div className={style.center}>
              {/* <Lines /> */}
              <TimeCurve />
              <Panel />
              {/* <Line /> */}
            </div>
            <div className={style.timePanel}>
              <TimeCurveSmallLayout />
              <TimeCurveViewPanel />
            </div>
          </div>
        </OptionContext.Provider>
      </div>
    </ThemeProvider>
  );
}

export default App;
