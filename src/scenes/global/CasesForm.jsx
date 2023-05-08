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
import { Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import SendIcon from "@mui/icons-material/Send";
import ApiClient from "../../api/ApiClient";
import CasesApi from "../../api/CasesApi";
import CaseFieldsComponent from "../../components/case/CaseFieldsComponent";
import useDidMountEffect from "../../hooks/useDidMountEffect";
import { UserContext } from "../../App";
import { useUpdateEffect } from "usehooks-ts";

export const CaseContext = createContext();

const CasesForm = ({employee, navigateTo}) => {
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

  const [isSaveButtonClicked, setIsSaveButtonClicked] = useState(false);

  const handleSubmit = (event) => { 
    event.preventDefault();

    if (formRef.current.reportValidity()) {
      console.log("form is valid");
      casesApi.saveCase(outputCase, relatedCases, caseSaveCallback, employee?.employeeId ); 
    } else {
      console.log("form INVALID");
    }
  };

  const caseSaveCallback = function (error, data, response) {
    if (error) {
      console.error(error);
      setIsSaveButtonClicked(true);
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

    casesApi.getCaseFields(caseName, callback, outputCase, relatedCases, employee?.employeeId);
  }, [outputCase, relatedCases]);

  useEffect(() => {
    console.log("User changed.");
  }, [user]);

  return (
    caseName && (
      <form ref={formRef}>
        <CaseContext.Provider
          value={{ isSaveButtonClicked, setIsSaveButtonClicked }}
        >
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

          <Box mt="20px" mb="30px" display="flex" flexDirection="row-reverse">
            <Box width="240px" >
            <Button
              // disable={}
              disableRipple
              fullWidth
              type="submit"
              variant="contained"
              color="secondary"
              size="large"
              onClick={handleSubmit}
              endIcon={<SendIcon />}
            >
              Send
            </Button>
            </Box>
          </Box>
        </CaseContext.Provider>
      </form>
    )
  );
};

export default CasesForm;
