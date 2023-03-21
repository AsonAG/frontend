import { useTheme } from "@emotion/react";
import { tokens } from "../../../theme";
import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Field from "./Field";
import useDidMountEffect from "../../../hooks/useDidMountEffect";

const CaseWrapper = ({ caseBase, isBase, outputCases, setOutputCases }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  // const [outputFields, setOutputFields] = useState({});

  // useDidMountEffect(() => {
  //   setOutputCases((prevState) => ({
  //     ...prevState,
  //     [caseBase.name]: outputFields,
  //   }));
  // }, [outputFields]);

  const updateOutputCases = () => {};

  // const handleFieldChange = (fieldName, fieldValue) => {
  //   let outputFields = (state => ({
  //     ...state,
  //     [fieldName]: fieldValue,
  //   }));

  //   setOutputCases((prevState) => ({
  //     ...prevState,
  //     [caseBase.name]: outputFields,
  //   }));
  // };

  const handleFieldChange = (
    fieldId,
    fieldName,
    fieldValue,
    fieldStartDate,
    fieldEndDate,
    fieldCaseSlot
  ) => {
    setOutputCases({
      ...outputCases,
      [fieldId]: {
        caseName: caseBase.name,
        caseFieldName: fieldName,
        value: fieldValue,
        start: fieldStartDate ? new Date(fieldStartDate).toISOString() : null,
        end: fieldEndDate ? new Date(fieldEndDate).toISOString() : null,
        caseSlot: fieldCaseSlot,
      },
    });
  };

  //   setOutputCases([
  //     ...outputCases,
  //     {
  //       caseName: caseBase.name,
  //       caseFieldName: fieldName,
  //       value: fieldValue,
  //       start: {fieldStartDate ? {new Date(fieldStartDate).toISOString()} : null },
  //       end: new Date(fieldEndDate).toUTCString(),
  //     }
  //   ]);
  // };

  // fieldStartDate && fieldEndDate
  //   ? setOutputCases([
  //       ...outputCases,
  //       {
  //         caseName: caseBase.name,
  //         caseFieldName: fieldName,
  //         value: fieldValue,
  //         start: new Date(fieldStartDate).toISOString(),
  //         end: new Date(fieldEndDate).toUTCString(),
  //       },
  //     ])
  //   : !fieldStartDate && fieldEndDate
  //   ? setOutputCases([
  //       ...outputCases,
  //       {
  //         caseName: caseBase.name,
  //         caseFieldName: fieldName,
  //         value: fieldValue,
  //         end: new Date(fieldEndDate).toISOString(),
  //       },
  //     ])
  //   : fieldStartDate && !fieldEndDate
  //   ? setOutputCases([
  //       ...outputCases,
  //       {
  //         caseName: caseBase.name,
  //         caseFieldName: fieldName,
  //         value: fieldValue,
  //         start: new Date(fieldStartDate).toISOString(),
  //       },
  //     ])
  //   : setOutputCases([
  //       ...outputCases,
  //       {
  //         caseName: caseBase.name,
  //         caseFieldName: fieldName,
  //         value: fieldValue,
  //       },
  //     ]);

  // setOutputCases((prevState) => {
  //   // const tmp = prevState[caseBase.name] ?? {};
  //   return [
  //     ...prevState,
  //     // [caseBase.name]: {
  //     // ...tmp,
  //     {
  //       caseName: caseBase.name,
  //       caseFieldName: fieldName,
  //       value: fieldValue,
  //       start: fieldStartDate,
  //       end: fieldEndDate,
  //     },
  //   ];
  // });

  return (
    <Box borderBottom={1} key={"casebox_" + caseBase.id}>
      <Accordion
        defaultExpanded={true}
        elevation={5}
        key={"caseaccordion_" + caseBase.id}
      >
        {isBase ? (
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{
              backgroundColor: colors.primary[300],
            }}
            key={"casesummary_" + caseBase.id}
          >
            <Typography
              variant="h4"
              fontWeight="bold"
              key={"casename_" + caseBase.id}
            >
              {caseBase?.caseSlot
                ? caseBase?.displayName + caseBase?.caseSlot
                : caseBase?.displayName}
            </Typography>
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
            <Typography
              variant="h4"
              fontWeight="bold"
              key={"casename_" + caseBase.id}
            >
              {caseBase?.caseSlot
                ? caseBase?.displayName + ' ' + caseBase?.caseSlot
                : caseBase?.displayName}
            </Typography>
          </AccordionSummary>
        )}

        {/* Fields */}
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
              <Field
                field={field}
                onChange={handleFieldChange}
                key={"field_" + field.id}
              />
            ))}
          </Box>

          {isBase ? (
            <></>
          ) : (
            <Box>
              {caseBase?.relatedCases?.map((relatedCase, i) => (
                <CaseWrapper
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

export default CaseWrapper;
