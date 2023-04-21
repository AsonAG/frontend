import { useTheme } from "@emotion/react";
import { tokens } from "../../theme";
import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FieldComponent from "./FieldComponent";
import useDidMountEffect from "../../hooks/useDidMountEffect";

function CaseNameHeader(caseBase) {
  return (
    <Box display="flex" alignItems="baseline">
      <Typography
        variant="h4"
        fontWeight="bold"
        key={"casename_" + caseBase.id}
        sx={{ 
          marginRight: "20px", 
          flexShrink: 0 }}
      >
        {caseBase?.caseSlot
          ? caseBase?.displayName + " " + caseBase?.caseSlot
          : caseBase?.displayName}
      </Typography>

      <Typography
        variant="h5"
        sx={{ color: "text.secondary" }}
        key={"casename_desc_" + caseBase.id}
      >
        {caseBase?.description}
      </Typography>
    </Box>
  );
}

const CaseFieldsForm = ({ caseBase, isBase, outputCases, setOutputCases }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [caseFieldsList, setCaseFieldsList] = useState({});

  useDidMountEffect(() => {
    // update output cases
    setOutputCases((prevState) => ({
      ...prevState,
      [caseBase.caseSlot
        ? caseBase.name + "_" + caseBase.caseSlot
        : caseBase.name]: {
        caseName: caseBase.name,
        values: caseFieldsList,
        caseSlot: caseBase.caseSlot,
      },
    }));
  }, [caseFieldsList]);

  const handleFieldChange = (
    fieldId,
    fieldName,
    fieldValue,
    fieldStartDate,
    fieldEndDate,
    fieldCaseSlot
  ) => {
    // add to fields list
    setCaseFieldsList((current) => ({
      ...current,

      [fieldId]: {
        caseName: caseBase.name,
        caseFieldName: fieldName,
        value: fieldValue,
        start: fieldStartDate ? new Date(fieldStartDate).toISOString() : null,
        end: fieldEndDate ? new Date(fieldEndDate).toISOString() : null,
        caseSlot: fieldCaseSlot,
      },
    }));
  };

  return (
    <Box borderBottom={1} key={"casebox_" + caseBase.id}>
      <Accordion
        defaultExpanded={true}
        elevation={5}
        key={"caseaccordion_" + caseBase.id}
      >
        {/***************************** Case Header ****************************/}
        {isBase ? (
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{
              backgroundColor: colors.primary[300],
            }}
            key={"casesummary_" + caseBase.id}
          >
            {CaseNameHeader(caseBase)}
          </AccordionSummary>
        ) : (
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{
              backgroundColor: colors.primary[400],
              marginTop: "18px",
            }}
            key={"casesummary_" + caseBase.id}
          >
            {CaseNameHeader(caseBase)}
          </AccordionSummary>
        )}

        {/***************************** Case Fields *****************************/}
        <AccordionDetails
          sx={{
            backgroundColor: colors.primary[400],
          }}
          key={"fields_" + caseBase.id}
        >
          <Box
            borderTop={1}
            paddingTop="16px"
            key={"fieldswrapper_" + caseBase.id}
          >
            {caseBase?.fields?.map((field, i) => (
              <FieldComponent
                field={field}
                onChange={handleFieldChange}
                key={"field_" + field.id}
              />
            ))}
          </Box>

          {isBase ? (
            // skip base related cases, they are already considered in the Parent component
            <></>
          ) : (
            <Box>
              {caseBase?.relatedCases?.map((relatedCase, i) => (
                <CaseFieldsForm
                  isBase={false}
                  caseBase={relatedCase}
                  outputCases={outputCases}
                  setOutputCases={setOutputCases}
                  key={"case_related" + i + relatedCase.id}
                />
              ))}
            </Box>
          )}
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default CaseFieldsForm;
