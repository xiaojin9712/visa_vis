import React, { useRef, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import * as d3 from "d3";

import Line from "../lineLayout";
import Lines from "../smallMultiplesLayout";
import Similarity from "../similarity/index";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "40%",
    border: "1px dashed #666",
    height: "max-content",
  },
  heading: {
    fontSize: theme.typography.pxToRem(14),
    fontWeight: theme.typography.fontWeightRegular,
  },
  content: {
    display: "flex",
    justifyContent: "center",
  },
}));

export default function SimpleAccordion() {
  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={classes.root}>
      <Accordion
        expanded={expanded}
        onClick={() => {
          setExpanded(!expanded);
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography className={classes.heading}>Similarity Matrix</Typography>
        </AccordionSummary>
        <AccordionDetails className={classes.content}>
          <Similarity />
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography className={classes.heading}>Overview</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Lines />
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography className={classes.heading}>Segment</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Line />
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
