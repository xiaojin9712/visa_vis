import { createMuiTheme } from "@material-ui/core/styles";

const theme = createMuiTheme({
  overrides: {
    MuiButton: {
      root: {
        borderRadius: 0,
        boxShadow: "none",
      },
      contained: {
        boxShadow: "none",
        "&:hover": {
          boxShadow: "none",
        },
      },
    },
    MuiAccordion: {
      root: {
        boxShadow: "none",
      },
    },
  },
  palette: {
    primary: {
      main: "#391D71",
    },
    secondary: {
      main: "#FD486E",
    },
  },
});

export default theme;
