import { useTheme } from "@emotion/react";
import { tokens } from "../../theme";
import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FieldComponent, { getFieldKey } from "./FieldComponent";
import { useUpdateEffect } from "usehooks-ts";

function CaseNameHeader(caseBase) {
  return (
    <Box display="flex" alignItems="baseline">
      <Typography
        variant="h4"
        fontWeight="bold"
        key={"casename_" + caseBase.id}
        sx={{ 
          marginLeft: "6px", 
          marginRight: "20px", 
          flexShrink: 0 
        }}
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

const CaseFieldsComponent = ({ caseBase, isBase, setOutputCases }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [caseFieldsList, setCaseFieldsList] = useState({});

  useUpdateEffect(() => {
    // update output cases
    setOutputCases((prevState) => ({
      ...prevState,
      [getFieldKey(caseBase.name, caseBase.id)]:
        {
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
        start: isoDateWithoutTimeZone(fieldStartDate),
        end: isoDateWithoutTimeZone(fieldEndDate),
        caseSlot: fieldCaseSlot,
      },
    }));
  };

  function isoDateWithoutTimeZone(date) {
    if (date == null) return date;
    let timestamp = date.getTime() - date.getTimezoneOffset() * 60000;
    let correctDate = new Date(timestamp);
    return correctDate.toISOString();
  }

  return (
    <Box 
      key={"casebox_" + caseBase.id}
      sx={{
        "& .MuiAccordionDetails-root": {
          padding: "0px 10px"
        },
        "& .MuiAccordionSummary-root": {
          minHeight: "48px !important"
        },
        "& .MuiAccordionSummary-content.Mui-expanded": {
          margin: "0"
      }
      }}
    >




      <Accordion
        defaultExpanded={true}
        // elevation={5}
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
              marginTop: "10px",
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
            // paddingTop="6px"
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

        {/***************************** Related Cases *****************************/}
          {isBase ? (
            // skip base related cases, they are already considered in the Parent component
            <></>
          ) : (
            <Box>
              {caseBase?.relatedCases?.map((relatedCase, i) => (
                <CaseFieldsComponent
                  isBase={false}
                  caseBase={relatedCase}
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

export default CaseFieldsComponent;
