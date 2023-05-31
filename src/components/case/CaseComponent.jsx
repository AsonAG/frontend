import { useTheme } from "@emotion/react";
import { tokens } from "../../theme";
import { useContext, useEffect, useRef, useState } from "react";
import { Box, Divider, Paper } from "@mui/material";
import Typography from "@mui/material/Typography";
import { useUpdateEffect } from "usehooks-ts";
import { CaseContext } from "../../scenes/global/CasesForm";
import FieldComponent from "./FieldComponent";
import CaseFields from "./CaseFields";

export const getCasedKey = (_case) => "case_" + _case.name + "_" + _case.id;

const CaseComponent = ({ inputCase, setOutputCase }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [outputCaseFields, setOutputCaseFields] = useState({});
  const [outputRelatedCases, setOutputRelatedCases] = useState({});

  const { casesTableOfContents, setCasesTableOfContents } =
    useContext(CaseContext);
  const caseRef = useRef(null);

  useUpdateEffect(() => {
    // update output cases
    setOutputCase((prevState) => ({
      ...prevState,
      [getCasedKey(inputCase)]: {
        caseName: inputCase.name,
        values: outputCaseFields,
        relatedCases: outputRelatedCases,
      },
    }));
  }, [outputCaseFields, outputRelatedCases]);

  const handleRelatedCaseChange = (relatedCase) => {
    setOutputRelatedCases((current) => ({
      ...current,
      [getCasedKey(relatedCase)]: relatedCase,
    }));
  };

  // useUpdateEffect(() => {
  //   setCaseExpanded(casesTableOfContents['case_' + caseBase.id].expanded); /// co to jest?
  // }, [casesTableOfContents['case_' + caseBase.id]]);

  const handleAccordionChange = (caseDetails) => (event, isExpanded) => {
    setCasesTableOfContents((current) => ({
      ...current,
      ["case_" + caseDetails.id]: {
        displayName: caseDetails.displayName,
        id: caseDetails.id,
        expanded: isExpanded,
        ref: caseRef,
      },
    }));
  };

  useEffect(() => {
    // handleAccordionChange(inputCase);
  }, [inputCase]);

  return (
    <Box
      key={"casebox_" + inputCase.id}
      sx={{
        "& .MuiAccordionDetails-root": {
          padding: "0px 10px",
        },
        "& .MuiAccordionSummary-root": {
          minHeight: "48px !important",
        },
        "& .MuiAccordionSummary-content.Mui-expanded": {
          margin: "0",
        },
      }}
    >
      <Paper
        // defaultExpanded={true}
        elevation={3}
        key={"caseaccordion_" + inputCase.id}
        onChange={handleAccordionChange(inputCase)}
        ref={caseRef}
      >
        {CaseNameHeader(inputCase)}

        <Box
          sx={{ backgroundColor: colors.primary[300] }}
          key={"fields_" + inputCase.id}
        >
          <Divider />

          {/***************************** Case Fields *****************************/}
          <Box paddingTop="6px" key={"fieldswrapper_" + inputCase.id}>
            <CaseFields
              inputCase={inputCase}
              setOutputCaseFields={setOutputCaseFields}
            />
          </Box>

          {/***************************** Related Cases *****************************/}
          <Box key={"relatedcases_fieldswrapper_" + inputCase.id}>
            {inputCase?.relatedCases?.map((relatedCase) => (
              <CaseComponent
                inputCase={relatedCase}
                setOutputCase={setOutputRelatedCases}
                key={"case_related" + relatedCase.id}
              />
            ))}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

function CaseNameHeader(caseDetails) {
  return (
    <Box
      display="flex"
      alignItems="baseline"
      sx={{
        // backgroundColor: colors.primary[300],
        margin: "8px 0",
      }}
      key={"casesummary_" + caseDetails.id}
    >
      <Typography
        variant="h4"
        fontWeight="bold"
        key={"casename_" + caseDetails.id}
        sx={{
          marginLeft: "6px",
          marginRight: "20px",
          flexShrink: 0,
        }}
      >
        {caseDetails.displayName}
      </Typography>

      <Typography
        variant="h5"
        sx={{ color: "text.secondary" }}
        key={"casename_desc_" + caseDetails.id}
      >
        {caseDetails.description}
      </Typography>
    </Box>
  );
}
export default CaseComponent;
