import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Upload from "../upload";

import style from "./style.module.css";
import { OptionContext } from "../../context";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

function ConfigurationPanel() {
  const { options, setCurrentOption } = useContext(OptionContext);
  const classes = useStyles();
  const [config, setConfig] = React.useState({
    year: 2018,
    city: "Reading",
    timeMode: "year",
    indicator: "weather",
    mcc: "travel",
    weather: "temperature",
  });
  const { year, city, timeMode, indicator, mcc, weather } = config;

  const handleChange = (event) => {
    setConfig({
      ...config,
      [event.target.name]: event.target.value,
    });
  };

  const handleOptionChange = () => {
    setCurrentOption({
      ...options,
      ...config,
    });
  };
  return (
    <div className={style.ConfigurationPanel}>
      <div className={style.panel}>
        <div className={style.config}>
          <div className={style.item}>
            <FormControl className={classes.formControl}>
              <InputLabel id="config-year" style={{ fontSize: 14 }}>
                Year
              </InputLabel>
              <Select
                labelId="config-year-select-label"
                id="config-year-select"
                value={year}
                onChange={handleChange}
                style={{
                  fontSize: 14,
                }}
                name="year"
              >
                <MenuItem value={2018}>2018</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div className={style.item}>
            <FormControl className={classes.formControl}>
              <InputLabel id="config-city" style={{ fontSize: 14 }}>
                City
              </InputLabel>
              <Select
                labelId="config-city-select-label"
                id="config-city-select"
                value={city}
                name="city"
                onChange={handleChange}
                style={{
                  fontSize: 14,
                }}
              >
                <MenuItem value={"Reading"}>Reading</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div className={style.item}>
            <FormControl className={classes.formControl}>
              <InputLabel id="config-timeMode" style={{ fontSize: 14 }}>
                Time scale
              </InputLabel>
              <Select
                labelId="config-timeMode-select-label"
                id="config-timeMode-select"
                value={timeMode}
                onChange={handleChange}
                name="timeMode"
                style={{
                  fontSize: 14,
                }}
              >
                <MenuItem value={"year"}>Year</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div className={style.item}>
            <FormControl className={classes.formControl}>
              <InputLabel id="config-indicator" style={{ fontSize: 14 }}>
                Indicator
              </InputLabel>
              <Select
                labelId="config-indicator-select-label"
                id="config-indicator-select"
                value={indicator}
                name="indicator"
                onChange={handleChange}
                style={{
                  fontSize: 14,
                }}
              >
                <MenuItem value={"mcc"}>MCC</MenuItem>
                <MenuItem value={"weather"}>Weather</MenuItem>
              </Select>
            </FormControl>
          </div>
          {indicator == "mcc" ? (
            <div className={style.item}>
              <FormControl className={classes.formControl}>
                <InputLabel
                  id="config-mcc-select-label"
                  style={{ fontSize: 14 }}
                >
                  MCC
                </InputLabel>
                <Select
                  labelId="config-mcc-select-label"
                  id="config-mcc-select"
                  value={mcc}
                  onChange={handleChange}
                  name="mcc"
                  style={{
                    fontSize: 14,
                  }}
                >
                  <MenuItem value={"travel"}>Travel</MenuItem>
                </Select>
              </FormControl>
            </div>
          ) : (
            <div className={style.item}>
              <FormControl className={classes.formControl}>
                <InputLabel
                  id="config-weather-select-label"
                  style={{ fontSize: 14 }}
                >
                  Weather
                </InputLabel>
                <Select
                  labelId="config-weather-select-label"
                  id="config-weather-select"
                  value={weather}
                  onChange={handleChange}
                  name="weather"
                  style={{
                    fontSize: 14,
                  }}
                >
                  <MenuItem value={"temperature"}>Temperature</MenuItem>
                  <MenuItem value={"precip1Hour"}>precip1Hour</MenuItem>
                  <MenuItem value={"windSpeed"}>windSpeed</MenuItem>
                </Select>
              </FormControl>
            </div>
          )}
        </div>
        <Grid
          container
          spacing={2}
          justify="space-between"
          alignItems="flex-end"
        >
          <Grid item>
            <Upload />
          </Grid>
          <Grid item>
            <Button
              color="primary"
              variant="contained"
              size="small"
              onClick={handleOptionChange}
            >
              UPDATE
            </Button>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

export default ConfigurationPanel;
