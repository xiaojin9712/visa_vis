import React, { useEffect, useState, useContext } from "react";
import { Popover } from "@material-ui/core";
import TimeCurve from "../timeCurveSmall";
import data from "../../data/0713.json";
import * as d3 from "d3";
import style from "./style.module.css";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import { OptionContext } from "../../context";

function App() {
  //   const [data, setData] = useState([]);
  const { options, setCurrentOption } = useContext(OptionContext);

  useEffect(() => {
    // console.clear();
    console.log("data", data);
    // d3.json("./0712.json").then((d) => {
    //   console.clear();
    //   console.log("k", d);
    //   //   update(d);
    // });
  }, []);

  const days = [
    "2018-03-01",
    "2018-03-02",
    "2018-03-03",
    "2018-03-04",
    "2018-03-05",
    "2018-03-06",
    "2018-03-07",
    // "2018-03-08",
    // "2018-03-09",
    // "2018-03-10",
    // "2018-03-11",
    // "2018-03-12",
    // "2018-03-13",
    // "2018-03-14",
    // "2018-03-15",
    // "2018-03-16",
    // "2018-03-17",
    // "2018-03-18",
    // "2018-03-19",
    // "2018-03-20",
    // "2018-03-21",
    // "2018-03-22",
    // "2018-03-23",
    // "2018-03-24",
    // "2018-03-25",
    // "2018-03-26",
    // "2018-03-27",
    // "2018-03-28",
    // "2018-03-29",
    // "2018-03-30",
    // "2018-03-31",
  ];

  const mccs = ["a", "b", "c", "d", "e", "f", "g", "h", "j", "k"];

  function select(day, mcc) {
    setCurrentOption({
      ...options,
      selectedDay: day,
      selectedMcc: mcc,
    });
  }

  function buildRow(day) {
    const color = Math.random() * 28 - 8;
    return (
      <div className={style.row}>
        <div className={`${style.item} ${style.title}`}>{day}</div>
        {data
          .filter((d) => {
            return d.day == day;
          })
          .map((d, i) => {
            return (
              <div
                className={style.item}
                onClick={() => {
                  console.log(day, mccs[i]);
                  select(day, mccs[i]);
                }}
              >
                <TimeCurve
                  id={day + mccs[i]}
                  data={{
                    m: d["mds"],
                  }}
                  color={color}
                />
              </div>
            );
          })}
      </div>
    );
  }

  return (
    <div style={{ padding: "24px" }}>
      {/* <Popover
        anchorOrigin={{
          vertical: "center",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "center",
          horizontal: "left",
        }}
      >
        The content of the Popover.
      </Popover> */}
      <div className={style.header}>
        <div className={style.headerItem} style={{ border: "1px solid #666" }}>
          <Select
            labelId="config-year-select-label"
            id="config-year-select"
            value={2018}
            // onChange={handleChange}
            style={{
              fontSize: 10,
            }}
            name="year"
          >
            <MenuItem value={2018}>Temperature</MenuItem>
            <MenuItem value={2019}>Wind speed</MenuItem>
          </Select>
        </div>
        <div className={style.headerItem}>MCC 1</div>
        <div className={style.headerItem}>MCC 1</div>
        <div className={style.headerItem}>MCC 1</div>
        <div className={style.headerItem}>MCC 1</div>
        <div className={style.headerItem}>MCC 1</div>
        <div className={style.headerItem}>MCC 1</div>
      </div>
      <div className={style.content}>
        {days.map((i) => {
          return buildRow(i);
        })}
      </div>
    </div>
  );
}

export default App;
