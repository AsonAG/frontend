import { useTheme } from "@emotion/react";
import { useMemo, useRef, useState, useContext, createContext, useEffect } from "react";
import { tokens } from "../../theme";
import { Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import SendIcon from "@mui/icons-material/Send";
import Header from "../Header";
import ApiClient from "../../api/ApiClient";
import CasesApi from "../../api/CasesApi";
import CaseFieldsForm from "./CaseFieldsForm";
import useDidMountEffect from "../../hooks/useDidMountEffect";
import { UserContext } from "../../App";


export const CaseContext = createContext();

const CaseForm = (props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [caseDetails, setCaseDetails] = useState();
  const [outputCase, setOutputCase] = useState({});
  const [relatedCases, setRelatedCases] = useState({});
  const { user, setUser } = useContext(UserContext);
  const casesApi = useMemo(() => new CasesApi(ApiClient, user), [user]);
  const formRef = useRef();

  const [isSaveButtonClicked, setIsSaveButtonClicked] = useState(false);


  const handleSubmit = (event) => {
    // event.preventDefault();
    if (formRef.current.reportValidity()) {
      console.log("form is valid");
      casesApi.saveCase(outputCase, relatedCases, caseSaveCallback);
    } else console.log("form INVALID");
  };

  const caseSaveCallback = function (error, data, response) {
    if (error) {
      console.error(error);
      setIsSaveButtonClicked(true);
    } else {
      console.log(
        "Case saved successfully. Response: " +
          JSON.stringify(response, null, 2) +
          "Exiting page..."
      );
      navigate("/tasks");
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
        JSON.stringify(outputCase, null, 2) +
        " ___related_cases___  " +
        JSON.stringify(relatedCases, null, 2)
    );
    // create request body
    casesApi.getCaseFields(
      props.caseName,
      callback,
      outputCase,
      relatedCases
    );
  }, [outputCase, relatedCases]);

  useEffect(()=>{}, [user]);

  return (
    props.caseName && (
      <Box m="25px" display="flex" flexDirection="column" alignItems="left">
        {/* HEADER */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          {/* <Header title={props.caseName} subtitle="Fulfill the case details" /> */}
          <Header title={caseDetails?.displayName} subtitle="Fulfill the case details" />
        </Box>

        <form ref={formRef}>
          <CaseContext.Provider value={{isSaveButtonClicked, setIsSaveButtonClicked}}>
          <Box>
            {caseDetails && (
              <CaseFieldsForm
                caseBase={caseDetails}
                isBase={true}
                outputCases={outputCase}
                setOutputCases={setOutputCase}
                key={"case_main"}
              />
            )}
          </Box>

          <Box>
            {caseDetails?.relatedCases?.map((relatedCase, i) => (
              <CaseFieldsForm
                caseBase={relatedCase}
                outputCases={relatedCases}
                setOutputCases={setRelatedCases}
                key={"case_related" + i + relatedCase.id}
              />
            ))}
          </Box>

          <Box mt="20px" mb="30px">
            <Button
              disableRipple
              type="submit"
              variant="contained"
              color="secondary"
              size="large"
              onClick={handleSubmit}
              to="/status"
              endIcon={<SendIcon />}
            >
              Send
            </Button>
          </Box>
          </CaseContext.Provider>
        </form>
      </Box>
    )
  );
};

export default CaseForm;
