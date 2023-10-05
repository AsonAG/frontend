import {
  Divider,
  Dialog,
  Stack,
  Typography,
  Box,
  IconButton,
  Button,
  useMediaQuery,
  useTheme,
  Fab
} from "@mui/material";
import { React, useEffect, useState } from "react";
import { useParams, useAsyncValue, Outlet, useNavigate } from "react-router-dom";
import { getDocument } from "../../api/FetchClient";
import { useTranslation } from "react-i18next";
import { Loading } from "../Loading";
import dayjs from "dayjs";
import { ArrowBack, DescriptionOutlined, Download } from "@mui/icons-material";
import { Centered } from "../Centered";
import { useIsMobile } from "../../hooks/useIsMobile";
import { TableButton } from "../buttons/TableButton";
import { Link } from "../Link";

export function DocumentTable() {
  const caseValues = useAsyncValue();
  const theme = useTheme();
  const variant = useMediaQuery(theme.breakpoints.down("sm")) ? "dense" : "default";

  return (
    <>
      <Stack spacing={3} divider={<Divider />} pb={3}>
        {caseValues.map(caseValue => <CaseValueRow key={caseValue.id} caseValue={caseValue} variant={variant} />)}
      </Stack>
      <Outlet />
    </>
  );
};

function CaseValueRow({ caseValue, variant }) {
  const created = dayjs.utc(caseValue.created).format("L LT")
  const { t } = useTranslation();
  return (
    <Stack direction="row" spacing={1.5} alignItems="start">
      <Stack flex={1}>
        <Typography variant="h6" component="div" sx={{wordBreak: "break-word"}}>{caseValue.caseFieldName}</Typography>
        <Typography variant="body2">{t("Created")}: {created}</Typography>
      </Stack>
      <TableButton title={t("Documents")} variant={variant} to={toFirstDocument(caseValue)} icon={<DescriptionOutlined />} />
    </Stack>
  )
}

function toFirstDocument(caseValue) {
  return `${caseValue.id}/i/${caseValue.documents[0].id}`;
}

export function DocumentDialog() {
  const params = useParams();
  const caseValues = useAsyncValue();
  const caseValueId = Number(params.caseValueId);
  const caseValue = caseValues.find(v => v.id === caseValueId);
  const documentId = Number(params.documentId);
  const documentRef = caseValue.documents.find(d => d.id === documentId)
  
  const isMobile = useIsMobile();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const onClose = () => navigate("..");

  const layoutProps = {
    sx: {
      display: 'grid',
      gridTemplate: "[header] 54px [divider-row] 1px [content] 1fr / [preview] 1fr [divider-column] 1px [attachments] 300px",
      justifyItems: "stretch",
      alignItems: "stretch",
      backgroundColor: "transparent",
      pointerEvents: "none"
    }
  }

  return (
    <Dialog open fullScreen onClose={onClose} PaperProps={layoutProps}>
      <Box gridArea="1 / 1 / 1 / span 3"  bgcolor="background.default" />
      <Box gridArea="1 / 3 / span 3"  bgcolor="background.default" />
      <DialogHeader title={documentRef?.name} onClose={onClose} gridArea="header / preview" sx={{pointerEvents: "auto"}} />
      <DocumentPreview gridArea="content / preview" />
      <DialogHeader title={t("Attachments")} gridArea="header / attachments"/>
      <AttachmentView caseValue={caseValue} gridArea="content / attachments" sx={{pointerEvents: "auto"}}/>
      <Divider sx={{gridArea: "2 / 1 / 2 / span 3"}} />
      <Divider sx={{gridArea: "1 / 2 / span 3 / 2"}} orientation="vertical" />
    </Dialog>
  )
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

function DialogHeader({title, onClose, ...stackProps}) {
  return (
    <Stack direction="row" alignItems="center" spacing={2} px={2} py={1} {...stackProps}>
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

function AttachmentView({caseValue, ...stackProps}) {
  return (
    <Stack {...stackProps} p={1} spacing={1}>
      {
        caseValue.documents.map(doc => 
          <Link key={doc.id} to={`../${caseValue.id}/i/${doc.id}`}>{doc.name}</Link>
        )
      }
    </Stack>
  )
}

function AttachmentChips({caseValue}) {

}