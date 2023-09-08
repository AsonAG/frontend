import { useTheme } from "@emotion/react";
import { tokens } from "../../theme";
import { Box, Divider, Paper } from "@mui/material";
import CaseNameHeader from "../../scenes/global/CaseNameHeader";
import FieldComponent from "./field/FieldComponent";

const CaseComponent = ({ _case }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Box margin="5px 0 0 0" >
      <section>
      <Paper elevation={3} >
        <CaseNameHeader caseDetails={_case} />

        <Box
          sx={{ backgroundColor: colors.primary[500] }}
        >
          <Divider />

          <Box margin="10px 0 0 10px">
            {
              _case.fields?.map((field) => <FieldComponent key={field.id} field={field} />)
            }
          </Box>

          <Box>
            {_case.relatedCases?.map((relatedCase) => (
              <CaseComponent
                key={relatedCase.id}
                _case={relatedCase}
              />
            ))}
          </Box>
        </Box>
      </Paper>
      </section>
    </Box>
  );
};

export default CaseComponent;
