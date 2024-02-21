import { Stack, Typography } from "@mui/material";

export function CaseComponent({ _case, FieldRenderComponent, pt = 0 }) {
  return (
    <Stack component="section" spacing={2} width="100%" pt={pt}>
      <Stack id={_case.name} data-header-jump-anchor>
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          {_case.displayName}
        </Typography>
        <Typography variant="subtitle">
          {_case.description}
        </Typography>
      </Stack>
      <Stack spacing={1.5}>
        {
          _case.fields?.map((field) => <FieldRenderComponent key={field.id} field={field} />)
        }
        {_case.relatedCases?.map((relatedCase) => (
          <CaseComponent
            key={relatedCase.id}
            _case={relatedCase}
            FieldRenderComponent={FieldRenderComponent}
            pt={2}
          />
        ))}
      </Stack>
    </Stack>
  );
};