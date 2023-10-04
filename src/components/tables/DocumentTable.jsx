import {
  Chip,
  Divider,
  Dialog,
  Stack,
  Typography,
  Box,
  DialogTitle,
  DialogContent,
  IconButton,
  Button,
  Slide
} from "@mui/material";
import { React, useEffect, useState, Suspense } from "react";
import { useOutletContext, useParams, useAsyncValue, useLoaderData, Await } from "react-router-dom";
import { getDocument } from "../../api/FetchClient";
import { useTranslation } from "react-i18next";
import Header from "../Header";
import { Loading } from "../Loading";
import { ErrorView } from "../ErrorView";
import dayjs from "dayjs";
import { Close } from "@mui/icons-material";
import { Centered } from "../Centered";
import { useTheme } from "@emotion/react";
import { useIsMobile } from "../../hooks/useIsMobile";

export function DocumentTableRoute({defaultTitle}) {
  const routeData = useLoaderData();
  const title = useOutletContext() || defaultTitle;
  const { t } = useTranslation();
  return (
    <Stack p={4} gap={2} useFlexGap sx={{height: "100%"}}>
      <Header title={t(title)} />
      <Suspense fallback={<Loading />}>
        <Await resolve={routeData.data} errorElement={<ErrorView />}>
          <DocumentTable />
        </Await>
      </Suspense>
    </Stack>
  );
}


export function DocumentTable() {
  const caseValues = useAsyncValue();
  const [selectedDocument, setSelectedDocument] = useState(null);

  return (
    <>
      <Stack spacing={3} divider={<Divider />} pb={3}>
        {caseValues.map(caseValue => <CaseValueRow key={caseValue.id} caseValue={caseValue} onSelect={setSelectedDocument} />)}
      </Stack>
      <DocumentView {...selectedDocument} onClose={() => setSelectedDocument(null)} />
    </>
  );
};

const style = {
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
  overflow: "hidden"
};

function CaseValueRow({ caseValue, onSelect }) {
  const created = dayjs.utc(caseValue.created).format("L LT")
  const { t } = useTranslation();
  return (
    <Stack direction="row" spacing={1.5}>
      <Stack flex={1}>
        <Typography variant="h6" component="div" sx={style}>{caseValue.caseFieldName}</Typography>
        <Typography variant="body2" sx={style}>{t("Created")}: {created}</Typography>
      </Stack>
      <Stack direction="row" spacing={1} useFlexGap justifyContent="end" flexWrap="wrap" alignItems="center">
      {
        caseValue.documents.map(doc => <Chip key={doc.id} label={doc.name} color="primary" variant="outlined" onClick={() => onSelect({caseValueId: caseValue.id, documentRef: doc})} />)
      }
      </Stack>
    </Stack>
  )
}

function getDialogDesktopProps(open) {
  return {
    open,
    fullWidth: true,
    maxWidth: "lg",
    PaperProps: {
      sx: { minHeight: "90vh" }
    }
  }
}

function getDialogMobileProps(open) {
  return {
    open,
    fullScreen: true,
    TransitionComponent: Slide,
    TransitionProps: {
      direction: "up",
      in: open
    }
  };
}

function DocumentView({ caseValueId, documentRef, onClose }) {
  const params = useParams();
  const [documentDataUrl, setDocumentDataUrl] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const open = !!documentRef;
  const isMobile = useIsMobile();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const doc = await getDocument({caseValueId, documentId: documentRef?.id, ...params});
        setDocumentDataUrl(getDataUrl(doc));
      }
      catch {
      }
      finally {
        setLoading(false);
      }
      
    }
    loadData();
  }, [caseValueId, documentRef?.id, params]);

  const dialogContent = isLoading ?
    <Loading /> :
    (<Box sx={{minHeight: "100%", width: "100%", border: 'none'}} component="object" data={documentDataUrl} type={documentRef?.contentType}>
      <Centered><Typography>Unable to display document. Tap the button to download it.</Typography></Centered>
    </Box>);

  const dialogProps = (isMobile ? getDialogMobileProps : getDialogDesktopProps)(open);

  return (
    <Dialog onClose={onClose} {...dialogProps}>
      <Stack direction="row" alignItems="center" pr={2} spacing={2}>
        <DialogTitle sx={{flex: 1}}>{documentRef?.name}</DialogTitle>
        <DownloadButton url={documentDataUrl} name={documentRef?.name} />
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </Stack>
      <DialogContent dividers sx={{display: 'flex', py: 3}}>
        {dialogContent}
      </DialogContent>  
    </Dialog>
  )
}

function DownloadButton({url, name}) {
  return <Button component="a" variant="outlined" href={url} download={name}>Download</Button>
}

function getDataUrl(document) {
  return `data:${document.contentType};base64,${document.content}`
}