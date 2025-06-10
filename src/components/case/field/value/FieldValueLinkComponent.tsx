import { Box, Link, Stack } from "@mui/material";
import { Link as RouterLink, useParams } from "react-router-dom";
import { useContext } from "react";
import { FieldContext } from "../Field";
import { FieldValueTextComponent } from "./FieldValueTextComponent";
import React from "react";

export function FieldValueLinkComponent() {
  const { field, displayName } = useContext(FieldContext);

  const isEmployeeLink = !!field.attributes?.["employeeLink"];
  if (isEmployeeLink) {
    return <EmployeeLink text={displayName} />
  }

  return (
    <Stack flex={1}>
      <FieldValueTextComponent />
      {field.value && (
        <Box m={0.75}>
          <Link href={field.value} target="_blank" rel="noopener">
            {field.value}
          </Link>
        </Box>
      )}
    </Stack>
  );
}

function EmployeeLink({ text }: { text: string }) {
  const { orgId, payrollId, employeeId } = useParams();
  const to = `/orgs/${orgId}/payrolls/${payrollId}/hr/employees/${employeeId}`;
  return <Link component={RouterLink} to={to}>{text}</Link>
}

