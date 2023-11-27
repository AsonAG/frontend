import { VpnKey } from "@mui/icons-material";
import { Button, Typography, Stack } from "@mui/material";
import { useTranslation } from "react-i18next";

export function TransmitterCertificatePicker({value, certificates, setValue}) {
  
}

export function ComplianceCertificatePicker({type, value, noValueText}) {
  const { t } = useTranslation();
  return (
    <Button variant="outlined" sx={{flex: 1, justifyContent: "start"}} startIcon={<VpnKey fontSize="small"/>}>
      <Stack alignItems="start">
        <Typography variant="subtitle2">{value === null ? t(noValueText) : value.name}</Typography>
        <Typography variant="body2">{t("Click to select certificate")}</Typography>
      </Stack>
    </Button>
  );
}


function CertificateDialog({certificates}) {
  
}