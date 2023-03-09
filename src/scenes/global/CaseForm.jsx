import { useTheme } from "@emotion/react";
import { tokens } from "../../theme";
import { Box } from "@mui/material";
import { useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { CaseDetails as CaseDetailsClass } from "../../model/CaseDetails";
import { Button, IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Header from "../../components/Header";
import ApiClient from "../../ApiClient";
import CasesApi from "../../api/CasesApi";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";

const FieldWrapper = ({ field }) => {
  return (
    <Box display="flex" justifyContent="space-between">
      <Typography fontWeight="bold">{field.name}</Typography>
      <Typography>{field.value.value}</Typography>
      <IconButton>
        <HistoryOutlinedIcon />
      </IconButton>
    </Box>
  );
};

const CaseWrapper = ({ caseBase }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const handleChange = (panel) => (isExpanded) => {
    // TODO: send build request when clicked (?)
  };

  return (
    <Accordion defaultExpanded={true}>
      <AccordionSummary
        onChange={handleChange("")} // TODO
        expandIcon={<ExpandMoreIcon />}
        sx={{
          backgroundColor: colors.primary[400],
        }}
      >
        <Typography variant="h4" fontWeight="bold">
          {caseBase?.name}
        </Typography>
      </AccordionSummary>
      <AccordionDetails
        sx={{
          backgroundColor: colors.primary[400],
        }}
      >
        {/* Fields */}
        <Box borderTop={1} paddingTop="16px">
          {caseBase.fields?.map((field, i) => (
            <FieldWrapper field={field} />
          ))}
        </Box>

        {/* Related cases */}
        <Box borderTop={1} paddingTop="16px">
          {caseBase.relatedCases?.map((relatedCase, i) => (
            <CaseWrapper
              caseBase={CaseDetailsClass.constructFromObject(relatedCase)}
            />
          ))}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

const CaseForm = (props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [caseDetails, setCaseDetails] = useState(new CaseDetailsClass());
  const casesApi = new CasesApi(ApiClient);

  const callback = function (error, data, response) {
    let caseDetailsCopy;
    let caseDetailsCopyConst;

    if (error) {
      console.error(error);
    } else {
      console.log(
        "API called successfully. Returned data: " +
          JSON.stringify(data, null, 2)
      );
      caseDetailsCopyConst = CaseDetailsClass.constructFromObject(
        data,
        caseDetailsCopy
      );

      console.log(
        "caseDetails print: " + JSON.stringify(caseDetailsCopyConst, null, 2)
      );
    }
    setCaseDetails(caseDetailsCopyConst);
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

      {<CaseWrapper caseBase={caseDetails} />}

      <Button
        pt="25px"
        variant="outlined"
        color="neutral"
        size="medium"
        endIcon={<SendIcon />}
      >
        Send
      </Button>
    </Box>
  );
};

export default CaseForm;
