import { useTheme } from "@emotion/react";
import { useMemo } from "react";
import { tokens } from "../../../theme";
import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { CaseDetails as CaseDetailsClass } from "../../../model/CaseDetails";
import { Button } from "@mui/material";
import { CaseFieldValue } from "../../../model/CaseFieldValue";
import SendIcon from "@mui/icons-material/Send";
import Header from "../../../components/Header";
import ApiClient from "../../../ApiClient";
import CasesApi from "../../../api/CasesApi";
import CaseWrapper from "./CaseWrapper";
import useDidMountEffect from "../../../hooks/useDidMountEffect";

const CaseForm = (props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [caseDetails, setCaseDetails] = useState(new CaseDetailsClass());
  const [fieldTimeEdit, setfieldTimeEdit] = useState(new CaseFieldValue());
  const [outputCases, setOutputCases] = useState({});
  const casesApi = useMemo(() => new CasesApi(ApiClient), []);

  // const handleSubmit = (event) => {
  //   alert("A name was submitted: " + JSON(fieldInputs));
  //   event.preventDefault();
  // };

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

  return (
    props.caseName && (
      <Box m="25px" display="flex" flexDirection="column" alignItems="left">
        {/* HEADER */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Header title={props.caseName} subtitle="Fulfill the case details" />
        </Box>

        {/* <FormControl */}
        <form
        // handleSubmit={handleSubmit}
        >
          <Box>
            {caseDetails && (
              <CaseWrapper
                caseBase={caseDetails}
                isBase={true}
                setOutputCases={setOutputCases}
                key={"case_main"}
              />
            )}
          </Box>

          <Box>
            {caseDetails?.relatedCases?.map((relatedCase, i) => (
              <CaseWrapper
                caseBase={relatedCase}
                setOutputCases={setOutputCases}
                key={"case_related" + i + relatedCase.id}
              />
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
    )
  );
};

export default CaseForm;
