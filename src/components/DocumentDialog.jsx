import { Dialog, Divider, Box, Stack, IconButton, Typography, Fab, useTheme } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { getDocument } from "../api/FetchClient";
import { ArrowBack, Download } from "@mui/icons-material";
import { Loading } from "./Loading";
import { Centered } from "./Centered";

export function DocumentDialog() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const onClose = () => navigate("..");
  return (
    <Dialog open fullScreen onClose={onClose}>
      <DialogHeader title={t("Document")} onClose={onClose}  />
      <Divider />
      <DocumentPreview flex={1} />
    </Dialog>
  );
}

function DocumentPreview(boxProps) {
  const params = useParams();
  const [doc, setDoc] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const d = await getDocument(params);
        setDoc({ url: getDataUrl(d), name: d.name });
      }
      catch { }
      finally {
        setLoading(false);
      }
      
    }
    loadData();
  }, [params]);


  if (isLoading) {
    return <Loading />;
  }

  return (
    <Box sx={{display: "grid", justifyItems: "stretch", alignItems: "stretch", pointerEvents:"none"}} {...boxProps}>
      <Box sx={{
        border: "none",
        objectFit: "contain",
        maxWidth: "100%",
        gridArea: "1 / 1", 
        m: 5, 
        pointerEvents: "auto"}} component="object" data={doc.url}>
        <Centered><Typography>{t("Preview not available.")}</Typography></Centered>
      </Box>
      <DownloadButton url={doc.url} name={doc.name} sx={{
        gridArea: "1 / 1", 
        justifySelf: "end", 
        alignSelf: "end", 
        m: 2,
        pointerEvents: "auto"
      }} />
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

function getDataUrl(document) {
  return `data:${document.contentType};base64,${document.content}`
}
