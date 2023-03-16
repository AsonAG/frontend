import { useTheme } from "@emotion/react";
import { tokens } from "../../theme";
import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { CaseDetails as CaseDetailsClass } from "../../model/CaseDetails";
import { Button, IconButton } from "@mui/material";
import { CaseFieldValue } from "../../model/CaseFieldValue";
import SendIcon from "@mui/icons-material/Send";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Input from "@mui/material/Input";
import FormControl from "@mui/material/FormControl";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Header from "../../components/Header";
import ApiClient from "../../ApiClient";
import CasesApi from "../../api/CasesApi";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";

import FieldsForm from "./FieldsForm";
import { useFormControl } from "@mui/material/FormControl";

const CaseForm = (props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [caseDetails, setCaseDetails] = useState(new CaseDetailsClass());
  const casesApi = new CasesApi(ApiClient);
  const [fieldTimeEdit, setfieldTimeEdit] = useState(new CaseFieldValue());
  const [outputFields, setOutputFields] = useState({});

  // const handleSubmit = (event) => {
  //   alert("A name was submitted: " + JSON(fieldInputs));
  //   event.preventDefault();
  // };

  const CaseWrapper = ({ caseBase, isBase }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    return (
      <Box borderBottom={1} key={'casebox_'+caseBase.id}>
        <Accordion defaultExpanded={true} elevation={5} key={'caseaccordion_'+caseBase.id}>
          {isBase ? (
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                backgroundColor: colors.primary[300],
              }}
              key={'casesummary_'+caseBase.id}
            >
              <Typography variant="h4" fontWeight="bold" key={'casename_'+caseBase.id} >
                {caseBase?.displayName}
              </Typography>
            </AccordionSummary>
          ) : (
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                backgroundColor: colors.primary[400],
                marginTop: "18px",
              }}
              key={'casesummary_'+caseBase.id}
            >
              <Typography variant="h4" fontWeight="bold" key={'casename_'+caseBase.id} >
                {caseBase?.displayName}
              </Typography>
            </AccordionSummary>
          )}

          {/* Fields */}
          <AccordionDetails
            sx={{
              backgroundColor: colors.primary[400],
            }}
            key={'fields_'+caseBase.id}
          >
            <Box borderTop={1} paddingTop="16px" key={'fieldswrapper_'+caseBase.id} >
              {caseBase?.fields?.map((field, i) => (
                <FieldsForm field={field} setOutputFields={setOutputFields} key={'field_'+field.id} />
              ))}
            </Box>
          </AccordionDetails>
        </Accordion>
      </Box>
    );
  };

  const callback = function (error, data, response) {
    if (error) {
      console.error(error);
    } else {
      console.log(
        "API called successfully. Returned CaseForm data: " +
          JSON.stringify(data, null, 2)
      );
    }
    setCaseDetails(data);
  };

  useEffect(() => {
    console.log("Making api Request for a case fields update: " + props.caseName + JSON.stringify(outputFields));
    // create request body
    casesApi.getCaseFields(props.caseName, callback, outputFields);
  }, [outputFields]);

  return (
    <Box m="25px" display="flex" flexDirection="column" alignItems="left">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title={props.caseName} subtitle="Fulfill the case details" />
      </Box>

      {/* <FormControl */}
      <form 
        // handleSubmit={handleSubmit}
        >
        <Box>{<CaseWrapper caseBase={caseDetails} isBase={true} key={'case_'+caseDetails.id} />}</Box>

        <Box>
          {caseDetails?.relatedCases?.map((relatedCase, i) => (
            <CaseWrapper caseBase={relatedCase} key={'case_'+relatedCase.id} />
          ))}
        </Box>

        <Box mt="20px" ml="auto">
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              size="large"
              endIcon={<SendIcon />}
            >
              Send
            </Button>
        </Box>
      </form>
    </Box>
  );
};

export default CaseForm;
