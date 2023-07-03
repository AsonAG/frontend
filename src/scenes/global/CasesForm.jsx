import {
  useMemo,
  useRef,
  useState,
  useContext,
  createContext,
  useEffect,
} from "react";
import { Box, Button, CircularProgress, LinearProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ApiClient from "../../api/ApiClient";
import CasesApi from "../../api/CasesApi";
import CaseComponent from "../../components/case/CaseComponent";
import { UserContext } from "../../App";
import { useUpdateEffect } from "usehooks-ts";
import CasesFormWrapper from "../../components/cases/CasesFormWrapper";
import ErrorBar from "../../components/errors/ErrorBar";

export const CaseContext = createContext();

const CasesForm = ({ employee, navigateTo, title, readOnly }) => {
  const caseName = window.sessionStorage.getItem("caseName");

  const navigate = useNavigate();
  const [inputCase, setInputCase] = useState();
  const [outputCase, setOutputCase] = useState({});
  const { user, setUser } = useContext(UserContext);
  const casesApi = useMemo(() => new CasesApi(ApiClient, user), [user]);
  const formRef = useRef();
  const [error, setError] = useState();
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useUpdateEffect(() => {
    console.log("User changed.");
  }, [user]);

  useEffect(() => {
    // setOutputCase({});
    casesApi.getCaseFields(
      //TODO: add logic to check if cases changed before sending a request
      caseName,
      inputCase,
      outputCase,
      getFieldsCallback,
      employee?.employeeId
    );
  }, [outputCase]);

  const getFieldsCallback = function (error, data, response) {
    setIsDataLoaded(true);
    if (error) {
      setError(error);
      console.error(JSON.stringify(error, null, 2));
    }
    // setOutputCase({});
    else {
      setInputCase(data);
      console.log(JSON.stringify(data, null, 2));
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (formRef.current.reportValidity()) {
      console.log("form is valid");
      casesApi.saveCase(
        inputCase,
        outputCase,
        caseSaveCallback,
        employee?.employeeId
      );
    } else {
      console.log("form INVALID");
    }
  };

  const caseSaveCallback = function (error, data, response) {
    if (error) {
      // showBoundary(error);
      console.error(JSON.stringify(error, null, 2));
      setError(error);
    } else {
      console.log(
        "Case saved successfully. Response: " +
          JSON.stringify(response, null, 2)
      );
      console.log("Navigating to: " + navigateTo);
      navigate(navigateTo);
    }
  };

  return (
    <CaseContext.Provider value={readOnly}>
      <CasesFormWrapper
        title={title}
        onSubmit={handleSubmit}
        outputCase={outputCase}
      >
        {error && (
          <ErrorBar error={error} resetErrorBoundary={() => setError(null)} />
        )}

        <form ref={formRef} key={"caseform_" + inputCase?.id}>
          <Box key={"casebox_" + inputCase?.id}>
            {inputCase && (
              <CaseComponent
                inputCase={inputCase}
                setOutputCase={setOutputCase}
                key={"basecase_" + inputCase?.id}
              />
            )}
          </Box>
        </form>
      </CasesFormWrapper>
      {!isDataLoaded && (
        <CircularProgress color="secondary" variant="soft" size="lg" />
      )}
    </CaseContext.Provider>
  );
};

export default CasesForm;
