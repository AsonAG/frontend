import { useTheme } from "@emotion/react";
import { tokens } from "../../theme";
import { Box } from "@mui/material";
import { useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "../../components/Header";
import ApiClient from "../../ApiClient";
import CasesApi from "../../api/CasesApi";
import { CaseDetails } from "../../model/CaseDetails";

const CaseForm = (props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [caseDetailsObj, setCaseDetailsObj] = useState(new CaseDetails());
  const { state } = useLocation();

  const casesApi = new CasesApi(ApiClient);

  const callback = function (error, data, response) {
    let caseDetailsObjCopy;

    if (error) {
      console.error(error);
    } else {
      console.log(
        "API called successfully. Returned data: " +
          JSON.stringify(data, null, 2)
      );
      CaseDetails.constructFromObject(data, caseDetailsObjCopy);
    }
    setCaseDetailsObj(caseDetailsObjCopy);
    console.log(
      "Our CaseDetailsObj data: " + JSON.stringify(caseDetailsObj, null, 2)
    );
  };

  useEffect(() => {
    console.log("state" + state);
    console.log("theme" + JSON.stringify(theme));

    console.log("Making api Request for a case: " + props.caseName);
    casesApi.getCaseFields(props.caseName, callback);
  }, []);

  return (
    <Box m="25px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title={props.caseName} subtitle="Fulfill the case details" />
      </Box>
    </Box>
  );
};

export default CaseForm;
