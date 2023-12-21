import styled from "@emotion/styled";
import { VpnKey } from "@mui/icons-material";
import { Button, Typography, Stack, Dialog, DialogTitle, DialogContent, List, ListItemButton as MuiListItemButton, DialogActions, useTheme, useMediaQuery, Divider, Skeleton } from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toBase64 } from "../../services/converters/BinaryConverter";
import { useFetcher } from "react-router-dom";

export function TransmitterCertificatePicker(props) {
  return <ComplianceCertificatePicker nullValueText={"Default certificate"} certificateType="Transmitter" {...props} />
}

export function EnterpriseCertificatePicker(props) {
  return <ComplianceCertificatePicker nullValueText="No certificate" certificateType="Enterprise" {...props} />
}

const ListItemButton = styled(MuiListItemButton)(({theme}) => ({
  borderRadius: theme.spacing(1),
  marginTop: theme.spacing(0.5),
  marginBottom: theme.spacing(0.5)
}));

function isNew(value) {return value !== null && !value.id}

function ComplianceCertificatePicker(props) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const onClose = () => setOpen(false);
  const { value, nullValueText, setValue: setValueParent } = props;
  const titleText = !value ? t(nullValueText) : value.name;
  const setValue = value => {
    onClose();
    setValueParent(value);
  }
  const titlePrefix = isNew(value) ? t("(New)") : null;
  return <>
    <Button variant="outlined" sx={{flex: 1, justifyContent: "start"}} startIcon={<VpnKey fontSize="small"/>} onClick={() => setOpen(true)}>
      <Stack alignItems="start">
        <Typography variant="subtitle2">{titlePrefix} {titleText}</Typography>
        <Typography variant="body2">{t("Click to select certificate")}</Typography>
      </Stack>
    </Button>
    <CertificateDialog {...props} open={open} onClose={onClose} setValue={setValue} />
  </>;
}

const dialogSx = {
  '& .MuiDialog-paper': {
    sm: { width: '80%', maxHeight: 435 }
  }
};

function CertificateDialog({value, setValue, nullValueText, open, onClose, certificateType}) {
  const { t } = useTranslation();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const fetcher = useFetcher();
  const uploadedCertificate = isNew(value) ?
    <ListItemButton selected>{t("(New)")} {value.name}</ListItemButton> : null;

  useEffect(() => {
    if (!open) {
      fetcher.data = null;
    } else if (open && fetcher.state === "idle" && !fetcher.data) {
      const url = certificateType === "Transmitter" ? "transmittercertificates" : "enterprisecertificates";
      fetcher.load(url);
    }
  }, [open, fetcher]);
  
  return (
    <Dialog open={open}
      sx={dialogSx}
      fullScreen={fullScreen}
      >
      <DialogTitle>{t("Select certificate")}</DialogTitle>
      <DialogContent dividers sx={{p: 0}}>
        <List sx={{px: 1}}>
          <UploadCertificateButton setValue={setValue} />
          { uploadedCertificate }
        </List>
        <Divider />
        <List sx={{px: 1}}>
          <ListItemButton selected={!value} onClick={() => setValue(null)}>{nullValueText}</ListItemButton>
          {
            fetcher.data ? 
              fetcher.data.map(cert => 
                <ListItemButton key={cert.id} selected={cert.id === value?.id} onClick={() => setValue(cert)}>
                  {cert.name}
                </ListItemButton>
              )
              :
              <>
                <Skeleton width="100%"><ListItemButton>Test</ListItemButton></Skeleton>
                <Skeleton width="100%"><ListItemButton>Test</ListItemButton></Skeleton>
                <Skeleton width="100%"><ListItemButton>Test</ListItemButton></Skeleton>
              </>
          }
        </List>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={onClose}>{t("Close")}</Button>
      </DialogActions>
    </Dialog>
  )
}

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

function UploadCertificateButton({setValue}) {
  const { t } = useTranslation();
  const handleUpload = async (event) => {
    const files = event.target.files;
    if (files.length !== 1)
      return;
    const file = files[0];
    const data = await toBase64(file);
    console.log("setting new certificate ");
    setValue({
      name: file.name,
      content: data
    });
  }


  return <ListItemButton component="label">
    {t("Upload new certificate")}
    <VisuallyHiddenInput type="file" onChange={handleUpload} />
  </ListItemButton>
}