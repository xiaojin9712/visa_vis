import React, { useState, useContext, useEffect } from "react";
import TimeCurveView from "../timeCurveOverview";

import { OptionContext } from "../../context/index";
import style from "./style.module.css";
import temData from "../../data/2018_03_tem_daily.json";
import mccData from "../../data/0713.json";
import { Button } from "@material-ui/core";

function App() {
  const [compose, setCompose] = useState(false);
  const { options, setCurrentOption } = useContext(OptionContext);
  const [selectedDay, setSelectedDay] = useState(options.selectedDay);
  useState(() => {
    console.log("object4", options.selectedDay);
  });
  console.log("object2", options.selectedDay, selectedDay);

  return (
    <div className={style.right}>
      <div className={style.mcc}>
        {mccData
          .filter((d) => {
            return d.day == options.selectedDay && d.mcc == options.selectedMcc;
          })
          .map((d, i) => {
            return (
              <TimeCurveView
                id={options.selectedDay + "-" + d["mcc"]}
                data={{
                  m: d["mds"],
                }}
                color="#391D71"
              />
            );
          })}
        <p>Travel: {options.selectedDay}</p>
        <div className={style.operation}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setCompose(!compose);
            }}
          >
            {compose ? "Seperate" : "Compose"}
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              setCompose(!compose);
            }}
          >
            REPLAY
          </Button>
        </div>
      </div>
      <div className={`${style.wea} ${compose ? style.compose : " "}`}>
        <TimeCurveView
          id={options.selectedDay + "-temp"}
          data={{
            m: temData[options.selectedDay],
          }}
        />
        <p>Temperature: {options.selectedDay}</p>
      </div>
    </div>
  );
}

export default App;
