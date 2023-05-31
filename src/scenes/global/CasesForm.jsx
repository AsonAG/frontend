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
import CaseComponent from "../../components/case/CaseComponent";
import { UserContext } from "../../App";
import { useUpdateEffect } from "usehooks-ts";
import CasesFormWrapper from "../../components/cases/CasesFormWrapper";

export const CaseContext = createContext();

const CasesForm = ({ employee, navigateTo, title }) => {
  const caseName = window.sessionStorage.getItem("caseName");

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [caseInput, setCaseInput] = useState();
  const [caseOutput, setCaseOutput] = useState({});
  const { user, setUser } = useContext(UserContext);
  const casesApi = useMemo(() => new CasesApi(ApiClient, user), [user]);
  const formRef = useRef();
  const [casesTableOfContents, setCasesTableOfContents] = useState({});

  useEffect(() => {
    casesApi.getCaseFields(
      //TODO: add logic to check if cases changed before sending a request
      caseName,
      getFieldsCallback,
      caseOutput,
      employee?.employeeId
    );
  }, [caseOutput]);

  useEffect(() => {
    console.log("User changed.");
  }, [user]);

  // useUpdateEffect(() => {
  //   updateCasesTableOfContents();
  // }, [caseDetails]);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (formRef.current.reportValidity()) {
      console.log("form is valid");
      casesApi.saveCase(caseOutput, caseSaveCallback, employee?.employeeId);
    } else {
      console.log("form INVALID");
    }
  };

  const getFieldsCallback = function (error, data, response) {
    if (error) {
      console.error(error);
    }
    setCaseInput(data);
    console.log(JSON.stringify(data, null, 2));
  };

  const caseSaveCallback = function (error, data, response) {
    if (error) {
      console.error(error);
      // TODO: add popup error message display on code:400
    } else {
      console.log(
        "Case saved successfully. Response: " +
          JSON.stringify(response, null, 2)
      );
      console.log("Navigating to: " + navigateTo);
      navigate(navigateTo);
    }
  };

  const updateCasesTableOfContents = () => {
    let accordionCase = {};
    if (caseInput && !("case_" + caseInput.id in casesTableOfContents)) {
      accordionCase["case_" + caseInput.id] = {
        displayName: caseInput.displayName,
        id: caseInput.id,
        expanded: true,
      };
    }

    for (let idx = 0; idx < caseInput.relatedCases.length; idx++) {
      const relatedCase = caseInput.relatedCases[idx];
      if (relatedCase && !("case_" + relatedCase.id in casesTableOfContents)) {
        // TODO: add another loop for relatedCases of relatedCases
        accordionCase["case_" + relatedCase.id] = {
          displayName: relatedCase.displayName,
          id: relatedCase.id,
          expanded: true,
        };
      }
    }

    setCasesTableOfContents((current) => ({
      ...current,
      ...accordionCase,
    }));
  };

  return (
    <CaseContext.Provider
      // value={{ isSaveButtonClicked, setIsSaveButtonClicked }}
      value={{ casesTableOfContents, setCasesTableOfContents }}
    >
      <CasesFormWrapper title={title} onSubmit={handleSubmit}>
        <form ref={formRef}>
          <Box>
            {caseInput && (
              <CaseComponent
                caseBase={caseInput}
                setOutputCase={setCaseOutput}
              />
            )}
          </Box>
        </form>
      </CasesFormWrapper>
    </CaseContext.Provider>
    // <CircularProgress color="neutral" variant="soft" size="lg"/>
  );
};

export default CasesForm;
