import { Stack, Typography } from "@mui/material";
import { FieldComponent } from "./field/FieldComponent";

const CaseComponent = ({ _case }) => {
  return (
    <Stack component="section" gap={2} width="100%">
      <Stack id={_case.name} data-header-jump-anchor>
        <Typography variant="h3" fontWeight="bold" gutterBottom sx={{pt: 2}}>
          {_case.displayName}
        </Typography>
        <Typography variant="subtitle">
          {_case.description}
        </Typography>
      </Stack>
      <Stack spacing={3}>
        {
          _case.fields?.map((field) => <FieldComponent key={field.id} field={field} />)
        }
        {_case.relatedCases?.map((relatedCase) => (
          <CaseComponent
            key={relatedCase.id}
            _case={relatedCase}
          />
        ))}
      </Stack>
    </Stack>
  );
};

export default CaseComponent;
