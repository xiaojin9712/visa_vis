import React, { useState, useContext, useEffect } from "react";
import * as d3 from "d3";

import { OptionContext } from "../../context/index";
import style from "./style.module.css";

import { Button } from "@material-ui/core";
import data from "../../data/0722_2.json";
import weather from "../../data/0722_weather.json";
import TimeCurve from "../timeCurve";
import Legend from "../legend";
import SmallLine from "../smallMultiples";
import Horizon from "../horizon";

function format(day, data) {
  let time = Object.keys(data);
  let res = time.map((d) => {
    return {
      date: `${day} ${d}`,
      value: data[d],
    };
  });
  return res;
}

let keys = [
  "00:20:00",
  "01:20:00",
  "02:20:00",
  "03:20:00",
  "04:20:00",
  "05:20:00",
  "06:20:00",
  "07:20:00",
  "08:20:00",
  "09:20:00",
  "10:20:00",
  "11:20:00",
  "12:20:00",
  "13:20:00",
  "14:20:00",
  "15:20:00",
  "16:20:00",
  "17:20:00",
  "18:20:00",
  "19:20:00",
  "20:20:00",
  "21:20:00",
  "22:20:00",
  "23:20:00",
];

function formatMccHorizon(day, mcc) {
  let days = Object.keys(data);
  let dates = [];
  for (let i = 0; i < days.length; i++) {
    const d = days[i];
    for (let j = 0; j < Object.keys(data[d][mcc]["revenue"]).length; j++) {
      dates.push(`${d}T${Object.keys(data[d][mcc]["revenue"])[j]}`);
    }
  }
  let series = [];
  for (let i = 0; i < days.length; i++) {
    const d = days[i];
    for (let j = 0; j < Object.keys(data[d][mcc]["revenue"]).length; j++) {
      series.push(data[d][mcc]["revenue"][keys[j]]);
    }
  }
  return {
    dates: dates.sort(d3.ascending).map((d) => new Date(d)),
    series: [
      {
        name: mcc,
        values: series,
      },
    ],
  };
}

function formatWeatherHorizon(day, mode = "temperature") {
  let days = Object.keys(weather);
  let dates = [];
  for (let i = 0; i < days.length; i++) {
    const d = days[i];
    for (let j = 0; j < Object.keys(weather[d][mode]).length; j++) {
      dates.push(`${d}T${Object.keys(weather[d][mode])[j]}`);
    }
  }
  let series = [];
  for (let i = 0; i < days.length; i++) {
    const d = days[i];
    for (let j = 0; j < Object.keys(weather[d][mode]).length; j++) {
      series.push(weather[d][mode][keys[j]]);
    }
  }
  return {
    dates: dates.sort(d3.ascending).map((d) => new Date(d)),
    series: [
      {
        name: mode,
        values: series,
      },
    ],
  };
}

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
      <h4 className={style.title}>
        Hourly Time curve: {options.selectedDay} - {options.selectedMcc}
      </h4>
      <Horizon
        id={options.selectedDay + "Horizon" + options.selectedMcc}
        data={formatMccHorizon(options.selectedDay, options.selectedMcc)}
      />
      {/* <div className={style.mcc}>
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
      </div> */}
      <div className={style.spending}>
        <TimeCurve
          data={{
            m: data[options.selectedDay][options.selectedMcc]["mds"],
            v: data[options.selectedDay][options.selectedMcc]["ratio_revenue"],
          }}
          id={options.selectedDay + "_" + options.selectedMcc}
          width={600 * 0.9}
          height={400 * 0.9}
        />
        <div className={style.anotation}>
          <h4>Spending time curve</h4>
          <p>
            Dimensions: &nbsp; &nbsp;
            <span className={style.label}>Transaction amount</span>
            &nbsp; &nbsp;
            <span className={style.label}>Transaction count</span>
          </p>
          <p>
            Each dot represent a time point (one hour), the size stand for{" "}
            <span className={style.highlight}>transaction amount.</span> opacity
            stand for <span className={style.highlight}>transaction count</span>
          </p>
          <div className={style.legend}>
            <Legend
              color={d3.scaleSequential([49, 89900], (d) => {
                return `rgba(255,204,0, ${d})`;
              })}
              title="Transaction count"
            />
          </div>
          <div className={style.view}>
            <SmallLine
              data={format(
                options.selectedDay,
                data[options.selectedDay][options.selectedMcc]["revenue"]
              )}
              id={options.selectedDay + "R" + options.selectedMcc}
              label="Transaction amount"
            />
            <div style={{ marginLeft: "12px" }}>
              <SmallLine
                data={format(
                  options.selectedDay,
                  data[options.selectedDay][options.selectedMcc]["amount"]
                )}
                id={options.selectedDay + "A" + options.selectedMcc}
                label="Transaction count"
              />
            </div>
          </div>
          {/* <div className={style.operation}>
            <Button variant="contained" color="primary" size="small">
              View Detail
            </Button>
          </div> */}
        </div>
      </div>
      <div className={style.weather}>
        <TimeCurve
          data={{
            m: weather[options.selectedDay]["mds"],
            v: weather[options.selectedDay]["ratio_temperature"],
          }}
          id={options.selectedDay + "__" + options.selectedMcc}
          width={600 * 0.9}
          height={400 * 0.9}
        />
        <div className={style.anotation}>
          <h4>Weather time curve</h4>
          <p>
            Dimensions: &nbsp; &nbsp;
            <span className={style.label}>Temperature</span>
            &nbsp; &nbsp;
            <span className={style.label}>Precipitation per hour</span>
            &nbsp; &nbsp;
            <span className={style.label}>Windspeed</span>
          </p>
          <p>
            Each dot represent a time point (one hour), the size stand for{" "}
            <span className={style.highlight}>wind speed.</span> opacity stand
            for <span className={style.highlight}>temperature.</span>
          </p>
          <div className={style.legend}>
            <Legend
              color={d3.scaleSequential([-10, 20], (d) => {
                return `rgba(255,204,0, ${d})`;
              })}
              title="Temperature (°C)"
            />
          </div>
          <div className={style.view}>
            <SmallLine
              data={format(
                options.selectedDay,
                weather[options.selectedDay]["temperature"]
              )}
              id={options.selectedDay + "T" + options.selectedMcc}
              label="Temperature"
            />
            <div style={{ marginLeft: "12px" }}>
              <SmallLine
                data={format(
                  options.selectedDay,
                  weather[options.selectedDay]["precip1Hour"]
                )}
                id={options.selectedDay + "P" + options.selectedMcc}
                label="Precipitation"
              />
            </div>
            <div style={{ marginLeft: "12px" }}>
              <SmallLine
                data={format(
                  options.selectedDay,
                  weather[options.selectedDay]["windSpeed"]
                )}
                id={options.selectedDay + "W" + options.selectedMcc}
                label="WindSpeed"
              />
            </div>
          </div>
          {/* <div className={style.operation}>
            <Button variant="contained" color="primary" size="small">
              View Detail
            </Button>
          </div> */}
        </div>
      </div>

      {/* <div className={`${style.wea} ${compose ? style.compose : " "}`}>
        <TimeCurveView
          id={options.selectedDay + "-temp"}
          data={{
            m: temData[options.selectedDay],
          }}
        />
        <p>Temperature: {options.selectedDay}</p>
      </div> */}
      <Horizon
        id={options.selectedDay + "HorizonW" + options.selectedMcc}
        data={formatWeatherHorizon(options.selectedDay, "windSpeed")}
      />
      {/* <Horizon
        id={options.selectedDay + "HorizonW" + options.selectedMcc}
        data={formatWeatherHorizon(options.selectedDay, "windSpeed")}
      /> */}
    </div>
  );
}

export default App;
