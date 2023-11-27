import { Button } from "@mui/material";

export function ComplianceCertificatePicker({type, value}) {
  return (
    <Button sx={{flex: 1}}>{type}</Button>
  );
}
