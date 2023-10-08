import {
  Divider,
  Dialog,
  Stack,
  Typography,
  Box,
  IconButton,
  Button,
  useTheme,
  Fab,
  Paper,
  Collapse,
  Link,
  CircularProgress
} from "@mui/material";
import { React, useEffect, useState } from "react";
import { useParams, useAsyncValue, Outlet, useNavigate, Link as RouterLink } from "react-router-dom";
import { getDocument, getDocumentsOfCaseField } from "../../api/FetchClient";
import { useTranslation } from "react-i18next";
import { Loading } from "../Loading";
import { ArrowBack, Attachment, Download, ExpandLess, ExpandMore } from "@mui/icons-material";
import { Centered } from "../Centered";
import dayjs from "dayjs";

export function DocumentTable() {
  const caseFields = useAsyncValue();

  return (
    <>
      <Stack spacing={3} pb={3}>
        {caseFields.map(caseField => <DocumentCard key={caseField.id} caseFieldName={caseField.name} />)}
      </Stack>
      <Outlet />
    </>
  );
};

const documentLinkSx = {
  textDecoration: 'none',
  color: (theme) => theme.palette.primary.main,
}
function CaseValueRow({ caseValue }) {
  return (
    <Stack spacing={1.5} pl={0.5}>
      {
        caseValue.documents.map(document => 
          <Link component={RouterLink} key={document.id} to={`${caseValue.id}/i/${document.id}`} sx={documentLinkSx}>
            <Stack direction="row" alignItems="center" spacing={0.75}>
              <Attachment fontSize="small"/>
              <Typography>{document.name}</Typography>
            </Stack>
          </Link>
        )
      }
    </Stack>
  )
}

const documentLoadSteps = 15;
function useDocuments(caseFieldName) {
  const params = useParams();
  const [documents, setDocuments] = useState({count: 0, items: []})
  const [top, setTop] = useState(documentLoadSteps);
  const [loading, setLoading] = useState(true);

  function loadMore() {
    setTop(top => top + documentLoadSteps);
  }

  useEffect(() => {
    setLoading(true);
    const load = async () => {
      try {
        const response = await getDocumentsOfCaseField(params, caseFieldName, top);
        setDocuments(response);
      }
      catch {}
      finally {
        setLoading(false);
      }
    };
    load();
  }, [caseFieldName, params.tenantId, params.payrollId, params.employeeId, top]);

  const hasMore = documents.count > documents.items.length;

  return { documents, loading, hasMore, loadMore };
}

function LoadDocumentsButton({loading, hasMore, onClick}) {
  const { t } = useTranslation();
  const text = loading ? "Loading..." :
    hasMore ? "Load more" : "Showing all documents";
  return <Button disabled={loading || !hasMore} startIcon={loading && <CircularProgress size="1rem" />} onClick={onClick}>{t(text)}</Button>
}

function DocumentCard({caseFieldName}) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(true);
  const { documents, loading, hasMore, loadMore } = useDocuments(caseFieldName);
  const onClick = () => setOpen(o => !o);
  const groupedDocuments = Object.groupBy(documents.items, ({start}) => dayjs.utc(start).format("MMMM YYYY"));
  const entries = Object.entries(groupedDocuments);

  let content = null;
  if (!loading && !hasMore && documents.items.length === 0) {
    content = <Typography color="text.disabled">{t("No documents available")}</Typography>;
  } else {
    content = <>
      {entries.map(([key, values]) => <DocumentMonthGroup key={key} month={key} items={values} />)}
      <LoadDocumentsButton loading={loading} hasMore={hasMore} onClick={loadMore} />
    </>
  }
  return (
    <Paper>
      <Stack>
        <Stack direction="row" alignItems="center" sx={{pl: 2, pr: 1, py: 1}} spacing={2}>
          <Typography variant="h6" flex={1}>{caseFieldName}</Typography>
          <IconButton onClick={onClick}>
            { open ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </Stack>
        <Collapse in={open} mountOnEnter>
          <Divider />
          <Stack sx={{px: 2, py: 1}} spacing={1} alignItems="start">
            {content}
          </Stack>
        </Collapse>
      </Stack>
    </Paper>
  )
}

function DocumentMonthGroup({month, items}) {
  return (
    <Stack>
      <Typography variant="subtitle">{month}</Typography>
      {items.map(caseValue => <CaseValueRow key={caseValue.id} caseValue={caseValue} />)}
    </Stack>
  )
}

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

