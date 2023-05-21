import { useTheme } from "@emotion/react";
import {
  useMemo,
  useRef,
  useState,
  useContext,
  createContext,
  useEffect,
} from "react";
import { tokens } from "../../theme";
import { Box, Button, CircularProgress, LinearProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import SendIcon from "@mui/icons-material/Send";
import ApiClient from "../../api/ApiClient";
import CasesApi from "../../api/CasesApi";
import CaseFieldsComponent from "../../components/case/CaseFieldsComponent";
import { UserContext } from "../../App";
import { useUpdateEffect } from "usehooks-ts";
import CasesFormWrapper from "./CasesFormWrapper";

export const CaseContext = createContext();

const CasesForm = ({ employee, navigateTo, title }) => {
  const caseName = window.sessionStorage.getItem("caseName");

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [caseDetails, setCaseDetails] = useState();
  const [outputCase, setOutputCase] = useState({});
  const [relatedCases, setRelatedCases] = useState({});
  const { user, setUser } = useContext(UserContext);
  const casesApi = useMemo(() => new CasesApi(ApiClient, user), [user]);
  const formRef = useRef();
  // const [isSaveButtonClicked, setIsSaveButtonClicked] = useState(false);
  const [casesTableOfContents, setCasesTableOfContents] = useState({});

  const handleSubmit = (event) => {
    event.preventDefault();

    if (formRef.current.reportValidity()) {
      console.log("form is valid");
      casesApi.saveCase(
        outputCase,
        relatedCases,
        caseSaveCallback,
        employee?.employeeId
      );
    } else {
      console.log("form INVALID");
    }
  };

  const caseSaveCallback = function (error, data, response) {
    if (error) {
      console.error(error);
      // setIsSaveButtonClicked(true);
    } else {
      console.log(
        "Case saved successfully. Response: " +
          JSON.stringify(response, null, 2)
      );
      console.log("Navigating to: " + navigateTo);
      navigate(navigateTo);
    }
  };

  const callback = function (error, data, response) {
    if (error) {
      console.error(error);
    }
    // else {
    //   console.log(
    //     "API called successfully. Returned CaseForm data: " +
    //       JSON.stringify(data, null, 2)
    //   );
    // }
    setCaseDetails(data);
  };

  useEffect(() => {
    // console.log(
    //   "Making api Request for a case fields update: " +
    //     caseName +
    //     JSON.stringify(outputCase, null, 2) +
    //     " ___related_cases___  " +
    //     JSON.stringify(relatedCases, null, 2)
    // );

    casesApi.getCaseFields(
      caseName,
      callback,
      outputCase,
      relatedCases,
      employee?.employeeId
    );
  }, [outputCase, relatedCases]);

  useEffect(() => {
    console.log("User changed.");
  }, [user]);

  return (
    <CaseContext.Provider
      // value={{ isSaveButtonClicked, setIsSaveButtonClicked }}
      value={{ casesTableOfContents, setCasesTableOfContents }}
    >
      <CasesFormWrapper title={title} onSubmit={handleSubmit}>
        <form ref={formRef}>
          <Box>
            {caseDetails && (
              <CaseFieldsComponent
                caseBase={caseDetails}
                isBase={true}
                setOutputCases={setOutputCase}
                key={"case_main"}
              />
            )}
          </Box>

          <Box>
            {caseDetails?.relatedCases?.map((relatedCase, i) => (
              <CaseFieldsComponent
                caseBase={relatedCase}
                setOutputCases={setRelatedCases}
                key={"case_related" + i + relatedCase.id}
              />
            ))}
          </Box>
        </form>
      </CasesFormWrapper>
    </CaseContext.Provider>
    // <CircularProgress color="neutral" variant="soft" size="lg"/>
  );
};

export default CasesForm;
