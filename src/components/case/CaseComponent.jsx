import { useTheme } from "@emotion/react";
import { tokens } from "../../theme";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Box, Divider, Paper } from "@mui/material";
import { useEffectOnce, useUpdateEffect } from "usehooks-ts";
import { CaseContext } from "../../scenes/global/CasesForm";
import CaseNameHeader from "../../scenes/global/CaseNameHeader";
import CaseFields from "./CaseFields";

export const getCasedKey = (_case) => "case_" + _case.name + "_" + _case.id;

const CaseComponent = ({ inputCase, setOutputCase }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [outputCaseFields, setOutputCaseFields] = useState({});
  const [outputRelatedCases, setOutputRelatedCases] = useState({});

  const caseFields = useMemo(
    () => (
      <CaseFields
        inputCase={inputCase}
        setOutputCaseFields={setOutputCaseFields}
        key={"casefields_" + inputCase.id}
      />
    ),
    [inputCase]
  );
  const relatedCases = useMemo(
    () => (
      <Box key={"relatedcases_fieldswrapper_" + inputCase.id}>
        {inputCase.relatedCases?.map((relatedCase) => (
          <CaseComponent
            inputCase={relatedCase}
            setOutputCase={setOutputRelatedCases}
            key={"case_related" + relatedCase.id}
          />
        ))}
      </Box>
    ),
    [inputCase.relatedCases]
  );

  const { casesTableOfContents, setCasesTableOfContents } =
    useContext(CaseContext);
  const caseRef = useRef(null);

  useEffectOnce(() => {
    // setOutputCaseFields({});
    // setOutputRelatedCases({});
  });

  useUpdateEffect(() => {
    // useEffect(() => {
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

  const setCaseRef = ()  => {
    setCasesTableOfContents((current) => ({
      ...current,
      ["case_" + inputCase.id]: {
        displayName: inputCase.displayName,
        id: inputCase.id,
        ref: caseRef,
      },
    }));
  };

  useEffect(() => {
    setCaseRef();
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
      <section
        id={'case_item_'+inputCase.id}
        >
      <Paper
        // defaultExpanded={true}
        elevation={3}
        key={"caseaccordion_" + inputCase.id}
        ref={caseRef}
      >
        <CaseNameHeader
          caseDetails={inputCase}
          key={"casenameheader_" + inputCase.id}
        />

        <Box
          sx={{ backgroundColor: colors.primary[300] }}
          key={"fields_" + inputCase.id}
        >
          <Divider />

          {/***************************** Case Fields *****************************/}
          <Box paddingTop="6px" key={"fieldswrapper_" + inputCase.id}>
            {caseFields}
          </Box>

          {/***************************** Related Cases *****************************/}
          {relatedCases}
        </Box>
      </Paper>
      </section>
    </Box>
  );
};

export default CaseComponent;
