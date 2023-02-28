import { useTheme } from "@emotion/react";
import { tokens } from "../../theme";
import { Box } from "@mui/material";
import { useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { CaseDetails as CaseDetailsClass} from "../../model/CaseDetails";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Header from "../../components/Header";
import ApiClient from "../../ApiClient";
import CasesApi from "../../api/CasesApi";

const CaseForm = (props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [caseDetails, setCaseDetails] = useState(new CaseDetailsClass());
  const { state } = useLocation();
  const casesApi = new CasesApi(ApiClient);

  const handleChange = (panel) => (isExpanded) => {
    // TODO: send build request when clicked (?)
  };

  const callback = function (error, data, response) {
    let caseDetailsCopy;

    if (error) {
      console.error(error);
    } else {
      console.log(
        "API called successfully. Returned data: " +
          JSON.stringify(data, null, 2)
      );
      CaseDetailsClass.constructFromObject(data, caseDetailsCopy);
    }
    setCaseDetails(caseDetailsCopy);
  };

  useEffect(() => {
    console.log("Making api Request for a case: " + props.caseName);
    casesApi.getCaseFields(props.caseName, callback);
  }, []);

  return (
    <Box m="25px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title={props.caseName} subtitle="Fulfill the case details" />
      </Box>

      { caseDetails ? 
      <Accordion>
      <AccordionSummary
        onChange={handleChange("panel1")} // TODO
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography>{caseDetails.name}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
          malesuada lacus ex, sit amet blandit leo lobortis eget.
        </Typography>
      </AccordionDetails>
    </Accordion>
      :
      
      
      };

      

      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography>Accordion 2</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            malesuada lacus ex, sit amet blandit leo lobortis eget.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion disabled>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3a-content"
          id="panel3a-header"
        >
          <Typography>Disabled Accordion</Typography>
        </AccordionSummary>
      </Accordion>
    </Box>
  );
};

export default CaseForm;
