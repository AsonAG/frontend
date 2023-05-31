import { useTheme } from "@emotion/react";
import { tokens } from "../../theme";
import { useContext, useEffect, useRef, useState } from "react";
import { Box, Divider, Paper } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useUpdateEffect } from "usehooks-ts";
import { CaseContext } from "../../scenes/global/CasesForm";
import { CaseValueSetup } from "../../generated_model/CaseValueSetup";
import FieldComponent from "./FieldComponent";

export const getCasedKey = (_case) => "case_" + _case.name + "_" + _case.id;

const CaseComponent = ({ caseBase, setOutputCase }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [caseFieldsList, setCaseFieldsList] = useState({});
  const [outputRelatedCases, setOutputRelatedCases] = useState({});

  const { casesTableOfContents, setCasesTableOfContents } =
    useContext(CaseContext);
  const caseRef = useRef(null);

  useUpdateEffect(() => {
    // update output cases
    setOutputCase((prevState) => ({
      ...prevState,
      [getCasedKey(caseBase)]: {
        caseName: caseBase.name,
        values: caseFieldsList,
        relatedCases: outputRelatedCases,
      },
    }));
  }, [caseFieldsList, outputRelatedCases]);

  const handleFieldChange = (
    fieldId,
    fieldName,
    fieldValue,
    fieldStartDate,
    fieldEndDate
  ) => {
    setCaseFieldsList((current) => ({
      ...current,
      [fieldId]: {
        caseName: caseBase.name,
        caseFieldName: fieldName,
        value: fieldValue,
        start: isoDateWithoutTimeZone(fieldStartDate),
        end: isoDateWithoutTimeZone(fieldEndDate),
      },
    }));
  };

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
    // handleAccordionChange(caseBase);
  }, [caseBase]);

  return (
    <Box
      key={"casebox_" + caseBase.id}
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
        key={"caseaccordion_" + caseBase.id}
        onChange={handleAccordionChange(caseBase)}
        ref={caseRef}
      >
        {CaseNameHeader(caseBase)}

        <Box
          sx={{ backgroundColor: colors.primary[300] }}
          key={"fields_" + caseBase.id}
        >
          <Divider />

          {/***************************** Case Fields *****************************/}
          <Box paddingTop="6px" key={"fieldswrapper_" + caseBase.id}>
            {caseBase?.fields?.map((field) => (
              <FieldComponent
                field={field}
                onChange={handleFieldChange}
                key={"field_" + field.id}
              />
            ))}
          </Box>

          {/***************************** Related Cases *****************************/}
          <Box>
            {caseBase?.relatedCases?.map((relatedCase) => (
              <CaseComponent
                caseBase={relatedCase}
                setOutputCase={
                  // (relatedCase) =>
                  setOutputRelatedCases
                  // (relatedCase)
                }
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

const isoDateWithoutTimeZone = (date) => {
  if (date == null) return date;
  let timestamp = date.getTime() - date.getTimezoneOffset() * 60000;
  let correctDate = new Date(timestamp);
  return correctDate.toISOString();
};

export default CaseComponent;
