import { useTheme } from "@emotion/react";
import { tokens } from "../../theme";
import { useMemo, useRef, useState } from "react";
import { Box, Divider, Paper } from "@mui/material";
import CaseNameHeader from "../../scenes/global/CaseNameHeader";
import CaseFields from "./CaseFields";

const CaseComponent = ({ inputCase, setOutputCase }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [outputCaseFields, setOutputCaseFields] = useState({});
  const [outputRelatedCases, setOutputRelatedCases] = useState({});
  const caseRef = useRef(null);

  const caseFields = useMemo(
    () => (
      <CaseFields
        inputCase={inputCase}
        setOutputCaseFields={setOutputCaseFields}
      />
    ),
    [inputCase]
  );
  const relatedCases = useMemo(
    () => (
      <Box>
        {inputCase.relatedCases?.map((relatedCase) => (
          <CaseComponent
            inputCase={relatedCase}
            setOutputCase={setOutputRelatedCases}
          />
        ))}
      </Box>
    ),
    [inputCase.relatedCases]
  );
  
  return (
    <Box margin="5px 0 0 0" >
      <section>
      <Paper elevation={3} ref={caseRef} >
        <CaseNameHeader caseDetails={inputCase} />

        <Box
          sx={{ backgroundColor: colors.primary[500] }}
        >
          <Divider />

          <Box margin="10px 0 0 10px">
            {caseFields}
          </Box>

          {relatedCases}
        </Box>
      </Paper>
      </section>
    </Box>
  );
};

export default CaseComponent;
