import { Dialog, Divider, Box, Stack, IconButton, Typography, Fab, useTheme } from "@mui/material";
import { Await, useAsyncValue, useLoaderData, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useMemo, Suspense } from "react";
import { ArrowBack, Download } from "@mui/icons-material";
import { Centered } from "./Centered";
import { getDataUrl } from "../utils/DocumentUtils";
import { XmlView } from "./compliance/XmlView";
import { Loading } from "./Loading";

export function CaseValueDocumentDialog() {
  const loaderData = useLoaderData();
  const navigate = useNavigate();
  const onClose = () => navigate("..");
  return <DocumentDialog documentPromise={loaderData.document} onClose={onClose} />;
}

export function DocumentDialog({ documentPromise, onClose }) {
  const { t } = useTranslation();
  const { state } = useLocation();
  const title = state?.name ?? t("Loading");

  return (
    <Dialog open fullScreen onClose={onClose}>
      <Suspense fallback={<DialogHeader title={title} onClose={onClose} />}>
        <Await resolve={documentPromise}>
          {(doc) => <DialogHeader title={doc.name} onClose={onClose} />}
        </Await>
      </Suspense>
      <Divider />
      <Box sx={{display: "grid", justifyItems: "stretch", alignItems: "stretch", flex: 1 }}>
        <Suspense fallback={<Loading />}>
          <Await resolve={documentPromise}>
            <DocumentView />
          </Await>
        </Suspense>
      </Box>
    </Dialog>
  );
}
const layoutSx = {
  maxWidth: "100%",
  gridArea: "1 / 1", 
  p: 5,
  minHeight: 0,
  overflowY: "auto" 
};

function DocumentView() {
  const doc = useAsyncValue();
  const url = useMemo(() => getDataUrl(doc), [doc]);
  return <>
    <DocumentDisplay doc={doc} url={url} />
    <DownloadButton url={url} name={doc?.name} sx={{
      gridArea: "1 / 1", 
      justifySelf: "end", 
      alignSelf: "end", 
      m: 2,
      pointerEvents: "auto"
    }} />
  </>;
}

function DocumentDisplay({doc, url}) {
  switch (doc?.contentType) {
    case "text/xml": return <Box sx={layoutSx}><XmlView xml={doc.content} /></Box>;
    default: return <GeneralPreview url={url} />;
  }
}

function GeneralPreview({ url }) {
  const { t } = useTranslation();
  return (
    <Box component="object" data={url} sx={{
      border: "none",
      objectFit: "contain",
      ...layoutSx
      }}>
      <Centered><Typography>{t("Preview not available.")}</Typography></Centered>
    </Box>
  );
}

function DialogHeader({title, onClose}) {
  const theme = useTheme();
  return (
    <Stack direction="row" alignItems="center" spacing={2} px={2} sx={theme.mixins.toolbar}>
      { onClose && <IconButton onClick={onClose}><ArrowBack /></IconButton> }
      <Typography variant="h6" sx={{flex: 1}}>{title}</Typography>
    </Stack>
  );
}

function DownloadButton({url, name, sx}) {
  return (
    <Fab 
      component="a" 
      variant="extended" 
      href={url} 
      download={name} 
      color="primary" 
      size="large" 
      sx={sx}>
        <Download sx={{mr: 1}} />
        <Typography>Download</Typography>
    </Fab>
  );
}
