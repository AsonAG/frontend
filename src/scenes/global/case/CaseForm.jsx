import { useTheme } from "@emotion/react";
import { useMemo } from "react";
import { tokens } from "../../../theme";
import { Box, Button } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SendIcon from "@mui/icons-material/Send";
import Header from "../../../components/Header";
import ApiClient from "../../../ApiClient";
import CasesApi from "../../../api/CasesApi";
import CaseWrapper from "./CaseWrapper";
import useDidMountEffect from "../../../hooks/useDidMountEffect";

const CaseForm = (props) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const colors = tokens(theme.palette.mode);
  const [caseDetails, setCaseDetails] = useState();
  const [outputCases, setOutputCases] = useState({});
  const casesApi = useMemo(() => new CasesApi(ApiClient), []);

  const handleSubmit = (event) => {
    console.log("A case was submitted: " + JSON.stringify(outputCases, null, 2));
    // event.preventDefault();
    casesApi.saveCase(props.caseName, outputCases, caseSaveCallback);
    navigate('/tasks');
  };

  const caseSaveCallback = function (error, data, response) {
    if (error) {
      console.error(error);
    } else {
      console.log(
        "Case saved successfully. Response: " +
          JSON.stringify(response, null, 2)
      );
    }
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

  useDidMountEffect(() => {
    console.log(
      "Making api Request for a case fields update: " +
        props.caseName +
        JSON.stringify(outputCases)
    );
    // create request body
    casesApi.getCaseFields(props.caseName, callback, outputCases);

  }, [outputCases]);

  // useDidMountEffect(() => {
  //   caseDetails.map((case))
  //   if ("lookupName" in field.lookupSettings) {
  //     casesApi.getCaseLookups(field.lookupSettings.lookupName, callbackLookups);
  //   }
  // }, [caseDetails]);


  return (
    props.caseName && (
      <Box m="25px" display="flex" flexDirection="column" alignItems="left">
        {/* HEADER */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Header title={props.caseName} subtitle="Fulfill the case details" />
        </Box>

         <form>
          <Box>
            {caseDetails && (
              <CaseWrapper
                caseBase={caseDetails}
                isBase={true}
                outputCases={outputCases}
                setOutputCases={setOutputCases}
                key={"case_main"}
              />
            )}
          </Box>

          <Box>
            {caseDetails?.relatedCases?.map((relatedCase, i) => (
              <CaseWrapper
                caseBase={relatedCase}
                outputCases={outputCases}
                setOutputCases={setOutputCases}
                key={"case_related" + i + relatedCase.id}
              />
            ))}
          </Box>

          <Box mt="20px" mb="30px">
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              size="large"        
              onClick={handleSubmit}
              to="/tasks"
              endIcon={<SendIcon />}
            >
              Send
            </Button>
          </Box>
        </form>
      </Box>
    )
  );
};

export default CaseForm;
